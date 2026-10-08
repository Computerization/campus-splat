"""Volunteer endpoints (phone).

Goal: usable one-handed while standing in a corridor.
  * the board lists the checkpoints that are free to take
  * a volunteer takes **one checkpoint at a time**: shoot it, upload it, hand it
    in, then take the next one — no "collect every room of a task, submit once"
  * the checkpoint page says where to go, how to shoot and how many shots
  * upload returns a verdict immediately, so a bad photo is retaken on the spot

Handing a checkpoint in means *its* photos are ready for review; an admin judges
that checkpoint on its own (see routers/reviews.py).
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import get_db
from ..models import AuthSession, Checkpoint, Photo, Task, VolunteerAccount, utcnow
from ..schemas import (
    CheckpointProgressOut,
    PhotoOut,
    QualityOut,
    UploadBatchOut,
    UploadResultOut,
)
from ..security import require_volunteer
from ..services import stats
from ..services.ingest import dispatch_quality, ingest_upload
from ..services.quality_jobs import result_from_photo

router = APIRouter(prefix="/api/volunteer", tags=["volunteer"])

# A checkpoint a volunteer still owes work on: taken but not handed in, or handed
# in and sent back for a retake.
OPEN_STATUSES = ("pending", "returned")
# How many already-approved checkpoints the board shows back to the volunteer.
DONE_PREVIEW = 20


def _write_lock(db: OrmSession) -> None:
    """Serialize "take this checkpoint" across threads and processes.

    Same trick as routers/workflow.py: without it two volunteers tapping
    "接取" at the same moment can both pass the "is it free?" check.
    """
    db.commit()
    db.execute(text('BEGIN IMMEDIATE'))
    db.expire_all()


def _load_checkpoint(db: OrmSession, checkpoint_id: int) -> Checkpoint:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")
    return checkpoint


def _load_active_task(db: OrmSession, checkpoint: Checkpoint) -> Task:
    task = db.get(Task, checkpoint.task_id)
    if task is None or task.status != "active":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在或已归档")
    return task


def _photo_out(photo: Photo, session: AuthSession) -> PhotoOut:
    data = PhotoOut.model_validate(photo)
    token = session.token
    data.thumb_url = f"/api/media/thumb/{photo.id}?token={token}"
    data.preview_url = f"/api/media/preview/{photo.id}?token={token}"
    data.file_url = f"/api/media/file/{photo.id}?token={token}"
    if photo.quality is not None:
        data.quality = QualityOut.model_validate(photo.quality)
    return data


def _my_photo_count(
    db: OrmSession,
    checkpoint_id: int,
    session: AuthSession,
    *,
    usable_only: bool = False,
    exclude_rejected: bool = False,
) -> int:
    """How many photos this volunteer uploaded for that checkpoint.

    `usable_only` counts the ones the quality check passed. `exclude_rejected`
    also accepts the ones still being checked — that is what "may I hand this
    checkpoint in yet?" means, because the background worker can lag behind an
    upload and the volunteer should not have to wait for it.
    """
    query = select(func.count(Photo.id)).where(
        Photo.checkpoint_id == checkpoint_id, Photo.volunteer_id == session.volunteer_id
    )
    if usable_only:
        query = query.where(Photo.status.in_(stats.USABLE_STATUSES))
    if exclude_rejected:
        query = query.where(Photo.status != "rejected")
    return db.execute(query).scalar_one() or 0


def _card(db: OrmSession, checkpoint: Checkpoint, progress: CheckpointProgressOut,
          session: AuthSession) -> dict:
    """One row for the volunteer's board."""
    task = db.get(Task, checkpoint.task_id)
    return {
        "checkpoint": progress.model_dump(mode="json"),
        "task_id": checkpoint.task_id,
        "task_name": task.name if task else "（任务已删除）",
        "task_kind": task.kind if task else "indoor",
        "review_status": checkpoint.review_status,
        "review_note": checkpoint.review_note,
        "attempt": checkpoint.attempt or 0,
        "mine": checkpoint.claimed_by == session.volunteer_id,
        "my_photo_count": _my_photo_count(db, checkpoint.id, session),
        "my_usable_count": _my_photo_count(db, checkpoint.id, session, exclude_rejected=True),
        "claimed_by_someone_else": checkpoint.claimed_by not in (None, session.volunteer_id),
    }


def _cards(db: OrmSession, checkpoints: list[Checkpoint], session: AuthSession) -> list[dict]:
    if not checkpoints:
        return []
    task_ids = sorted({checkpoint.task_id for checkpoint in checkpoints})
    progress_map = stats.checkpoint_progress_map(db, task_ids)
    return [
        _card(db, checkpoint, stats.to_progress(checkpoint, progress_map.get((checkpoint.task_id, checkpoint.id))), session)
        for checkpoint in checkpoints
    ]


@router.get("/board")
def checkpoint_board(
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    """点位大厅：我手上的、可以接的、等我上传的、已经通过的。"""
    mine = [row.id for row in db.execute(
        select(Checkpoint).where(Checkpoint.claimed_by == session.volunteer_id,
                                 Checkpoint.review_status.in_(OPEN_STATUSES))
    ).scalars().all()]

    held = [row for row in db.execute(
        select(Checkpoint).where(Checkpoint.claimed_by == session.volunteer_id,
                                 Checkpoint.review_status.in_(OPEN_STATUSES))
        .order_by(Checkpoint.review_status.desc(), Checkpoint.order_index)
    ).scalars().all()]

    reviewing = [row for row in db.execute(
        select(Checkpoint).where(Checkpoint.claimed_by == session.volunteer_id,
                                 Checkpoint.review_status == "submitted")
        .order_by(Checkpoint.submitted_at.desc())
    ).scalars().all()]

    approved = [row for row in db.execute(
        select(Checkpoint).join(Task, Task.id == Checkpoint.task_id)
        .where(Checkpoint.claimed_by == session.volunteer_id,
               Checkpoint.review_status == "approved",
               Task.status == "active")
        .order_by(Checkpoint.reviewed_at.desc()).limit(DONE_PREVIEW)
    ).scalars().all()]

    available = [row for row in db.execute(
        select(Checkpoint).join(Task, Task.id == Checkpoint.task_id)
        .where(Checkpoint.claimed_by.is_(None),
               Checkpoint.review_status != "approved",
               Checkpoint.status != "blocked",
               Task.status == "active")
        .order_by(Checkpoint.task_id, Checkpoint.order_index)
    ).scalars().all()]

    # "One at a time" only counts what has not been handed in yet: a checkpoint
    # sent back for a retake may wait while the volunteer does something else.
    busy = any(row.review_status == "pending" for row in held)
    return {
        "busy": busy,
        "held": _cards(db, held, session),
        "reviewing": _cards(db, reviewing, session),
        "approved": _cards(db, approved, session),
        "available": _cards(db, available, session),
    }


@router.post("/checkpoints/{checkpoint_id}/claim")
def claim_checkpoint(
    checkpoint_id: int,
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    """接取一个点位（同时只能有一个没上传的）。"""
    _write_lock(db)
    account = db.get(VolunteerAccount, session.volunteer_id)
    if account is None or not account.active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "账号已注销")
    checkpoint = _load_checkpoint(db, checkpoint_id)
    _load_active_task(db, checkpoint)

    if checkpoint.review_status == "approved":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已经审核通过，不需要再拍")
    if checkpoint.status == "blocked":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位暂不可拍摄，请等管理员处理")
    if checkpoint.claimed_by == session.volunteer_id:
        progress_map = stats.checkpoint_progress_map(db, [checkpoint.task_id])
        return _card(db, checkpoint, stats.to_progress(checkpoint, progress_map.get((checkpoint.task_id, checkpoint.id))), session)
    if checkpoint.claimed_by is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已被其他志愿者接取")

    open_mine = db.execute(
        select(func.count(Checkpoint.id)).where(
            Checkpoint.claimed_by == session.volunteer_id,
            Checkpoint.review_status == "pending",
        )
    ).scalar_one() or 0
    if open_mine:
        raise HTTPException(status.HTTP_409_CONFLICT, "一次只能做一个点位：先把手上那个上传提交，再接下一个")

    checkpoint.claimed_by = session.volunteer_id
    checkpoint.claimed_at = utcnow()
    if checkpoint.review_status == "pending" and checkpoint.status == "pending":
        checkpoint.status = "in_progress"
    db.commit()

    progress_map = stats.checkpoint_progress_map(db, [checkpoint.task_id])
    return _card(db, checkpoint, stats.to_progress(checkpoint, progress_map.get((checkpoint.task_id, checkpoint.id))), session)


@router.post("/checkpoints/{checkpoint_id}/release")
def release_checkpoint(
    checkpoint_id: int,
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    """放弃手上的点位，放回可接池（打回待重拍的不影响别人接着做）。"""
    _write_lock(db)
    checkpoint = _load_checkpoint(db, checkpoint_id)
    if checkpoint.claimed_by != session.volunteer_id:
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位不在你手上")
    if checkpoint.review_status not in OPEN_STATUSES:
        raise HTTPException(status.HTTP_409_CONFLICT, "已经提交的点位不能放弃，请等管理员审核或联系管理员")
    checkpoint.claimed_by = None
    checkpoint.claimed_at = None
    checkpoint.review_status = "pending"
    if checkpoint.status == "in_progress":
        checkpoint.status = "pending"
    db.commit()
    return {"ok": True}


@router.post("/checkpoints/{checkpoint_id}/submit")
def submit_checkpoint(
    checkpoint_id: int,
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    """提交这个点位的照片，等管理员审核（可以马上接下一个点位）。"""
    _write_lock(db)
    checkpoint = _load_checkpoint(db, checkpoint_id)
    if checkpoint.claimed_by != session.volunteer_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "这个点位不在你手上")
    if checkpoint.review_status == "submitted":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已经提交，正在等审核")
    if checkpoint.review_status == "approved":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已经审核通过")

    # Still-being-checked photos count: the quality worker can lag behind the
    # upload, and the volunteer stands in the corridor, not waiting for it.
    uploaded = _my_photo_count(db, checkpoint.id, session, exclude_rejected=True)
    if uploaded == 0:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "这个点位还没有可用的照片，先上传照片再提交",
        )

    checkpoint.review_status = "submitted"
    checkpoint.submitted_at = utcnow()
    checkpoint.reviewed_by = None
    checkpoint.reviewed_at = None
    checkpoint.attempt = (checkpoint.attempt or 0) + 1
    if checkpoint.status != "done":
        checkpoint.status = "in_progress"
    db.commit()

    progress_map = stats.checkpoint_progress_map(db, [checkpoint.task_id])
    return _card(db, checkpoint, stats.to_progress(checkpoint, progress_map.get((checkpoint.task_id, checkpoint.id))), session)


@router.get("/checkpoints/{checkpoint_id}")
def checkpoint_detail(
    checkpoint_id: int,
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> dict:
    """点位详情：怎么拍、拍到什么程度、管理员说过什么。

    Viewable by every volunteer (they need to read the shooting notes before
    taking it); uploading still requires holding it.
    """
    checkpoint = _load_checkpoint(db, checkpoint_id)
    task = db.get(Task, checkpoint.task_id)
    if task is None or task.status == "deleted":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在或已删除")
    progress_map = stats.checkpoint_progress_map(db, [task.id])
    progress = stats.to_progress(checkpoint, progress_map.get((task.id, checkpoint.id)))

    my_photos = db.execute(
        select(Photo)
        .where(Photo.checkpoint_id == checkpoint.id, Photo.volunteer_id == session.volunteer_id)
        .order_by(Photo.uploaded_at.desc())
        .limit(60)
    ).scalars().all()

    return {
        "checkpoint": progress.model_dump(mode="json"),
        "task": {"id": task.id, "name": task.name, "kind": task.kind},
        "review": {
            "status": checkpoint.review_status,
            "note": checkpoint.review_note,
            "reviewed_at": checkpoint.reviewed_at.isoformat() + "Z" if checkpoint.reviewed_at else None,
            "attempt": checkpoint.attempt or 0,
        },
        "held_by_me": checkpoint.claimed_by == session.volunteer_id,
        "held_by_other": checkpoint.claimed_by not in (None, session.volunteer_id),
        "my_photos": [_photo_out(photo, session).model_dump(mode="json") for photo in my_photos],
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
    checkpoint = _load_checkpoint(db, checkpoint_id)
    task = _load_active_task(db, checkpoint)
    if checkpoint.claimed_by != session.volunteer_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "先接取这个点位，再上传照片")
    if checkpoint.review_status == "submitted":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已经提交，等管理员审核结果")
    if checkpoint.review_status == "approved":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位已经审核通过，不需要再上传")

    if not files:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "没有收到文件")
    if len(files) > config.MAX_FILES_PER_REQUEST:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"一次最多上传 {config.MAX_FILES_PER_REQUEST} 张，请分几批",
        )

    results: list[UploadResultOut] = []
    new_photos: list[Photo] = []
    for upload in files:
        result = ingest_upload(
            db, task=task, checkpoint=checkpoint, session=session, upload=upload
        )
        results.append(result)
        if result.photo_id is not None:
            photo = db.get(Photo, result.photo_id)
            if photo is not None:
                new_photos.append(photo)
    # The submission path commits per batch, so the background quality worker can
    # see these rows only after the commit (services/ingest.py documents this).
    for photo in new_photos:
        dispatch_quality(db, photo)

    progress_map = stats.checkpoint_progress_map(db, [task.id])
    progress: CheckpointProgressOut = stats.to_progress(checkpoint, progress_map.get((task.id, checkpoint.id)))
    return UploadBatchOut(results=results, checkpoint=progress)


@router.get("/photos", response_model=list[UploadResultOut])
def photo_results(
    ids: str = Query(..., description="逗号分隔的照片 id，最多 60 张"),
    session: AuthSession = Depends(require_volunteer),
    db: OrmSession = Depends(get_db),
) -> list[UploadResultOut]:
    """Verdicts for photos this session uploaded.

    The upload reply only says "received"; the phone polls this while the
    background worker (services/quality_jobs.py) checks the batch, so each photo
    flips from ``checking`` to its result on screen.
    """
    wanted: list[int] = []
    for chunk in (ids or "").split(","):
        text_id = chunk.strip()
        if text_id.isdigit():
            wanted.append(int(text_id))
    wanted = wanted[:60]
    if not wanted:
        return []

    photos = db.execute(
        select(Photo).where(
            Photo.id.in_(wanted),
            Photo.volunteer_id == session.volunteer_id,
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
    photos = db.execute(
        select(Photo)
        .where(Photo.volunteer_id == session.volunteer_id)
        .order_by(Photo.uploaded_at.desc())
        .limit(limit)
    ).scalars().all()
    return [_photo_out(photo, session) for photo in photos]
