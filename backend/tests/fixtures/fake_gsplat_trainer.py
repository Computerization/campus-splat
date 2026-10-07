#!/usr/bin/env python
"""Stand-in for gsplat's ``examples/simple_trainer.py`` (docs/training-toolchain.md, method A).

The real trainer only runs on the GPU machine, so this file keeps the
*contract* between the platform and that trainer under test on any machine:

* the CLI surface the doc's command template uses — the ``default`` profile,
  ``--data_dir``, ``--result_dir``, ``--max_steps``, ``--save_steps``,
  ``--eval_steps``, ``--ply_steps``, ``--save_ply``, ``--data_factor``,
  ``--disable_viewer``
* a tqdm-style bar that is redrawn with ``\\r`` instead of ``\\n``
* the point cloud landing in ``<result_dir>/ply/point_cloud_<step>.ply`` with the
  0-indexed step in the name (real gsplat writes ``point_cloud_29999.ply`` for
  ``--max_steps 30000``)
* ``--save_ply`` defaulting to off, exactly like gsplat, so that "训练结束但
  没有找到 .ply 点云产物" stays reproducible here instead of only on the GPU box

Everything expensive (rasterisation, densification, the CUDA kernels) is
replaced by a small but *real* 3DGS-format ply per ply step, which is what the
platform's artifact scanner and the admin preview actually consume.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services import splat  # noqa: E402

GAUSSIANS = 2000
# "How long one step takes" — enough for the bar to be flushed in chunks rather
# than in one burst, small enough to keep the test suite fast.
STEP_SECONDS = 0.002


def _add_trainer_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--data_dir", required=True)
    parser.add_argument("--result_dir", required=True)
    parser.add_argument("--max_steps", type=int, default=30_000)
    parser.add_argument("--save_steps", type=int, nargs="+", default=[7_000, 30_000])
    parser.add_argument("--eval_steps", type=int, nargs="+", default=[500, 7_000, 30_000])
    parser.add_argument("--ply_steps", type=int, nargs="+", default=[7_000, 30_000])
    # gsplat ships with save_ply=False: no flag, no .ply
    parser.add_argument("--save_ply", action="store_true")
    parser.add_argument("--disable_viewer", action="store_true")
    parser.add_argument("--data_factor", type=int, default=4)
    parser.add_argument("--steps_scaler", type=float, default=1.0)


def main() -> int:
    parser = argparse.ArgumentParser(prog="simple_trainer")
    profiles = parser.add_subparsers(dest="profile", required=True)
    for profile in ("default", "mcmc"):
        _add_trainer_arguments(profiles.add_parser(profile))
    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    result_dir = Path(args.result_dir)

    # gsplat reads a COLMAP capture; the platform's {source} is the undistorted
    # block directory colmap image_undistorter produced.
    if not (data_dir / "sparse").is_dir() or not (data_dir / "images").is_dir():
        print(f"[fake-gsplat] --data_dir 不是 COLMAP 目录（images/ + sparse/）：{data_dir}", flush=True)
        return 2
    if args.data_factor not in (1, 2, 4):
        print(f"[fake-gsplat] --data_factor 值不合理：{args.data_factor}", flush=True)
        return 2

    result_dir.mkdir(parents=True, exist_ok=True)
    (result_dir / "run_args.json").write_text(
        json.dumps(
            {
                "profile": args.profile,
                "data_dir": str(data_dir),
                "result_dir": str(result_dir),
                "max_steps": args.max_steps,
                "save_steps": args.save_steps,
                "eval_steps": args.eval_steps,
                "ply_steps": args.ply_steps,
                "save_ply": args.save_ply,
                "data_factor": args.data_factor,
                "steps_scaler": args.steps_scaler,
                "disable_viewer": args.disable_viewer,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    if not args.disable_viewer:
        print("[fake-gsplat] viewer enabled (--disable_viewer missing)", flush=True)

    steps = max(1, int(args.max_steps))
    ply_steps = set(int(step) for step in args.ply_steps)
    last_percent = -1
    for step in range(steps):
        percent = int((step + 1) * 100 / steps)
        if percent != last_percent:
            last_percent = percent
            filled = percent // 4
            # Redrawn in place, exactly like tqdm does on a pipe: \r, never \n.
            sys.stdout.write(
                f"\r{percent:3d}%|{'#' * filled}{' ' * (25 - filled)}| "
                f"{step + 1}/{steps} [00:00<00:00, 500.00it/s]"
            )
            sys.stdout.flush()
        # gsplat counts steps from 0, so ply_steps=[30000] fires on step 29999
        if args.save_ply and (step + 1) in ply_steps:
            # 0-indexed name, like the real trainer (point_cloud_29999.ply)
            splat.write_mock_splat(
                result_dir / "ply" / f"point_cloud_{step}.ply",
                count=GAUSSIANS,
                seed=step + 1,
            )
            print(f"\nSaving ply to {result_dir / 'ply' / f'point_cloud_{step}.ply'}", flush=True)
        time.sleep(STEP_SECONDS)

    print(f"\nStep: {steps - 1} num_GS={GAUSSIANS} 训练结束", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
