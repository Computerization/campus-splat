"""Login sessions and authorization.

Three fixed administrator identities own separate tasks. Persistent volunteer
accounts may claim multiple tasks; media access follows the account ID.
"""

from __future__ import annotations

import secrets
from datetime import timedelta

from fastapi import Depends, Header, HTTPException, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from . import config
from .database import get_db
from .models import AuthSession, VolunteerAccount, Task, Checkpoint, Photo, TrainingRun, TrainingBlock, utcnow


def new_token() -> str:
    return secrets.token_urlsafe(32)


def create_session(
    db: OrmSession,
    *,
    role: str,
    nickname: str | None = None,
    task_id: int | None = None,
    admin_id: int | None = None,
    volunteer_id: int | None = None,
) -> AuthSession:
    session = AuthSession(
        token=new_token(),
        role=role,
        nickname=nickname,
        task_id=task_id,
        admin_id=admin_id,
        volunteer_id=volunteer_id,
        expires_at=utcnow() + timedelta(hours=config.SESSION_TTL_HOURS),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _extract_token(
    authorization: str | None = Header(default=None),
    token: str | None = Query(default=None),
) -> str | None:
    """The token may arrive in the Authorization header (normal requests) or as
    a query parameter, which is what <img> tags have to use.
    """
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    return token


def optional_session(
    token: str | None = Depends(_extract_token),
    db: OrmSession = Depends(get_db),
) -> AuthSession | None:
    if not token:
        return None
    session = db.get(AuthSession, token)
    if session is None:
        return None
    if session.role == "admin" and session.admin_id not in config.ADMIN_IDS:
        return None
    if session.role == "volunteer":
        account = db.get(VolunteerAccount, session.volunteer_id) if session.volunteer_id else None
        if account is None or not account.active:
            return None
        session.nickname = account.username
    if session.expires_at <= utcnow():
        db.delete(session)
        db.commit()
        return None
    # Throttle last_seen_at to one write per minute; the admin pages poll often.
    if (utcnow() - session.last_seen_at).total_seconds() > 60:
        session.last_seen_at = utcnow()
        db.commit()
    return session


def current_session(session: AuthSession | None = Depends(optional_session)) -> AuthSession:
    if session is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "未登录或登录已过期")
    return session


def require_admin(session: AuthSession = Depends(current_session)) -> AuthSession:
    if session.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "需要管理员权限")
    return session


def require_training_admin(session: AuthSession = Depends(require_admin)) -> AuthSession:
    if session.admin_id != 1:
        raise HTTPException(403, '只有管理员 001 有训练权限')
    return session


def require_volunteer(session: AuthSession = Depends(current_session)) -> AuthSession:
    if session.role != "volunteer" or session.volunteer_id is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "需要志愿者权限")
    return session


def require_owned_task(db: OrmSession, task_id: int, session: AuthSession) -> Task:
    task = db.get(Task, task_id)
    if task is None or task.status == "deleted":
        raise HTTPException(404, "任务不存在或已删除")
    if task.owner_admin_id != session.admin_id:
        raise HTTPException(403, "只能管理自己创建的任务")
    return task


def require_task_write(db: OrmSession, task_id: int, session: AuthSession) -> Task:
    """Who may *change* a task's data.

    Administrator 001 may operate on any checkpoint (he owns training and the
    final verdict); 002 and 003 only on the tasks they published. Reading is not
    restricted anywhere any more — every admin can see every checkpoint.
    """
    if session.admin_id == config.SUPER_ADMIN_ID:
        task = db.get(Task, task_id)
        if task is None or task.status == "deleted":
            raise HTTPException(404, "任务不存在或已删除")
        return task
    return require_owned_task(db, task_id, session)


async def admin_scope(request: Request,
                      session: AuthSession = Depends(require_admin),
                      db: OrmSession = Depends(get_db)) -> None:
    """Authorize identifiers in every existing admin route, including training/media helpers."""
    if request.url.path == '/api/admin/training' or request.url.path.startswith('/api/admin/training/'):
        require_training_admin(session)
    if request.method not in ('GET', 'HEAD', 'OPTIONS'):
        from sqlalchemy import text
        token = session.token
        db.commit()
        db.execute(text('BEGIN IMMEDIATE'))
        db.expire_all()
        if db.get(AuthSession, token) is None:
            raise HTTPException(401, '登录已失效')
    # Reading is shared: every administrator sees every task, checkpoint and
    # photo — that is what the checkpoint review page is for. Only *changes* are
    # restricted: 001 for everything, 002/003 for the tasks they published.
    read_only = request.method in ('GET', 'HEAD', 'OPTIONS')
    # Keep each source separate: a body/query ID must never mask a path ID.
    identifiers = list(request.path_params.items())
    identifiers += [(k, v) for k, v in request.query_params.items() if k.endswith('_id')]
    body = {}
    if request.headers.get('content-type', '').startswith('application/json'):
        try:
            body = await request.json()
        except ValueError:
            raise HTTPException(400, 'JSON 格式错误')
        if isinstance(body, dict):
            identifiers += [(k, v) for k, v in body.items() if k.endswith('_id') and v is not None]
    for key, value in identifiers:
        if key not in ('task_id', 'photo_id', 'checkpoint_id', 'run_id', 'block_id'):
            continue
        try:
            record_id = int(value)
        except (ValueError, TypeError, OverflowError):
            raise HTTPException(422, '记录 ID 必须是整数')
        if key == 'task_id':
            if not read_only:
                require_task_write(db, record_id, session)
        elif key in ('photo_id', 'checkpoint_id', 'run_id', 'block_id'):
            model = {'photo_id': Photo, 'checkpoint_id': Checkpoint, 'run_id': TrainingRun, 'block_id': TrainingBlock}[key]
            row = db.get(model, record_id)
            if row is None:
                raise HTTPException(404, "记录不存在")
            if key == 'block_id':
                row = db.get(TrainingRun, row.run_id)
            if row is None or row.task_id is None:
                if read_only:
                    continue
                raise HTTPException(403, "记录没有可管理的任务")
            if not read_only:
                require_task_write(db, row.task_id, session)
    run_ids = request.query_params.get('with_runs', '').split(',')
    run_ids += [str(p['run_id']) for p in body.get('placements', []) if p.get('run_id')] if isinstance(body, dict) else []
    for value in run_ids:
        if value.strip().isdigit():
            run = db.get(TrainingRun, int(value))
            if run and not read_only:
                require_task_write(db, run.task_id, session)
    if request.url.path in ('/api/admin/reset', '/api/admin/reveal'):
        if request.url.path.endswith('/reset') or not (body.get('task_id') or body.get('photo_id')):
            raise HTTPException(403, "固定管理员只能管理自己的任务，不能清空或打开全局数据")


def prune_expired_sessions(db: OrmSession) -> int:
    rows = db.execute(select(AuthSession).where(AuthSession.expires_at <= utcnow())).scalars().all()
    for row in rows:
        db.delete(row)
    if rows:
        db.commit()
    return len(rows)
