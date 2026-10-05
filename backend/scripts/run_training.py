#!/usr/bin/env python
"""3DGS training entry point (COLMAP + 3D Gaussian Splatting).

The backend passes directories in through environment variables and tracks
progress by parsing lines on this script's stdout that start with
`[THREEDGS] {...}` — so any reconstruction toolchain can be plugged in as long
as it reports progress in that format.

Environment variables
---------------------
Injected by the backend, don't set them by hand:
    THREEDGS_RUN_ID, THREEDGS_TASK_ID
    THREEDGS_INPUT_DIR    already-filtered photo directory (hard links)
    THREEDGS_OUTPUT_DIR   output directory
    THREEDGS_LOG_FILE     log file path
    THREEDGS_PHOTO_COUNT  number of photos
    THREEDGS_PARAMS       extra parameters as JSON

Mode and toolchain:
    THREEDGS_TRAINING_MODE   mock (default: walks the pipeline without training) | real
    THREEDGS_COLMAP_BIN      colmap executable (required in real mode)
    THREEDGS_IMAGE_RESIZE    max long side for COLMAP feature extraction, default 2000
    THREEDGS_GS_COMMAND      3DGS training command template (required in real mode)
                             Placeholders: {source} {model} {images} {iterations}
                             e.g. python train.py -s {source} -m {model} --iterations {iterations}

Usage (normally launched by the backend, but you can run it by hand):
    python scripts/run_training.py --mock
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

PROGRESS_PREFIX = "[THREEDGS]"


def report(*, stage: str | None = None, progress: float | None = None,
           message: str | None = None, output: str | None = None) -> None:
    payload: dict = {}
    if stage is not None:
        payload["stage"] = stage
    if progress is not None:
        payload["progress"] = round(progress, 2)
    if message is not None:
        payload["message"] = message
    if output is not None:
        payload["output"] = output
    if payload:
        print(f"{PROGRESS_PREFIX} {json.dumps(payload, ensure_ascii=False)}", flush=True)


def run(cmd: list[str], *, stage: str, progress: float) -> None:
    report(stage=stage, progress=progress, message=" ".join(cmd[:2]) + " ...")
    print("[exec] " + " ".join(str(c) for c in cmd), flush=True)
    result = subprocess.run(cmd, stdout=sys.stdout, stderr=subprocess.STDOUT, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"命令失败（退出码 {result.returncode}）：{' '.join(str(c) for c in cmd)}")


# ---------------------------------------------------------------- mock mode

MOCK_STAGES = [
    (0.0, "preparing", "整理输入照片"),
    (8.0, "colmap_features", "提取特征点（SIFT）"),
    (22.0, "colmap_matching", "特征匹配"),
    (45.0, "colmap_mapping", "稀疏重建 / 相机位姿解算"),
    (60.0, "gs_training", "高斯泼溅训练中"),
    (88.0, "export", "导出 ply / 生成预览"),
    (98.0, "verify", "质量检查"),
]


def mock_mode(input_dir: Path, output_dir: Path, photo_count: int) -> int:
    report(stage="preparing", progress=0.0, message=f"发现 {photo_count} 张照片")
    images = [p for p in input_dir.iterdir() if p.is_file()] if input_dir.exists() else []
    total_bytes = sum(p.stat().st_size for p in images)
    report(
        stage="preparing",
        progress=4.0,
        message=f"{len(images)} 张照片，共 {total_bytes / 1024 / 1024:.1f} MB",
    )

    step_seconds = float(os.environ.get("THREEDGS_MOCK_STEP_SECONDS", "2.5"))
    for index, (progress, stage, message) in enumerate(MOCK_STAGES):
        report(stage=stage, progress=progress, message=message)
        time.sleep(step_seconds)
        # Emit an intermediate value between stages so the admin progress bar
        # moves smoothly instead of jumping.
        if index + 1 < len(MOCK_STAGES):
            mid = (progress + MOCK_STAGES[index + 1][0]) / 2
            report(stage=stage, progress=mid, message=f"{message}（进行中）")
            time.sleep(step_seconds)

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "point_cloud.ply").write_bytes(
        f"mock point cloud\nphotos={len(images)}\n".encode()
    )
    (output_dir / "cameras.json").write_text(
        json.dumps({"source": str(input_dir), "photos": len(images)}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    report(stage="finished", progress=100.0, message="【模拟模式】流程跑通", output=str(output_dir))
    print("\n提示：当前是 mock 模式，没有真正训练。"
          "接入真实流程请设置 THREEDGS_TRAINING_MODE=real 及对应命令。\n")
    return 0


# ---------------------------------------------------------------- real mode


def real_mode(input_dir: Path, output_dir: Path, params: dict) -> int:
    colmap = os.environ.get("THREEDGS_COLMAP_BIN", "colmap")
    gs_command = os.environ.get("THREEDGS_GS_COMMAND", "").strip()

    if shutil.which(colmap) is None and not Path(colmap).exists():
        raise RuntimeError(
            f"找不到 COLMAP（{colmap}）。请安装 COLMAP 并设置 THREEDGS_COLMAP_BIN 指向 colmap.exe"
        )
    if not gs_command:
        raise RuntimeError(
            "未设置 THREEDGS_GS_COMMAND。示例："
            'python train.py -s {source} -m {model} --iterations {iterations}'
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    database = output_dir / "database.db"
    sparse = output_dir / "sparse"
    dense = output_dir / "dense"
    sparse.mkdir(exist_ok=True)

    image_resize = os.environ.get("THREEDGS_IMAGE_RESIZE", "2000")
    iterations = str(params.get("iterations", 30000))

    report(stage="colmap_features", progress=8.0, message="COLMAP 特征提取")
    run(
        [
            colmap, "feature_extractor",
            "--database_path", str(database),
            "--image_path", str(input_dir),
            "--ImageReader.single_camera", "1",
            "--SiftExtraction.max_image_size", image_resize,
            "--SiftExtraction.use_gpu", "1",
        ],
        stage="colmap_features",
        progress=12.0,
    )

    report(stage="colmap_matching", progress=26.0, message="COLMAP 特征匹配")
    run(
        [
            colmap, "exhaustive_matcher",
            "--database_path", str(database),
        ],
        stage="colmap_matching",
        progress=30.0,
    )

    report(stage="colmap_mapping", progress=48.0, message="COLMAP 稀疏重建")
    run(
        [
            colmap, "mapper",
            "--database_path", str(database),
            "--image_path", str(input_dir),
            "--output_path", str(sparse),
        ],
        stage="colmap_mapping",
        progress=52.0,
    )

    # Pick the largest sparse model (COLMAP can produce several)
    models = [p for p in sparse.iterdir() if p.is_dir()]
    if not models:
        raise RuntimeError("COLMAP 没有产出任何稀疏模型，可能是照片重叠率不足")
    model = max(models, key=lambda p: sum(f.stat().st_size for f in p.iterdir() if f.is_file()))
    report(
        stage="colmap_mapping",
        progress=58.0,
        message=f"稀疏重建完成，使用模型 {model.name}",
    )

    report(stage="undistort", progress=60.0, message="去畸变 / 生成 dense 输入")
    run(
        [
            colmap, "image_undistorter",
            "--image_path", str(input_dir),
            "--input_path", str(model),
            "--output_path", str(dense),
            "--output_type", "COLMAP",
        ],
        stage="undistort",
        progress=62.0,
    )

    source = dense
    report(stage="gs_training", progress=64.0, message="开始 3DGS 训练")
    command = gs_command.format(
        source=str(source),
        model=str(output_dir / "gs_model"),
        images=str(source / "images"),
        iterations=iterations,
    )
    print("[exec] " + command, flush=True)
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT, text=True, encoding="utf-8",
                               errors="replace")
    progress = 64.0
    assert process.stdout is not None
    for line in process.stdout:
        print(line, end="", flush=True)
        # Most 3DGS implementations print a tqdm bar; scrape the percentage when
        # it's there.
        if "%" in line:
            try:
                chunk = line.split("%")[0].strip().split()[-1]
                value = float(chunk)
                progress = max(progress, min(97.0, 64.0 + value * 0.33))
                report(stage="gs_training", progress=progress)
            except (ValueError, IndexError):
                pass
    if process.wait() != 0:
        raise RuntimeError("3DGS 训练进程失败")

    report(stage="verify", progress=98.0, message="检查产物")
    ply_files = list(output_dir.rglob("*.ply"))
    if not ply_files:
        raise RuntimeError("训练结束但没有找到 .ply 点云产物")

    report(
        stage="finished",
        progress=100.0,
        message=f"完成，产物 {len(ply_files)} 个",
        output=str(output_dir),
    )
    return 0


# ---------------------------------------------------------------- entry point


def main() -> int:
    parser = argparse.ArgumentParser(description="校园 3DGS 训练入口")
    parser.add_argument("--mock", action="store_true", help="强制使用模拟模式")
    parser.add_argument("--input", help="覆盖输入目录")
    parser.add_argument("--output", help="覆盖输出目录")
    args = parser.parse_args()

    input_dir = Path(args.input or os.environ.get("THREEDGS_INPUT_DIR", "data/training/input"))
    output_dir = Path(args.output or os.environ.get("THREEDGS_OUTPUT_DIR", "data/training/output"))
    photo_count = int(os.environ.get("THREEDGS_PHOTO_COUNT", "0") or 0)

    try:
        params = json.loads(os.environ.get("THREEDGS_PARAMS") or "{}")
    except json.JSONDecodeError:
        params = {}

    mode = "mock" if args.mock else os.environ.get("THREEDGS_TRAINING_MODE", "mock").lower()

    try:
        if mode == "real":
            return real_mode(input_dir, output_dir, params)
        return mock_mode(input_dir, output_dir, photo_count)
    except Exception as exc:
        report(stage="failed", message=f"训练失败：{exc}")
        print(f"[error] {exc}", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
