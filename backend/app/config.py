"""Central configuration.

Priority: process environment variable > .env at the repo root > default in code.
The .env file is loaded with python-dotenv and is git-ignored.
"""

from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]  # repo root

# Load .env before reading any environment variable below.
try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env", override=False)
except Exception:  # pragma: no cover - without dotenv only env vars count
    pass

DATA_DIR = Path(os.environ.get("THREEDGS_DATA_DIR") or (BASE_DIR / "data")).resolve()

# Photos may live on another disk than the database / training output.
# Absolute paths are used as they are; relative ones resolve against the repo
# root (not the process working directory, which varies with how you launch).
_UPLOAD_DIR_ENV = (os.environ.get("THREEDGS_UPLOAD_DIR") or "").strip()
if _UPLOAD_DIR_ENV:
    _upload_path = Path(_UPLOAD_DIR_ENV).expanduser()
    UPLOAD_DIR = (
        _upload_path.resolve()
        if _upload_path.is_absolute()
        else (BASE_DIR / _upload_path).resolve()
    )
else:
    UPLOAD_DIR = DATA_DIR / "uploads"

THUMB_DIR = DATA_DIR / "thumbnails"
TRAINING_DIR = DATA_DIR / "training"
LOG_DIR = DATA_DIR / "logs"
DB_PATH = DATA_DIR / "app.db"

# Built frontend bundle; when present the backend serves it directly, so the
# whole app runs on a single port.
FRONTEND_DIST = Path(
    os.environ.get("THREEDGS_FRONTEND_DIST") or (BASE_DIR / "frontend" / "dist")
).resolve()

# Three permanent administrator identities; password-only login.
ADMIN_PASSWORDS = {i: f"admin{i:03d}" for i in range(1, 4)}
# CLI helpers default to administrator 001.
ADMIN_PASSWORD = ADMIN_PASSWORDS[1]

# Rate limit for admin login: an IP is locked out after too many failures.
LOGIN_MAX_FAILURES = int(os.environ.get("THREEDGS_LOGIN_MAX_FAILURES", "8"))
LOGIN_LOCKOUT_SECONDS = int(os.environ.get("THREEDGS_LOGIN_LOCKOUT_SECONDS", "300"))
# 30 days by default — volunteers shouldn't get logged out mid-session.
SESSION_TTL_HOURS = int(os.environ.get("THREEDGS_SESSION_TTL_HOURS", str(24 * 30)))

ALLOWED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".tif", ".tiff", ".bmp",
}
# Phone originals are usually 3-12 MB, HEIC smaller.
MAX_UPLOAD_MB = int(os.environ.get("THREEDGS_MAX_UPLOAD_MB", "60"))
MAX_FILES_PER_REQUEST = int(os.environ.get("THREEDGS_MAX_FILES_PER_REQUEST", "20"))

# Quality thresholds.
#
# Sharpness is measured as the Laplacian variance of the image resized to a
# 1024 px long side, so the thresholds are comparable across camera
# resolutions. Rough ranges at that size: >300 very sharp, 140-300 acceptable,
# 60-140 soft, <60 blurry.
QUALITY = {
    "sharpness_normalize_long_side": 1024,
    "sharpness_fail": 60.0,
    "sharpness_warn": 140.0,
    "sharpness_good": 300.0,

    "brightness_too_dark": 55.0,
    "brightness_dark_warn": 80.0,
    "brightness_bright_warn": 185.0,
    "brightness_too_bright": 210.0,

    # Ratios of blown (>=250) and crushed (<=8) pixels
    "overexposed_warn": 0.15,
    "overexposed_fail": 0.38,
    "underexposed_warn": 0.22,
    "underexposed_fail": 0.45,

    # Grayscale standard deviation. Too low means haze, backlight or a dirty lens.
    "contrast_low_warn": 26.0,
    "contrast_low_fail": 14.0,

    "min_long_side": 1600,
    "good_long_side": 2200,

    # Bytes per pixel — catches photos re-sent through WeChat/QQ
    "compression_warn_bpp": 0.25,

    # dHash Hamming distance at or below this counts as a duplicate frame
    "duplicate_hamming": 4,
}

# Entry point for real reconstruction. Leave empty to only track jobs without
# launching anything.
TRAINING_COMMAND = os.environ.get("THREEDGS_TRAINING_COMMAND", "")
TRAINING_TIMEOUT_SECONDS = int(os.environ.get("THREEDGS_TRAINING_TIMEOUT", str(12 * 3600)))
TRAINING_MAX_CONCURRENT = int(os.environ.get("THREEDGS_TRAINING_MAX_CONCURRENT", "1"))

# ---------------------------------------------------------------- training pipeline
#
# Defaults for the graded pipeline of docs/training-pipeline.md. Every value can
# be overridden per run from the admin console.

# Optional external tools. Without them the pipeline still runs end to end in
# mock mode (no COLMAP, no GPU needed).
COLMAP_BIN = os.environ.get("THREEDGS_COLMAP_BIN", "colmap")
# COLMAP's vocabulary tree, needed by vocab_tree_matcher. Download it once and
# point this at the .bin file (see the docs).
VOCAB_TREE = os.environ.get("THREEDGS_VOCAB_TREE", "").strip()

TRAINING_DEFAULTS = {
    # 3DGS iterations per block
    "iterations": 30_000,
    # COLMAP feature extraction long side. 2000 keeps matching affordable; the
    # SfM stage is the one that eats RAM, not VRAM.
    "image_resize": 2000,
    # Training resolution (long side). 1600 is the 3DGS default and the first
    # knob to turn when a block runs out of VRAM.
    "train_resize": 1600,
    # toolchain: 3dgs (original, most VRAM) | gsplat (about 1/5 of the VRAM)
    "toolchain": "3dgs",
    # gsplat image downsampling (--data_factor, see docs/training-toolchain.md
    # §二): the doc's first lever when a block runs out of VRAM, preferred over
    # shrinking {resolution} because it keeps the COLMAP resolution intact.
    "data_factor": 1,
    # matcher: auto | vocab_tree | sequential | exhaustive
    "matcher": "auto",
    # A checkpoint with more usable photos than this is cut into several blocks.
    # 200-600 photos per room is the safe range in the docs.
    "block_max_photos": 600,
    # Concatenate the block point clouds into one ply (same coordinate system,
    # so this is a plain file-level join)
    "merge_blocks": True,
    # Outdoor runs: align the sparse model to real-world ENU coordinates using
    # the GPS tags of the drone photos
    "rtk_align": True,
}

# A gaussian costs roughly 800 bytes while training (parameters + gradients + two
# Adam states) — about 500k gaussians per GB, so a 24 GB card tops out near 11M.
TRAINING_GAUSSIANS_PER_GB = int(os.environ.get("THREEDGS_GAUSSIANS_PER_GB", "500000"))
# VRAM of the machine that does the training, for the preflight warning.
TRAINING_VRAM_GB = float(os.environ.get("THREEDGS_VRAM_GB", "24"))
# Photos that roughly map to one million gaussians; used for the VRAM warning in
# the admin preflight. Deliberately conservative.
TRAINING_PHOTOS_PER_MILLION_GAUSSIANS = int(
    os.environ.get("THREEDGS_PHOTOS_PER_MILLION_GAUSSIANS", "120")
)

# How much of a block's progress the training loop owns (the rest is COLMAP).
TRAINING_BLOCK_STAGES = (
    "block_init",
    "block_undistort",
    "block_training",
    "block_export",
)


def ensure_dirs() -> None:
    for path in (DATA_DIR, UPLOAD_DIR, THUMB_DIR, TRAINING_DIR, LOG_DIR):
        path.mkdir(parents=True, exist_ok=True)
