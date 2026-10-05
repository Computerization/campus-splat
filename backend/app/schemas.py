"""Request/response models (Pydantic v2)."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

TaskKind = Literal["indoor", "outdoor"]
CheckpointStatus = Literal["pending", "in_progress", "done", "blocked"]
PhotoStatus = Literal["ok", "warning", "rejected"]
TrainingStatus = Literal["queued", "running", "succeeded", "failed", "cancelled"]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------- auth


class AdminLoginIn(BaseModel):
    password: str = Field(min_length=1)


class VolunteerJoinIn(BaseModel):
    access_code: str = Field(min_length=2, max_length=32)
    nickname: str = Field(min_length=1, max_length=32)

    @field_validator("access_code")
    @classmethod
    def _upper(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator("nickname")
    @classmethod
    def _strip(cls, value: str) -> str:
        return value.strip()


class SessionOut(BaseModel):
    token: str
    role: str
    nickname: str | None = None
    task_id: int | None = None
    task_name: str | None = None


# ---------------------------------------------------------------- tasks


class TaskCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    kind: TaskKind = "indoor"
    description: str | None = None
    location_hint: str | None = None
    access_code: str | None = Field(default=None, max_length=32)


class TaskPatchIn(BaseModel):
    name: str | None = Field(default=None, max_length=128)
    kind: TaskKind | None = None
    description: str | None = None
    location_hint: str | None = None
    access_code: str | None = Field(default=None, max_length=32)
    status: Literal["active", "archived"] | None = None


class TaskOut(ORMModel):
    id: int
    name: str
    kind: str
    description: str | None
    location_hint: str | None
    access_code: str
    status: str
    cover_image: str | None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------- checkpoints


class AngleSpec(BaseModel):
    label: str
    pitch: float | None = None
    yaw: float | None = None
    tip: str | None = None


class CheckpointCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    order_index: int | None = None
    building: str | None = None
    floor: str | None = None
    room: str | None = None
    lat: float | None = None
    lng: float | None = None
    height_m: float | None = None
    length_m: float | None = Field(default=None, ge=0, le=1000)
    width_m: float | None = Field(default=None, ge=0, le=1000)
    room_height_m: float | None = Field(default=None, ge=0, le=100)
    indoor: bool = True
    instructions: str | None = None
    find_hint: str | None = None
    shot_count: int = Field(default=4, ge=1, le=64)
    angles: list[AngleSpec] | None = None


class CheckpointPatchIn(BaseModel):
    name: str | None = Field(default=None, max_length=128)
    order_index: int | None = None
    building: str | None = None
    floor: str | None = None
    room: str | None = None
    lat: float | None = None
    lng: float | None = None
    height_m: float | None = None
    length_m: float | None = Field(default=None, ge=0, le=1000)
    width_m: float | None = Field(default=None, ge=0, le=1000)
    room_height_m: float | None = Field(default=None, ge=0, le=100)
    indoor: bool | None = None
    instructions: str | None = None
    find_hint: str | None = None
    shot_count: int | None = Field(default=None, ge=1, le=64)
    angles: list[AngleSpec] | None = None
    status: CheckpointStatus | None = None
    admin_note: str | None = None


class CheckpointOut(ORMModel):
    id: int
    task_id: int
    order_index: int
    name: str
    building: str | None
    floor: str | None
    room: str | None
    lat: float | None
    lng: float | None
    height_m: float | None
    length_m: float | None
    width_m: float | None
    room_height_m: float | None
    indoor: bool
    instructions: str | None
    find_hint: str | None
    shot_count: int
    angles: list[Any] | None
    reference_image: str | None
    status: str
    admin_note: str | None


class CheckpointProgressOut(CheckpointOut):
    """Checkpoint plus upload progress; used by both the admin and volunteer UIs.

    "Usable" counts `warning` photos as well: they only have a minor flaw (say,
    slightly dark) and can still go into reconstruction. So
    uploaded_usable = uploaded_ok + uploaded_warning, and completion is based on it.
    """

    uploaded_ok: int = 0
    uploaded_warning: int = 0
    uploaded_rejected: int = 0
    uploaded_total: int = 0
    uploaded_usable: int = 0
    remaining: int = 0
    contributors: list[str] = Field(default_factory=list)
    last_upload_at: datetime | None = None


# ---------------------------------------------------------------- photos


class QualityOut(ORMModel):
    passed: bool
    score: int
    issues: list[Any] | None
    metrics: dict | None
    advice: str | None
    checked_at: datetime


class PhotoOut(ORMModel):
    id: int
    task_id: int
    checkpoint_id: int | None
    nickname: str | None
    original_filename: str
    width: int | None
    height: int | None
    size_bytes: int
    captured_at: datetime | None
    gps_lat: float | None
    gps_lng: float | None
    camera_model: str | None
    status: str
    duplicate_of: int | None
    uploaded_at: datetime
    thumb_url: str | None = None
    preview_url: str | None = None
    file_url: str | None = None
    checkpoint_name: str | None = None
    quality: QualityOut | None = None


class PhotoPage(BaseModel):
    items: list[PhotoOut]
    total: int
    limit: int
    offset: int


class PhotoReviewIn(BaseModel):
    status: PhotoStatus
    note: str | None = None


class UploadResultOut(BaseModel):
    """Upload + quality result for one photo, returned straight to the phone."""

    ok: bool
    photo_id: int | None = None
    original_filename: str
    status: PhotoStatus | None = None
    score: int | None = None
    passed: bool | None = None
    issues: list[Any] = Field(default_factory=list)
    advice: str | None = None
    metrics: dict | None = None
    captured_at: datetime | None = None
    error: str | None = None


class UploadBatchOut(BaseModel):
    results: list[UploadResultOut]
    checkpoint: CheckpointProgressOut


# ---------------------------------------------------------------- progress / overview


class TaskProgressOut(BaseModel):
    task: TaskOut
    checkpoint_total: int = 0
    checkpoint_done: int = 0
    checkpoint_in_progress: int = 0
    photo_total: int = 0
    photo_ok: int = 0
    photo_warning: int = 0
    photo_rejected: int = 0
    contributors: list[str] = Field(default_factory=list)
    progress_percent: float = 0.0
    last_upload_at: datetime | None = None


class OverviewOut(BaseModel):
    tasks: list[TaskProgressOut]
    totals: dict
    storage: dict
    training: list["TrainingRunOut"]


class VolunteerBoardOut(BaseModel):
    task: TaskOut
    checkpoints: list[CheckpointProgressOut]
    nickname: str | None = None
    my_photo_count: int = 0
    my_ok_count: int = 0


# ---------------------------------------------------------------- training


class TrainingCreateIn(BaseModel):
    task_id: int | None = None
    name: str | None = Field(default=None, max_length=128)
    # Free-form parameters passed through to the training script
    params: dict | None = None


class TrainingRunOut(ORMModel):
    id: int
    task_id: int | None
    name: str
    status: str
    stage: str | None
    progress: float
    message: str | None
    params: dict | None
    photo_count: int
    output_path: str | None
    created_at: datetime
    started_at: datetime | None
    finished_at: datetime | None
    duration_seconds: float | None = None


OverviewOut.model_rebuild()
