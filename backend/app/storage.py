"""File storage: photos on disk, thumbnails and previews. Everything is stored
as a path relative to the data directory, which keeps the data folder portable.
"""

from __future__ import annotations

import hashlib
import secrets
import shutil
from dataclasses import dataclass
from pathlib import Path

from fastapi import HTTPException, status
from PIL import Image, ImageOps

from . import config

THUMB_LONG_SIDE = 400
PREVIEW_LONG_SIDE = 1600

# Formats a browser can render in an <img> tag; HEIC is not one of them
_BROWSER_SAFE = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}


@dataclass
class SavedFile:
    rel_path: str
    abs_path: Path
    sha256: str
    size_bytes: int
    ext: str


def _new_name(ext: str) -> str:
    return f"{secrets.token_hex(16)}{ext}"


def check_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            f"不支持的文件类型：{ext or '(无扩展名)'}",
        )
    return ext


def save_stream(
    fileobj,
    *,
    task_id: int,
    checkpoint_id: int | None,
    filename: str,
    max_bytes: int | None = None,
) -> SavedFile:
    """Stream an upload to disk while computing its sha256.

    `max_bytes` is enforced *during* the write: checking afterwards would let a
    single huge upload fill the disk first.
    """
    config.ensure_dirs()
    ext = check_extension(filename)

    folder = Path("uploads") / f"task{task_id}" / (f"cp{checkpoint_id}" if checkpoint_id else "unassigned")
    abs_folder = config.DATA_DIR / folder
    abs_folder.mkdir(parents=True, exist_ok=True)

    rel = folder / _new_name(ext)
    abs_path = config.DATA_DIR / rel

    digest = hashlib.sha256()
    size = 0
    try:
        with abs_path.open("wb") as out:
            while True:
                chunk = fileobj.read(1024 * 1024)
                if not chunk:
                    break
                size += len(chunk)
                if max_bytes is not None and size > max_bytes:
                    raise HTTPException(
                        # 413; the constant was renamed in newer starlette
                        getattr(status, "HTTP_413_CONTENT_TOO_LARGE", 413),
                        f"这张太大了（已超过 {max_bytes // 1024 // 1024}MB 上限）",
                    )
                digest.update(chunk)
                out.write(chunk)
    except Exception:
        # Drop the half-written file (the HTTPException above lands here too)
        abs_path.unlink(missing_ok=True)
        raise

    if size == 0:
        abs_path.unlink(missing_ok=True)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "上传的文件是空的")

    return SavedFile(
        rel_path=rel.as_posix(),
        abs_path=abs_path,
        sha256=digest.hexdigest(),
        size_bytes=size,
        ext=ext,
    )


def _resize_long_side(img: Image.Image, long_side: int) -> Image.Image:
    w, h = img.size
    longest = max(w, h)
    if longest <= long_side:
        return img.copy()
    scale = long_side / longest
    return img.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)


def make_derivatives(rel_path: str, *, prefix: str) -> tuple[str | None, str | None]:
    """Build the thumbnail and preview. Returns None on failure rather than
    blocking the upload.
    """
    src = config.DATA_DIR / rel_path
    thumb_rel: str | None = None
    preview_rel: str | None = None
    try:
        with Image.open(src) as raw:
            img = ImageOps.exif_transpose(raw)
            img = img.convert("RGB")

            thumb = _resize_long_side(img, THUMB_LONG_SIDE)
            thumb_rel = (Path("thumbnails") / f"{prefix}_thumb.jpg").as_posix()
            _save_jpeg(thumb, config.DATA_DIR / thumb_rel, quality=82)

            preview = _resize_long_side(img, PREVIEW_LONG_SIDE)
            preview_rel = (Path("thumbnails") / f"{prefix}_preview.jpg").as_posix()
            _save_jpeg(preview, config.DATA_DIR / preview_rel, quality=88)
    except Exception:
        # A missing HEIC decoder or a truncated file must not fail the upload
        thumb_rel = thumb_rel if thumb_rel and (config.DATA_DIR / thumb_rel).exists() else None
        preview_rel = None
    return thumb_rel, preview_rel


def _save_jpeg(img: Image.Image, dest: Path, *, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="JPEG", quality=quality, optimize=True)


def is_browser_viewable(rel_path: str) -> bool:
    return Path(rel_path).suffix.lower() in _BROWSER_SAFE


def resolve(rel_path: str) -> Path:
    """Turn a stored relative path back into an absolute one, rejecting
    directory traversal.
    """
    candidate = (config.DATA_DIR / rel_path).resolve()
    data_root = config.DATA_DIR.resolve()
    if not candidate.is_relative_to(data_root):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "非法路径")
    return candidate


def delete_file(rel_path: str | None) -> None:
    if not rel_path:
        return
    try:
        resolve(rel_path).unlink(missing_ok=True)
    except HTTPException:
        return


def disk_usage() -> dict:
    usage = shutil.disk_usage(config.DATA_DIR)
    used_by_us = sum(p.stat().st_size for p in config.UPLOAD_DIR.rglob("*") if p.is_file())
    return {
        "total_bytes": usage.total,
        "free_bytes": usage.free,
        "photos_bytes": used_by_us,
    }
