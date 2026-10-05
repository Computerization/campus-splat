"""Training job management.

Queue -> prepare input data -> spawn the training subprocess -> parse progress
-> finalize. The actual reconstruction lives in backend/scripts/run_training.py
(COLMAP + 3DGS).

The subprocess reports progress on stdout with a fixed prefix, which the backend
parses line by line:
    [THREEDGS] {"stage": "colmap", "progress": 42.5, "message": "matching"}
That way any toolchain can be plugged in without touching the backend.
"""

from __future__ import annotations

import json
import os
import shlex
import shutil
import subprocess
import sys
import threading
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session as OrmSession

from .. import config
from ..database import SessionLocal
from ..models import Photo, Task, TrainingRun, utcnow
from .stats import USABLE_STATUSES

PROGRESS_PREFIX = "[THREEDGS]"

TERMINAL_STATUSES = ("succeeded", "failed", "cancelled")


def create_run(
    db: OrmSession,
    *,
    task_id: int | None,
    name: str | None,
    params: dict | None,
    created_by: str | None,
) -> TrainingRun:
    task = db.get(Task, task_id) if task_id else None
    if task_id and task is None:
        raise ValueError("任务不存在")

    default_name = f"{task.name} 重建" if task else "全局重建"
    run = TrainingRun(
        task_id=task_id,
        name=(name or default_name)[:128],
        status="queued",
        stage="queued",
        progress=0.0,
        message="已排队，等待算力机空闲",
        params=params or {},
        created_by=created_by,
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


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
                db.execute(select(TrainingRun).where(TrainingRun.status == "running"))
                .scalars()
                .all()
            )
            if not stale:
                return
            for run in stale:
                run.status = "failed"
                run.stage = "failed"
                run.message = "后端服务重启，这次训练已中断（可以重新发起）"
                run.finished_at = utcnow()
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
                    db.commit()

    # ------------------------------------------------------------ launch

    def _launch(self, run_id: int) -> None:
        config.ensure_dirs()
        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is None or run.status != "queued":
                return

            work_dir = config.TRAINING_DIR / f"run{run.id}"
            input_dir = work_dir / "input"
            output_dir = work_dir / "output"
            log_path = config.LOG_DIR / f"training_run{run.id}.log"
            input_dir.mkdir(parents=True, exist_ok=True)
            output_dir.mkdir(parents=True, exist_ok=True)

            photos = []
            if run.task_id:
                photos = db.execute(
                    select(Photo).where(
                        Photo.task_id == run.task_id,
                        Photo.status.in_(USABLE_STATUSES),
                        Photo.duplicate_of.is_(None),
                    )
                ).scalars().all()

            run.status = "running"
            run.stage = "preparing"
            run.progress = 0.0
            run.message = f"准备数据：{len(photos)} 张照片"
            run.photo_count = len(photos)
            run.started_at = utcnow()
            run.log_path = log_path.relative_to(config.DATA_DIR).as_posix()
            run.output_path = output_dir.relative_to(config.DATA_DIR).as_posix()
            params = dict(run.params or {})
            task_id = run.task_id
            rel_paths = [photo.stored_path for photo in photos]
            db.commit()

        # Hard-link the inputs when possible (instant on the same volume), else copy
        linked = 0
        for index, rel in enumerate(rel_paths):
            src = config.DATA_DIR / rel
            if not src.exists():
                continue
            dest = input_dir / f"{index:06d}{src.suffix.lower()}"
            try:
                if dest.exists():
                    linked += 1
                    continue
                os.link(src, dest)
            except OSError:
                try:
                    shutil.copy2(src, dest)
                except OSError:
                    continue
            linked += 1

        command = self._build_command()
        env = os.environ.copy()
        env.update(
            {
                "PYTHONUNBUFFERED": "1",
                "THREEDGS_RUN_ID": str(run_id),
                "THREEDGS_TASK_ID": str(task_id) if task_id else "",
                "THREEDGS_INPUT_DIR": str(input_dir),
                "THREEDGS_OUTPUT_DIR": str(output_dir),
                "THREEDGS_LOG_FILE": str(log_path),
                "THREEDGS_PHOTO_COUNT": str(linked),
                "THREEDGS_PARAMS": json.dumps(params, ensure_ascii=False),
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
                run.message = f"训练进程已启动（{linked} 张照片）"
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
            with SessionLocal() as db:
                run = db.get(TrainingRun, run_id)
                if run is None:
                    return
                if run.status == "cancelled":
                    run.finished_at = run.finished_at or utcnow()
                elif code == 0:
                    run.status = "succeeded"
                    run.stage = "finished"
                    run.progress = 100.0
                    run.message = "训练完成"
                    run.finished_at = utcnow()
                else:
                    run.status = "failed"
                    run.stage = "failed"
                    run.message = f"训练进程异常退出（退出码 {code}），详见日志"
                    run.finished_at = utcnow()
                db.commit()

    def _apply_progress(self, run_id: int, payload: str) -> None:
        try:
            data = json.loads(payload.strip())
        except json.JSONDecodeError:
            return
        with SessionLocal() as db:
            run = db.get(TrainingRun, run_id)
            if run is None or run.status in TERMINAL_STATUSES:
                return
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
                run.output_path = str(data["output"])[:512]
            db.commit()

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
    }
