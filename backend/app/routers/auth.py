"""Authentication endpoints."""

from __future__ import annotations

import hmac
import threading
import time

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import get_db
from ..models import AuthSession, Task
from ..schemas import AdminLoginIn, SessionOut, VolunteerJoinIn
from ..security import create_session, current_session

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ---------------------------------------------------------------- rate limiting
#
# The default admin password is public in this repo, so brute force has to be
# blocked. An in-memory counter is enough for a single-process deployment and
# resets when the server restarts — not worth Redis.
_failures: dict[str, list[float]] = {}
_failures_lock = threading.Lock()


def _client_key(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _prune_locked(now: float) -> None:
    window = config.LOGIN_LOCKOUT_SECONDS
    for key in list(_failures):
        kept = [ts for ts in _failures[key] if now - ts < window]
        if kept:
            _failures[key] = kept
        else:
            del _failures[key]


def _reject_if_locked(key: str) -> None:
    now = time.time()
    with _failures_lock:
        _prune_locked(now)
        recent = _failures.get(key, [])
        if len(recent) >= config.LOGIN_MAX_FAILURES:
            retry_after = int(config.LOGIN_LOCKOUT_SECONDS - (now - recent[-1])) + 1
            retry_after = max(retry_after, 1)
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                f"密码错误次数过多，请 {retry_after} 秒后再试",
                headers={"Retry-After": str(retry_after)},
            )


def _record_failure(key: str) -> None:
    with _failures_lock:
        _failures.setdefault(key, []).append(time.time())


def _clear_failures(key: str) -> None:
    with _failures_lock:
        _failures.pop(key, None)


def _to_out(session: AuthSession, task_name: str | None = None) -> SessionOut:
    return SessionOut(
        token=session.token,
        role=session.role,
        nickname=session.nickname,
        task_id=session.task_id,
        task_name=task_name,
    )


@router.post("/admin/login", response_model=SessionOut)
def admin_login(
    payload: AdminLoginIn,
    request: Request,
    db: OrmSession = Depends(get_db),
) -> SessionOut:
    key = _client_key(request)
    _reject_if_locked(key)
    if not hmac.compare_digest(payload.password, config.ADMIN_PASSWORD):
        _record_failure(key)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "管理密码不正确")
    _clear_failures(key)
    session = create_session(db, role="admin", nickname="管理员")
    return _to_out(session)


@router.post("/volunteer/join", response_model=SessionOut)
def volunteer_join(payload: VolunteerJoinIn, db: OrmSession = Depends(get_db)) -> SessionOut:
    task = db.execute(
        select(Task).where(Task.access_code == payload.access_code, Task.status == "active")
    ).scalar_one_or_none()
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "访问码无效，请找负责同学确认")

    session = create_session(db, role="volunteer", nickname=payload.nickname, task_id=task.id)
    return _to_out(session, task.name)


@router.get("/me", response_model=SessionOut)
def me(
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> SessionOut:
    task_name = None
    if session.task_id:
        task = db.get(Task, session.task_id)
        task_name = task.name if task else None
    return _to_out(session, task_name)


@router.post("/logout")
def logout(
    session: AuthSession = Depends(current_session),
    db: OrmSession = Depends(get_db),
) -> dict:
    db.delete(session)
    db.commit()
    return {"ok": True}
