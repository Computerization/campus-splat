"""Reconstruction job orchestration (docs/training-pipeline.md).

A run is a *pipeline*, not a single tool call:

    prepare -> sfm (one COLMAP per scope) -> split (one block per room)
    -> train (one 3DGS per block, sharing the SfM poses) -> merge -> align
    -> export

This module owns the queue, the plan (which photos belong to which block, see
``build_block_plan``) and the progress bookkeeping. The actual reconstruction
lives in backend/scripts/run_training.py, which reports progress on stdout with
a fixed prefix:

    [THREEDGS] {"stage": "sfm_matching", "progress": 22.5, "message": "..."}
    [THREEDGS] {"stage": "train", "block": {"key": "b001", "status": "running"}}

so any toolchain can be plugged in without touching the backend.
"""

from __future__ import annotations

import json
import os
import shlex
import shutil
import subprocess
import sys
import threading
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session as OrmSession

from PIL import Image

from .. import config
from ..database import SessionLocal
from ..models import Checkpoint, Photo, Task, TrainingBlock, TrainingRun, utcnow
from . import naming, splat, toolchain
from .stats import USABLE_STATUSES

PROGRESS_PREFIX = "[THREEDGS]"

TERMINAL_STATUSES = ("succeeded", "failed", "cancelled")

BLOCK_TERMINAL_STATUSES = ("succeeded", "failed", "skipped", "cancelled")


@dataclass
class PlannedBlock:
    """One training chunk, before it is written to the database."""

    key: str
    name: str
    checkpoint_id: int | None
    part_index: int
    part_total: int
    photos: list[Photo] = field(default_factory=list)


# ---------------------------------------------------------------- planning


def collect_usable_photos(db: OrmSession, task_id: int | None) -> list[tuple[Photo, str | None]]:
    """Usable photos (plus their checkpoint name), ordered for block planning.

    Ordering is by checkpoint first — the checkpoint order the admin arranged,
    unassigned photos last — so a block never mixes two rooms.
    """
    query = (
        select(Photo, Checkpoint.name, Checkpoint.order_index)
        .outerjoin(Checkpoint, Photo.checkpoint_id == Checkpoint.id)
        .where(
            Photo.status.in_(USABLE_STATUSES),
            Photo.duplicate_of.is_(None),
        )
        .order_by(
            func.coalesce(Checkpoint.order_index, 10**6),
            Photo.uploaded_at,
            Photo.id,
        )
    )
    if task_id is not None:
        query = query.where(Photo.task_id == task_id)
    return [(photo, name) for photo, name, _ in db.execute(query).all()]


def build_block_plan(
    rows: list[tuple[Photo, str | None]],
    block_max_photos: int,
) -> list[PlannedBlock]:
    """Cut the photos of one scope into blocks.

    One block per checkpoint (room / corridor / stairwell), and any checkpoint
    bigger than ``block_max_photos`` is split further — a single block is a
    single 3DGS run, so this is the knob that keeps it inside VRAM.
    """
    limit = max(20, int(block_max_photos or config.TRAINING_DEFAULTS["block_max_photos"]))

    grouped: dict[int | None, list[Photo]] = {}
    names: dict[int | None, str | None] = {}
    order: list[int | None] = []
    for photo, checkpoint_name in rows:
        key = photo.checkpoint_id
        if key not in grouped:
            grouped[key] = []
            names[key] = checkpoint_name
            order.append(key)
        grouped[key].append(photo)

    blocks: list[PlannedBlock] = []
    for checkpoint_id in order:
        photos = grouped[checkpoint_id]
        label = names[checkpoint_id] or (
            f"任务 {photos[0].task_id} 未分配点位的照片" if photos else "未分配点位的照片"
        )
        part_total = max(1, -(-len(photos) // limit))
        for part_index in range(part_total):
            chunk = photos[part_index * limit : (part_index + 1) * limit]
            if not chunk:
                continue
            name = label if part_total == 1 else f"{label}（{part_index + 1}/{part_total}）"
            blocks.append(
                PlannedBlock(
                    key=f"b{len(blocks):03d}",
                    name=name[:160],
                    checkpoint_id=checkpoint_id,
                    part_index=part_index,
                    part_total=part_total,
                    photos=chunk,
                )
            )
    return blocks


def normalize_params(params: dict | None) -> dict:
    """Merge user parameters over the configured defaults (unknown keys dropped)."""
    merged = dict(config.TRAINING_DEFAULTS)
    for key, value in (params or {}).items():
        if key in merged and value is not None:
            merged[key] = value
    return merged


def preflight(
    db: OrmSession,
    *,
    task_id: int,
    block_max_photos: int,
    params: dict | None = None,
) -> dict:
    """What the admin sees *before* committing to a run.

    ``params`` is the parameter set the admin currently has on screen, so the
    warnings can be about *that* toolchain / downsampling factor rather than
    about the defaults.
    """
    task = db.get(Task, task_id)
    if task is None:
        raise ValueError("任务不存在")

    merged = normalize_params(params)
    chain = toolchain.normalize_toolchain(merged["toolchain"])
    template = toolchain.template_for(chain)
    command_warnings = toolchain.diagnose(
        template,
        toolchain=chain,
        iterations=merged["iterations"],
        data_factor=merged["data_factor"],
        mode=toolchain.training_mode(),
    )

    rows = collect_usable_photos(db, task_id)
    blocks = build_block_plan(rows, block_max_photos)
    with_gps = sum(
        1 for photo, _ in rows if photo.gps_lat is not None and photo.gps_lng is not None
    )
    # Uploads are judged in the background, so a run started right after a
    # volunteer's batch would silently leave those photos out of the block plan.
    checking = db.execute(
        select(func.count(Photo.id)).where(
            Photo.task_id == task_id, Photo.status == "checking"
        )
    ).scalar_one()
    largest = max((len(block.photos) for block in blocks), default=0)
    budget = config.TRAINING_GAUSSIANS_PER_GB * config.TRAINING_VRAM_GB

    warnings: list[str] = []
    if not rows:
        warnings.append("这个任务还没有可用的照片，先让志愿者多拍一些")
    if checking:
        warnings.append(
            f"还有 {checking} 张照片在后台质检，这次重建用不到它们 —— "
            "等十几秒再发起，或者先到「照片审阅」看结果"
        )
    if task.kind == "outdoor" and with_gps == 0:
        warnings.append("室外任务没有带 GPS 的照片，RTK 对齐会被跳过，各栋楼之间不会自动对齐")
    if task.kind == "indoor" and with_gps == 0:
        warnings.append(
            "室内照片没有 GPS 是正常的。室内 → 室外这一步平台不会自动完成："
            "两次 COLMAP 之间没有共同特征，需要在 3D 预览里人工摆放（或用 ≥3 对控制点解相似变换）"
        )
    if largest:
        estimate = splat.gaussian_estimate(largest)
        if estimate > budget:
            warnings.append(
                f"最大的块有 {largest} 张照片，估算约 {estimate / 1e6:.1f}M 高斯，"
                f"超过 {config.TRAINING_VRAM_GB:.0f}GB 显存的容量（约 {budget / 1e6:.0f}M）："
                + _vram_advice(chain, int(merged["data_factor"]))
            )
    if len(blocks) > 12:
        warnings.append(f"这个任务会切成 {len(blocks)} 个块，训练时间会按块数线性增长")

    return {
        "task_id": task.id,
        "task_name": task.name,
        "kind": task.kind,
        "photo_count": len(rows),
        "gps_photos": with_gps,
        "block_max_photos": block_max_photos,
        "blocks": [
            {
                "key": block.key,
                "name": block.name,
                "checkpoint_id": block.checkpoint_id,
                "part_index": block.part_index,
                "part_total": block.part_total,
                "photo_count": len(block.photos),
            }
            for block in blocks
        ],
        "estimated_gaussians_per_block": splat.gaussian_estimate(largest) if largest else 0,
        "gaussian_budget": budget,
        "warnings": warnings,
        "toolchain": chain,
        "toolchain_env_var": toolchain.env_var(chain),
        "command_configured": bool(template),
        "command_program": toolchain.program(template),
        "command_program_available": (
            toolchain.program_available(template) if template else None
        ),
        "command_warnings": command_warnings,
    }


def _vram_advice(chain: str, data_factor: int) -> str:
    """The doc's "如果 OOM，按这个顺序处理" list, tailored per toolchain."""
    if chain == "gsplat" and data_factor == 1:
        return "先用 gsplat 的图像降采样（--data_factor 2 或 4）再考虑降分辨率，最后才缩块"
    if chain == "gsplat":
        return f"已经降采样 {data_factor} 倍，再不够就把「单块照片上限」调小，或用更小的训练分辨率"
    return "把「单块照片上限」调小、降训练分辨率，或改用 gsplat（显存约为原版的 1/5）"


# ---------------------------------------------------------------- run creation


def create_run(
    db: OrmSession,
    *,
    task_id: int | None,
    name: str | None,
    params: dict | None,
    created_by: str | None,
    retry_block: TrainingBlock | None = None,
) -> TrainingRun:
    """Queue a run and freeze its block plan.

    ``retry_block`` re-queues a single block of an earlier run: the new run
    contains just that block and reuses the earlier run's SfM model instead of
    recomputing the poses for the whole building.
    """
    task = db.get(Task, task_id) if task_id else None
    if task_id and task is None:
        raise ValueError("任务不存在")

    merged = normalize_params(params)
    rows = collect_usable_photos(db, task_id)
    if not rows:
        raise ValueError("这个任务还没有可用的照片，先让志愿者多拍一些")
    blocks = build_block_plan(rows, merged["block_max_photos"])

    reuse_run_id = None
    if retry_block is not None:
        matches = [
            block
            for block in blocks
            if block.checkpoint_id == retry_block.checkpoint_id
            and block.part_index == retry_block.part_index
            and block.part_total == retry_block.part_total
        ]
        if not matches:
            raise ValueError("找不到要重试的训练块，可能是照片已被改动，请重新整栋重建")
        block = matches[0]
        block.key = retry_block.key
        block.name = retry_block.name
        blocks = [block]
        reuse_run_id = retry_block.run_id

    default_name = f"{task.name} 重建" if task else "全局重建"
    if retry_block is not None:
        default_name = f"{retry_block.name} 重试"

    run = TrainingRun(
        task_id=task_id,
        name=(name or default_name)[:128],
        status="queued",
        stage="queued",
        progress=0.0,
        message=(
            f"已排队，复用 #{reuse_run_id} 的位姿，只重跑 {len(blocks)} 个训练块"
            if reuse_run_id
            else f"已排队，等待算力机空闲（{len(blocks)} 个训练块）"
        ),
        params=merged,
        photo_count=sum(len(block.photos) for block in blocks),
        scope_kind=(task.kind if task else "mixed"),
        block_total=len(blocks),
        block_done=0,
        artifacts=[],
        reuse_run_id=reuse_run_id,
        created_by=created_by,
    )
    db.add(run)
    db.flush()

    for index, block in enumerate(blocks):
        db.add(
            TrainingBlock(
                run_id=run.id,
                checkpoint_id=block.checkpoint_id,
                order_index=index,
                key=block.key,
                name=block.name,
                part_index=block.part_index,
                part_total=block.part_total,
                photo_count=len(block.photos),
                photo_ids=[photo.id for photo in block.photos],
                status="queued",
                progress=0.0,
            )
        )

    db.commit()
    db.refresh(run)
    return run


def retry_block(db: OrmSession, block: TrainingBlock, *, created_by: str | None) -> TrainingRun:
    run = db.get(TrainingRun, block.run_id)
    if run is None:
        raise ValueError("训练任务不存在")
    if block.status not in ("failed", "skipped"):
        raise ValueError("只有失败的训练块需要重试")
    return create_run(
        db,
        task_id=run.task_id,
        name=None,
        params=run.params,
        created_by=created_by,
        retry_block=block,
    )


# ---------------------------------------------------------------- input prep
#
# Photos are grouped into one folder per device (and image size) so COLMAP can
# give each group its own intrinsics (--ImageReader.single_camera_per_folder),
# and anything COLMAP cannot read — HEIC above all — is transcoded to JPEG before
# the pipeline starts.

JPEG_QUALITY = 95


def camera_group(photo: Photo) -> str:
    """Input folder for one camera: device model plus image size.

    Same device *and* same resolution share one camera model — that is exactly
    the condition under which COLMAP may share intrinsics at all.
    """
    model = naming.normalize(photo.camera_model, fallback="UnknownCamera", max_length=24)
    if photo.width and photo.height:
        return f"{model}_{photo.width}x{photo.height}"
    return model


def input_photo_name(photo: Photo, index: int) -> str:
    """Relative name inside the run's input directory (always ``.jpg``)."""
    return f"{camera_group(photo)}/{index:06d}.jpg"


def transcode_to_jpeg(src: Path, dest: Path, *, quality: int = JPEG_QUALITY) -> None:
    """Re-encode a photo COLMAP cannot read (HEIC, PNG, TIFF, …) as JPEG.

    The EXIF blob is copied verbatim — the outdoor RTK alignment reads the GPS
    tags out of it — and the pixels are stored as they are, so the orientation tag
    keeps matching the image.
    """
    with Image.open(src) as raw:
        exif = raw.info.get("exif")
        image = raw.convert("RGB")
        if exif:
            try:
                image.save(dest, format="JPEG", quality=quality, optimize=True, exif=exif)
                return
            except Exception:  # noqa: BLE001 - a broken EXIF blob must not lose the photo
                pass
        image.save(dest, format="JPEG", quality=quality, optimize=True)


# ---------------------------------------------------------------- manager


class TrainingManager:
    """Singleton; the dispatcher thread starts lazily on first use."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._procs: dict[int, subprocess.Popen] = {}
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    # ------------------------------------------------------------ lifecycle

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._recover_stale_runs()
        self._stop.clear()
        self._thread = threading.Thread(target=self._loop, name="training-dispatcher", daemon=True)
        self._thread.start()

    def _recover_stale_runs(self) -> None:
        """Clear out "running" records left behind by a previous shutdown.

        A restart loses track of the training subprocesses, but the rows still
        say running — so the admin console would show a job that is stuck
        forever and can't be re-queued.
        """
        with SessionLocal() as db:
            stale = (
                db.execute(
                    select(TrainingRun).where(TrainingRun.status.in_(("running", "queued")))
                )
                .scalars()
                .all()
            )
            if not stale:
                return
            for run in stale:
                if run.status == "queued":
                    continue  # queued runs are picked up again by the dispatcher
                run.status = "failed"
                run.stage = "failed"
                run.message = "后端服务重启，这次训练已中断（可以重新发起）"
                run.finished_at = utcnow()
                for block in run.blocks:
                    if block.status not in BLOCK_TERMINAL_STATUSES:
                        block.status = "failed"
                        block.stage = "failed"
                        block.message = "后端服务重启，训练中断"
                        block.finished_at = utcnow()
            db.commit()

    def shutdown(self) -> None:
        self._stop.set()
        with self._lock:
            procs = list(self._procs.values())
        for proc in procs:
            if proc.poll() is None:
                proc.terminate()

    def is_running(self, run_id: int) -> bool:
        proc = self._procs.get(run_id)
        return proc is not None and proc.poll() is None

    # ------------------------------------------------------------ dispatch

    def _loop(self) -> None:
        while not self._stop.wait(2.0):
            try:
                self._tick()
            except Exception:  # the dispatcher thread must never die
                continue

    def _tick(self) -> None:
        with self._lock:
            self._procs = {k: v for k, v in self._procs.items() if v.poll() is None}
            running = len(self._procs)
        if running >= config.TRAINING_MAX_CONCURRENT:
            return

        with SessionLocal() as db:
            run = db.execute(
                select(TrainingRun)
                .where(TrainingRun.status == "queued")
                .order_by(TrainingRun.created_at.asc())
            ).scalars().first()
            if run is None:
                return
            run_id = run.id
        try:
            self._launch(run_id)
        except Exception as exc:
            with SessionLocal() as db:
                failed = db.get(TrainingRun, run_id)
                if failed is not None:
                    failed.status = "failed"
                    failed.stage = "failed"
                    failed.message = f"启动失败：{exc}"
                    failed.finished_at = utcnow()
                    for block in failed.blocks:
                        if block.status not in BLOCK_TERMINAL_STATUSES:
                            block.status = "failed"
                            block.message = "训练进程启动失败"
                    db.commit()

    # ------------------------------------------------------------ launch

    @staticmethod
    def _work_dir(db: OrmSession, run: TrainingRun) -> Path:
        """``data/training/<task folder>/<timestamp>`` for this run.

        One folder per *run*, under the task it belongs to, so a glance at the
        directory tells you which building it is — and two runs of the same task
        never overwrite each other (the second one within the same minute gets
        ``-2``). The name is only decided here, once: the path is stored on the
        run and everything later (delete, retry, preview) reads it back.
        """
        folder = "Global"
        if run.task_id:
            task = db.get(Task, run.task_id)
            if task is not None:
                folder = task.folder or naming.normalize(task.name, fallback=f"Task{task.id}")
        # Local time on purpose: the folder should read like the clock on the wall
        stamp = datetime.now().strftime("%Y%m%d-%H%M")
        candidate = config.TRAINING_DIR / folder / stamp
        suffix = 2
        while candidate.exists():
            candidate = config.TRAINING_DIR / folder / f"{stamp}-{suffix}"
            suffix += 1
        return candidate

    def _launch(self, run_id: int) -> None:
        config.ensure_dirs()
        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is None or run.status != "queued":
                return

            work_dir = self._work_dir(db, run)
            input_dir = work_dir / "input"
            output_dir = work_dir / "output"
            log_path = config.LOG_DIR / f"training_run{run.id}.log"
            input_dir.mkdir(parents=True, exist_ok=True)
            output_dir.mkdir(parents=True, exist_ok=True)

            blocks = list(run.blocks)
            # The plan maps block -> file name; the files themselves are hard
            # links (or transcoded copies) inside the input directory
            photo_query = select(Photo)
            if run.task_id:
                photo_query = photo_query.where(Photo.task_id == run.task_id)
            photo_by_id = {
                photo.id: photo for photo in db.execute(photo_query).scalars()
            }

            file_names: dict[int, str] = {}
            plan_photos: list[dict] = []
            plan_blocks: list[dict] = []
            for block in blocks:
                names: list[str] = []
                for photo_id in block.photo_ids or []:
                    photo = photo_by_id.get(photo_id)
                    if photo is None:
                        continue  # the photo was deleted after the run was queued
                    name = file_names.get(photo_id)
                    if name is None:
                        name = input_photo_name(photo, len(file_names))
                        file_names[photo_id] = name
                        plan_photos.append(
                            {
                                "id": photo.id,
                                "file": name,
                                "checkpoint_id": photo.checkpoint_id,
                                "lat": photo.gps_lat,
                                "lng": photo.gps_lng,
                                "alt": photo.gps_alt,
                                "captured_at": (
                                    photo.captured_at.isoformat(sep=" ")
                                    if photo.captured_at
                                    else None
                                ),
                            }
                        )
                    names.append(name)
                plan_blocks.append(
                    {
                        "key": block.key,
                        "name": block.name,
                        "checkpoint_id": block.checkpoint_id,
                        "part_index": block.part_index,
                        "part_total": block.part_total,
                        "photos": names,
                    }
                )
                block.photo_count = len(names)
                block.log_path = (
                    output_dir / "logs" / f"{block.key}.log"
                ).relative_to(config.DATA_DIR).as_posix()

            plan = {
                "run_id": run.id,
                "task_id": run.task_id,
                "task_name": (run.task.name if run.task else run.name),
                "kind": run.scope_kind,
                "params": run.params or {},
                "photos": plan_photos,
                "blocks": plan_blocks,
                "reuse_dir": None,
            }
            if run.reuse_run_id:
                # Read the earlier run's directory from the database instead of
                # guessing it from the id: the folder name is whatever it was
                # created as.
                reuse = db.get(TrainingRun, run.reuse_run_id)
                reuse_dir = (
                    config.DATA_DIR / reuse.output_path
                    if reuse is not None and reuse.output_path
                    else None
                )
                plan["reuse_dir"] = (
                    str(reuse_dir) if reuse_dir is not None and reuse_dir.exists() else None
                )

            plan_path = work_dir / "plan.json"
            plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")

            run.status = "running"
            run.stage = "prepare"
            run.progress = 0.0
            run.message = f"准备数据：{len(plan_photos)} 张照片 / {len(plan_blocks)} 个训练块"
            run.photo_count = len(plan_photos)
            run.block_total = len(plan_blocks)
            run.block_done = 0
            run.started_at = utcnow()
            run.log_path = log_path.relative_to(config.DATA_DIR).as_posix()
            run.output_path = output_dir.relative_to(config.DATA_DIR).as_posix()
            for block in blocks:
                block.status = "queued"
                block.progress = 0.0
                block.stage = "queued"
            db.commit()

            rel_paths = [
                (photo, file_names[photo.id])
                for photo in sorted(photo_by_id.values(), key=lambda item: item.id)
                if photo.id in file_names
            ]

        # One directory per device (and image size) under the input directory:
        # COLMAP gets its own intrinsics per folder, and files it cannot read
        # (HEIC, PNG, TIFF, …) are transcoded to JPEG here — the last moment
        # before the trainer sees them.
        prepared = 0
        for photo, name in rel_paths:
            src = config.DATA_DIR / photo.stored_path
            if not src.exists():
                continue
            dest = input_dir / name
            if dest.exists():
                prepared += 1
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                if src.suffix.lower() in (".jpg", ".jpeg"):
                    try:
                        os.link(src, dest)  # instant on the same volume
                    except OSError:
                        shutil.copy2(src, dest)
                else:
                    transcode_to_jpeg(src, dest)
            except OSError:
                continue
            prepared += 1

        command = self._build_command()
        env = os.environ.copy()
        env.update(
            {
                "PYTHONUNBUFFERED": "1",
                "THREEDGS_RUN_ID": str(run_id),
                "THREEDGS_TASK_ID": str(run.task_id) if run.task_id else "",
                "THREEDGS_INPUT_DIR": str(input_dir),
                "THREEDGS_OUTPUT_DIR": str(output_dir),
                "THREEDGS_LOG_FILE": str(log_path),
                "THREEDGS_PHOTO_COUNT": str(prepared),
                "THREEDGS_PARAMS": json.dumps(run.params or {}, ensure_ascii=False),
                "THREEDGS_PLAN_FILE": str(plan_path),
            }
        )

        log_path.parent.mkdir(parents=True, exist_ok=True)
        log_file = log_path.open("a", encoding="utf-8", newline="")
        log_file.write(f"\n===== run #{run_id} 开始 =====\n命令: {' '.join(command)}\n")
        log_file.flush()

        creationflags = 0
        if os.name == "nt":
            creationflags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)

        try:
            proc = subprocess.Popen(
                command,
                cwd=str(config.BASE_DIR / "backend"),
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                creationflags=creationflags,
            )
        except Exception:
            log_file.close()
            raise

        with self._lock:
            self._procs[run_id] = proc

        threading.Thread(
            target=self._reader,
            args=(run_id, proc, log_file),
            name=f"training-reader-{run_id}",
            daemon=True,
        ).start()

        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is not None:
                run.stage = "starting"
                run.message = f"训练进程已启动（{prepared} 张照片）"
                db.commit()

    def _build_command(self) -> list[str]:
        if config.TRAINING_COMMAND.strip():
            return shlex.split(config.TRAINING_COMMAND, posix=os.name != "nt")
        # Ship with the bundled script; THREEDGS_TRAINING_MODE=mock walks the
        # whole pipeline without a GPU.
        return [sys.executable, "scripts/run_training.py"]

    # ------------------------------------------------------------ output parsing

    def _reader(self, run_id: int, proc: subprocess.Popen, log_file) -> None:
        try:
            assert proc.stdout is not None
            for line in proc.stdout:
                log_file.write(line)
                log_file.flush()
                if line.startswith(PROGRESS_PREFIX):
                    self._apply_progress(run_id, line[len(PROGRESS_PREFIX):])
        except Exception as exc:
            log_file.write(f"\n[后端] 读取训练输出失败：{exc}\n")
        finally:
            code = proc.wait()
            log_file.write(f"\n===== run #{run_id} 结束，退出码 {code} =====\n")
            log_file.close()
            self._finalize(run_id, code)

    def _finalize(self, run_id: int, code: int) -> None:
        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is None:
                return
            if run.status == "cancelled":
                run.finished_at = run.finished_at or utcnow()
                for block in run.blocks:
                    if block.status not in BLOCK_TERMINAL_STATUSES:
                        block.status = "cancelled"
                        block.message = "训练已取消"
                        block.finished_at = utcnow()
            else:
                ok = code == 0
                if ok:
                    run.status = "succeeded"
                    run.stage = "finished"
                    run.progress = 100.0
                    run.message = "重建完成"
                else:
                    run.status = "failed"
                    run.stage = "failed"
                    run.message = f"重建过程中有训练块失败（退出码 {code}），详见日志"
                run.finished_at = utcnow()
                for block in run.blocks:
                    if block.status in BLOCK_TERMINAL_STATUSES:
                        continue
                    block.status = "succeeded" if ok else "failed"
                    block.stage = "block_export" if ok else "failed"
                    block.progress = 100.0 if ok else block.progress
                    block.message = "训练进程结束，未收到该块的单独结果"
                    block.finished_at = utcnow()
                run.block_done = sum(
                    1 for block in run.blocks if block.status == "succeeded"
                )
            db.commit()

    def _apply_progress(self, run_id: int, payload: str) -> None:
        try:
            data = json.loads(payload.strip())
        except json.JSONDecodeError:
            return
        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is None:
                return
            if run.status not in TERMINAL_STATUSES:
                if "stage" in data:
                    run.stage = str(data["stage"])[:64]
                if "progress" in data:
                    try:
                        run.progress = max(0.0, min(100.0, float(data["progress"])))
                    except (TypeError, ValueError):
                        pass
                if "message" in data:
                    run.message = str(data["message"])[:500]
                if "output" in data:
                    normalised = self._normalise_path(str(data["output"]))
                    if normalised:
                        run.output_path = normalised[:512]
                if data.get("artifacts"):
                    run.artifacts = self._absolutize_artifacts(run, data["artifacts"])

            block_payload = data.get("block")
            if isinstance(block_payload, dict):
                self._apply_block(run, block_payload)
                run.block_done = sum(
                    1 for block in run.blocks if block.status == "succeeded"
                )
            db.commit()

    @staticmethod
    def _normalise_path(value: str) -> str | None:
        """Store data-dir relative paths, whatever the script reported.

        Older scripts report absolute output directories; anything we can't map
        back onto the data directory is ignored rather than stored as-is.
        """
        text = (value or "").strip()
        if not text:
            return None
        path = Path(text)
        if path.is_absolute():
            try:
                return path.resolve().relative_to(config.DATA_DIR).as_posix()
            except ValueError:
                return None
        return text.replace("\\", "/").lstrip("/")

    def _absolutize_artifacts(self, run: TrainingRun, artifacts: list) -> list[dict]:
        """Turn the script's output-relative paths into data-dir relative ones."""
        prefix = run.output_path or ""
        items: list[dict] = []
        for artifact in artifacts:
            if not isinstance(artifact, dict) or not artifact.get("path"):
                continue
            rel = str(artifact["path"]).replace("\\", "/").lstrip("/")
            item = dict(artifact)
            item["path"] = f"{prefix}/{rel}" if prefix else rel
            items.append(item)
        return items

    def _apply_block(self, run: TrainingRun, payload: dict) -> None:
        key = str(payload.get("key") or "")
        block = next((item for item in run.blocks if item.key == key), None)
        if block is None:
            return
        status = payload.get("status")
        if status == "running" and block.started_at is None:
            block.started_at = utcnow()
        if "stage" in payload:
            block.stage = str(payload["stage"])[:64]
        if "progress" in payload:
            try:
                block.progress = max(0.0, min(100.0, float(payload["progress"])))
            except (TypeError, ValueError):
                pass
        if payload.get("message"):
            block.message = str(payload["message"])[:500]
        if payload.get("error"):
            block.message = str(payload["error"])[:500]
        if payload.get("output"):
            rel = str(payload["output"]).replace("\\", "/").lstrip("/")
            prefix = run.output_path or ""
            block.output_path = f"{prefix}/{rel}" if prefix else rel
        if "gaussians" in payload:
            metrics = dict(block.metrics or {})
            metrics["gaussians"] = int(payload.get("gaussians") or 0)
            if payload.get("size_bytes"):
                metrics["size_bytes"] = int(payload["size_bytes"])
            block.metrics = metrics
        if status in BLOCK_TERMINAL_STATUSES:
            block.status = status
            block.finished_at = utcnow()
            if status == "succeeded":
                block.progress = 100.0

    # ------------------------------------------------------------ cancel

    def cancel(self, run_id: int) -> str:
        with self._lock:
            proc = self._procs.get(run_id)
        if proc is not None and proc.poll() is None:
            proc.terminate()
            return "已请求终止训练进程"
        return "任务已在队列中标记取消"


manager = TrainingManager()


def queue_depth(db: OrmSession) -> dict:
    rows = db.execute(
        select(TrainingRun.status, func.count(TrainingRun.id)).group_by(TrainingRun.status)
    ).all()
    counts = {status: count for status, count in rows}
    return {
        "queued": counts.get("queued", 0),
        "running": counts.get("running", 0),
        "succeeded": counts.get("succeeded", 0),
        "failed": counts.get("failed", 0),
        "cancelled": counts.get("cancelled", 0),
        "max_concurrent": config.TRAINING_MAX_CONCURRENT,
        "script_configured": bool(config.TRAINING_COMMAND.strip()),
        "mode": toolchain.training_mode(),
        "colmap_configured": bool(shutil.which(config.COLMAP_BIN) or Path(config.COLMAP_BIN).exists()),
        "vocab_tree_configured": bool(config.VOCAB_TREE),
        # Which trainer command each toolchain reads (docs/training-toolchain.md
        # §二 "接进网站"), so a wrong 「工具链」 choice is visible in the console.
        "toolchains": toolchain.status()["toolchains"],
    }
