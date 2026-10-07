"""Upload ingest.

The upload request is the part that must never make a volunteer wait, so it does
only what cannot be deferred:

    stream the file to disk (computing sha256 as we go)
      -> reject byte-identical files (sha256 is unique per task)
      -> store the photo row with status "checking"
      -> hand the photo to the background quality worker
      -> reply immediately, so the next batch of 20 can start right away

The heuristic check itself (decode, metrics, thumbnail, near-duplicate scan)
lives in services/quality_jobs.py and writes the verdict back onto the row; the
phone polls ``GET /api/volunteer/photos?ids=...`` for it. With
``THREEDGS_QUALITY_INLINE=1`` the check runs here instead, so the reply already
carries the verdict (tests and tiny deployments).
"""

from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image
from sqlalchemy import func, select
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..models import AuthSession, Checkpoint, Photo, Task
from ..quality.pipeline import LEVEL_WARN, Issue
from ..schemas import UploadResultOut
from . import naming
from .quality_jobs import CHECKING_STATUS, queue, result_from_photo, run_check

UNASSIGNED_FOLDER = "Unassigned"


def photo_folder(task: Task, checkpoint: Checkpoint | None) -> str:
    """Where this checkpoint's photos live: ``<task>/<checkpoint>``.

    Both halves are ASCII names fixed when the row was created (naming.py); the
    id-based fallbacks only matter for rows created before the folders existed.
    """
    task_folder = task.folder or f"Task{task.id}"
    checkpoint_folder = (
        (checkpoint.folder or f"Cp{checkpoint.id}") if checkpoint else UNASSIGNED_FOLDER
    )
    return f"{task_folder}/{checkpoint_folder}"


def _next_index(db: OrmSession, task: Task, checkpoint: Checkpoint | None) -> int:
    """1-based position of the next photo inside its checkpoint (file numbering)."""
    query = select(func.count(Photo.id)).where(Photo.task_id == task.id)
    query = (
        query.where(Photo.checkpoint_id == checkpoint.id)
        if checkpoint is not None
        else query.where(Photo.checkpoint_id.is_(None))
    )
    return int(db.execute(query).scalar_one() or 0) + 1


def dispatch_quality(db: OrmSession, photo: Photo) -> None:
    """Hand one stored photo to the checker (inline, or the background queue).

    Separate from ``ingest_upload`` because a caller that commits a whole batch
    itself (the volunteer submission flow) has to dispatch *after* its own commit:
    the worker reads the row in a different session and cannot see a photo that is
    still inside an open transaction.
    """
    if config.quality_inline():
        run_check(db, photo)
    else:
        queue.submit(photo.id)


def ingest_upload(
    db: OrmSession,
    *,
    task: Task,
    checkpoint: Checkpoint | None,
    session: AuthSession | None,
    upload: UploadFile,
    assignment_id: int | None = None,
    commit: bool = True,
) -> UploadResultOut:
    filename = (upload.filename or "unnamed").strip() or "unnamed"

    # 1. write to disk under a name a human can read:
    #    uploads/<task>/<checkpoint>/0001_ZhangSan.jpg
    ext = Path(filename).suffix.lower()
    index = _next_index(db, task, checkpoint)
    stored_name = naming.photo_name(index, session.nickname if session else None, ext)
    try:
        saved = storage.save_stream(
            upload.file,
            folder=photo_folder(task, checkpoint),
            filename=stored_name,
            max_bytes=config.MAX_UPLOAD_MB * 1024 * 1024,
        )
    except HTTPException as exc:
        return UploadResultOut(ok=False, original_filename=filename, error=str(exc.detail))
    except Exception as exc:  # disk full, permissions, ...
        return UploadResultOut(ok=False, original_filename=filename, error=f"保存文件失败：{exc}")

    # 2. identical content is rejected outright — the one check that has to be
    #    synchronous, because it decides whether the file is kept at all
    existing = db.execute(
        select(Photo).where(Photo.task_id == task.id, Photo.sha256 == saved.sha256)
    ).scalar_one_or_none()
    if existing is not None:
        storage.delete_file(saved.rel_path)
        return UploadResultOut(
            ok=False,
            original_filename=filename,
            status="rejected",
            score=0,
            passed=False,
            issues=[
                Issue("duplicate", LEVEL_WARN, "这张照片已经上传过了（内容完全相同）").to_dict()
            ],
            advice="换个角度再拍一张；如果确实需要同一视角的补拍，请稍微移动站位。",
            error="这张照片之前已经上传过了（内容完全相同），没有重复入库",
        )

    # 3. the file has to be a readable image. This is cheap (header check, no
    #    pixel decode) and it is what lets a volunteer's batch submission roll
    #    back as a whole; the heuristic quality verdict itself is asynchronous
    #    (services/quality_jobs.py).
    try:
        with Image.open(saved.abs_path) as probe:
            probe.verify()
    except Exception as exc:
        storage.delete_file(saved.rel_path)
        return UploadResultOut(
            ok=False, original_filename=filename, error=f"照片无法解析（格式异常或已损坏）：{exc}"
        )

    # 4. the photo exists from here on; everything else about it is derived
    photo = Photo(
        task_id=task.id,
        checkpoint_id=checkpoint.id if checkpoint else None,
        session_id=session.token if session else None,
        volunteer_id=session.volunteer_id if session else None,
        assignment_id=assignment_id,
        nickname=session.nickname if session else None,
        original_filename=filename[:255],
        stored_path=saved.rel_path,
        sha256=saved.sha256,
        size_bytes=saved.size_bytes,
        status=CHECKING_STATUS,
    )
    db.add(photo)
    db.flush()  # the caller may need photo.id before the transaction commits
    if commit:
        db.commit()
        db.refresh(photo)
        dispatch_quality(db, photo)

    return result_from_photo(photo)
