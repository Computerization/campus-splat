"""Request/response models (Pydantic v2)."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

TaskKind = Literal["indoor", "outdoor"]
CheckpointStatus = Literal["pending", "in_progress", "done", "blocked"]
# "checking" is the transient state while the background worker analyzes an
# upload (services/quality_jobs.py) — the volunteer sees it as 质检中.
PhotoStatus = Literal["ok", "warning", "rejected", "checking"]
# What an admin may set by hand when overriding the heuristic verdict; "checking"
# is a state, not a verdict, so it is not offered there.
ReviewStatus = Literal["ok", "warning", "rejected"]
TrainingStatus = Literal["queued", "running", "succeeded", "failed", "cancelled"]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------- auth


class AdminLoginIn(BaseModel):
    # Which of the three fixed administrators is logging in (the login page asks
    # first). Optional so password-only clients keep working.
    admin_id: int | None = Field(default=None, ge=1, le=3)
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
    admin_id: int | None = None
    volunteer_id: str | None = None


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
    owner_admin_id: int = 1
    name: str
    kind: str
    description: str | None
    location_hint: str | None
    # ASCII folder under data/uploads/ that holds this task's photos
    folder: str | None = None
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
    shot_count: int | None = Field(default=None, ge=1, le=64)
    # Left empty, the server estimates it from the room size (services/shots.py).
    # That is what the "点位名|位置|长x宽x高" import format relies on.
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
    # ASCII folder under data/uploads/<task folder>/ that holds these photos
    folder: str | None = None
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
    # Uploaded but still being checked in the background (nothing to count as
    # usable yet — the volunteer's phone polls until it drops to 0)
    uploaded_checking: int = 0
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
    status: ReviewStatus
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
    # Uploaded but still in the background quality check: part of photo_total,
    # counted as neither usable nor rejected
    photo_checking: int = 0
    contributors: list[str] = Field(default_factory=list)
    active_volunteers: list[str] = Field(default_factory=list)
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


class TrainingParamsIn(BaseModel):
    """Parameters of one reconstruction run (docs/training-pipeline.md).

    Every field maps to something the pipeline script understands, so the admin
    console can expose the whole graded flow without touching the backend.
    """

    iterations: int = Field(default=30_000, ge=1_000, le=200_000)
    # COLMAP feature extraction long side (the SfM stage is RAM-bound)
    image_resize: int = Field(default=2000, ge=800, le=8000)
    # Training long side — the first knob to turn when a block runs out of VRAM
    train_resize: int = Field(default=1600, ge=400, le=8000)
    toolchain: Literal["3dgs", "gsplat"] = "3dgs"
    # gsplat only: train on images downsampled by this factor (--data_factor).
    # First lever when a block runs out of VRAM (docs/training-toolchain.md §二).
    data_factor: Literal[1, 2, 4] = 1
    matcher: Literal["auto", "vocab_tree", "sequential", "exhaustive"] = "auto"
    # A checkpoint with more usable photos than this is cut into several blocks
    block_max_photos: int = Field(default=600, ge=20, le=5000)
    merge_blocks: bool = True
    rtk_align: bool = True


class TrainingCreateIn(BaseModel):
    task_id: int | None = None
    name: str | None = Field(default=None, max_length=128)
    params: TrainingParamsIn | None = None


class TrainingBlockOut(ORMModel):
    id: int
    run_id: int
    checkpoint_id: int | None
    order_index: int
    key: str
    name: str
    part_index: int
    part_total: int
    photo_count: int
    status: str
    stage: str | None
    progress: float
    message: str | None
    output_path: str | None
    log_path: str | None
    metrics: dict | None
    started_at: datetime | None
    finished_at: datetime | None


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
    scope_kind: str = "indoor"
    block_total: int = 0
    block_done: int = 0
    artifacts: list[Any] | None = None
    reuse_run_id: int | None = None
    created_at: datetime
    started_at: datetime | None
    finished_at: datetime | None
    duration_seconds: float | None = None


class TrainingRunDetailOut(TrainingRunOut):
    blocks: list[TrainingBlockOut] = Field(default_factory=list)


class TrainingBlockPlanOut(BaseModel):
    key: str
    name: str
    checkpoint_id: int | None
    part_index: int
    part_total: int
    photo_count: int


class SolveActivityOut(BaseModel):
    """一个正在试解算的点位（训练发起前的资源提示，见 services/recon.py）。"""
    checkpoint_id: int
    name: str
    task_name: str
    status: str            # queued | running
    progress: int = 0      # 0-100
    eta_s: int | None = None


class TrainingPreflightOut(BaseModel):
    task_id: int
    task_name: str
    kind: str
    photo_count: int
    gps_photos: int
    block_max_photos: int
    blocks: list[TrainingBlockPlanOut] = Field(default_factory=list)
    estimated_gaussians_per_block: int = 0
    gaussian_budget: int = 0
    warnings: list[str] = Field(default_factory=list)
    # Toolchain readiness for the parameters this preflight was asked about:
    # which .env variable backs it, whether its command template is usable and
    # every pitfall of docs/training-toolchain.md the template trips over.
    toolchain: str = "3dgs"
    toolchain_env_var: str = ""
    command_configured: bool = False
    command_program: str | None = None
    command_program_available: bool | None = None
    command_warnings: list[str] = Field(default_factory=list)
    # 正在试解算的点位：训练前提示一下算力占用（只提醒，不拦）
    active_solves: list[SolveActivityOut] = Field(default_factory=list)


class TrainingPreviewSceneOut(BaseModel):
    """One loadable point cloud for the admin preview."""

    key: str
    name: str
    url: str
    # Which run the cloud belongs to; scenes from other runs are what the admin
    # places by hand against this run's coordinate system
    run_id: int
    is_reference: bool = False
    block_key: str | None = None
    merged: bool = False
    gaussians: int = 0
    size_bytes: int = 0
    color: list[float] = Field(default_factory=list)
    # Structured placement (pivot / offset / yaw / scale) plus the matrix derived
    # from it, so the editor can bind straight to numbers
    placement: dict = Field(default_factory=dict)
    transform: list[list[float]] = Field(default_factory=list)
    transform_source: str = "identity"


class TrainingPreviewOut(BaseModel):
    run_id: int
    name: str
    status: str
    coordinate_system: str
    scenes: list[TrainingPreviewSceneOut] = Field(default_factory=list)


class PlacementIn(BaseModel):
    """One placement written back from the 3D preview editor."""

    key: str = Field(min_length=1, max_length=64)
    # NULL = a block of this run; otherwise the run the cloud belongs to
    run_id: int | None = None
    offset: list[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0], min_length=3, max_length=3)
    # ZYX Euler angles in radians (pitch = around X, yaw = around Y, roll = around Z)
    yaw: float = 0.0
    pitch: float = 0.0
    roll: float = 0.0
    scale: float = 1.0


class TransformUpdateIn(BaseModel):
    placements: list[PlacementIn] = Field(default_factory=list, max_length=200)


# ---------------------------------------------------------------- maintenance


class ResetIn(BaseModel):
    """Wipe everything. The confirm word keeps a stray click from doing it."""

    confirm: str = Field(min_length=1, max_length=32)


class RevealIn(BaseModel):
    """Where the *server machine's* file manager should open.

    Give one of these; paths are resolved against the data roots, so this can't
    be used to browse the rest of the disk.
    """

    photo_id: int | None = None
    task_id: int | None = None
    scope: Literal["data", "uploads", "thumbs", "training", "logs"] | None = None
    path: str | None = Field(default=None, max_length=1024)


OverviewOut.model_rebuild()
