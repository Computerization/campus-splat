"""点位照片最终审核 (admin).

Replaces the old "整份成果审核": the unit is a single checkpoint, because a
volunteer now hands checkpoints in one at a time (routers/volunteer.py).

Who sees and who acts:

* **every** administrator sees every checkpoint of every task, photos included;
* administrator 001 (config.SUPER_ADMIN_ID) may judge any checkpoint;
* 002 and 003 may judge only the checkpoints of tasks they published.

Reading is deliberately unrestricted — `security.admin_scope` only checks
ownership for non-GET requests, and the review list has to show all tasks. The
trial reconstruction (试解算) is a write, so it follows the same rule.
"""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import get_db
from ..models import AuthSession, Checkpoint, Photo, Task, VolunteerAccount, utcnow
from ..schemas import PhotoOut, QualityOut
from ..security import admin_scope, require_admin
from ..services import recon, stats

router = APIRouter(prefix="/api/admin", tags=["checkpoint review"],
                   dependencies=[Depends(admin_scope)])

REVIEW_STATUSES = ("submitted", "approved", "returned", "pending")


def _write_lock(db: OrmSession) -> None:
    """Same serialization trick as routers/workflow.py (BEGIN IMMEDIATE)."""
    db.commit()
    db.execute(text('BEGIN IMMEDIATE'))
    db.expire_all()


def _can_operate(session: AuthSession, task: Task) -> bool:
    """001 judges anything; 002/003 only the tasks they published."""
    return session.admin_id == config.SUPER_ADMIN_ID or task.owner_admin_id == session.admin_id


def _load(db: OrmSession, checkpoint_id: int) -> tuple[Checkpoint, Task]:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")
    task = db.get(Task, checkpoint.task_id)
    if task is None or task.status == "deleted":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "任务不存在或已删除")
    return checkpoint, task


def _volunteer_label(db: OrmSession, volunteer_id: int | None) -> str | None:
    if not volunteer_id:
        return None
    account = db.get(VolunteerAccount, volunteer_id)
    if account is None:
        return None
    return f"{account.username} · {account.id - 1:05d}"


def _count_photos(db: OrmSession, checkpoint_id: int, *, usable_only: bool) -> int:
    query = select(func.count(Photo.id)).where(Photo.checkpoint_id == checkpoint_id)
    if usable_only:
        query = query.where(Photo.status.in_(stats.USABLE_STATUSES))
    return db.execute(query).scalar_one() or 0


def _solve_summary(checkpoint: Checkpoint) -> dict | None:
    report = checkpoint.solve_report or {}
    if checkpoint.solve_status == recon.SOLVE_NONE and not report:
        return None
    return {
        "status": checkpoint.solve_status,
        "error": checkpoint.solve_error,
        "mock": bool(report.get("mock")),
        "score": report.get("score"),
        "verdict": report.get("verdict"),
        "can_reconstruct": report.get("can_reconstruct"),
        "registered_ratio": report.get("registered_ratio"),
        "components": len(report.get("components") or []),
        "images": report.get("images"),
        "registered": report.get("registered"),
        "mean_error_px": report.get("mean_error_px"),
        "elapsed_s": report.get("elapsed_s"),
        "finished_at": checkpoint.solve_finished_at.isoformat() + "Z" if checkpoint.solve_finished_at else None,
    }


def _photo_out(photo: Photo, session: AuthSession) -> dict:
    data = PhotoOut.model_validate(photo)
    token = session.token
    data.thumb_url = f"/api/media/thumb/{photo.id}?token={token}"
    data.preview_url = f"/api/media/preview/{photo.id}?token={token}"
    data.file_url = f"/api/media/file/{photo.id}?token={token}"
    if photo.quality is not None:
        data.quality = QualityOut.model_validate(photo.quality)
    return data.model_dump(mode="json")


def _review_out(db: OrmSession, checkpoint: Checkpoint, task: Task, session: AuthSession) -> dict:
    return {
        "checkpoint_id": checkpoint.id,
        "name": checkpoint.name,
        "room": checkpoint.room,
        "order_index": checkpoint.order_index,
        "task_id": task.id,
        "task_name": task.name,
        "task_kind": task.kind,
        "owner_admin_id": task.owner_admin_id,
        "volunteer": _volunteer_label(db, checkpoint.claimed_by),
        "required": checkpoint.shot_count,
        "usable_photos": _count_photos(db, checkpoint.id, usable_only=True),
        "total_photos": _count_photos(db, checkpoint.id, usable_only=False),
        "review_status": checkpoint.review_status,
        "review_note": checkpoint.review_note,
        "reviewed_by": checkpoint.reviewed_by,
        "submitted_at": checkpoint.submitted_at.isoformat() + "Z" if checkpoint.submitted_at else None,
        "reviewed_at": checkpoint.reviewed_at.isoformat() + "Z" if checkpoint.reviewed_at else None,
        "attempt": checkpoint.attempt or 0,
        "can_operate": _can_operate(session, task),
        "solve": _solve_summary(checkpoint),
    }


@router.get("/checkpoint-reviews")
def list_checkpoint_reviews(
    status_filter: str = Query(default="submitted", alias="status"),
    task_id: int | None = Query(default=None),
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """点位审核列表。默认列出"已提交、等审核"的点位。

    所有管理员都能看到全部任务的点位（`can_operate` 说明他能不能对这个点位
    做操作，前端按它决定按钮是否可用）。
    """
    if status_filter not in REVIEW_STATUSES:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY,
                            f"status 只能是 {', '.join(REVIEW_STATUSES)}")
    query = (
        select(Checkpoint, Task)
        .join(Task, Task.id == Checkpoint.task_id)
        .where(Task.status != "deleted")
    )
    if task_id is not None:
        query = query.where(Checkpoint.task_id == task_id)
    if status_filter == "submitted":
        query = query.where(Checkpoint.review_status == "submitted")
    elif status_filter == "pending":
        query = query.where(Checkpoint.review_status.in_(("pending", "returned")),
                            Checkpoint.claimed_by.is_not(None))
    else:
        query = query.where(Checkpoint.review_status == status_filter)

    if status_filter == "submitted":
        # First come, first judged.
        query = query.order_by(Checkpoint.submitted_at.asc(), Checkpoint.id.asc())
    else:
        query = query.order_by(Checkpoint.reviewed_at.desc(), Checkpoint.id.desc())

    rows = db.execute(query.limit(200)).all()
    counts = {
        name: db.execute(
            select(func.count(Checkpoint.id))
            .join(Task, Task.id == Checkpoint.task_id)
            .where(Task.status != "deleted", Checkpoint.review_status == name)
        ).scalar_one() or 0
        for name in ("submitted", "approved", "returned")
    }
    return {
        "items": [_review_out(db, checkpoint, task, session) for checkpoint, task in rows],
        "counts": counts,
        "status": status_filter,
    }


@router.get("/checkpoint-reviews/{checkpoint_id}")
def checkpoint_review_detail(
    checkpoint_id: int,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """一个点位的审核详情：照片（带质检结论）+ 试解算报告全文。"""
    checkpoint, task = _load(db, checkpoint_id)
    photos = db.execute(
        select(Photo).where(Photo.checkpoint_id == checkpoint.id).order_by(Photo.id)
    ).scalars().all()
    payload = _review_out(db, checkpoint, task, session)
    payload["photos"] = [_photo_out(photo, session) for photo in photos]
    payload["report"] = checkpoint.solve_report or None
    payload["shots_note"] = checkpoint.instructions
    payload["find_hint"] = checkpoint.find_hint
    payload["reference_url"] = (
        f"/api/media/checkpoint-reference/{checkpoint.id}?token={session.token}"
        if checkpoint.reference_image
        else None
    )
    # Which of the submitted checkpoints of this task still wait for a verdict —
    # the page can jump straight to the next one after a decision.
    siblings = db.execute(
        select(Checkpoint.id)
        .where(Checkpoint.task_id == checkpoint.task_id,
               Checkpoint.review_status == "submitted",
               Checkpoint.id != checkpoint.id)
        .order_by(Checkpoint.submitted_at.asc())
    ).scalars().all()
    payload["pending_siblings"] = list(siblings)
    return payload


class ReviewIn(BaseModel):
    decision: Literal['approve', 'return'] = Field(...)
    note: str = Field(default='', max_length=2000)


@router.post("/checkpoint-reviews/{checkpoint_id}/review")
def review_checkpoint(
    checkpoint_id: int,
    payload: ReviewIn,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """裁断一个点位：通过，或打回让志愿者只重拍这一个点位。"""
    _write_lock(db)
    checkpoint, task = _load(db, checkpoint_id)
    if not _can_operate(session, task):
        raise HTTPException(403, "只能审核自己发布的任务的点位（管理员 001 可以审核全部）")
    if checkpoint.review_status != "submitted":
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位当前不在待审核状态")

    note = payload.note.strip()
    if payload.decision == 'return' and not note:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "打回时请写一句要补拍什么")

    checkpoint.reviewed_by = session.admin_id
    checkpoint.reviewed_at = utcnow()
    checkpoint.review_note = note or None
    if payload.decision == 'approve':
        checkpoint.review_status = "approved"
        checkpoint.status = "done"
    else:
        checkpoint.review_status = "returned"
        checkpoint.status = "in_progress"
    db.commit()
    return _review_out(db, checkpoint, task, session)


@router.post("/checkpoint-reviews/{checkpoint_id}/solve")
def solve_checkpoint(
    checkpoint_id: int,
    session: AuthSession = Depends(require_admin),
    db: OrmSession = Depends(get_db),
) -> dict:
    """发起试解算：对一个点位跑一次 COLMAP，回答"能不能重建、能打几分"。

    耗时是分钟级（房间大小），所以排队串行执行，不阻塞请求；前端轮询
    `solve.status`。
    """
    _write_lock(db)
    checkpoint, task = _load(db, checkpoint_id)
    if not _can_operate(session, task):
        raise HTTPException(403, "只能对自己发布的任务的点位做试解算（管理员 001 可以全部）")
    if checkpoint.solve_status in (recon.SOLVE_QUEUED, recon.SOLVE_RUNNING):
        raise HTTPException(status.HTTP_409_CONFLICT, "这个点位正在试解算，请等它结束")

    usable = _count_photos(db, checkpoint.id, usable_only=True)
    if usable < config.RECON_MIN_PHOTOS:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"可用照片只有 {usable} 张，少于 {config.RECON_MIN_PHOTOS} 张，试解算没有意义",
        )

    checkpoint.solve_status = recon.SOLVE_QUEUED
    checkpoint.solve_report = None
    checkpoint.solve_error = None
    checkpoint.solve_started_at = None
    checkpoint.solve_finished_at = None
    db.commit()
    recon.queue.submit(checkpoint.id)
    return _review_out(db, checkpoint, task, session)
