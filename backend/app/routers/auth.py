"""Authentication endpoints."""

from __future__ import annotations

import hmac
import threading
import time

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import get_db
from ..models import AuthSession, Task, VolunteerAccount, TaskAssignment, utcnow
from ..schemas import AdminLoginIn, SessionOut, VolunteerJoinIn
from ..security import create_session, current_session, require_volunteer

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
        admin_id=session.admin_id,
        volunteer_id=f"{session.volunteer_id - 1:05d}" if session.volunteer_id else None,
    )


@router.post("/admin/login", response_model=SessionOut)
def admin_login(
    payload: AdminLoginIn,
    request: Request,
    db: OrmSession = Depends(get_db),
) -> SessionOut:
    key = _client_key(request)
    _reject_if_locked(key)
    admin_id = next((i for i, password in config.ADMIN_PASSWORDS.items() if hmac.compare_digest(payload.password.encode(), password.encode())), None)
    if admin_id is None:
        _record_failure(key)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "管理密码不正确")
    _clear_failures(key)
    session = create_session(db, role="admin", nickname=f"管理员 {admin_id:03d}", admin_id=admin_id)
    return _to_out(session)


@router.post("/volunteer/join", response_model=SessionOut)
def volunteer_join(payload: VolunteerJoinIn, db: OrmSession = Depends(get_db)) -> SessionOut:
    raise HTTPException(410, "请注册独立志愿者账号，再使用用户名和密码登录")


class VolunteerCredentials(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=128)

    @field_validator('username')
    @classmethod
    def normalize_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('请输入真实姓名')
        return value


class PasswordChange(BaseModel):
    current_password: str
    password: str = Field(min_length=1, max_length=128)


@router.post('/volunteer/register', response_model=SessionOut, status_code=201)
def register_volunteer(payload: VolunteerCredentials, db: OrmSession = Depends(get_db)):
    account = VolunteerAccount(username=payload.username, active_username=payload.username, password=payload.password)
    db.add(account)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, '用户名已存在，请使用未被占用的真实姓名')
    return _to_out(create_session(db, role='volunteer', nickname=account.username, volunteer_id=account.id))


@router.post('/volunteer/login', response_model=SessionOut)
def login_volunteer(payload: VolunteerCredentials, request: Request, db: OrmSession = Depends(get_db)):
    key = _client_key(request)
    _reject_if_locked(key)
    account = db.execute(select(VolunteerAccount).where(VolunteerAccount.active_username == payload.username)).scalar_one_or_none()
    if account is None or not hmac.compare_digest(account.password.encode(), payload.password.encode()):
        _record_failure(key)
        raise HTTPException(401, '用户名或密码不正确')
    _clear_failures(key)
    return _to_out(create_session(db, role='volunteer', nickname=account.username, volunteer_id=account.id))


@router.patch('/volunteer/password')
def change_password(payload: PasswordChange, session: AuthSession = Depends(require_volunteer), db: OrmSession = Depends(get_db)):
    account = db.get(VolunteerAccount, session.volunteer_id)
    if not hmac.compare_digest(account.password.encode(), payload.current_password.encode()):
        raise HTTPException(400, '当前密码不正确')
    account.password = payload.password
    db.execute(delete(AuthSession).where(AuthSession.volunteer_id == account.id, AuthSession.token != session.token))
    db.commit()
    return {'ok': True}


def archive_account(db: OrmSession, account: VolunteerAccount):
    account.active = False
    account.active_username = None
    account.archived_at = utcnow()
    db.execute(delete(AuthSession).where(AuthSession.volunteer_id == account.id))
    # Pending submissions remain reviewable; unfinished assignments release their slots.
    for assignment in db.scalars(select(TaskAssignment).where(TaskAssignment.volunteer_id == account.id, TaskAssignment.status == 'in_progress')):
        assignment.status = 'account_archived'
    db.commit()


@router.delete('/volunteer/account')
def archive_own_account(session: AuthSession = Depends(require_volunteer), db: OrmSession = Depends(get_db)):
    archive_account(db, db.get(VolunteerAccount, session.volunteer_id))
    return {'ok': True}


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
