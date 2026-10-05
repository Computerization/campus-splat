"""EXIF reading: capture time, GPS, camera model, exposure settings.

Used both to echo information back to the volunteer and as a pose prior for
reconstruction later on.
"""

from __future__ import annotations

from datetime import datetime
from fractions import Fraction
from typing import Any

from PIL import Image

EXIF_IFD = 0x8769
GPS_IFD = 0x8825

_TAG_DATETIME_ORIGINAL = 36867
_TAG_DATETIME_DIGITIZED = 36868
_TAG_DATETIME = 306
_TAG_MAKE = 271
_TAG_MODEL = 272
_TAG_ORIENTATION = 274
_TAG_ISO = 34855
_TAG_FNUMBER = 33437
_TAG_EXPOSURE_TIME = 33434
_TAG_FOCAL_LENGTH = 37386


def _rational_to_float(value: Any) -> float | None:
    try:
        if isinstance(value, tuple) and len(value) == 2:
            num, den = value
            return float(num) / float(den) if den else None
        if isinstance(value, Fraction):
            return float(value)
        return float(value)
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def _parse_datetime(raw: Any) -> datetime | None:
    if not raw:
        return None
    text = str(raw).strip().replace("\x00", "")
    for fmt in ("%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y:%m:%d %H:%M"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _to_degrees(value: Any) -> float | None:
    try:
        degrees, minutes, seconds = value
        return (
            float(degrees)
            + float(minutes) / 60.0
            + float(seconds) / 3600.0
        )
    except (TypeError, ValueError):
        return None


def _read_gps(gps: dict) -> tuple[float | None, float | None, float | None]:
    lat = lon = alt = None
    lat_value = gps.get(2)
    lon_value = gps.get(4)
    if lat_value is not None:
        lat = _to_degrees(lat_value)
        if lat is not None and str(gps.get(1, "N")).upper().startswith("S"):
            lat = -lat
    if lon_value is not None:
        lon = _to_degrees(lon_value)
        if lon is not None and str(gps.get(3, "E")).upper().startswith("W"):
            lon = -lon
    if gps.get(6) is not None:
        alt = _rational_to_float(gps.get(6))
    return lat, lon, alt


def read_exif(img: Image.Image) -> dict:
    """Best-effort read: any failure degrades to empty values rather than
    blocking the upload.
    """
    result: dict = {
        "captured_at": None,
        "gps_lat": None,
        "gps_lng": None,
        "gps_alt": None,
        "camera_make": None,
        "camera_model": None,
        "orientation": None,
        "iso": None,
        "f_number": None,
        "exposure_time": None,
        "focal_length": None,
        "has_exif": False,
    }
    try:
        exif = img.getexif()
    except Exception:
        return result
    if not exif:
        return result

    try:
        exif_ifd = exif.get_ifd(EXIF_IFD) or {}
    except Exception:
        exif_ifd = {}
    try:
        gps_ifd = exif.get_ifd(GPS_IFD) or {}
    except Exception:
        gps_ifd = {}

    captured = (
        _parse_datetime(exif_ifd.get(_TAG_DATETIME_ORIGINAL))
        or _parse_datetime(exif_ifd.get(_TAG_DATETIME_DIGITIZED))
        or _parse_datetime(exif.get(_TAG_DATETIME))
    )
    lat, lon, alt = _read_gps(gps_ifd)

    make = (exif.get(_TAG_MAKE) or "").strip() if isinstance(exif.get(_TAG_MAKE), str) else None
    model = (exif.get(_TAG_MODEL) or "").strip() if isinstance(exif.get(_TAG_MODEL), str) else None
    if make and model and make.lower() not in model.lower():
        model = f"{make} {model}"

    orientation = exif.get(_TAG_ORIENTATION)

    result.update(
        captured_at=captured,
        gps_lat=lat,
        gps_lng=lon,
        gps_alt=alt,
        camera_make=make or None,
        camera_model=model or None,
        orientation=int(orientation) if isinstance(orientation, int) else None,
        iso=exif_ifd.get(_TAG_ISO),
        f_number=_rational_to_float(exif_ifd.get(_TAG_FNUMBER)),
        exposure_time=_rational_to_float(exif_ifd.get(_TAG_EXPOSURE_TIME)),
        focal_length=_rational_to_float(exif_ifd.get(_TAG_FOCAL_LENGTH)),
    )
    result["has_exif"] = any(
        result[key] is not None
        for key in ("captured_at", "gps_lat", "camera_model", "iso", "exposure_time")
    )
    return result
