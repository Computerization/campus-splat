"""试解算 (trial reconstruction): point COLMAP at one checkpoint's photos and
turn the result into something an administrator can act on.

The review page asks three things, and this module answers all of them:

* **能不能重建** — is the geometry there at all (`can_reconstruct`, `verdict`)?
* **能打几分** — a 1-100 score built from the registration ratio, whether the
  photos form a single connected block, and the reprojection error (`score` plus
  a `checks` list with a good/warn/bad level per indicator).
* **哪里要补拍** — rule-based advice for the volunteer (`suggestions`).

Working directory: ``data/recon/<任务 folder>/<点位 folder>/``, the same layered
naming as training output, so a glance at the tree says which checkpoint it
belongs to. It is **kept** after the run (the report carries the path) because
"why did this one fail" is a question that gets asked the next morning; the JSON
report is the part the UI reads.

The trial stays isolated from the real run: its model is never reused by training,
because COLMAP is non-deterministic and mixing the two would make both harder to
trust. Treat the report as evidence for a human decision, not a promise.

One worker at a time, like the quality queue: a solve eats CPU/RAM/GPU. Progress
and a time estimate go to the database as the stages run, so the console can show
a bar instead of a spinner.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import threading
import time
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..database import SessionLocal
from ..models import Checkpoint, Photo, Task, utcnow
from . import naming

SOLVE_NONE = "none"
SOLVE_QUEUED = "queued"
SOLVE_RUNNING = "running"
SOLVE_DONE = "done"
SOLVE_FAILED = "failed"

# Photos the quality check threw out are not what the volunteer should be judged
# on; ones still being checked have no verdict yet.
_SKIPPED_STATUSES = ("rejected", "checking")

# COLMAP's three stages take wildly different amounts of time, so the bar moves by
# experience-based weights rather than by stage count: feature extraction, feature
# matching, incremental reconstruction. A room that takes 8 minutes spends most of
# it in the mapper.
STAGES: dict[str, tuple[str, float, float]] = {
    "feature_extractor": ("features", 2.0, 30.0),
    "exhaustive_matcher": ("match", 30.0, 72.0),
    "mapper": ("map", 72.0, 100.0),
}

# Within a stage COLMAP prints a counter; matching it makes the bar move smoothly.
# Anything that does not match simply leaves the stage-level percentage alone.
_PROGRESS_PATTERNS: dict[str, re.Pattern[str]] = {
    "feature_extractor": re.compile(r"Processed file \[(\d+)/(\d+)\]"),
    "exhaustive_matcher": re.compile(r"Matching block \[(\d+)/(\d+)\]"),
    "mapper": re.compile(r"Registering image #(\d+)"),
}


def recon_dir(task: Task, checkpoint: Checkpoint) -> Path:
    """``data/recon/<任务 folder>/<点位 folder>/`` — readable, one per checkpoint."""
    task_folder = task.folder or naming.normalize(task.name, fallback=f"Task{task.id}")
    checkpoint_folder = checkpoint.folder or naming.normalize(
        checkpoint.name, fallback=f"Checkpoint{checkpoint.id}"
    )
    return config.DATA_DIR / "recon" / task_folder / checkpoint_folder


def _gpu_flag() -> str:
    value = os.environ.get("THREEDGS_COLMAP_USE_GPU", "1").strip().lower()
    return "0" if value in ("0", "false", "no", "off") else "1"


def colmap_available() -> bool:
    return bool(shutil.which(config.COLMAP_BIN) or Path(config.COLMAP_BIN).exists())


def mock_mode() -> bool:
    """`auto` uses COLMAP when it is installed, `mock` never does (tests, demos)."""
    mode = config.RECON_MODE
    if mode == "mock":
        return True
    if mode == "colmap":
        return False
    return not colmap_available()


def estimate_remaining(percent: float, started_at: datetime | None) -> int | None:
    """Seconds left, extrapolated from how long the finished part took.

    Deliberately silent until a bit of the work is done: an estimate computed from
    3% of a noisy process is worse than no estimate.
    """
    if started_at is None or percent < 8:
        return None
    elapsed = (utcnow() - started_at).total_seconds()
    if elapsed < 5:
        return None
    total = elapsed / (percent / 100.0)
    return max(0, int(round(total - elapsed)))


# ------------------------------------------------------------------ parsing
#
# Everything below reads COLMAP's *text* model, so the numbers can be tested
# without COLMAP installed.


def parse_images(path: Path) -> dict[int, str]:
    """`images.txt` holds two lines per registered image: pose, then 2D points."""
    images: dict[int, str] = {}
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    for index in range(0, len(lines), 2):
        line = lines[index].strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 10:
            continue
        try:
            image_id = int(parts[0])
        except ValueError:
            continue
        # The name may contain spaces, and is the last field.
        images[image_id] = " ".join(parts[9:])
    return images


def parse_points3d(path: Path) -> tuple[int, dict[int, float], dict[int, int]]:
    """`points3D.txt` → (point count, mean error per image, observations per image).

    Per-image error is the mean reprojection error of the points that image
    contributed to — it is what tells the admin *which* photo is the bad one.
    """
    errors: dict[int, list[float]] = defaultdict(list)
    observations: dict[int, int] = defaultdict(int)
    count = 0
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 8:
            continue
        count += 1
        try:
            error = float(parts[7])
        except ValueError:
            continue
        track = parts[8:]
        for index in range(0, len(track) - 1, 2):
            try:
                image_id = int(track[index])
            except ValueError:
                continue
            errors[image_id].append(error)
            observations[image_id] += 1
    means = {image_id: sum(values) / len(values) for image_id, values in errors.items()}
    return count, means, dict(observations)


def score_report(*, ratio: float, components: list[dict], mean_error: float) -> tuple[int, list[dict]]:
    """1-100 score and a per-indicator good/warn/bad breakdown.

    Weights: registration 50, connectivity 30, reprojection error 20. The score
    is only meaningful together with `can_reconstruct` — a checkpoint can score
    low and still be reconstructible, which is exactly the case an admin wants to
    see separately.
    """
    checks: list[dict] = []

    ratio_score = 50.0 * min(max(ratio, 0.0) / 0.95, 1.0)
    checks.append({
        "key": "registered",
        "level": "good" if ratio >= 0.9 else "warn" if ratio >= 0.7 else "bad",
        "points": round(ratio_score, 1),
        "max_points": 50,
    })

    if len(components) <= 1:
        connectivity_score, level = 30.0, "good"
    else:
        total = max(sum(component["images"] for component in components), 1)
        largest = max(component["images"] for component in components)
        share = largest / total
        connectivity_score = 30.0 * max(share - 0.2, 0.0) / 0.8
        level = "bad" if share < 0.7 else "warn"
    checks.append({
        "key": "connectivity",
        "level": level,
        "points": round(connectivity_score, 1),
        "max_points": 30,
    })

    if mean_error <= 0:
        error_score, level = 0.0, "warn"
    elif mean_error <= 1.0:
        error_score, level = 20.0, "good"
    elif mean_error <= 3.0:
        error_score, level = 20.0 - (mean_error - 1.0) / 2.0 * 12.0, "warn"
    else:
        error_score, level = max(0.0, 8.0 - (mean_error - 3.0) * 2.0), "bad"
    checks.append({
        "key": "reprojection",
        "level": level,
        "points": round(error_score, 1),
        "max_points": 20,
    })

    total = int(round(max(1.0, min(100.0, ratio_score + connectivity_score + error_score))))
    return total, checks


def build_suggestions(report: dict, *, shot_count: int | None = None) -> list[dict]:
    """What the volunteer should do differently, from the same numbers.

    Rules, not a model: every line points at a specific measurable problem, so
    the admin can paste it into the reviewer note as is.
    """
    advice: list[dict] = []
    ratio = report.get("registered_ratio") or 0.0
    components = report.get("components") or []
    mean_error = report.get("mean_error_px") or 0.0
    images = report.get("images") or 0
    unregistered = report.get("unregistered_images") or []

    if images and images < 30:
        advice.append({
            "level": "warn",
            "text": f"只有 {images} 张照片参与解算，样本偏少，最好按拍摄要点拍满所需张数"
                    + (f"（这一点位要求 {shot_count} 张）" if shot_count else ""),
        })

    if ratio < 0.9 and unregistered:
        shown = "、".join(unregistered[:6])
        more = f" 等 {len(unregistered)} 张" if len(unregistered) > 6 else ""
        advice.append({
            "level": "bad" if ratio < 0.7 else "warn",
            "text": f"{len(unregistered)} 张照片没有定位成功（{shown}{more}）。"
                    "通常是相邻照片重叠不够或该处太模糊，建议对着这些位置补拍几个相邻角度",
        })

    if len(components) > 1:
        sizes = "、".join(str(component["images"]) for component in components[:5])
        advice.append({
            "level": "bad",
            "text": f"照片被解算成 {len(components)} 组互不相连的块（各组张数 {sizes}）。"
                    "相邻两个空间之间缺少过渡照片——常见于门口、走廊两端、转角；"
                    "建议在两块之间补 3~5 张连续拍摄的过渡照片",
        })

    if mean_error > 3.0:
        advice.append({
            "level": "bad",
            "text": f"平均重投影误差 {mean_error:.2f} 像素，明显偏高。"
                    "多半是照片糊、或同一房间混用了不同手机；建议同一房间用同一台手机重新拍一遍",
        })
    elif mean_error > 1.5:
        advice.append({
            "level": "warn",
            "text": f"平均重投影误差 {mean_error:.2f} 像素偏高（低于 1 像素最好），"
                    "注意放慢移动速度、避免行走中拍摄",
        })

    worst = report.get("worst_images") or []
    bad_ones = [item for item in worst if (item.get("error") or 0) > 4.0]
    if bad_ones:
        names = "、".join(item["name"] for item in bad_ones[:4])
        advice.append({
            "level": "warn",
            "text": f"这几张照片误差最大：{names}，建议检查是否模糊或过曝后重拍",
        })

    if report.get("can_reconstruct") and not advice:
        advice.append({
            "level": "good",
            "text": "照片在几何上能拼成一片、误差正常，没有发现需要补拍的地方",
        })
    if not report.get("can_reconstruct"):
        advice.append({
            "level": "bad",
            "text": "这组照片目前无法解算出可用的重建结果，建议按上面的提示整体重拍一遍",
        })
    return advice


def _verdict(*, ratio: float, components: list[dict], points3d: int, score: int) -> tuple[bool, str]:
    can_reconstruct = ratio >= 0.6 and points3d >= 100 and len(components) >= 1
    if not can_reconstruct:
        return False, "failed"
    if score >= 75 and len(components) == 1 and ratio >= 0.85:
        return True, "ok"
    return True, "risky"


# ------------------------------------------------------------------ solving

def _prepare_images(photos: list[Photo], target_dir: Path) -> tuple[int, list[str]]:
    """Hard-link the readable photos into `target_dir`, transcoding the rest.

    Returns (number prepared, skipped file names). HEIC and friends have to become
    JPEG — COLMAP cannot read them at all.
    """
    target_dir.mkdir(parents=True, exist_ok=True)
    prepared = 0
    skipped: list[str] = []
    for index, photo in enumerate(photos, start=1):
        try:
            source = storage.resolve(photo.stored_path)
        except Exception:
            skipped.append(photo.original_filename)
            continue
        if not source.exists():
            skipped.append(photo.original_filename)
            continue
        if source.suffix.lower() in (".jpg", ".jpeg"):
            target = target_dir / f"{index:05d}.jpg"
            try:
                os.link(source, target)
                prepared += 1
                continue
            except OSError:
                # Different volume, or no hard-link support: fall through to a copy.
                try:
                    shutil.copyfile(source, target)
                    prepared += 1
                    continue
                except OSError:
                    skipped.append(photo.original_filename)
                    continue
        target = target_dir / f"{index:05d}.jpg"
        try:
            from PIL import Image

            with Image.open(source) as image:
                image.convert("RGB").save(target, "JPEG", quality=95)
            prepared += 1
        except Exception:
            skipped.append(photo.original_filename)
    return prepared, skipped


def _commands(work: Path) -> list[list[str]]:
    colmap = config.COLMAP_BIN
    database = work / "database.db"
    images = work / "images"
    sparse = work / "sparse"
    resize = str(config.RECON_MAX_IMAGE_SIZE or config.TRAINING_DEFAULTS["image_resize"])
    gpu = _gpu_flag()
    return [
        [colmap, "feature_extractor",
         "--database_path", str(database),
         "--image_path", str(images),
         "--ImageReader.single_camera_per_folder", "1",
         "--SiftExtraction.max_image_size", resize,
         "--SiftExtraction.use_gpu", gpu],
        # A room is tens to a couple of hundred photos: exhaustive matching is
        # affordable here and finds the pairs sequential matching misses (e.g.
        # shooting the same wall from both ends).
        [colmap, "exhaustive_matcher",
         "--database_path", str(database),
         "--SiftMatching.use_gpu", gpu],
        [colmap, "mapper",
         "--database_path", str(database),
         "--image_path", str(images),
         "--output_path", str(sparse)],
    ]


def _run_stage(
    command: list[str],
    log: list[str],
    *,
    total_images: int,
    on_progress,
) -> int:
    """Run one COLMAP stage, reporting progress while it works.

    Output is pumped from a reader thread so the timeout can still fire: iterating
    `proc.stdout` directly blocks until the process ends, which would make the
    timeout useless.
    """
    tool = command[1]
    _, start, end = STAGES.get(tool, ("", 0.0, 100.0))
    pattern = _PROGRESS_PATTERNS.get(tool)
    on_progress(start, STAGES.get(tool, ("", 0.0, 0.0))[0])
    log.append("$ " + " ".join(command))

    creationflags = 0
    if os.name == "nt":
        creationflags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
    proc = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
        creationflags=creationflags,
    )

    lines: list[str] = []
    reader = threading.Thread(target=lambda: [lines.append(line.rstrip()) for line in proc.stdout],
                              daemon=True)
    reader.start()

    deadline = time.time() + config.RECON_TIMEOUT_S
    seen = 0
    try:
        while proc.poll() is None:
            if time.time() > deadline:
                proc.kill()
                proc.wait()
                raise subprocess.TimeoutExpired(command, config.RECON_TIMEOUT_S)
            if len(lines) > seen:
                for line in lines[seen:]:
                    if pattern is not None:
                        match = pattern.search(line)
                        if match:
                            done = int(match.group(1))
                            total = int(match.group(2)) if match.lastindex and match.lastindex > 1 else total_images
                            if total > 0:
                                fraction = min(done / total, 1.0)
                                on_progress(start + (end - start) * fraction, STAGES.get(tool, ("", 0.0, 0.0))[0])
                seen = len(lines)
            time.sleep(0.35)
    finally:
        reader.join(timeout=2.0)

    for line in lines[seen:]:
        if pattern is not None:
            match = pattern.search(line)
            if match:
                done = int(match.group(1))
                total = int(match.group(2)) if match.lastindex and match.lastindex > 1 else total_images
                if total > 0:
                    on_progress(start + (end - start) * min(done / total, 1.0),
                                STAGES.get(tool, ("", 0.0, 0.0))[0])

    log.extend(lines[-14:])
    on_progress(end, STAGES.get(tool, ("", 0.0, 0.0))[0])
    return proc.returncode


def _read_models(sparse: Path) -> list[dict]:
    """Every model COLMAP produced is a connected block of photos."""
    models: list[dict] = []
    if not sparse.exists():
        return models
    for folder in sorted(path for path in sparse.iterdir() if path.is_dir()):
        images_file = folder / "images.txt"
        points_file = folder / "points3D.txt"
        if not images_file.exists():
            continue
        registered = parse_images(images_file)
        points3d, means, observations = parse_points3d(points_file) if points_file.exists() else (0, {}, {})
        errors = [means[image_id] for image_id in registered if image_id in means]
        mean_error = sum(errors) / len(errors) if errors else 0.0
        models.append({
            "model": folder.name,
            "images": len(registered),
            "points3d": points3d,
            "mean_error_px": round(mean_error, 3),
            "names": list(registered.values()),
            "image_ids": {name: image_id for image_id, name in registered.items()},
            "errors": {registered[image_id]: means[image_id] for image_id in registered if image_id in means},
            "observations": {registered[image_id]: observations[image_id] for image_id in registered if image_id in observations},
        })
    return models


def _mock_report(image_names: list[str], *, note: str) -> dict:
    """A plausible report for demos and for machines without COLMAP.

    Clearly marked `mock: true` so nobody mistakes it for a measurement.
    """
    total = len(image_names)
    registered = max(total - max(1, total // 12), 1) if total else 0
    unregistered = image_names[registered:]
    report = {
        "generated_at": utcnow().isoformat() + "Z",
        "mock": True,
        "note": note,
        "images": total,
        "registered": registered,
        "registered_ratio": round(registered / total, 3) if total else 0.0,
        "components": [{"model": "0", "images": registered, "points3d": registered * 180,
                        "mean_error_px": 0.87}] if registered else [],
        "points3d": registered * 180,
        "mean_error_px": 0.87,
        "median_error_px": 0.79,
        "worst_images": [{"name": name, "error": round(1.4 + index * 0.6, 2)}
                         for index, name in enumerate(image_names[:3])],
        "unregistered_images": list(unregistered),
        "skipped_images": [],
        "elapsed_s": 0.0,
        "log_tail": ["mock 模式：未实际调用 COLMAP"],
    }
    score, checks = score_report(ratio=report["registered_ratio"], components=report["components"],
                                 mean_error=report["mean_error_px"])
    can_reconstruct, verdict = _verdict(ratio=report["registered_ratio"], components=report["components"],
                                        points3d=report["points3d"], score=score)
    report["score"] = score
    report["checks"] = checks
    report["can_reconstruct"] = can_reconstruct
    report["verdict"] = verdict
    report["suggestions"] = build_suggestions(report)
    return report


def solve_now(db: OrmSession, checkpoint: Checkpoint, *, on_progress=None) -> dict:
    """Run one trial solve synchronously and return the report (never raises).

    `on_progress(percent, stage)` is called as the stages advance; the queue turns
    it into the progress bar the console polls.
    """
    photos = list(db.scalars(
        select(Photo)
        .where(Photo.checkpoint_id == checkpoint.id, Photo.status.notin_(_SKIPPED_STATUSES))
        .order_by(Photo.id)
    ))
    image_names = [photo.original_filename for photo in photos]
    task = db.get(Task, checkpoint.task_id)
    work = recon_dir(task, checkpoint) if task is not None else (
        config.DATA_DIR / "recon" / f"checkpoint-{checkpoint.id}"
    )
    started = time.time()

    def report_progress(percent: float, stage: str) -> None:
        if on_progress is not None:
            on_progress(percent, stage)

    if len(photos) < config.RECON_MIN_PHOTOS:
        report_progress(100.0, "skip")
        report = {
            "generated_at": utcnow().isoformat() + "Z",
            "mock": False,
            "images": len(photos),
            "registered": 0,
            "registered_ratio": 0.0,
            "components": [],
            "points3d": 0,
            "mean_error_px": 0.0,
            "median_error_px": 0.0,
            "worst_images": [],
            "unregistered_images": image_names,
            "skipped_images": [],
            "elapsed_s": round(time.time() - started, 2),
            "log_tail": [f"照片不足（{len(photos)} < {config.RECON_MIN_PHOTOS}），没有调用 COLMAP"],
            "note": f"只有 {len(photos)} 张可解算的照片，少于 {config.RECON_MIN_PHOTOS} 张不做试解算",
            "work_dir": str(work),
        }
        report["score"] = 1
        report["checks"] = []
        report["can_reconstruct"] = False
        report["verdict"] = "failed"
        report["suggestions"] = build_suggestions(report, shot_count=checkpoint.shot_count)
        return report

    if mock_mode():
        report_progress(100.0, "mock")
        report = _mock_report(image_names, note="THREEDGS_RECON_MODE=mock 或未安装 COLMAP：这是模拟结果，不是真实解算")
        report["work_dir"] = str(work)
        report["suggestions"] = build_suggestions(report, shot_count=checkpoint.shot_count)
        return report

    # Start from a clean directory, but never wipe the *other* checkpoints' results.
    shutil.rmtree(work, ignore_errors=True)
    log: list[str] = []
    try:
        report_progress(1.0, "prepare")
        prepared, skipped = _prepare_images(photos, work / "images")
        if prepared < config.RECON_MIN_PHOTOS:
            raise RuntimeError(f"只有 {prepared} 张照片能交给 COLMAP（跳过了 {len(skipped)} 张）")
        for command in _commands(work):
            code = _run_stage(command, log, total_images=prepared, on_progress=report_progress)
            # feature_extractor and matcher return non-zero on partial failures
            # that still leave a usable database; only the mapper is decisive.
            if code != 0 and command[1] == "mapper":
                raise RuntimeError(f"COLMAP {command[1]} 失败（退出码 {code}）")
        models = _read_models(work / "sparse")
        if not models:
            raise RuntimeError("COLMAP 没有产出任何重建模型（照片之间没找到足够的共同特征）")

        models.sort(key=lambda model: model["images"], reverse=True)
        best = models[0]
        all_errors = sorted(best["errors"].items(), key=lambda item: item[1], reverse=True)
        registered_names = set(best["names"])
        unregistered = [name for name in image_names if name not in registered_names]
        errors = [error for _, error in all_errors]
        report = {
            "generated_at": utcnow().isoformat() + "Z",
            "mock": False,
            "images": prepared,
            "registered": best["images"],
            "registered_ratio": round(best["images"] / max(prepared, 1), 3),
            "components": [{"model": model["model"], "images": model["images"],
                            "points3d": model["points3d"], "mean_error_px": model["mean_error_px"]}
                           for model in models],
            "points3d": best["points3d"],
            "mean_error_px": best["mean_error_px"],
            "median_error_px": round(errors[len(errors) // 2], 3) if errors else 0.0,
            "worst_images": [{"name": name, "error": round(error, 2)} for name, error in all_errors[:8]],
            "unregistered_images": unregistered[:40],
            "skipped_images": skipped[:20],
            "elapsed_s": round(time.time() - started, 2),
            "log_tail": log[-20:],
            "work_dir": str(work),
        }
        score, checks = score_report(ratio=report["registered_ratio"], components=report["components"],
                                     mean_error=report["mean_error_px"])
        can_reconstruct, verdict = _verdict(ratio=report["registered_ratio"], components=report["components"],
                                            points3d=report["points3d"], score=score)
        report["score"] = score
        report["checks"] = checks
        report["can_reconstruct"] = can_reconstruct
        report["verdict"] = verdict
        report["suggestions"] = build_suggestions(report, shot_count=checkpoint.shot_count)
        report_progress(100.0, "done")
        return report
    except subprocess.TimeoutExpired:
        return _failure_report(image_names, started, log + [f"超过 {config.RECON_TIMEOUT_S} 秒仍未完成，已中止"], work)
    except Exception as exc:  # noqa: BLE001 - the report has to come back, not blow up
        return _failure_report(image_names, started, log + [str(exc)], work)


def _failure_report(image_names: list[str], started: float, log: list[str], work: Path) -> dict:
    report = {
        "generated_at": utcnow().isoformat() + "Z",
        "mock": False,
        "images": len(image_names),
        "registered": 0,
        "registered_ratio": 0.0,
        "components": [],
        "points3d": 0,
        "mean_error_px": 0.0,
        "median_error_px": 0.0,
        "worst_images": [],
        "unregistered_images": image_names[:40],
        "skipped_images": [],
        "elapsed_s": round(time.time() - started, 2),
        "log_tail": log[-20:],
        "note": "试解算未能完成",
        # The directory is kept on purpose: "why did it fail" gets asked later.
        "work_dir": str(work),
    }
    report["score"] = 1
    report["checks"] = []
    report["can_reconstruct"] = False
    report["verdict"] = "failed"
    report["suggestions"] = [{
        "level": "bad",
        "text": "试解算没有跑出结果：照片之间没能建立足够的共同特征。"
                "请先确认这一组照片确实覆盖了同一个连通空间，并补拍重叠不足的地方后重试",
    }]
    return report


# ------------------------------------------------------------------ queue


class SolveQueue:
    """One trial solve at a time, in a background thread."""

    def __init__(self) -> None:
        self._queue: list[int] = []
        self._lock = threading.RLock()
        self._wake = threading.Condition(self._lock)
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()

    # ------------------------------------------------------------ lifecycle
    def start(self) -> None:
        with self._lock:
            if self._thread and self._thread.is_alive():
                return
            self._stop.clear()
            self._thread = threading.Thread(target=self._loop, name="recon-solve", daemon=True)
            self._thread.start()

    def shutdown(self) -> None:
        self._stop.set()
        with self._wake:
            self._wake.notify_all()

    # ------------------------------------------------------------ submitting
    def submit(self, checkpoint_id: int) -> None:
        with self._lock:
            if checkpoint_id not in self._queue:
                self._queue.append(checkpoint_id)
        self.start()
        with self._wake:
            self._wake.notify_all()

    @property
    def pending(self) -> int:
        with self._lock:
            return len(self._queue)

    def drain(self, timeout: float = 60.0) -> bool:
        """Wait until the queue is empty (tests and the shutdown path)."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            if self.pending == 0:
                return True
            time.sleep(0.05)
        return self.pending == 0

    def running_ids(self) -> list[int]:
        """Which checkpoints are being solved right now (训练前的资源提示用)."""
        with SessionLocal() as db:
            return list(db.scalars(select(Checkpoint.id).where(
                Checkpoint.solve_status.in_((SOLVE_RUNNING, SOLVE_QUEUED))
            )))

    def requeue_stale(self) -> int:
        """Rows left in `running` by a restart go back to `failed` with a reason."""
        with SessionLocal() as db:
            rows = list(db.scalars(select(Checkpoint).where(Checkpoint.solve_status == SOLVE_RUNNING)))
            for row in rows:
                row.solve_status = SOLVE_FAILED
                row.solve_error = "服务重启，这次试解算被中断，请重新发起"
                row.solve_progress = 0
                row.solve_stage = None
                row.solve_eta_s = None
                row.solve_finished_at = utcnow()
            if rows:
                db.commit()
            return len(rows)

    # ------------------------------------------------------------ worker
    def _loop(self) -> None:
        while not self._stop.is_set():
            with self._wake:
                while not self._queue and not self._stop.is_set():
                    self._wake.wait(timeout=1.0)
                if self._stop.is_set():
                    return
                checkpoint_id = self._queue.pop(0)
            try:
                self._run_one(checkpoint_id)
            except Exception:  # noqa: BLE001 - a bad checkpoint must not kill the worker
                continue

    def _run_one(self, checkpoint_id: int) -> None:
        with SessionLocal() as db:
            checkpoint = db.get(Checkpoint, checkpoint_id)
            if checkpoint is None:
                return
            checkpoint.solve_status = SOLVE_RUNNING
            checkpoint.solve_error = None
            checkpoint.solve_progress = 1
            checkpoint.solve_stage = "prepare"
            checkpoint.solve_eta_s = None
            checkpoint.solve_started_at = utcnow()
            db.commit()
            started_at = checkpoint.solve_started_at

            # Progress arrives from the COLMAP reader thread; SQLite is not built
            # for hundreds of tiny writes, so only the latest value every couple of
            # seconds reaches the table (the console polls at that pace anyway).
            state = {"percent": 1.0, "stage": "prepare", "written": 0.0}

            def on_progress(percent: float, stage: str) -> None:
                state["percent"] = max(state["percent"], min(100.0, percent))
                state["stage"] = stage or state["stage"]
                now = time.time()
                if now - state["written"] < 2.0:
                    return
                state["written"] = now
                self._write_progress(checkpoint_id, state["percent"], state["stage"], started_at)

            report = solve_now(db, checkpoint, on_progress=on_progress)

        with SessionLocal() as db:
            checkpoint = db.get(Checkpoint, checkpoint_id)
            if checkpoint is None:
                return
            checkpoint.solve_report = report
            checkpoint.solve_status = SOLVE_DONE if report.get("verdict") else SOLVE_FAILED
            checkpoint.solve_error = None if report.get("verdict") else report.get("note")
            checkpoint.solve_finished_at = utcnow()
            checkpoint.solve_progress = 100
            checkpoint.solve_stage = "done" if report.get("verdict") else "failed"
            checkpoint.solve_eta_s = None
            db.commit()

    def _write_progress(self, checkpoint_id: int, percent: float, stage: str,
                        started_at: datetime | None) -> None:
        try:
            with SessionLocal() as db:
                row = db.get(Checkpoint, checkpoint_id)
                if row is None or row.solve_status != SOLVE_RUNNING:
                    return
                row.solve_progress = int(round(max(0.0, min(100.0, percent))))
                row.solve_stage = stage
                row.solve_eta_s = estimate_remaining(percent, started_at or row.solve_started_at)
                db.commit()
        except Exception:  # noqa: BLE001 - progress must never break the solve
            return


queue = SolveQueue()
