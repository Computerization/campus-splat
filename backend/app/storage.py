"""File storage: photos on disk, thumbnails and previews. Everything is stored
as a path relative to the data directory, which keeps the data folder portable.
"""

from __future__ import annotations

import hashlib
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
    # The name it ended up with on disk; equals the requested one unless that
    # was taken (two volunteers, same number) and a suffix was appended.
    name: str = ""


def check_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            f"不支持的文件类型：{ext or '(无扩展名)'}",
        )
    return ext


def upload_folder(rel_folder: str) -> Path:
    """Resolve <uploads>/<folder>, refusing anything that escapes the root.

    The folder is built from task/checkpoint names (already normalized to ASCII),
    but this is the last line of defence before writing to disk.
    """
    folder = (rel_folder or "").strip().strip("/\\")
    if not folder or ".." in Path(folder).parts:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "非法目录名")
    return config.UPLOAD_DIR / folder


def _upload_prefix() -> str | None:
    """UPLOAD_DIR relative to DATA_DIR, or None when it lives elsewhere.

    With the default layout this is "uploads", so stored paths keep exactly the
    shape they have always had ("uploads/Task/Cp/0001_ZhangSan.jpg"). When the
    photos live on another disk there is no relative form, and the absolute path
    is stored instead.
    """
    try:
        return config.UPLOAD_DIR.relative_to(config.DATA_DIR).as_posix()
    except ValueError:
        return None


def save_stream(
    fileobj,
    *,
    folder: str,
    filename: str,
    max_bytes: int | None = None,
) -> SavedFile:
    """Stream an upload to ``<uploads>/<folder>/<filename>``, hashing as we go.

    ``max_bytes`` is enforced *during* the write: checking afterwards would let a
    single huge upload fill the disk first.
    """
    config.ensure_dirs()
    ext = check_extension(filename)

    abs_folder = upload_folder(folder)
    abs_folder.mkdir(parents=True, exist_ok=True)

    # Two volunteers can compute the same index at the same moment; the file name
    # is what decides, so step aside instead of overwriting someone's photo.
    stem = Path(filename).stem
    abs_path = abs_folder / filename
    bump = 1
    while abs_path.exists():
        abs_path = abs_folder / f"{stem}-{bump}{ext}"
        bump += 1
    name = abs_path.name

    prefix = _upload_prefix()
    stored = (
        (Path(prefix) / folder / name).as_posix() if prefix is not None else str(abs_path)
    )

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
        rel_path=stored,
        abs_path=abs_path,
        sha256=digest.hexdigest(),
        size_bytes=size,
        ext=ext,
        name=name,
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
    src = resolve(rel_path)
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
    """Turn a stored path into an absolute one, rejecting anything outside the
    data roots.

    Stored paths are normally relative to the data directory
    ("uploads/task3/cp5/abc.jpg"), but when the photos live on another disk
    (`THREEDGS_UPLOAD_DIR`) they are absolute — those are accepted only when they
    really sit under one of the configured roots.
    """
    raw = Path(rel_path)
    roots = (
        config.DATA_DIR,
        config.UPLOAD_DIR,
        config.THUMB_DIR,
        config.TRAINING_DIR,
        config.LOG_DIR,
    )
    if raw.is_absolute():
        candidate = raw.resolve()
        if any(candidate.is_relative_to(root.resolve()) for root in roots):
            return candidate
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "非法路径")

    candidate = (config.DATA_DIR / raw).resolve()
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


def tree_bytes(path: Path, seen: set[tuple[int, int]] | None = None) -> int:
    """Size of a directory tree, counting each inode once.

    The training input directory is made of hard links to the uploaded photos, so
    counting both trees would report the same bytes twice and make "how big are
    the photos" unanswerable. Pass one shared ``seen`` set across several calls to
    de-duplicate them.
    """
    if not path.exists():
        return 0
    counted = seen if seen is not None else set()
    total = 0
    for child in path.rglob("*"):
        if not child.is_file():
            continue
        try:
            info = child.stat()
        except OSError:
            continue
        key = (info.st_dev, info.st_ino)
        if key in counted:
            continue
        counted.add(key)
        total += info.st_size
    return total


def disk_usage() -> dict:
    usage = shutil.disk_usage(config.DATA_DIR)
    # One shared inode set: a photo that is hard-linked into a training run is
    # counted where it lives (uploads), not a second time in training/.
    seen: set[tuple[int, int]] = set()
    photos = tree_bytes(config.UPLOAD_DIR, seen)
    training = tree_bytes(config.TRAINING_DIR, seen)
    thumbnails = tree_bytes(config.THUMB_DIR, seen)
    logs = tree_bytes(config.LOG_DIR, seen)
    return {
        "total_bytes": usage.total,
        "free_bytes": usage.free,
        "photos_bytes": photos,
        "training_bytes": training,
        "thumbnails_bytes": thumbnails,
        "logs_bytes": logs,
        "managed_bytes": photos + training + thumbnails + logs,
    }
