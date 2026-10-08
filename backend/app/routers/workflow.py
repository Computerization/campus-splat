"""Persistent accounts, task claims and atomic, whole-task submissions.

**Superseded by the per-checkpoint flow.** A volunteer now takes one checkpoint at
a time, uploads it, hands it in and moves on (routers/volunteer.py), and an admin
judges that single checkpoint (routers/reviews.py) — with a trial reconstruction
to go with it (services/recon.py). Nothing in the UI calls these task-level
endpoints any more: they are kept because existing rows and the tests written
before the checkpoint flow still refer to them.

If that ever stops being true, this module, `/api/admin/submissions`, the
`TaskAssignment` model and those task-level tests can all go together.
"""
from __future__ import annotations

import json
from collections import Counter

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy import select, func, text, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AuthSession, VolunteerAccount, Task, TaskAssignment, Photo, Checkpoint, utcnow
from ..schemas import TaskOut, CheckpointOut
from ..security import require_admin, require_volunteer, require_owned_task
from ..services.ingest import dispatch_quality, ingest_upload
from .. import storage
from .auth import archive_account
from .volunteer import _photo_out

router = APIRouter(prefix='/api', tags=['accounts and task workflow'])
ACTIVE = ('in_progress', 'submitted')


def write_lock(db: Session):
    # Serialize claims/submissions/reviews across threads and processes, not just UI buttons.
    db.commit()
    db.execute(text('BEGIN IMMEDIATE'))
    db.expire_all()


def volunteer_write_lock(db: Session, session: AuthSession):
    volunteer_id = session.volunteer_id
    token = session.token
    write_lock(db)
    account = db.get(VolunteerAccount, volunteer_id)
    if account is None or not account.active or db.get(AuthSession, token) is None:
        raise HTTPException(401, '账号已注销或登录已失效')


def account_out(account: VolunteerAccount, *, password=False):
    result = {'id': f'{account.id - 1:05d}', 'username': account.username,
              'active': account.active, 'created_at': account.created_at,
              'archived_at': account.archived_at}
    if password:
        result['password'] = account.password
    return result


def assignment_out(db: Session, assignment: TaskAssignment | None):
    if assignment is None:
        return None
    account = db.get(VolunteerAccount, assignment.volunteer_id)
    return {'id': assignment.id, 'status': assignment.status, 'attempt': assignment.attempt,
            'username': account.username, 'volunteer_id': f'{account.id - 1:05d}',
            'account_active': account.active, 'task_id': assignment.task_id,
            'review_note': assignment.review_note, 'submitted_at': assignment.submitted_at,
            'accepted_at': assignment.accepted_at, 'manifest': assignment.submitted_manifest}


def participants(db: Session, task_id: int):
    return list(db.scalars(select(VolunteerAccount.username).join(
        TaskAssignment, TaskAssignment.volunteer_id == VolunteerAccount.id
    ).where(TaskAssignment.task_id == task_id, TaskAssignment.status.in_(ACTIVE))))


def own_assignment(db: Session, task_id: int, session: AuthSession):
    return db.scalar(select(TaskAssignment).where(TaskAssignment.task_id == task_id,
                                                 TaskAssignment.volunteer_id == session.volunteer_id))


def visible_task(db: Session, task_id: int):
    task = db.get(Task, task_id)
    if task is None or task.status == 'deleted':
        raise HTTPException(404, '任务不存在或已删除')
    return task


@router.get('/admin/volunteers')
def accounts(session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    return [account_out(a, password=True) for a in db.scalars(select(VolunteerAccount).where(
        VolunteerAccount.active.is_(True)).order_by(VolunteerAccount.id))]


class AccountPatch(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=64)
    password: str | None = Field(default=None, min_length=1, max_length=128)


def account_by_public_id(db: Session, public_id: str):
    if not public_id.isdigit():
        raise HTTPException(404, '账号不存在')
    account = db.get(VolunteerAccount, int(public_id) + 1)
    if account is None or not account.active:
        raise HTTPException(404, '账号不存在或已注销')
    return account


@router.patch('/admin/volunteers/{public_id}')
def edit_account(public_id: str, payload: AccountPatch,
                 session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    write_lock(db)
    account = account_by_public_id(db, public_id)
    if payload.username is not None:
        name = payload.username.strip()
        if not name:
            raise HTTPException(400, '用户名不能为空')
        account.username = account.active_username = name
    if payload.password is not None:
        account.password = payload.password
        db.execute(delete(AuthSession).where(AuthSession.volunteer_id == account.id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, '用户名已存在')
    return account_out(account, password=True)


@router.delete('/admin/volunteers/{public_id}')
def delete_account(public_id: str, session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    write_lock(db)
    archive_account(db, account_by_public_id(db, public_id))
    return {'ok': True}


@router.get('/volunteer/tasks')
def task_board(session: AuthSession = Depends(require_volunteer), db: Session = Depends(get_db)):
    tasks = db.scalars(select(Task).where(Task.status != 'deleted').order_by(Task.created_at.desc(), Task.id.desc())).all()
    result = []
    for task in tasks:
        assignment = own_assignment(db, task.id, session)
        if task.status != 'active' and assignment is None:
            continue
        result.append({'task': TaskOut.model_validate(task), 'assignment': assignment_out(db, assignment),
                       'active_volunteers': participants(db, task.id),
                       'checkpoint_count': db.scalar(select(func.count(Checkpoint.id)).where(Checkpoint.task_id == task.id))})
    return {'items': result, 'slots_used': db.scalar(select(func.count(TaskAssignment.id)).where(
        TaskAssignment.volunteer_id == session.volunteer_id, TaskAssignment.status.in_(ACTIVE))), 'slots_max': 10}


@router.get('/volunteer/tasks/{task_id}')
def task_detail(task_id: int, session: AuthSession = Depends(require_volunteer), db: Session = Depends(get_db)):
    task = visible_task(db, task_id)
    assignment = own_assignment(db, task_id, session)
    photos = db.scalars(select(Photo).where(Photo.assignment_id == assignment.id)).all() if assignment else []
    return {'task': TaskOut.model_validate(task), 'assignment': assignment_out(db, assignment),
            'active_volunteers': participants(db, task_id),
            'checkpoints': [CheckpointOut.model_validate(cp) for cp in db.scalars(select(Checkpoint).where(
                Checkpoint.task_id == task_id).order_by(Checkpoint.order_index, Checkpoint.id))],
            'photos': [_photo_out(p, session) for p in photos]}


@router.post('/volunteer/tasks/{task_id}/claim')
def claim(task_id: int, session: AuthSession = Depends(require_volunteer), db: Session = Depends(get_db)):
    volunteer_write_lock(db, session)
    task = visible_task(db, task_id)
    if task.status != 'active':
        raise HTTPException(409, '任务已归档，不能接取')
    assignment = own_assignment(db, task_id, session)
    if assignment and assignment.status in (*ACTIVE, 'accepted'):
        raise HTTPException(409, '已经接取或完成该任务')
    count = db.scalar(select(func.count(TaskAssignment.id)).where(
        TaskAssignment.volunteer_id == session.volunteer_id, TaskAssignment.status.in_(ACTIVE)))
    if count >= 10:
        raise HTTPException(409, '同时最多接取 10 个任务，待审核任务也占用任务槽')
    if assignment is None:
        assignment = TaskAssignment(task_id=task_id, volunteer_id=session.volunteer_id)
        db.add(assignment)
    else:
        assignment.status = 'in_progress'
        assignment.attempt += 1
        assignment.review_note = None
        assignment.submitted_manifest = None
        assignment.submitted_at = None
    assignment.updated_at = utcnow()
    db.commit()
    return assignment_out(db, assignment)


def file_paths(photos):
    return [path for p in photos for path in (p.stored_path, p.thumb_path, p.preview_path) if path]


@router.post('/volunteer/tasks/{task_id}/abandon')
def abandon(task_id: int, session: AuthSession = Depends(require_volunteer), db: Session = Depends(get_db)):
    volunteer_write_lock(db, session)
    assignment = own_assignment(db, task_id, session)
    if assignment is None or assignment.status != 'in_progress':
        raise HTTPException(409, '只能放弃进行中的任务，待审核和已完成任务不能放弃')
    photos = db.scalars(select(Photo).where(Photo.assignment_id == assignment.id)).all()
    paths = file_paths(photos)
    for photo in photos:
        db.delete(photo)
    assignment.status = 'abandoned'
    assignment.submitted_manifest = None
    assignment.review_note = None
    assignment.updated_at = utcnow()
    db.commit()
    for path in paths:
        storage.delete_file(path)
    return {'ok': True}


@router.post('/volunteer/tasks/{task_id}/submit')
def submit(task_id: int, manifest: str = Form(...), files: list[UploadFile] = File(default=[]),
           session: AuthSession = Depends(require_volunteer), db: Session = Depends(get_db)):
    volunteer_write_lock(db, session)
    task = visible_task(db, task_id)
    assignment = own_assignment(db, task_id, session)
    if assignment is None or assignment.status != 'in_progress':
        raise HTTPException(409, '任务未接取或内容已锁定')
    try:
        entries = json.loads(manifest)
        if not isinstance(entries, list) or len(entries) != len(files):
            raise ValueError()
        ids = [int(e['checkpoint_id']) for e in entries]
        retained_ids = {int(e['photo_id']) for e in entries if e.get('photo_id') is not None}
        if len(retained_ids) != sum(e.get('photo_id') is not None for e in entries):
            raise ValueError()
    except (ValueError, TypeError, KeyError):
        raise HTTPException(400, '照片与拍摄点清单不匹配')
    checkpoints = {cp.id: cp for cp in db.scalars(select(Checkpoint).where(Checkpoint.task_id == task_id))}
    old_photos = db.scalars(select(Photo).where(Photo.assignment_id == assignment.id)).all()
    # A rejected submission may retain existing photos or replace individual photos.
    old_by_id = {p.id: p for p in old_photos}
    if not retained_ids.issubset(old_by_id):
        raise HTTPException(400, '不能引用其他提交的照片')
    counts = Counter(ids)
    if not checkpoints or set(ids) - checkpoints.keys() or any(counts[cp.id] < cp.shot_count for cp in checkpoints.values()):
        raise HTTPException(400, '必须完成全部拍摄点的照片数量才能统一提交')
    old_paths = file_paths([p for p in old_photos if p.id not in retained_ids])
    new_paths = []
    new_photos = []
    results = []
    try:
        for photo in old_photos:
            if photo.id not in retained_ids:
                db.delete(photo)
        db.flush()
        for entry, upload, cp_id in zip(entries, files, ids):
            if entry.get('photo_id') is not None:
                photo = old_by_id[int(entry['photo_id'])]
                if photo.checkpoint_id != cp_id:
                    raise HTTPException(400, '已提交照片不能更换拍摄点')
                continue
            result = ingest_upload(db, task=task, checkpoint=checkpoints[cp_id], session=session,
                                   upload=upload, assignment_id=assignment.id, commit=False)
            if result.photo_id is None:
                raise HTTPException(400, f'{result.original_filename}：{result.error}')
            photo = db.get(Photo, result.photo_id)
            new_paths.extend(file_paths([photo]))
            new_photos.append(photo)
            results.append(result)
        assignment.status = 'submitted'
        assignment.submitted_at = assignment.updated_at = utcnow()
        assignment.review_note = None
        assignment.submitted_manifest = [{'checkpoint_id': cp.id, 'name': cp.name, 'required': cp.shot_count,
                                           'submitted': counts[cp.id]} for cp in checkpoints.values()]
        db.commit()
    except Exception:
        db.rollback()
        for path in new_paths:
            storage.delete_file(path)
        raise
    # The quality worker reads its photos in its own session, so the checks can
    # only be queued once this batch is committed.
    for photo in new_photos:
        dispatch_quality(db, photo)
    for path in old_paths:
        storage.delete_file(path)
    return {'assignment': assignment_out(db, assignment), 'results': results}


@router.get('/admin/submissions')
def submissions(session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.scalars(select(TaskAssignment).join(Task).where(Task.owner_admin_id == session.admin_id,
        Task.status != 'deleted', TaskAssignment.status.in_(('submitted', 'accepted', 'in_progress')),
        TaskAssignment.submitted_at.is_not(None)).order_by(TaskAssignment.submitted_at.desc())).all()
    return [{**assignment_out(db, row), 'task_name': db.get(Task, row.task_id).name} for row in rows]


@router.get('/admin/submissions/{assignment_id}')
def submission_detail(assignment_id: int, session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    row = db.get(TaskAssignment, assignment_id)
    if row is None or row.submitted_at is None:
        raise HTTPException(404, '提交不存在')
    require_owned_task(db, row.task_id, session)
    return {'assignment': assignment_out(db, row), 'photos': [_photo_out(p, session) for p in db.scalars(
        select(Photo).where(Photo.assignment_id == row.id).order_by(Photo.checkpoint_id, Photo.id))]}


class Review(BaseModel):
    decision: str = Field(pattern='^(accept|return)$')
    note: str = Field(default='', max_length=2000)


@router.post('/admin/submissions/{assignment_id}/review')
def review(assignment_id: int, payload: Review, session: AuthSession = Depends(require_admin), db: Session = Depends(get_db)):
    write_lock(db)
    row = db.get(TaskAssignment, assignment_id)
    if row is None:
        raise HTTPException(404, '提交不存在')
    require_owned_task(db, row.task_id, session)
    if row.status != 'submitted':
        raise HTTPException(409, '该提交已处理，不能重复裁断')
    row.status = 'accepted' if payload.decision == 'accept' else 'in_progress'
    if not db.get(VolunteerAccount, row.volunteer_id).active and payload.decision == 'return':
        row.status = 'account_archived'
    row.review_note = payload.note
    row.updated_at = utcnow()
    if payload.decision == 'accept':
        row.accepted_at = utcnow()
    db.commit()
    return assignment_out(db, row)
