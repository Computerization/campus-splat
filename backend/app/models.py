"""Data models.

    Task (a building / floor / area; volunteers join with an access code)
      └─ Checkpoint (one shooting spot, e.g. "Building B, 3F corridor east end")
           └─ Photo (uploaded by a volunteer)
                └─ QualityReport (heuristic quality check result)

    TrainingRun (one reconstruction job, see docs/training-pipeline.md)
      └─ TrainingBlock (one training chunk: a room / corridor, sharing the
                        poses of the run's single SfM reconstruction)
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utcnow() -> datetime:
    """Naive UTC everywhere — avoids SQLite timezone round-trip surprises.
    The frontend converts to local time.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)


class VolunteerAccount(Base):
    __tablename__ = "volunteer_accounts"
    __table_args__ = {"sqlite_autoincrement": True}
    # SQLite AUTOINCREMENT guarantees archived IDs are never reused. Public ID = id - 1.
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(64))
    active_username: Mapped[str | None] = mapped_column(String(64), unique=True)
    password: Mapped[str] = mapped_column(String(128))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    archived_at: Mapped[datetime | None] = mapped_column(DateTime)


class AdminAccount(Base):
    """The three fixed administrators.

    Their passwords used to be code constants (`config.ADMIN_PASSWORDS`). They now
    live here — hashed — so each admin can change their own from the console, and
    `config.ADMIN_PASSWORDS` only seeds the very first start.
    """

    __tablename__ = "admin_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)


class TaskAssignment(Base):
    """A volunteer's claim on a whole task (the model that predates per-checkpoint
    work).

    Superseded by `Checkpoint.claimed_by` / `review_status`: a volunteer now takes
    one checkpoint at a time, uploads it and moves on, instead of collecting every
    checkpoint of a task and handing the whole thing in at once. Kept so existing
    rows keep working.
    """

    __tablename__ = "task_assignments"
    __table_args__ = (UniqueConstraint("task_id", "volunteer_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), index=True)
    volunteer_id: Mapped[int] = mapped_column(ForeignKey("volunteer_accounts.id"), index=True)
    status: Mapped[str] = mapped_column(String(24), default="in_progress", index=True)
    attempt: Mapped[int] = mapped_column(Integer, default=1)
    review_note: Mapped[str | None] = mapped_column(Text)
    submitted_manifest: Mapped[list | None] = mapped_column(JSON)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class AuthSession(Base):
    """Login session. Admins and volunteers share this table, split by `role`."""

    __tablename__ = "auth_sessions"

    token: Mapped[str] = mapped_column(String(64), primary_key=True)
    role: Mapped[str] = mapped_column(String(16), index=True)  # admin | volunteer
    nickname: Mapped[str | None] = mapped_column(String(64))
    admin_id: Mapped[int | None] = mapped_column(Integer)
    volunteer_id: Mapped[int | None] = mapped_column(Integer, index=True)
    # Volunteer sessions are bound to one task
    task_id: Mapped[int | None] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, index=True)

    task: Mapped["Task | None"] = relationship(back_populates="sessions")


class Task(Base):
    """One capture task: a building, a floor, or a whole indoor area."""

    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_admin_id: Mapped[int] = mapped_column(Integer, default=1, index=True)
    name: Mapped[str] = mapped_column(String(128))
    kind: Mapped[str] = mapped_column(String(16), default="indoor", index=True)
    # indoor (volunteers' phones) | outdoor (drone)
    description: Mapped[str | None] = mapped_column(Text)
    location_hint: Mapped[str | None] = mapped_column(String(255))
    # ASCII name derived from `name` (services/naming.py) — the photos of this
    # task live under data/uploads/<folder>/<checkpoint folder>/… It is fixed
    # when the task is created, so renaming never moves files around.
    folder: Mapped[str | None] = mapped_column(String(80))
    access_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(16), default="active")  # active | archived
    cover_image: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    checkpoints: Mapped[list["Checkpoint"]] = relationship(
        back_populates="task", cascade="all, delete-orphan", order_by="Checkpoint.order_index"
    )
    photos: Mapped[list["Photo"]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )
    sessions: Mapped[list["AuthSession"]] = relationship(back_populates="task")


class Checkpoint(Base):
    """A shooting spot. Volunteers follow `instructions` / `angles` and upload
    `shot_count` usable photos.
    """

    __tablename__ = "checkpoints"
    __table_args__ = (Index("ix_checkpoints_task_order", "task_id", "order_index"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), index=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    name: Mapped[str] = mapped_column(String(128))
    # Same idea as Task.folder: data/uploads/<task folder>/<folder>/…
    folder: Mapped[str | None] = mapped_column(String(80))
    building: Mapped[str | None] = mapped_column(String(64))
    floor: Mapped[str | None] = mapped_column(String(32))
    room: Mapped[str | None] = mapped_column(String(64))

    # Outdoor (drone) checkpoints carry coordinates; indoor ones stay empty and
    # rely on the written find-hint instead.
    lat: Mapped[float | None] = mapped_column(Float)
    lng: Mapped[float | None] = mapped_column(Float)
    height_m: Mapped[float | None] = mapped_column(Float)
    indoor: Mapped[bool] = mapped_column(Boolean, default=True)

    # Room size in metres. The admin UI uses it to suggest a photo count; the
    # authoritative value is still `shot_count`.
    length_m: Mapped[float | None] = mapped_column(Float)
    width_m: Mapped[float | None] = mapped_column(Float)
    room_height_m: Mapped[float | None] = mapped_column(Float)

    instructions: Mapped[str | None] = mapped_column(Text)
    shot_count: Mapped[int] = mapped_column(Integer, default=4)
    # Shooting script: [{"label": "...", "pitch": 0, "yaw": 0, "tip": "..."}]
    angles: Mapped[list | None] = mapped_column(JSON)
    # Reference image uploaded by an admin, relative to the data directory
    reference_image: Mapped[str | None] = mapped_column(String(255))
    find_hint: Mapped[str | None] = mapped_column(Text)

    # How far the shooting is: pending | in_progress | done | blocked
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)
    admin_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    # ---- Per-checkpoint workflow -------------------------------------------
    # A volunteer takes one checkpoint at a time, shoots it, uploads it, and only
    # then picks up the next one. `claimed_by` is the volunteer holding it.
    claimed_by: Mapped[int | None] = mapped_column(Integer, index=True)
    claimed_at: Mapped[datetime | None] = mapped_column(DateTime)
    # Review of *this* checkpoint's photos, separate from `status` above (which
    # only says whether enough photos exist).
    # pending (not submitted yet) | submitted | approved | returned
    review_status: Mapped[str] = mapped_column(String(16), default="pending", index=True)
    review_note: Mapped[str | None] = mapped_column(Text)
    reviewed_by: Mapped[int | None] = mapped_column(Integer)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    # How many times the volunteer has handed this checkpoint in (0 = never)
    attempt: Mapped[int] = mapped_column(Integer, default=0)

    # ---- Trial reconstruction (试解算) --------------------------------------
    # none | queued | running | done | failed — see services/recon.py
    solve_status: Mapped[str] = mapped_column(String(16), default="none", index=True)
    solve_report: Mapped[dict | None] = mapped_column(JSON)
    solve_error: Mapped[str | None] = mapped_column(Text)
    solve_started_at: Mapped[datetime | None] = mapped_column(DateTime)
    solve_finished_at: Mapped[datetime | None] = mapped_column(DateTime)

    task: Mapped["Task"] = relationship(back_populates="checkpoints")
    photos: Mapped[list["Photo"]] = relationship(
        back_populates="checkpoint", cascade="all, delete-orphan"
    )


class Photo(Base):
    __tablename__ = "photos"
    __table_args__ = (
        UniqueConstraint("task_id", "sha256", name="uq_photos_task_sha256"),
        Index("ix_photos_task_cp", "task_id", "checkpoint_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), index=True)
    checkpoint_id: Mapped[int | None] = mapped_column(
        ForeignKey("checkpoints.id", ondelete="SET NULL"), index=True
    )
    session_id: Mapped[str | None] = mapped_column(String(64), index=True)
    volunteer_id: Mapped[int | None] = mapped_column(Integer, index=True)
    assignment_id: Mapped[int | None] = mapped_column(Integer, index=True)
    nickname: Mapped[str | None] = mapped_column(String(64))

    original_filename: Mapped[str] = mapped_column(String(255))
    stored_path: Mapped[str] = mapped_column(String(512))  # relative to the data dir
    thumb_path: Mapped[str | None] = mapped_column(String(512))
    preview_path: Mapped[str | None] = mapped_column(String(512))
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)

    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    captured_at: Mapped[datetime | None] = mapped_column(DateTime, index=True)
    gps_lat: Mapped[float | None] = mapped_column(Float)
    gps_lng: Mapped[float | None] = mapped_column(Float)
    gps_alt: Mapped[float | None] = mapped_column(Float)
    camera_model: Mapped[str | None] = mapped_column(String(128))
    orientation: Mapped[int | None] = mapped_column(Integer)

    # Perceptual hash (dHash, hex string) used for duplicate detection
    dhash: Mapped[str | None] = mapped_column(String(32), index=True)
    # Which photo this one duplicates, if any
    duplicate_of: Mapped[int | None] = mapped_column(Integer)
    # ok | warning | rejected
    status: Mapped[str] = mapped_column(String(16), default="ok", index=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)

    task: Mapped["Task"] = relationship(back_populates="photos")
    checkpoint: Mapped["Checkpoint | None"] = relationship(back_populates="photos")
    quality: Mapped["QualityReport | None"] = relationship(
        back_populates="photo", cascade="all, delete-orphan", uselist=False
    )


class QualityReport(Base):
    __tablename__ = "quality_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    photo_id: Mapped[int] = mapped_column(
        ForeignKey("photos.id", ondelete="CASCADE"), unique=True, index=True
    )
    passed: Mapped[bool] = mapped_column(Boolean, default=True)
    score: Mapped[int] = mapped_column(Integer, default=100)  # 0-100
    # [{"level": "error|warn|info", "code": "blurry", "message": "..."}]
    issues: Mapped[list | None] = mapped_column(JSON)
    metrics: Mapped[dict | None] = mapped_column(JSON)
    advice: Mapped[str | None] = mapped_column(Text)
    checked_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    photo: Mapped["Photo"] = relationship(back_populates="quality")


class TrainingRun(Base):
    """One reconstruction job (a whole pipeline, not a single tool invocation).

    The run walks the stages of docs/training-pipeline.md: prepare → sfm (one
    COLMAP per building) → split (one block per room/corridor) → train (one 3DGS
    per block) → merge → align → export. The backend only orchestrates; the
    heavy lifting happens in backend/scripts/run_training.py.
    """

    __tablename__ = "training_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int | None] = mapped_column(
        ForeignKey("tasks.id", ondelete="SET NULL"), index=True
    )
    name: Mapped[str] = mapped_column(String(128))
    # queued | running | succeeded | failed | cancelled
    status: Mapped[str] = mapped_column(String(16), default="queued", index=True)
    # Current stage, e.g. prepare / sfm_mapping / train / merge / export
    stage: Mapped[str | None] = mapped_column(String(64))
    progress: Mapped[float] = mapped_column(Float, default=0.0)  # 0-100
    message: Mapped[str | None] = mapped_column(Text)
    params: Mapped[dict | None] = mapped_column(JSON)
    photo_count: Mapped[int] = mapped_column(Integer, default=0)
    log_path: Mapped[str | None] = mapped_column(String(512))
    output_path: Mapped[str | None] = mapped_column(String(512))
    # indoor | outdoor | mixed — decides the matcher and whether RTK alignment runs
    scope_kind: Mapped[str] = mapped_column(String(16), default="indoor")
    # Number of training blocks (rooms) planned for this run
    block_total: Mapped[int] = mapped_column(Integer, default=0)
    block_done: Mapped[int] = mapped_column(Integer, default=0)
    # [{"kind": "ply"|"transform"|"manifest", "name": ..., "path": ...,
    #   "size_bytes": ..., "block_key": ...|None}]
    artifacts: Mapped[list | None] = mapped_column(JSON)
    # Reuse an earlier run's SfM result (used when retrying a single block)
    reuse_run_id: Mapped[int | None] = mapped_column(Integer)
    created_by: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)

    task: Mapped["Task | None"] = relationship()
    blocks: Mapped[list["TrainingBlock"]] = relationship(
        back_populates="run",
        cascade="all, delete-orphan",
        order_by="TrainingBlock.order_index",
    )


class TrainingBlock(Base):
    """One training chunk.

    Every block of a run shares the *same* COLMAP reconstruction, so the poses
    (and therefore the coordinate system) of all blocks are identical — merging
    them back together needs no registration at all.
    """

    __tablename__ = "training_blocks"
    __table_args__ = (Index("ix_training_blocks_run_order", "run_id", "order_index"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_id: Mapped[int] = mapped_column(
        ForeignKey("training_runs.id", ondelete="CASCADE"), index=True
    )
    # Source checkpoint (room / corridor / stairwell); NULL for photos that were
    # never assigned to a checkpoint
    checkpoint_id: Mapped[int | None] = mapped_column(
        ForeignKey("checkpoints.id", ondelete="SET NULL"), index=True
    )
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    # Stable key used between the backend and the training script
    key: Mapped[str] = mapped_column(String(32), index=True)
    name: Mapped[str] = mapped_column(String(160))
    # A checkpoint with more photos than the block limit is split into parts
    part_index: Mapped[int] = mapped_column(Integer, default=0)
    part_total: Mapped[int] = mapped_column(Integer, default=1)
    photo_count: Mapped[int] = mapped_column(Integer, default=0)
    # Photo ids of this block, in training order. Frozen when the run is queued
    # so the block plan the admin saw is exactly the one that gets trained.
    photo_ids: Mapped[list | None] = mapped_column(JSON)

    # queued | running | succeeded | failed | skipped | cancelled
    status: Mapped[str] = mapped_column(String(16), default="queued", index=True)
    stage: Mapped[str | None] = mapped_column(String(64))
    progress: Mapped[float] = mapped_column(Float, default=0.0)
    message: Mapped[str | None] = mapped_column(Text)
    output_path: Mapped[str | None] = mapped_column(String(512))
    log_path: Mapped[str | None] = mapped_column(String(512))
    # {"gaussians": 123456, "size_bytes": 12_345_678}
    metrics: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)

    run: Mapped["TrainingRun"] = relationship(back_populates="blocks")
    checkpoint: Mapped["Checkpoint | None"] = relationship()
