"""Objective per-photo metrics."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
from PIL import Image

try:  # opencv is only a speed-up; everything works without it
    import cv2
except Exception:  # pragma: no cover
    cv2 = None

OPENCV_AVAILABLE = cv2 is not None


@dataclass
class ImageMetrics:
    width: int
    height: int
    megapixels: float
    size_bytes: int
    bytes_per_pixel: float
    sharpness: float           # Laplacian variance at the normalized long side
    brightness: float          # grayscale mean, 0-255
    contrast: float            # grayscale standard deviation
    overexposed_ratio: float   # fraction of pixels >= 250
    underexposed_ratio: float  # fraction of pixels <= 8

    def to_dict(self) -> dict:
        data = asdict(self)
        for key, value in data.items():
            if isinstance(value, float):
                data[key] = round(value, 4)
        return data


def _small_gray(img: Image.Image, long_side: int) -> np.ndarray:
    gray = img.convert("L")
    w, h = gray.size
    longest = max(w, h)
    if longest > long_side:
        scale = long_side / longest
        gray = gray.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    return np.asarray(gray, dtype=np.float32)


def laplacian_variance(gray: np.ndarray) -> float:
    """Laplacian variance — the classic blur metric; lower means blurrier."""
    if cv2 is not None:
        return float(cv2.Laplacian(gray, cv2.CV_64F).var())

    kernel = (
        -4.0 * gray
        + np.roll(gray, 1, axis=0)
        + np.roll(gray, -1, axis=0)
        + np.roll(gray, 1, axis=1)
        + np.roll(gray, -1, axis=1)
    )
    inner = kernel[1:-1, 1:-1]
    return float(inner.var())


def compute_metrics(img: Image.Image, *, size_bytes: int, normalize_long_side: int) -> ImageMetrics:
    width, height = img.size
    pixels = max(1, width * height)

    small = _small_gray(img, normalize_long_side)
    sharpness = laplacian_variance(small)

    full_gray = np.asarray(img.convert("L"), dtype=np.uint8)
    over = float((full_gray >= 250).mean())
    under = float((full_gray <= 8).mean())

    return ImageMetrics(
        width=width,
        height=height,
        megapixels=round(pixels / 1_000_000, 2),
        size_bytes=size_bytes,
        bytes_per_pixel=round(size_bytes / pixels, 3),
        sharpness=round(sharpness, 3),
        brightness=round(float(full_gray.mean()), 3),
        contrast=round(float(full_gray.std()), 3),
        overexposed_ratio=round(over, 5),
        underexposed_ratio=round(under, 5),
    )


def image_size_of(path: Path) -> tuple[int, int]:
    with Image.open(path) as img:
        return img.size
