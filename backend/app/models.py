"""Data models.

    Task (a building / floor / area; volunteers join with an access code)
      └─ Checkpoint (one shooting spot, e.g. "Building B, 3F corridor east end")
           └─ Photo (uploaded by a volunteer)
                └─ QualityReport (heuristic quality check result)

    TrainingRun (a 3DGS reconstruction job) hangs off a Task.
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


class AuthSession(Base):
    """Login session. Admins and volunteers share this table, split by `role`."""

    __tablename__ = "auth_sessions"

    token: Mapped[str] = mapped_column(String(64), primary_key=True)
    role: Mapped[str] = mapped_column(String(16), index=True)  # admin | volunteer
    nickname: Mapped[str | None] = mapped_column(String(64))
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
    name: Mapped[str] = mapped_column(String(128))
    kind: Mapped[str] = mapped_column(String(16), default="indoor", index=True)
    # indoor (volunteers' phones) | outdoor (drone)
    description: Mapped[str | None] = mapped_column(Text)
    location_hint: Mapped[str | None] = mapped_column(String(255))
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

    # pending | in_progress | done | blocked
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)
    admin_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

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
    """One 3DGS job. The backend only queues and tracks state; the heavy lifting
    happens in the training script.
    """

    __tablename__ = "training_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int | None] = mapped_column(
        ForeignKey("tasks.id", ondelete="SET NULL"), index=True
    )
    name: Mapped[str] = mapped_column(String(128))
    # queued | running | succeeded | failed | cancelled
    status: Mapped[str] = mapped_column(String(16), default="queued", index=True)
    # Current stage, e.g. preparing / colmap_mapping / gs_training / export
    stage: Mapped[str | None] = mapped_column(String(64))
    progress: Mapped[float] = mapped_column(Float, default=0.0)  # 0-100
    message: Mapped[str | None] = mapped_column(Text)
    params: Mapped[dict | None] = mapped_column(JSON)
    photo_count: Mapped[int] = mapped_column(Integer, default=0)
    log_path: Mapped[str | None] = mapped_column(String(512))
    output_path: Mapped[str | None] = mapped_column(String(512))
    created_by: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)

    task: Mapped["Task | None"] = relationship()
