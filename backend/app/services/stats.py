"""Progress statistics.

Aggregates the photos table into per-checkpoint / per-task / global progress for
the admin console. Everything is done with single aggregate queries to avoid N+1.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..models import Checkpoint, Photo, Task, TrainingRun
from ..schemas import (
    CheckpointProgressOut,
    OverviewOut,
    TaskOut,
    TaskProgressOut,
    TrainingRunOut,
)

USABLE_STATUSES = ("ok", "warning")


def _empty_counts() -> dict:
    return {"ok": 0, "warning": 0, "rejected": 0, "total": 0, "usable": 0}


def checkpoint_progress_map(db: OrmSession, task_ids: list[int]) -> dict[tuple[int, int], dict]:
    """Return {(task_id, checkpoint_id): counts}."""
    if not task_ids:
        return {}

    counts: dict[tuple[int, int], dict] = defaultdict(_empty_counts)
    for task_id, cp_id, status, total in db.execute(
        select(Photo.task_id, Photo.checkpoint_id, Photo.status, func.count(Photo.id))
        .where(Photo.task_id.in_(task_ids))
        .group_by(Photo.task_id, Photo.checkpoint_id, Photo.status)
    ):
        if cp_id is None:
            continue
        bucket = counts[(task_id, cp_id)]
        bucket[status] = bucket.get(status, 0) + total
        bucket["total"] += total
    for bucket in counts.values():
        bucket["usable"] = bucket["ok"] + bucket["warning"]

    last_seen: dict[tuple[int, int], datetime] = {}
    for task_id, cp_id, latest in db.execute(
        select(Photo.task_id, Photo.checkpoint_id, func.max(Photo.uploaded_at))
        .where(Photo.task_id.in_(task_ids))
        .group_by(Photo.task_id, Photo.checkpoint_id)
    ):
        if cp_id is not None and latest is not None:
            last_seen[(task_id, cp_id)] = latest

    contributors: dict[tuple[int, int], set[str]] = defaultdict(set)
    for task_id, cp_id, nickname in db.execute(
        select(Photo.task_id, Photo.checkpoint_id, Photo.nickname)
        .where(Photo.task_id.in_(task_ids))
        .distinct()
    ):
        if cp_id is not None and nickname:
            contributors[(task_id, cp_id)].add(nickname)

    for key, bucket in counts.items():
        bucket["last_upload_at"] = last_seen.get(key)
        bucket["contributors"] = sorted(contributors.get(key, set()))

    # Fill in entries that only appeared as contributors (e.g. all rejected)
    for key, names in contributors.items():
        counts[key].setdefault("last_upload_at", last_seen.get(key))
        counts[key].setdefault("contributors", sorted(names))
    return counts


def to_progress(checkpoint: Checkpoint, counts: dict | None) -> CheckpointProgressOut:
    data = CheckpointProgressOut.model_validate(checkpoint)
    bucket = counts or _empty_counts()
    data.uploaded_ok = bucket.get("ok", 0)
    data.uploaded_warning = bucket.get("warning", 0)
    data.uploaded_rejected = bucket.get("rejected", 0)
    data.uploaded_total = bucket.get("total", 0)
    data.uploaded_usable = bucket.get("ok", 0) + bucket.get("warning", 0)
    data.remaining = max(0, checkpoint.shot_count - data.uploaded_usable)
    data.contributors = list(bucket.get("contributors", []))
    data.last_upload_at = bucket.get("last_upload_at")

    # A checkpoint marked "blocked" by hand keeps that status
    if checkpoint.status != "blocked":
        if data.uploaded_usable >= checkpoint.shot_count:
            derived = "done"
        elif data.uploaded_total > 0:
            derived = "in_progress"
        else:
            derived = "pending"
        data.status = derived
    return data


def build_task_progress(
    db: OrmSession,
    task: Task,
    *,
    checkpoint_map: dict[tuple[int, int], dict] | None = None,
) -> TaskProgressOut:
    if checkpoint_map is None:
        checkpoint_map = checkpoint_progress_map(db, [task.id])

    checkpoints = db.execute(
        select(Checkpoint).where(Checkpoint.task_id == task.id).order_by(Checkpoint.order_index)
    ).scalars().all()

    progress_items = [to_progress(cp, checkpoint_map.get((task.id, cp.id))) for cp in checkpoints]

    agg = _empty_counts()
    contributors: set[str] = set()
    last_upload: datetime | None = None
    target_total = 0
    usable_total = 0
    for item in progress_items:
        agg["ok"] += item.uploaded_ok
        agg["warning"] += item.uploaded_warning
        agg["rejected"] += item.uploaded_rejected
        agg["total"] += item.uploaded_total
        target_total += max(1, item.shot_count)
        usable_total += min(item.uploaded_usable, item.shot_count)
        contributors.update(item.contributors)
        if item.last_upload_at and (last_upload is None or item.last_upload_at > last_upload):
            last_upload = item.last_upload_at

    percent = round(usable_total / target_total * 100, 1) if target_total else 0.0

    return TaskProgressOut(
        task=TaskOut.model_validate(task),
        checkpoint_total=len(checkpoints),
        checkpoint_done=sum(1 for i in progress_items if i.status == "done"),
        checkpoint_in_progress=sum(1 for i in progress_items if i.status == "in_progress"),
        photo_total=agg["total"],
        photo_ok=agg["ok"],
        photo_warning=agg["warning"],
        photo_rejected=agg["rejected"],
        contributors=sorted(contributors),
        progress_percent=percent,
        last_upload_at=last_upload,
    )


def build_overview(db: OrmSession, *, include_archived: bool = False) -> OverviewOut:
    query = select(Task).order_by(Task.created_at.desc())
    if not include_archived:
        query = query.where(Task.status != "archived")
    tasks = db.execute(query).scalars().all()

    checkpoint_map = checkpoint_progress_map(db, [t.id for t in tasks])
    task_progress = [build_task_progress(db, t, checkpoint_map=checkpoint_map) for t in tasks]

    training = db.execute(
        select(TrainingRun).order_by(TrainingRun.created_at.desc()).limit(20)
    ).scalars().all()

    totals = {
        "tasks": len(tasks),
        "photos": sum(t.photo_total for t in task_progress),
        "photos_usable": sum(t.photo_ok + t.photo_warning for t in task_progress),
        "photos_rejected": sum(t.photo_rejected for t in task_progress),
        "checkpoints": sum(t.checkpoint_total for t in task_progress),
        "checkpoints_done": sum(t.checkpoint_done for t in task_progress),
        "contributors": len({n for t in task_progress for n in t.contributors}),
    }

    return OverviewOut(
        tasks=task_progress,
        totals=totals,
        storage=storage.disk_usage(),
        training=[to_training_out(run) for run in training],
    )


def to_training_out(run: TrainingRun) -> TrainingRunOut:
    data = TrainingRunOut.model_validate(run)
    if run.started_at and run.finished_at:
        data.duration_seconds = (run.finished_at - run.started_at).total_seconds()
    elif run.started_at:
        from ..models import utcnow

        data.duration_seconds = (utcnow() - run.started_at).total_seconds()
    return data


def training_queue_depth(db: OrmSession) -> int:
    return (
        db.execute(
            select(func.count(TrainingRun.id)).where(TrainingRun.status.in_(("queued", "running")))
        ).scalar_one()
        or 0
    )


def training_concurrency_limit() -> int:
    return max(1, config.TRAINING_MAX_CONCURRENT)
