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

# The default password is public in this repo, so it must be changed before the
# site is exposed. serve.py warns loudly while this flag is true.
DEFAULT_ADMIN_PASSWORD = "admin123"
ADMIN_PASSWORD = os.environ.get("THREEDGS_ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD)
USING_DEFAULT_PASSWORD = ADMIN_PASSWORD == DEFAULT_ADMIN_PASSWORD

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


def ensure_dirs() -> None:
    for path in (DATA_DIR, UPLOAD_DIR, THUMB_DIR, TRAINING_DIR, LOG_DIR):
        path.mkdir(parents=True, exist_ok=True)
