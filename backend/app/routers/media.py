"""Media file access. Images go through <img> tags, so the token has to be
passed as a query parameter.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session as OrmSession

from .. import storage
from ..database import get_db
from ..models import AuthSession, Checkpoint, Photo, Task
from ..security import current_session, require_owned_task

router = APIRouter(prefix="/api/media", tags=["media"])


def _load_photo(db: OrmSession, photo_id: int, session: AuthSession) -> Photo:
    photo = db.get(Photo, photo_id)
    if photo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "照片不存在")
    if session.role == 'admin':
        require_owned_task(db, photo.task_id, session)
    elif session.volunteer_id != photo.volunteer_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "无权访问这条任务的照片")
    return photo


def _respond(rel_path: str | None, *, filename: str | None = None) -> FileResponse:
    if not rel_path:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "该照片没有对应文件")
    path = storage.resolve(rel_path)
    if not path.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "文件已丢失")
    return FileResponse(path, filename=filename)


@router.get("/thumb/{photo_id}")
def get_thumb(
    photo_id: int,
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> FileResponse:
    photo = _load_photo(db, photo_id, session)
    # Fall back to the original when there is no thumbnail, so the UI doesn't
    # end up full of broken images.
    return _respond(photo.thumb_path or photo.stored_path)


@router.get("/preview/{photo_id}")
def get_preview(
    photo_id: int,
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> FileResponse:
    photo = _load_photo(db, photo_id, session)
    if photo.preview_path:
        return _respond(photo.preview_path)
    if storage.is_browser_viewable(photo.stored_path):
        return _respond(photo.stored_path)
    return _respond(photo.thumb_path or photo.stored_path)


@router.get("/file/{photo_id}")
def get_file(
    photo_id: int,
    download: bool = Query(default=False),
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> FileResponse:
    photo = _load_photo(db, photo_id, session)
    return _respond(photo.stored_path, filename=photo.original_filename if download else None)


@router.get("/checkpoint-reference/{checkpoint_id}")
def get_checkpoint_reference(
    checkpoint_id: int,
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> FileResponse:
    checkpoint = db.get(Checkpoint, checkpoint_id)
    if checkpoint is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "点位不存在")
    if session.role == 'admin':
        require_owned_task(db, checkpoint.task_id, session)
    elif db.get(Task, checkpoint.task_id).status == 'deleted':
        raise HTTPException(404, '任务已删除')
    return _respond(checkpoint.reference_image)
