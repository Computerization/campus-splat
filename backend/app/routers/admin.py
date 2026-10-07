"""Admin endpoints (the club-room desktop console).

Covers checkpoint planning, progress overview, photo review and the training
job controls.
"""

from __future__ import annotations

import csv
import io
import json
import random
import secrets
import shutil
import string
import subprocess
import sys
from pathlib import Path
from typing import Iterable
from urllib.parse import quote

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..database import get_db
from ..models import (
    AuthSession,
    Checkpoint,
    Photo,
    QualityReport,
    Task,
    TaskAssignment,
    TrainingBlock,
    TrainingRun,
    utcnow,
)
from ..quality import HEIF_SUPPORTED
from ..quality.metrics import OPENCV_AVAILABLE
from ..schemas import (
    CheckpointCreateIn,
    CheckpointOut,
    CheckpointPatchIn,
    CheckpointProgressOut,
    PhotoOut,
    PhotoPage,
    PhotoReviewIn,
    QualityOut,
    ResetIn,
    RevealIn,
    TaskCreateIn,
    TaskOut,
    TaskPatchIn,
    TaskProgressOut,
    TransformUpdateIn,
    TrainingBlockOut,
    TrainingCreateIn,
    TrainingPreflightOut,
    TrainingPreviewOut,
    TrainingPreviewSceneOut,
    TrainingRunDetailOut,
    TrainingRunOut,
)
from ..security import prune_expired_sessions, require_admin, admin_scope
from ..services import naming, splat, stats, sysinfo, training
from ..services.training import manager, queue_depth

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(admin_scope)])

_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I


def _new_access_code(db: OrmSession, length: int = 5) -> str:
    for _ in range(100):
        code = "".join(secrets.choice(_CODE_ALPHABET) for _ in range(length))
        if not any(c.isdigit() for c in code) or not any(c.isalpha() for c in code):
            continue
        if not db.execute(select(Task.id).where(Task.access_code == code)).first():
            return code
    raise HTTPException(503, '任务码分配失败，请重试')


def _photo_out(photo: Photo, session: AuthSession, checkpoint_name: str | None = None) -> PhotoOut:
    data = PhotoOut.model_validate(photo)
    token = session.token
    data.thumb_url = f"/api/media/thumb/{photo.id}?token={token}"
    data.preview_url = f"/api/media/preview/{photo.id}?token={token}"
    data.file_url = f"/api/media/file/{photo.id}?token={token}"
    data.checkpoint_name = checkpoint_name
    if photo.quality is not None:
        data.quality = QualityOut.model_validate(photo.quality)
    return data


# ---------------------------------------------------------------- overview / system


@router.get("/overview")
def overview(
    include_archived: bool = Query(default=False),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    result = stats.build_overview(db, include_archived=include_archived, owner_admin_id=session.admin_id)
    if session.admin_id != 1:
        result.training = []
    return result.model_dump(mode="json")


@router.get("/system")
def system_info(db: OrmSession = Depends(get_db), session: AuthSession = Depends(require_admin)) -> dict:
    """Hardware, storage and dependency status."""
    counts = db.execute(
        select(Photo.status, func.count(Photo.id)).group_by(Photo.status)
    ).all()
    return {
        "hardware": sysinfo.hardware_info(),
        "data_dir": str(config.DATA_DIR),
        "storage": storage.disk_usage(),
        "photo_status_counts": {status_: count for status_, count in counts},
        "heif_supported": HEIF_SUPPORTED,
        "opencv_available": OPENCV_AVAILABLE,
        "training_queue": queue_depth(db) if session.admin_id == 1 else None,
    }


@router.get("/metrics")
def metrics() -> dict:
    """Live resource usage (CPU / memory / disk / GPU). Polled every 2s."""
    return sysinfo.realtime_metrics()


@router.post("/prune-sessions")
def prune_sessions(db: OrmSession = Depends(get_db)) -> dict:
    """Drop expired sessions (also fine to run on a schedule)."""
    removed = prune_expired_sessions(db)
    return {"ok": True, "removed": removed}


# ---------------------------------------------------------------- tasks


@router.get("/tasks", response_model=list[TaskProgressOut])
def list_tasks(
    include_archived: bool = Query(default=True),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> list[TaskProgressOut]:
    query = select(Task).where(Task.owner_admin_id == session.admin_id, Task.status != 'deleted').order_by(Task.created_at.desc(), Task.id.desc())
    if not include_archived:
        query = query.where(Task.status != "archived")
    tasks = db.execute(query).scalars().all()
    checkpoint_map = stats.checkpoint_progress_map(db, [t.id for t in tasks])
    return [stats.build_task_progress(db, t, checkpoint_map=checkpoint_map) for t in tasks]


@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreateIn, db: OrmSession = Depends(get_db), session: AuthSession = Depends(require_admin)) -> TaskOut:
    from .workflow import write_lock
    write_lock(db)
    if payload.access_code is not None:
        raise HTTPException(400, '任务码由系统自动生成，不能手动设置')
    code = _new_access_code(db)
    if db.execute(select(Task.id).where(Task.access_code == code)).first():
        raise HTTPException(status.HTTP_409_CONFLICT, f"访问码 {code} 已被占用")

    task = Task(
        owner_admin_id=session.admin_id,
        name=payload.name.strip(),
        kind=payload.kind,
        description=payload.description,
        location_hint=payload.location_hint,
        folder=_free_task_folder(db, payload.name),
        access_code=code,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.get("/tasks/{task_id}")
def task_detail(task_id: int, db: OrmSession = Depends(get_db)) -> dict:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    checkpoint_map = stats.checkpoint_progress_map(db, [task.id])
    checkpoints = db.execute(
        select(Checkpoint).where(Checkpoint.task_id == task.id).order_by(Checkpoint.order_index)
    ).scalars().all()

    progress = stats.build_task_progress(db, task, checkpoint_map=checkpoint_map)
    return {
        "task": progress.model_dump(mode="json"),
        "checkpoints": [
            stats.to_progress(cp, checkpoint_map.get((task.id, cp.id))).model_dump(mode="json")
            for cp in checkpoints
        ],
    }


@router.patch("/tasks/{task_id}", response_model=TaskOut)
def patch_task(
    task_id: int, payload: TaskPatchIn, db: OrmSession = Depends(get_db)
) -> TaskOut:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    data = payload.model_dump(exclude_unset=True)
    if 'access_code' in data:
        raise HTTPException(400, '任务码绑定任务后不可修改')
    if 'name' in data and (data['name'] is None or not data['name'].strip()):
        raise HTTPException(400, '任务名称不能为空')
    if "access_code" in data and data["access_code"]:
        code = data["access_code"].strip().upper()
        clash = db.execute(
            select(Task.id).where(Task.access_code == code, Task.id != task_id)
        ).first()
        if clash:
            raise HTTPException(status.HTTP_409_CONFLICT, f"访问码 {code} 已被占用")
        data["access_code"] = code
    elif "access_code" in data:
        data.pop("access_code")

    for key, value in data.items():
        setattr(task, key, value)
    if not task.folder:
        task.folder = _free_task_folder(db, task.name)
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    purge_files: bool = Query(default=True),
    db: OrmSession = Depends(get_db),
) -> dict:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    rel_paths: list[str] = []
    if purge_files:
        rel_paths = [
            photo.stored_path for photo in task.photos
        ] + [
            photo.thumb_path for photo in task.photos if photo.thumb_path
        ] + [
            photo.preview_path for photo in task.photos if photo.preview_path
        ] + [
            cp.reference_image for cp in task.checkpoints if cp.reference_image
        ]

    # Keep account and accepted-submission history even after the task disappears.
    task.status = 'deleted'
    for assignment in db.scalars(select(TaskAssignment).where(TaskAssignment.task_id == task.id, TaskAssignment.status.in_(('in_progress', 'submitted')))):
        assignment.status = 'task_deleted'
    db.commit()

    for rel in rel_paths:
        storage.delete_file(rel)
    if purge_files:
        folder = config.UPLOAD_DIR / f"task{task_id}"
        shutil.rmtree(folder, ignore_errors=True)
    return {"ok": True, "deleted_photos": len(rel_paths)}


# ---------------------------------------------------------------- checkpoints


class CheckpointBulkIn(BaseModel):
    items: list[CheckpointCreateIn] = Field(default_factory=list)
    mode: str = Field(default="append", pattern="^(append|replace)$")


@router.post("/tasks/{task_id}/checkpoints", response_model=CheckpointOut, status_code=201)
def create_checkpoint(
    task_id: int, payload: CheckpointCreateIn, db: OrmSession = Depends(get_db)
) -> CheckpointOut:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    checkpoint = Checkpoint(
        task_id=task_id,
        order_index=payload.order_index if payload.order_index is not None else _next_order(db, task_id),
        name=payload.name,
        folder=_free_checkpoint_folder(db, task_id, payload.name),
        building=payload.building,
        floor=payload.floor,
        room=payload.room,
        lat=payload.lat,
        lng=payload.lng,
        height_m=payload.height_m,
        length_m=payload.length_m,
        width_m=payload.width_m,
        room_height_m=payload.room_height_m,
        indoor=payload.indoor,
        instructions=payload.instructions,
        find_hint=payload.find_hint,
        shot_count=payload.shot_count,
        angles=[a.model_dump() for a in payload.angles] if payload.angles else None,
    )
    db.add(checkpoint)
    db.commit()
    db.refresh(checkpoint)
    return CheckpointOut.model_validate(checkpoint)


def _next_order(db: OrmSession, task_id: int) -> int:
    return (
        db.execute(
            select(func.coalesce(func.max(Checkpoint.order_index), -1)).where(
                Checkpoint.task_id == task_id
            )
        ).scalar_one()
        + 1
    )


def _free_task_folder(db: OrmSession, name: str) -> str:
    """ASCII folder for a task's photos (data/uploads/<this>/…) — unique per task."""
    taken = db.execute(select(Task.folder).where(Task.folder.is_not(None))).scalars().all()
    return naming.unique_folder(naming.normalize(name, fallback="Task"), taken)


def _free_checkpoint_folder(
    db: OrmSession, task_id: int, name: str, *, extra_taken: Iterable[str] = ()
) -> str:
    """Folder for one checkpoint inside its task; ``extra_taken`` covers rows that
    are queued in the same transaction but not flushed yet (bulk import)."""
    taken = list(
        db.execute(
            select(Checkpoint.folder).where(
                Checkpoint.task_id == task_id, Checkpoint.folder.is_not(None)
            )
        ).scalars()
    )
    taken.extend(extra_taken)
    return naming.unique_folder(naming.normalize(name, fallback="Checkpoint"), taken)


@router.post("/tasks/{task_id}/checkpoints/bulk")
def bulk_create_checkpoints(
    task_id: int, payload: CheckpointBulkIn, db: OrmSession = Depends(get_db)
) -> dict:
    """Import a batch of checkpoints (easiest is pasting JSON)."""
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    if payload.mode == "replace":
        # Only unlink, never delete the photos: already-captured material is
        # worth more than the checkpoint layout, so clear checkpoint_id first
        # and only then remove the old checkpoints.
        db.execute(update(Photo).where(Photo.task_id == task_id).values(checkpoint_id=None))
        db.execute(delete(Checkpoint).where(Checkpoint.task_id == task_id))
        db.commit()
        db.expire_all()
        base_order = 0
    else:
        base_order = _next_order(db, task_id)

    used_folders: list[str] = []

    for index, item in enumerate(payload.items):
        folder = _free_checkpoint_folder(
            db, task_id, item.name, extra_taken=used_folders
        )
        used_folders.append(folder)
        db.add(
            Checkpoint(
                task_id=task_id,
                order_index=item.order_index if item.order_index is not None else base_order + index,
                name=item.name,
                folder=folder,
                building=item.building,
                floor=item.floor,
                room=item.room,
                lat=item.lat,
                lng=item.lng,
                height_m=item.height_m,
                length_m=item.length_m,
                width_m=item.width_m,
                room_height_m=item.room_height_m,
                indoor=item.indoor,
                instructions=item.instructions,
                find_hint=item.find_hint,
                shot_count=item.shot_count,
                angles=[a.model_dump() for a in item.angles] if item.angles else None,
            )
        )
    db.commit()
    return {"ok": True, "created": len(payload.items)}


@router.patch("/checkpoints/{checkpoint_id}", response_model=CheckpointOut)
def patch_checkpoint(
    checkpoint_id: int, payload: CheckpointPatchIn, db: OrmSession = Depends(get_db)
) -> CheckpointOut:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")

    data = payload.model_dump(exclude_unset=True)
    if "angles" in data:
        raw = data.pop("angles")
        checkpoint.angles = [
            a.model_dump() if hasattr(a, "model_dump") else a for a in (raw or [])
        ] or None
    for key, value in data.items():
        setattr(checkpoint, key, value)
    # Rows created before the folder layout existed get one on the next edit; an
    # existing folder is never changed, because the photos already live there.
    if not checkpoint.folder:
        checkpoint.folder = _free_checkpoint_folder(db, checkpoint.task_id, checkpoint.name)
    db.commit()
    db.refresh(checkpoint)
    return CheckpointOut.model_validate(checkpoint)


@router.delete("/checkpoints/{checkpoint_id}")
def delete_checkpoint(
    checkpoint_id: int,
    purge_photos: bool = Query(default=False),
    db: OrmSession = Depends(get_db),
) -> dict:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")

    if purge_photos:
        for photo in list(checkpoint.photos):
            storage.delete_file(photo.stored_path)
            storage.delete_file(photo.thumb_path)
            storage.delete_file(photo.preview_path)
            db.delete(photo)

    storage.delete_file(checkpoint.reference_image)
    db.delete(checkpoint)
    db.commit()
    return {"ok": True}


@router.post("/checkpoints/{checkpoint_id}/reference")
def upload_reference(
    checkpoint_id: int,
    file: UploadFile = File(...),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Upload an example image showing what this checkpoint should look like."""
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")

    saved = storage.save_stream(
        file.file,
        task_id=checkpoint.task_id,
        checkpoint_id=checkpoint.id,
        filename=file.filename or "reference.jpg",
    )
    storage.delete_file(checkpoint.reference_image)
    # Also build a preview so the phone loads it quickly
    thumb_rel, preview_rel = storage.make_derivatives(saved.rel_path, prefix=f"ref{checkpoint.id}")
    checkpoint.reference_image = saved.rel_path
    db.commit()
    return {"ok": True, "reference_image": saved.rel_path, "preview": preview_rel or thumb_rel}


# ---------------------------------------------------------------- photos


@router.get("/photos", response_model=PhotoPage)
def list_photos(
    task_id: int | None = Query(default=None),
    checkpoint_id: int | None = Query(default=None),
    status_: str | None = Query(default=None, alias="status"),
    q: str | None = Query(default=None),
    duplicates_only: bool = Query(default=False),
    limit: int = Query(default=60, ge=1, le=300),
    offset: int = Query(default=0, ge=0),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> PhotoPage:
    conditions = [Photo.task_id.in_(select(Task.id).where(Task.owner_admin_id == session.admin_id, Task.status != 'deleted'))]
    if task_id is not None:
        conditions.append(Photo.task_id == task_id)
    if checkpoint_id is not None:
        conditions.append(Photo.checkpoint_id == checkpoint_id)
    if status_:
        conditions.append(Photo.status == status_)
    if duplicates_only:
        conditions.append(Photo.duplicate_of.is_not(None))
    if q:
        like = f"%{q.strip()}%"
        conditions.append(
            or_(
                Photo.original_filename.ilike(like),
                Photo.nickname.ilike(like),
                Photo.camera_model.ilike(like),
            )
        )

    total = db.execute(
        select(func.count(Photo.id)).where(*conditions)
    ).scalar_one()
    photos = db.execute(
        select(Photo)
        .where(*conditions)
        .order_by(Photo.uploaded_at.desc())
        .limit(limit)
        .offset(offset)
    ).scalars().all()

    name_map: dict[int, str] = {}
    cp_ids = {p.checkpoint_id for p in photos if p.checkpoint_id}
    if cp_ids:
        name_map = {
            cp_id: name
            for cp_id, name in db.execute(
                select(Checkpoint.id, Checkpoint.name).where(Checkpoint.id.in_(cp_ids))
            )
        }

    return PhotoPage(
        items=[_photo_out(p, session, name_map.get(p.checkpoint_id)) for p in photos],
        total=total,
        limit=limit,
        offset=offset,
    )


# What a manual review is worth in the score column when the heuristic never ran
# (the photo was still queued when the admin judged it).
MANUAL_REVIEW_SCORES = {"ok": 100, "warning": 70, "rejected": 0}


@router.patch("/photos/{photo_id}", response_model=PhotoOut)
def review_photo(
    photo_id: int,
    payload: PhotoReviewIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> PhotoOut:
    """Manual override (e.g. the heuristic flagged a photo as blurry but it's fine)."""
    photo = db.get(Photo, photo_id)
    if photo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "照片不存在")

    photo.status = payload.status
    report = photo.quality
    if report is None:
        # The background check has not produced a report yet (the photo is still
        # queued or being decoded) — the manual verdict has to be self-contained,
        # otherwise the note would be dropped on the floor. The worker sees the
        # changed status and leaves this row alone.
        report = QualityReport(
            photo_id=photo.id,
            score=MANUAL_REVIEW_SCORES.get(payload.status, 100),
            issues=[],
            metrics=None,
            advice=f"管理员人工判定：{payload.status}",
        )
        db.add(report)
        photo.quality = report
    report.passed = payload.status != "rejected"

    issues = list(report.issues or [])
    if payload.note:
        issues.append({"code": "admin_note", "level": "info", "message": payload.note})
    if issues != (report.issues or []):
        report.issues = issues
    db.commit()
    db.refresh(photo)
    return _photo_out(photo, session)


@router.delete("/photos/{photo_id}")
def delete_photo(
    photo_id: int, db: OrmSession = Depends(get_db)
) -> dict:
    photo = db.get(Photo, photo_id)
    if photo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "照片不存在")
    storage.delete_file(photo.stored_path)
    storage.delete_file(photo.thumb_path)
    storage.delete_file(photo.preview_path)
    db.delete(photo)
    db.commit()
    return {"ok": True}


@router.get("/tasks/{task_id}/export.csv")
def export_photos_csv(task_id: int, db: OrmSession = Depends(get_db)) -> StreamingResponse:
    """Export the photo manifest (with quality metrics) for archiving or
    feeding into a reconstruction tool.
    """
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")

    photos = db.execute(
        select(Photo).where(Photo.task_id == task_id).order_by(Photo.uploaded_at.asc())
    ).scalars().all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(
        [
            "photo_id", "checkpoint_id", "checkpoint_name", "nickname", "filename",
            "status", "score", "width", "height", "captured_at", "gps_lat", "gps_lng",
            "camera_model", "stored_path", "duplicate_of",
        ]
    )
    name_map = {
        cp.id: cp.name
        for cp in db.execute(select(Checkpoint).where(Checkpoint.task_id == task_id)).scalars()
    }
    for photo in photos:
        writer.writerow(
            [
                photo.id,
                photo.checkpoint_id or "",
                name_map.get(photo.checkpoint_id, ""),
                photo.nickname or "",
                photo.original_filename,
                photo.status,
                photo.quality.score if photo.quality else "",
                photo.width or "",
                photo.height or "",
                photo.captured_at.isoformat(sep=" ") if photo.captured_at else "",
                photo.gps_lat if photo.gps_lat is not None else "",
                photo.gps_lng if photo.gps_lng is not None else "",
                photo.camera_model or "",
                photo.stored_path,
                photo.duplicate_of or "",
            ]
        )

    buffer.seek(0)
    safe_name = "".join(c for c in task.name if c not in '\\/:*?"<>|').strip() or f"task{task_id}"
    # HTTP headers are latin-1 only, so a Chinese filename needs RFC 5987 filename*
    disposition = (
        f'attachment; filename="task{task_id}_photos.csv"; '
        f"filename*=UTF-8''{quote(f'{safe_name}_photos.csv')}"
    )
    return StreamingResponse(
        iter(["\ufeff" + buffer.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": disposition},
    )


# ---------------------------------------------------------------- training


def _read_log(rel_path: str | None, tail: int) -> tuple[list[str], int]:
    if not rel_path:
        return [], 0
    try:
        path = storage.resolve(rel_path)
    except HTTPException:
        return [], 0
    if not path.exists():
        return [], 0
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    return lines[-tail:], len(lines)


def _run_detail(run: TrainingRun) -> TrainingRunDetailOut:
    base = stats.to_training_out(run)
    return TrainingRunDetailOut(
        **base.model_dump(),
        blocks=[TrainingBlockOut.model_validate(block) for block in run.blocks],
    )


@router.get("/training", response_model=list[TrainingRunOut])
def list_training_runs(
    limit: int = Query(default=30, ge=1, le=200),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> list[TrainingRunOut]:
    runs = db.execute(
        select(TrainingRun).where(TrainingRun.task_id.in_(select(Task.id).where(Task.owner_admin_id == session.admin_id, Task.status != 'deleted'))).order_by(TrainingRun.created_at.desc()).limit(limit)
    ).scalars().all()
    manager.start()  # wake the dispatcher thread as soon as someone looks
    return [stats.to_training_out(run) for run in runs]


@router.get("/training/queue")
def training_queue(db: OrmSession = Depends(get_db)) -> dict:
    return queue_depth(db)


@router.get("/training/preflight", response_model=TrainingPreflightOut)
def training_preflight(
    task_id: int = Query(..., ge=1),
    block_max_photos: int = Query(
        default=int(config.TRAINING_DEFAULTS["block_max_photos"]), ge=20, le=5000
    ),
    # The trainer parameters the admin has on screen: the preflight checks the
    # command template of *that* toolchain (docs/training-toolchain.md §二).
    toolchain: str = Query(default=str(config.TRAINING_DEFAULTS["toolchain"]), pattern="^(3dgs|gsplat)$"),
    # gsplat's image downsampling: 1 = full size, 2/4 = the doc's VRAM levers
    data_factor: int = Query(default=1, ge=1, le=4),
    iterations: int = Query(default=int(config.TRAINING_DEFAULTS["iterations"]), ge=1000, le=200000),
    db: OrmSession = Depends(get_db),
) -> TrainingPreflightOut:
    """Show the block plan (and the risks) before committing to a run."""
    if data_factor not in (1, 2, 4):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "图像降采样只能是 1 / 2 / 4")
    try:
        data = training.preflight(
            db,
            task_id=task_id,
            block_max_photos=block_max_photos,
            params={
                "block_max_photos": block_max_photos,
                "toolchain": toolchain,
                "data_factor": data_factor,
                "iterations": iterations,
            },
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
    return TrainingPreflightOut.model_validate(data)


@router.post("/training", response_model=TrainingRunDetailOut, status_code=201)
def create_training_run(
    payload: TrainingCreateIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> TrainingRunDetailOut:
    if payload.task_id is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "请选择要重建的任务")

    params = payload.params.model_dump() if payload.params is not None else None
    try:
        run = training.create_run(
            db,
            task_id=payload.task_id,
            name=payload.name,
            params=params,
            created_by=session.nickname or "admin",
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc

    manager.start()
    db.refresh(run)
    return _run_detail(run)


@router.get("/training/blocks/{block_id}/log")
def training_block_log(
    block_id: int,
    tail: int = Query(default=300, ge=1, le=5000),
    db: OrmSession = Depends(get_db),
) -> dict:
    block = db.get(TrainingBlock, block_id)
    if block is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练块不存在")
    lines, total = _read_log(block.log_path, tail)
    return {"lines": lines, "path": block.log_path, "total": total, "block_id": block.id}


@router.post("/training/blocks/{block_id}/retry", response_model=TrainingRunDetailOut, status_code=201)
def retry_training_block(
    block_id: int,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> TrainingRunDetailOut:
    """Re-queue one failed block, reusing the poses of the original run."""
    block = db.get(TrainingBlock, block_id)
    if block is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练块不存在")
    try:
        run = training.retry_block(db, block, created_by=session.nickname or "admin")
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    manager.start()
    db.refresh(run)
    return _run_detail(run)


@router.get("/training/{run_id}", response_model=TrainingRunDetailOut)
def training_detail(run_id: int, db: OrmSession = Depends(get_db)) -> TrainingRunDetailOut:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    manager.start()
    return _run_detail(run)


@router.post("/training/{run_id}/cancel", response_model=TrainingRunDetailOut)
def cancel_training(run_id: int, db: OrmSession = Depends(get_db)) -> TrainingRunDetailOut:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    if run.status in ("succeeded", "failed", "cancelled"):
        return _run_detail(run)

    note = manager.cancel(run_id)
    run.status = "cancelled"
    run.stage = "cancelled"
    run.message = note
    run.finished_at = utcnow()
    for block in run.blocks:
        if block.status not in ("succeeded", "failed", "skipped", "cancelled"):
            block.status = "cancelled"
            block.message = "训练已取消"
            block.finished_at = utcnow()
    db.commit()
    db.refresh(run)
    return _run_detail(run)


def _run_work_dir(run: TrainingRun) -> Path:
    """A run's own directory, read back from the path stored when it launched.

    Going through the stored path also keeps runs created with the earlier
    ``runN`` layout working — nothing assumes the folder name any more.
    """
    if run.output_path:
        try:
            return storage.resolve(run.output_path).parent
        except HTTPException:
            pass
    return config.TRAINING_DIR / f"run{run.id}"


def _run_log_path(run: TrainingRun) -> Path:
    if run.log_path:
        try:
            return storage.resolve(run.log_path)
        except HTTPException:
            pass
    return config.LOG_DIR / f"training_run{run.id}.log"


@router.delete("/training/{run_id}")
def delete_training_run(
    run_id: int,
    purge_files: bool = Query(default=False, description="连磁盘上的产物目录与日志一起删除"),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Drop one run's record.

    The files stay on disk unless ``purge_files`` is set: a training run is hours
    of GPU time and deleting its point clouds cannot be undone, so the cautious
    default is "remove it from the console, leave the data alone". The reply says
    where the files are either way.
    """
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    if run.status == "running":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "这次训练还在跑，先取消再删除")

    work_dir = _run_work_dir(run)
    log_path = _run_log_path(run)
    kept_at = run.output_path

    freed = 0
    if purge_files:
        freed += _purge_dir(work_dir)
        try:
            work_dir.rmdir()
        except OSError:
            pass
        if log_path.exists():
            freed += log_path.stat().st_size
            log_path.unlink(missing_ok=True)
        kept_at = None

    # Blocks (and their logs) belong to this run; other runs only reference it
    # through reuse_run_id, and a missing reuse directory just means they solve
    # the poses again instead of copying them.
    for block in list(run.blocks):
        db.delete(block)
    db.delete(run)
    db.commit()

    return {
        "ok": True,
        "run_id": run_id,
        "files_deleted": bool(purge_files),
        "freed_bytes": freed,
        "kept_at": kept_at,
    }


@router.get("/training/{run_id}/log")
def training_log(
    run_id: int,
    tail: int = Query(default=200, ge=1, le=5000),
    db: OrmSession = Depends(get_db),
) -> dict:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    lines, total = _read_log(run.log_path, tail)
    return {"lines": lines, "path": run.log_path, "total": total}


_BLOCK_COLORS = [
    [0.82, 0.42, 0.36],
    [0.36, 0.64, 0.82],
    [0.44, 0.76, 0.46],
    [0.86, 0.74, 0.34],
    [0.62, 0.46, 0.82],
    [0.36, 0.78, 0.76],
]


@router.get("/training/{run_id}/preview", response_model=TrainingPreviewOut)
def training_preview(
    run_id: int,
    with_runs: str = Query(default="", description="额外叠加显示的 run id，逗号分隔"),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> TrainingPreviewOut:
    """Everything the admin 3D preview needs to load this run's point clouds.

    `with_runs` additionally lists the point clouds of other runs — typically an
    outdoor run while the admin places an indoor one, which is the manual form
    of the "indoor → outdoor" step in docs/training-pipeline.md §6.2.

    The artifacts themselves are streamed by `training_artifact`, using the
    session token in the query string because a WebGL loader cannot set an
    Authorization header.
    """
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")

    host = _load_transforms(run)
    host_placements = {
        (placement.get("run_id"), str(placement.get("key"))): placement
        for placement in (host.get("placements") or [])
        if isinstance(placement, dict)
    }

    others: list[TrainingRun] = []
    seen: set[int] = {run.id}
    for raw in with_runs.split(","):
        text = raw.strip()
        if not text.isdigit():
            continue
        other_id = int(text)
        if other_id in seen:
            continue
        seen.add(other_id)
        other = db.get(TrainingRun, other_id)
        if other is not None:
            others.append(other)

    def url(target: TrainingRun, key: str) -> str:
        # The path must end in ".ply": the WebGL loader picks its parser from the
        # URL suffix, and a query string after the extension makes it bail out
        # with "File format not supported".
        return f"/api/admin/training/{target.id}/artifacts/{key}.ply?token={session.token}"

    scenes: list[TrainingPreviewSceneOut] = []
    for target in [run, *others]:
        is_reference = target.id != run.id
        own = _load_transforms(target) if is_reference else host
        own_blocks = {
            str(block.get("key")): block
            for block in (own.get("blocks") or [])
            if isinstance(block, dict)
        }
        merged_meta = own.get("merged") if isinstance(own.get("merged"), dict) else {}
        block_rows = {block.key: block for block in target.blocks}

        for order, (key, artifact) in enumerate(_scene_artifacts(target).items()):
            meta = merged_meta if key == "merged" else (own_blocks.get(key) or {})
            entry = meta if isinstance(meta, dict) else {}
            base_pivot = (
                (entry.get("placement") or {}).get("pivot")
                or entry.get("camera_center")
                or [0.0, 0.0, 0.0]
            )
            if is_reference:
                # A cloud of another run is placed relative to *this* run
                saved = host_placements.get((target.id, key))
                placement = splat.sanitize_placement(
                    (saved or {}).get("placement"), base_pivot
                )
                transform_source = "manual" if saved else "identity"
            else:
                placement = splat.sanitize_placement(entry.get("placement"), base_pivot)
                transform_source = str(entry.get("transform_source") or "identity")

            block = block_rows.get(key)
            scenes.append(
                TrainingPreviewSceneOut(
                    key=f"{target.id}:{key}" if is_reference else key,
                    name=(
                        block.name
                        if block is not None
                        else str(entry.get("name") or ("合并模型" if key == "merged" else key))
                    ),
                    url=url(target, key),
                    run_id=target.id,
                    is_reference=is_reference,
                    block_key=None if key == "merged" else key,
                    merged=key == "merged",
                    gaussians=int(entry.get("gaussians") or artifact.get("gaussians") or 0),
                    size_bytes=int(artifact.get("size_bytes") or 0),
                    # Offset the reference palette so the stacked run is visually
                    # distinct from the one being placed
                    color=_BLOCK_COLORS[
                        (order + (3 if is_reference else 0)) % len(_BLOCK_COLORS)
                    ],
                    placement=placement,
                    transform=splat.matrix_for_placement(placement),
                    transform_source=transform_source,
                )
            )

    # Merged clouds first, then this run's blocks, then the reference runs.
    scenes.sort(key=lambda scene: (not scene.merged, scene.is_reference, scene.name))
    return TrainingPreviewOut(
        run_id=run.id,
        name=run.name,
        status=run.status,
        coordinate_system=_coordinate_system(run),
        scenes=scenes,
    )


def _scene_artifacts(run: TrainingRun) -> dict[str, dict]:
    """``key -> ply artifact`` for every point cloud of a run."""
    artifacts: dict[str, dict] = {}
    for artifact in run.artifacts or []:
        if artifact.get("kind") == "ply" and artifact.get("path"):
            artifacts[str(artifact.get("block_key") or "merged")] = artifact
    return artifacts


def _scene_paths(run: TrainingRun) -> dict[str, str]:
    """``key -> artifact path`` for every point cloud of a run."""
    return {
        key: str(artifact["path"]) for key, artifact in _scene_artifacts(run).items()
    }


def _load_transforms(run: TrainingRun) -> dict:
    """The run's transforms.json (empty dict when it doesn't exist yet)."""
    artifact = next(
        (item for item in (run.artifacts or []) if item.get("kind") == "transform"),
        None,
    )
    if not artifact or not artifact.get("path"):
        return {}
    try:
        path = storage.resolve(str(artifact["path"]))
        if not path.exists():
            return {}
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _base_pivot(meta: dict | None) -> list[float]:
    entry = meta if isinstance(meta, dict) else {}
    value = (entry.get("placement") or {}).get("pivot") or entry.get("camera_center")
    if isinstance(value, (list, tuple)) and len(value) == 3:
        return [float(item) for item in value]
    return [0.0, 0.0, 0.0]


def _coordinate_system(run: TrainingRun) -> str:
    """Read the coordinate system the pipeline recorded in transforms.json."""
    value = _load_transforms(run).get("coordinate_system")
    if isinstance(value, str) and value:
        return value
    return "colmap_world"


@router.put("/training/{run_id}/transforms")
def update_training_transforms(
    run_id: int,
    payload: TransformUpdateIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Save hand-made placements from the 3D preview editor.

    A cloud of this run goes into ``blocks[].placement``; a cloud belonging to
    another run is recorded in ``placements[]`` as "relative to this run's
    coordinate system". The 4x4 matrix is always derived from the structured
    parameters, so transforms.json can never drift away from the editor.
    """
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")

    data = _load_transforms(run)
    if not data:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "这个任务还没有 transforms.json，请先跑一次重建"
        )
    if not payload.placements:
        # Nothing to do — don't touch updated_at just because someone hit save
        return {
            "ok": True,
            "saved": 0,
            "updated_at": data.get("updated_at"),
            "placement_count": len(data.get("placements") or []),
        }

    blocks = [block for block in (data.get("blocks") or []) if isinstance(block, dict)]
    blocks_by_key = {str(block.get("key")): block for block in blocks}
    merged = data.get("merged") if isinstance(data.get("merged"), dict) else None

    placements: list[dict] = [
        item for item in (data.get("placements") or []) if isinstance(item, dict)
    ]
    placement_index = {(item.get("run_id"), str(item.get("key"))): item for item in placements}

    now = utcnow().isoformat(timespec="seconds")
    saved = 0

    for item in payload.placements:
        target_key = str(item.key)
        if item.run_id is None or item.run_id == run.id:
            entry = merged if target_key == "merged" else blocks_by_key.get(target_key)
            if entry is None:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST, f"这个任务里没有名为 {target_key} 的点云"
                )
            base_pivot = _base_pivot(entry)
        else:
            other = db.get(TrainingRun, item.run_id)
            if other is None:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST, f"任务 #{item.run_id} 不存在"
                )
            if target_key not in _scene_paths(other):
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    f"任务 #{item.run_id} 里没有名为 {target_key} 的点云",
                )
            other_transforms = _load_transforms(other)
            other_blocks = {
                str(block.get("key")): block
                for block in (other_transforms.get("blocks") or [])
                if isinstance(block, dict)
            }
            other_meta = (
                other_transforms.get("merged")
                if target_key == "merged"
                else other_blocks.get(target_key)
            )
            base_pivot = _base_pivot(other_meta)

            entry = placement_index.get((other.id, target_key))
            if entry is None:
                block_row = next((b for b in other.blocks if b.key == target_key), None)
                entry = {
                    "run_id": other.id,
                    "run_name": other.name,
                    "key": target_key,
                    "name": block_row.name if block_row is not None else other.name,
                }
                placements.append(entry)
                placement_index[(other.id, target_key)] = entry

        placement = splat.sanitize_placement(item.model_dump(), base_pivot)
        entry["placement"] = placement
        entry["transform"] = splat.matrix_for_placement(placement)
        entry["transform_source"] = "manual"
        entry["transform_updated_at"] = now
        saved += 1

    data["blocks"] = blocks
    if merged is not None:
        data["merged"] = merged
    data["placements"] = placements
    data["updated_at"] = now

    manual_count = sum(
        1
        for entry in [*blocks, *([merged] if merged else []), *placements]
        if isinstance(entry, dict) and entry.get("transform_source") == "manual"
    )
    if manual_count:
        alignment = dict(data.get("alignment") or {})
        alignment["manual_placements"] = manual_count
        data["alignment"] = alignment

    artifact = next(
        (item for item in (run.artifacts or []) if item.get("kind") == "transform"),
        None,
    )
    if not artifact or not artifact.get("path"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "找不到 transforms.json 的产物路径")
    path = storage.resolve(str(artifact["path"]))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    artifact["size_bytes"] = path.stat().st_size
    run.artifacts = list(run.artifacts or [])
    db.commit()

    return {
        "ok": True,
        "saved": saved,
        "updated_at": now,
        "manual": manual_count,
        "placement_count": len(placements),
    }


@router.get("/training/{run_id}/artifacts/{filename}")
def training_artifact(
    run_id: int,
    filename: str,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> FileResponse:
    """Stream one point cloud of a run, for the preview.

    The URL deliberately ends in `.ply` — the WebGL loader derives the scene
    format from the path suffix, so a query string *after* the extension
    ("...?path=x.ply&token=...") makes it refuse the file. Only keys the run
    actually produced can be served, so this can't read arbitrary files.
    """
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")

    name = Path(filename).name
    if not name.lower().endswith(".ply"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "只提供 .ply 点云")
    key = name[: -len(".ply")]

    artifact = _scene_artifacts(run).get(key)
    if artifact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "该点云不存在（可能已被清理）")

    resolved = storage.resolve(str(artifact.get("path") or ""))
    if not resolved.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点云文件已丢失")

    # No filename: keep this an inline stream for the preview, not a download.
    return FileResponse(resolved, media_type="application/octet-stream")


# ---------------------------------------------------------------- maintenance


def _scope_dir(scope: str) -> Path:
    """One of the well-known data directories, resolved on every call so tests
    (and a live config change) see the current value."""
    return {
        "data": config.DATA_DIR,
        "uploads": config.UPLOAD_DIR,
        "thumbs": config.THUMB_DIR,
        "training": config.TRAINING_DIR,
        "logs": config.LOG_DIR,
    }[scope]


def _purge_dir(path: Path) -> int:
    """Empty a data directory, returning how many bytes were removed."""
    if not path.exists():
        return 0
    freed = 0
    for child in path.iterdir():
        try:
            if child.is_dir():
                freed += sum(item.stat().st_size for item in child.rglob("*") if item.is_file())
                shutil.rmtree(child, ignore_errors=True)
            else:
                freed += child.stat().st_size
                child.unlink(missing_ok=True)
        except OSError:
            continue
    return freed


@router.post("/photos/purge")
def purge_photos(
    task_id: int | None = Query(default=None, description="只清这个任务，默认全部"),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Delete every photo (files, thumbnails and records) but keep tasks/checkpoints.

    Meant for the one-off switch to the readable upload layout: photos taken
    before it have random file names, and starting the collection over is simpler
    than shuffling them around. Photos are what is deleted — the tasks,
    checkpoints and their shot counts stay exactly as they are.
    """
    query = select(Photo)
    if task_id is not None:
        query = query.where(Photo.task_id == task_id)
    photos = db.execute(query).scalars().all()

    freed = 0
    for photo in photos:
        for rel in (photo.stored_path, photo.thumb_path, photo.preview_path):
            if not rel:
                continue
            try:
                path = storage.resolve(rel)
            except HTTPException:
                continue
            freed += path.stat().st_size if path.exists() else 0
            path.unlink(missing_ok=True)
        db.delete(photo)
    db.commit()

    # Files left in the uploads tree without a database row (a crash, or an
    # earlier cleanup) would keep the tree messy — the point of this endpoint is
    # a photo directory that matches reality.
    known = {
        row
        for (row,) in db.execute(select(Photo.stored_path))
        if row
    }
    orphans = 0
    for path in sorted(config.UPLOAD_DIR.rglob("*"), key=lambda item: len(item.parts), reverse=True):
        if path.is_dir():
            try:
                if not any(path.iterdir()):
                    path.rmdir()
            except OSError:
                continue
            continue
        try:
            rel = path.relative_to(config.DATA_DIR).as_posix()
        except ValueError:
            rel = str(path)
        if rel in known:
            continue
        orphans += 1
        freed += path.stat().st_size if path.exists() else 0
        path.unlink(missing_ok=True)

    return {
        "ok": True,
        "deleted_photos": len(photos),
        "orphan_files": orphans,
        "freed_bytes": freed,
    }


@router.post("/reset")
def reset_everything(
    payload: ResetIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Delete every task, checkpoint, photo and training run — files included.

    The admin's own session survives (so the console doesn't log you out), and
    volunteer logins are dropped because their tasks are gone.
    """
    if payload.confirm.strip().upper() != "DELETE":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "确认词不对：请在确认框里输入 DELETE")

    tasks = db.execute(select(Task)).scalars().all()
    runs = db.execute(select(TrainingRun)).scalars().all()
    photos = db.execute(select(func.count(Photo.id))).scalar_one() or 0

    # Stop training first: deleting its output under a running job would only
    # make the job fail confusingly
    for run in runs:
        if run.status == "running":
            manager.cancel(run.id)

    for run in runs:
        db.delete(run)
    for task in tasks:
        db.delete(task)
    removed_sessions = (
        db.execute(delete(AuthSession).where(AuthSession.role == "volunteer")).rowcount or 0
    )
    db.commit()

    freed = 0
    for path in (config.UPLOAD_DIR, config.THUMB_DIR, config.TRAINING_DIR, config.LOG_DIR):
        freed += _purge_dir(path)

    return {
        "ok": True,
        "tasks": len(tasks),
        "photos": photos,
        "runs": len(runs),
        "volunteer_sessions": removed_sessions,
        "freed_bytes": freed,
    }


def _reveal_command(target: Path, *, is_file: bool) -> list[str]:
    """Command that opens the file manager of the machine running the server."""
    if sys.platform.startswith("win"):
        # explorer wants /select,<path> in one argument (no space after the comma)
        return ["explorer", f"/select,{target}"] if is_file else ["explorer", str(target)]
    if sys.platform == "darwin":
        return ["open", "-R", str(target)] if is_file else ["open", str(target)]
    # Linux/BSD: xdg-open is the portable choice; it opens the folder for files
    return ["xdg-open", str(target.parent if is_file else target)]


@router.post("/reveal")
def reveal_in_file_manager(
    payload: RevealIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """Open the server machine's file manager at a photo / task / data folder.

    Only useful when you are sitting at the machine that runs the service; from
    another computer it still opens it — on that machine, not on yours.
    """
    if payload.photo_id is not None:
        photo = db.get(Photo, payload.photo_id)
        if photo is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "照片不存在")
        target = storage.resolve(photo.stored_path)
        is_file = True
    elif payload.task_id is not None:
        task = db.get(Task, payload.task_id)
        if task is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")
        target = config.UPLOAD_DIR / f"task{task.id}"
        is_file = False
    elif payload.scope is not None:
        target = _scope_dir(payload.scope)
        is_file = False
    elif payload.path:
        target = storage.resolve(payload.path)
        is_file = target.is_file()
    else:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "要指定 photo_id / task_id / scope / path 其中之一"
        )

    if not target.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"路径不存在：{target}")

    command = _reveal_command(target, is_file=is_file)
    try:
        subprocess.Popen(
            command,
            shell=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except OSError as exc:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"这台机器上打不开文件管理器（{exc}）—— 无桌面环境时正常",
        )

    return {"ok": True, "path": str(target), "command": " ".join(command)}
