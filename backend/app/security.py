"""Login sessions and authorization.

Two roles:
  * admin     — the desktop console (club room computer): password login, full
                access to progress, checkpoint planning and training.
  * volunteer — the phone interface: joins with a task access code plus a
                nickname, and only ever sees their own task.
"""

from __future__ import annotations

import secrets
from datetime import timedelta

from fastapi import Depends, Header, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from . import config
from .database import get_db
from .models import AuthSession, utcnow


def new_token() -> str:
    return secrets.token_urlsafe(32)


def create_session(
    db: OrmSession,
    *,
    role: str,
    nickname: str | None = None,
    task_id: int | None = None,
) -> AuthSession:
    session = AuthSession(
        token=new_token(),
        role=role,
        nickname=nickname,
        task_id=task_id,
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


def require_volunteer(session: AuthSession = Depends(current_session)) -> AuthSession:
    if session.role not in ("volunteer", "admin"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "需要志愿者权限")
    return session


def prune_expired_sessions(db: OrmSession) -> int:
    rows = db.execute(select(AuthSession).where(AuthSession.expires_at <= utcnow())).scalars().all()
    for row in rows:
        db.delete(row)
    if rows:
        db.commit()
    return len(rows)
