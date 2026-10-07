"""Volunteer endpoints (phone).

Goal: usable one-handed while standing in a corridor.
  * one board per task — see at a glance which checkpoints still need photos
  * the checkpoint page says where to go, how to shoot and how many shots
  * upload returns a verdict immediately, so a bad photo is retaken on the spot
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import get_db
from ..models import AuthSession, Checkpoint, Photo, Task
from ..schemas import (
    CheckpointProgressOut,
    PhotoOut,
    QualityOut,
    UploadBatchOut,
    UploadResultOut,
    VolunteerBoardOut,
)
from ..security import require_volunteer
from ..services import stats
from ..services.ingest import ingest_upload
from ..services.quality_jobs import result_from_photo

router = APIRouter(prefix="/api/volunteer", tags=["volunteer"])


def _require_task(session: AuthSession, db: OrmSession) -> Task:
    raise HTTPException(410, "请从任务大厅接取任务，并完成全部拍摄点后统一提交")


def _load_checkpoint(db: OrmSession, task: Task, checkpoint_id: int) -> Checkpoint:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None or checkpoint.task_id != task.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")
    return checkpoint


def _photo_out(photo: Photo, session: AuthSession) -> PhotoOut:
    data = PhotoOut.model_validate(photo)
    token = session.token
    data.thumb_url = f"/api/media/thumb/{photo.id}?token={token}"
    data.preview_url = f"/api/media/preview/{photo.id}?token={token}"
    data.file_url = f"/api/media/file/{photo.id}?token={token}"
    if photo.quality is not None:
        data.quality = QualityOut.model_validate(photo.quality)
    return data


@router.get("/board")
def board(
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    task = _require_task(session, db)
    checkpoint_map = stats.checkpoint_progress_map(db, [task.id])
    checkpoints = db.execute(
        select(Checkpoint).where(Checkpoint.task_id == task.id).order_by(Checkpoint.order_index)
    ).scalars().all()

    mine_total = db.execute(
        select(func.count(Photo.id)).where(Photo.task_id == task.id, Photo.session_id == session.token)
    ).scalar_one()
    mine_ok = db.execute(
        select(func.count(Photo.id)).where(
            Photo.task_id == task.id,
            Photo.session_id == session.token,
            Photo.status.in_(stats.USABLE_STATUSES),
        )
    ).scalar_one()

    payload = VolunteerBoardOut(
        task=task,
        nickname=session.nickname,
        my_photo_count=mine_total or 0,
        my_ok_count=mine_ok or 0,
        checkpoints=[
            stats.to_progress(cp, checkpoint_map.get((task.id, cp.id))) for cp in checkpoints
        ],
    )
    return payload.model_dump(mode="json")


@router.get("/checkpoints/{checkpoint_id}")
def checkpoint_detail(
    checkpoint_id: int,
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    task = _require_task(session, db)
    checkpoint = _load_checkpoint(db, task, checkpoint_id)
    checkpoint_map = stats.checkpoint_progress_map(db, [task.id])
    progress = stats.to_progress(checkpoint, checkpoint_map.get((task.id, checkpoint.id)))

    my_photos = db.execute(
        select(Photo)
        .where(Photo.checkpoint_id == checkpoint.id, Photo.session_id == session.token)
        .order_by(Photo.uploaded_at.desc())
        .limit(60)
    ).scalars().all()

    return {
        "checkpoint": progress.model_dump(mode="json"),
        "my_photos": [_photo_out(p, session).model_dump(mode="json") for p in my_photos],
        "reference_url": (
            f"/api/media/checkpoint-reference/{checkpoint.id}?token={session.token}"
            if checkpoint.reference_image
            else None
        ),
    }


@router.post("/checkpoints/{checkpoint_id}/photos", response_model=UploadBatchOut)
def upload_photos(
    checkpoint_id: int,
    files: list[UploadFile] = File(...),
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> UploadBatchOut:
    task = _require_task(session, db)
    checkpoint = _load_checkpoint(db, task, checkpoint_id)

    if not files:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "没有收到文件")
    if len(files) > config.MAX_FILES_PER_REQUEST:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"一次最多上传 {config.MAX_FILES_PER_REQUEST} 张，请分几批",
        )

    results: list[UploadResultOut] = []
    for upload in files:
        result = ingest_upload(
            db, task=task, checkpoint=checkpoint, session=session, upload=upload
        )
        results.append(result)

    checkpoint_map = stats.checkpoint_progress_map(db, [task.id])
    progress: CheckpointProgressOut = stats.to_progress(checkpoint, checkpoint_map.get((task.id, checkpoint.id)))
    return UploadBatchOut(results=results, checkpoint=progress)


@router.get("/photos", response_model=list[UploadResultOut])
def photo_results(
    ids: str = Query(..., description="逗号分隔的照片 id，最多 60 张"),
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> list[UploadResultOut]:
    """Verdicts for photos this session uploaded.

    The submission reply only says "received"; the phone polls this while the
    background worker (services/quality_jobs.py) checks the batch, so each photo
    flips from ``checking`` to its result on screen.

    Scoped by the session that uploaded them, not by a task: a volunteer account
    claims tasks inside the app and is not bound to a single one (docs/README).
    """
    wanted: list[int] = []
    for chunk in (ids or "").split(","):
        text = chunk.strip()
        if text.isdigit():
            wanted.append(int(text))
    wanted = wanted[:60]
    if not wanted:
        return []

    photos = db.execute(
        select(Photo).where(
            Photo.id.in_(wanted),
            Photo.session_id == session.token,
        )
    ).scalars().all()
    order = {photo_id: index for index, photo_id in enumerate(wanted)}
    photos.sort(key=lambda photo: order.get(photo.id, len(wanted)))
    return [result_from_photo(photo) for photo in photos]


@router.get("/my/photos", response_model=list[PhotoOut])
def my_photos(
    session: AuthSession = Depends(require_volunteer),
    limit: int = Query(default=80, ge=1, le=300),
    db: OrmSession = Depends(get_db),
) -> list[PhotoOut]:
    task = _require_task(session, db)
    photos = db.execute(
        select(Photo)
        .where(Photo.task_id == task.id, Photo.session_id == session.token)
        .order_by(Photo.uploaded_at.desc())
        .limit(limit)
    ).scalars().all()
    return [_photo_out(p, session) for p in photos]
