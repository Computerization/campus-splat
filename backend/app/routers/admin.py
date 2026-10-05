"""Admin endpoints (the club-room desktop console).

Covers checkpoint planning, progress overview, photo review and the training
job controls.
"""

from __future__ import annotations

import csv
import io
import random
import string
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..database import get_db
from ..models import AuthSession, Checkpoint, Photo, Task, TrainingRun, utcnow
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
    TaskCreateIn,
    TaskOut,
    TaskPatchIn,
    TaskProgressOut,
    TrainingCreateIn,
    TrainingRunOut,
)
from ..security import prune_expired_sessions, require_admin
from ..services import stats, sysinfo
from ..services.training import create_run, manager, queue_depth

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])

_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I


def _new_access_code(db: OrmSession, length: int = 6) -> str:
    for _ in range(20):
        code = "".join(random.choice(_CODE_ALPHABET) for _ in range(length))
        if not db.execute(select(Task.id).where(Task.access_code == code)).first():
            return code
    return "".join(random.choice(_CODE_ALPHABET) for _ in range(10))


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
    db: OrmSession = Depends(get_db),
) -> dict:
    return stats.build_overview(db, include_archived=include_archived).model_dump(mode="json")


@router.get("/system")
def system_info(db: OrmSession = Depends(get_db)) -> dict:
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
        "training_queue": queue_depth(db),
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
    db: OrmSession = Depends(get_db),
) -> list[TaskProgressOut]:
    query = select(Task).order_by(Task.created_at.desc())
    if not include_archived:
        query = query.where(Task.status != "archived")
    tasks = db.execute(query).scalars().all()
    checkpoint_map = stats.checkpoint_progress_map(db, [t.id for t in tasks])
    return [stats.build_task_progress(db, t, checkpoint_map=checkpoint_map) for t in tasks]


@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreateIn, db: OrmSession = Depends(get_db)) -> TaskOut:
    code = (payload.access_code or "").strip().upper() or _new_access_code(db)
    if db.execute(select(Task.id).where(Task.access_code == code)).first():
        raise HTTPException(status.HTTP_409_CONFLICT, f"访问码 {code} 已被占用")

    task = Task(
        name=payload.name.strip(),
        kind=payload.kind,
        description=payload.description,
        location_hint=payload.location_hint,
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

    db.delete(task)
    db.commit()

    for rel in rel_paths:
        storage.delete_file(rel)
    if purge_files:
        folder = config.UPLOAD_DIR / f"task{task_id}"
        try:
            import shutil

            shutil.rmtree(folder, ignore_errors=True)
        except Exception:
            pass
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

    for index, item in enumerate(payload.items):
        db.add(
            Checkpoint(
                task_id=task_id,
                order_index=item.order_index if item.order_index is not None else base_order + index,
                name=item.name,
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
    conditions = []
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
    if photo.quality is not None:
        photo.quality.passed = payload.status != "rejected"
        if payload.note:
            issues = list(photo.quality.issues or [])
            issues.append({"code": "admin_note", "level": "info", "message": payload.note})
            photo.quality.issues = issues
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


@router.get("/training", response_model=list[TrainingRunOut])
def list_training_runs(
    limit: int = Query(default=30, ge=1, le=200),
    db: OrmSession = Depends(get_db),
) -> list[TrainingRunOut]:
    runs = db.execute(
        select(TrainingRun).order_by(TrainingRun.created_at.desc()).limit(limit)
    ).scalars().all()
    manager.start()  # wake the dispatcher thread as soon as someone looks
    return [stats.to_training_out(run) for run in runs]


@router.get("/training/queue")
def training_queue(db: OrmSession = Depends(get_db)) -> dict:
    return queue_depth(db)


@router.post("/training", response_model=TrainingRunOut, status_code=201)
def create_training_run(
    payload: TrainingCreateIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> TrainingRunOut:
    if payload.task_id is not None:
        task = db.get(Task, payload.task_id)
        if task is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在")
        eligible = stats.eligible_photo_count(db, payload.task_id)
        if eligible == 0:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "这个任务还没有可用的照片，先让志愿者多拍一些"
            )

    try:
        run = create_run(
            db,
            task_id=payload.task_id,
            name=payload.name,
            params=payload.params,
            created_by=session.nickname or "admin",
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc

    manager.start()
    db.refresh(run)
    return stats.to_training_out(run)


@router.get("/training/{run_id}", response_model=TrainingRunOut)
def training_detail(run_id: int, db: OrmSession = Depends(get_db)) -> TrainingRunOut:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    manager.start()
    return stats.to_training_out(run)


@router.post("/training/{run_id}/cancel", response_model=TrainingRunOut)
def cancel_training(run_id: int, db: OrmSession = Depends(get_db)) -> TrainingRunOut:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    if run.status in ("succeeded", "failed", "cancelled"):
        return stats.to_training_out(run)

    note = manager.cancel(run_id)
    run.status = "cancelled"
    run.stage = "cancelled"
    run.message = note
    run.finished_at = utcnow()
    db.commit()
    db.refresh(run)
    return stats.to_training_out(run)


@router.get("/training/{run_id}/log")
def training_log(
    run_id: int,
    tail: int = Query(default=200, ge=1, le=5000),
    db: OrmSession = Depends(get_db),
) -> dict:
    run = db.get(TrainingRun, run_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "训练任务不存在")
    if not run.log_path:
        return {"lines": [], "path": None}

    path = storage.resolve(run.log_path)
    if not path.exists():
        return {"lines": [], "path": run.log_path}

    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    return {"lines": lines[-tail:], "path": run.log_path, "total": len(lines)}
