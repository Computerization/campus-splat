#!/usr/bin/env python
"""Reconstruction pipeline (graded COLMAP + per-block 3DGS + merge + align).

This is the executable form of docs/training-pipeline.md. The stages:

    prepare   collect the plan, write gps.txt from the photos' EXIF tags
    sfm       ONE COLMAP per building/scope: features -> matching -> mapping
              -> (outdoor) align to ENU with the RTK coordinates
    split     cut each room's poses out of that single model, so every block
              shares one coordinate system and merging needs no registration
    train     one 3DGS run per block (VRAM friendly: the COLMAP stage eats RAM,
              the training stage eats VRAM)
    merge     concatenate the block point clouds (identical poses => no
              transformation at all)
    align     record the block placement / georeferencing in transforms.json
    export    transforms.json + manifest.json
    verify    check the artifacts exist

The backend passes directories in through environment variables and tracks
progress by parsing lines on this script's stdout that start with
`[THREEDGS] {...}`:

    {"stage": "sfm_matching", "progress": 22.0, "message": "..."}
    {"stage": "train", "block": {"key": "b001", "stage": "block_training",
                                 "progress": 40.0, "status": "running"}}

Environment variables
---------------------
Injected by the backend, don't set them by hand:
    THREEDGS_RUN_ID, THREEDGS_TASK_ID
    THREEDGS_INPUT_DIR    already-filtered photo directory (hard links)
    THREEDGS_OUTPUT_DIR   output directory
    THREEDGS_LOG_FILE     log file path
    THREEDGS_PHOTO_COUNT  number of photos
    THREEDGS_PARAMS       extra parameters as JSON
    THREEDGS_PLAN_FILE    plan.json written by the backend (photos + blocks)

Toolchain:
    THREEDGS_TRAINING_MODE   mock (default: walks the pipeline without training) | real
    THREEDGS_COLMAP_BIN      colmap executable (real mode)
    THREEDGS_VOCAB_TREE      vocab_tree.bin for vocab_tree_matcher (optional but
                             strongly recommended for indoor scopes)
    THREEDGS_GS_COMMAND      3DGS training command template (real mode).
                             Placeholders: {source} {model} {images}
                                           {iterations} {resolution} {data_factor}
    THREEDGS_GSPLAT_COMMAND  same, for the gsplat toolchain (method A of
                             docs/training-toolchain.md)

Usage (normally launched by the backend, but you can run it by hand):
    python scripts/run_training.py --mock --plan plan.json
"""

from __future__ import annotations

import argparse
import io
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services import splat, toolchain  # noqa: E402

PROGRESS_PREFIX = "[THREEDGS]"

# Where every stage sits on the run's overall 0-100 progress bar.
RUN_STAGES: dict[str, tuple[float, float]] = {
    "prepare": (0.0, 4.0),
    "sfm_features": (4.0, 14.0),
    "sfm_matching": (14.0, 30.0),
    "sfm_mapping": (30.0, 46.0),
    "sfm_align": (46.0, 52.0),
    "split": (52.0, 56.0),
    "train": (56.0, 92.0),
    "merge": (92.0, 96.0),
    "export": (96.0, 99.0),
    "verify": (99.0, 100.0),
}

# How much of a block's own 0-100 bar each sub-stage owns.
BLOCK_STAGES: dict[str, tuple[float, float]] = {
    "block_init": (0.0, 5.0),
    "block_undistort": (5.0, 15.0),
    "block_training": (15.0, 95.0),
    "block_export": (95.0, 100.0),
}

DEFAULTS: dict[str, Any] = {
    "iterations": 30_000,
    "image_resize": 2000,
    "train_resize": 1600,
    "toolchain": "3dgs",
    # gsplat only: train on images downsampled by this factor (--data_factor)
    "data_factor": 1,
    "matcher": "auto",
    "block_max_photos": 600,
    "merge_blocks": True,
    "rtk_align": True,
}

# Mock rooms are laid out on a grid so the preview shows a "campus overview"
# instead of every block piled up at the origin.
MOCK_BLOCK_SPACING = 8.0
MOCK_ROOM_SIZE = (5.0, 4.0, 3.0)
MOCK_GAUSSIANS_PER_BLOCK = 20_000

# Below this many photos, exhaustive matching is cheap AND connects far more
# reliably than sequential — the right default for a single room or corridor
# when no vocabulary tree is configured.
EXHAUSTIVE_MAX_PHOTOS = 300


def report(
    *,
    stage: str | None = None,
    progress: float | None = None,
    message: str | None = None,
    output: str | None = None,
    block: dict | None = None,
    artifacts: list | None = None,
) -> None:
    payload: dict = {}
    if stage is not None:
        payload["stage"] = stage
    if progress is not None:
        payload["progress"] = round(max(0.0, min(100.0, progress)), 2)
    if message is not None:
        payload["message"] = message
    if output is not None:
        payload["output"] = output
    if block is not None:
        payload["block"] = block
    if artifacts is not None:
        payload["artifacts"] = artifacts
    if payload:
        print(f"{PROGRESS_PREFIX} {json.dumps(payload, ensure_ascii=False)}", flush=True)


def log(text: str) -> None:
    print(text, flush=True)


class BlockFailed(RuntimeError):
    """A single block failed; the rest of the run carries on."""


class Pipeline:
    def __init__(
        self,
        plan: dict,
        input_dir: Path,
        output_dir: Path,
        *,
        mock: bool,
        step_seconds: float = 0.0,
    ) -> None:
        self.plan = plan
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.mock = mock
        self.step_seconds = step_seconds
        self.params: dict = {**DEFAULTS, **(plan.get("params") or {})}
        self.blocks: list[dict] = list(plan.get("blocks") or [])
        self.photos: list[dict] = list(plan.get("photos") or [])
        self.kind: str = plan.get("kind") or "indoor"
        self.reuse_dir = Path(plan["reuse_dir"]) if plan.get("reuse_dir") else None

        self.model_dir: Path | None = None  # the single COLMAP model (text)
        self.gps_images = 0
        self.aligned = False
        self.artifacts: list[dict] = []
        self.failed: list[str] = []
        self.block_plys: dict[str, Path] = {}
        self.block_stats: dict[str, dict] = {}
        # Camera centres per block model, read once for transforms.json
        self._center_cache: dict[str, dict[str, list[float]]] = {}

    # ------------------------------------------------------------ helpers

    def stage(self, name: str, ratio: float, message: str | None = None) -> None:
        start, end = RUN_STAGES[name]
        report(stage=name, progress=start + (end - start) * max(0.0, min(1.0, ratio)), message=message)

    def block_stage(
        self,
        index: int,
        name: str,
        ratio: float,
        message: str | None = None,
        **extra: Any,
    ) -> None:
        span = (RUN_STAGES["train"][1] - RUN_STAGES["train"][0]) / max(1, len(self.blocks))
        inner_start, inner_end = BLOCK_STAGES[name]
        inner = inner_start + (inner_end - inner_start) * max(0.0, min(1.0, ratio))
        progress = RUN_STAGES["train"][0] + span * index + span * inner / 100.0
        block = {
            "key": self.blocks[index]["key"],
            "stage": name,
            "progress": round(inner, 2),
            "status": "running",
        }
        if message is not None:
            block["message"] = message
        block.update(extra)
        report(stage="train", progress=progress, message=message, block=block)

    def block_done(self, index: int, status: str, message: str, **extra: Any) -> None:
        block = {
            "key": self.blocks[index]["key"],
            "stage": "block_export" if status == "succeeded" else "block_failed",
            "progress": 100.0 if status == "succeeded" else 0.0,
            "status": status,
            "message": message,
        }
        block.update(extra)
        report(stage="train", block=block)

    def _block_dir(self, key: str) -> Path:
        return self.output_dir / "blocks" / key

    def _block_log(self, key: str) -> Path:
        return self.output_dir / "logs" / f"{key}.log"

    def _write_block_log(self, key: str, text: str) -> None:
        path = self._block_log(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8", newline="") as handle:
            handle.write(text)

    def _pause(self, seconds: float = 0.0) -> None:
        if self.mock:
            time.sleep(seconds or self.step_seconds)

    def _run_tool(self, cmd: Sequence[str], *, label: str) -> dict:
        line = "[exec] " + " ".join(str(part) for part in cmd)
        log(line)
        result = subprocess.run(
            [str(part) for part in cmd],
            stdout=sys.stdout,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if result.returncode != 0:
            raise RuntimeError(f"{label} 失败（退出码 {result.returncode}）：{' '.join(map(str, cmd))}")
        return {"returncode": result.returncode}

    # ------------------------------------------------------------ 1. prepare

    def _prepare(self) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.stage("prepare", 0.0, f"整理输入：{len(self.photos)} 张照片 / {len(self.blocks)} 个训练块")

        entries: list[tuple[str, float, float, float | None]] = []
        with_gps = 0
        for photo in self.photos:
            lat, lng = photo.get("lat"), photo.get("lng")
            if lat is not None and lng is not None:
                with_gps += 1
            entries.append((photo["file"], lat, lng, photo.get("alt")))
        gps_path = self.output_dir / "gps.txt"
        self.gps_images = splat.write_gps_file(entries, gps_path)
        self.stage(
            "prepare",
            1.0,
            f"{len(self.photos)} 张照片，{len(self.blocks)} 个训练块，GPS 参考 {self.gps_images} 张",
        )
        if self.kind == "outdoor" and self.gps_images == 0 and self.params.get("rtk_align"):
            log("[warn] 室外任务没有带 GPS 的照片，跳过 RTK 对齐（各栋楼之间将不会自动对齐）")

    # ------------------------------------------------------------ 2. SfM

    def _sfm(self) -> None:
        reused = self._reuse_model()
        if reused:
            self.stage("sfm_mapping", 1.0, f"复用已有位姿：{self.model_dir}")
            return

        if self.mock:
            self._mock_sfm()
            return

        colmap = os.environ.get("THREEDGS_COLMAP_BIN", "colmap")
        if shutil.which(colmap) is None and not Path(colmap).exists():
            raise RuntimeError(
                f"找不到 COLMAP（{colmap}）。请安装 COLMAP，并让 THREEDGS_COLMAP_BIN 指向 colmap.exe"
            )

        database = self.output_dir / "database.db"
        sparse = self.output_dir / "sparse"
        sparse.mkdir(parents=True, exist_ok=True)

        self.stage("sfm_features", 0.0, "COLMAP 特征提取")
        self._run_tool(
            [
                colmap, "feature_extractor",
                "--database_path", str(database),
                "--image_path", str(self.input_dir),
                "--ImageReader.single_camera", "1",
                "--SiftExtraction.max_image_size", str(self.params["image_resize"]),
                "--SiftExtraction.use_gpu", self._gpu_flag(),
            ],
            label="COLMAP 特征提取",
        )
        self.stage("sfm_features", 1.0, "特征提取完成")

        self.stage("sfm_matching", 0.0, "COLMAP 特征匹配")
        matchers = self._matcher_commands(database)
        for index, matcher in enumerate(matchers):
            self._run_tool(matcher, label="COLMAP 特征匹配")
            self.stage(
                "sfm_matching",
                (index + 1) / len(matchers),
                f"匹配完成：{matcher[1]}",
            )

        self.stage("sfm_mapping", 0.0, "COLMAP 稀疏重建 / 相机位姿解算")
        self._run_tool(
            [
                colmap, "mapper",
                "--database_path", str(database),
                "--image_path", str(self.input_dir),
                "--output_path", str(sparse),
            ],
            label="COLMAP 稀疏重建",
        )

        models = sorted(
            (path for path in sparse.iterdir() if path.is_dir()),
            key=self._model_weight,
            reverse=True,
        )
        if not models:
            raise RuntimeError(
                "COLMAP 没有产出任何稀疏模型 —— 通常是照片重叠率不足，或连接键（走廊重叠 / 楼梯间 / 门口朝外那张）拍漏了"
            )
        if len(models) > 1:
            log(
                f"[warn] COLMAP 解出 {len(models)} 个互不相连的模型，只使用最大的 {models[0].name}。"
                "这说明某些区域之间没有连上，需要补拍重叠区。"
            )
        selected = models[0]
        self.stage("sfm_mapping", 0.7, f"稀疏重建完成，使用模型 {selected.name}")

        txt_model = self.output_dir / "sparse_txt"
        self._run_tool(
            [
                colmap, "model_converter",
                "--input_path", str(selected),
                "--output_path", str(txt_model),
                "--output_type", "TXT",
            ],
            label="COLMAP 模型转 TXT",
        )
        self.model_dir = txt_model
        self.stage("sfm_mapping", 1.0, "位姿解算完成")

        self._align_model(colmap)

    def _model_weight(self, path: Path) -> int:
        return sum(file.stat().st_size for file in path.iterdir() if file.is_file())

    @staticmethod
    def _gpu_flag() -> str:
        """COLMAP's GPU switch, so machines without CUDA can run it on CPU.

        SfM is CPU-friendly (just slower); only the 3DGS training stage really
        needs the GPU. Set THREEDGS_COLMAP_USE_GPU=0 on a machine where COLMAP
        was built without CUDA.
        """
        value = os.environ.get("THREEDGS_COLMAP_USE_GPU", "1").strip().lower()
        return "0" if value in ("0", "false", "no", "off") else "1"

    def _matcher_commands(self, database: Path) -> list[list[str]]:
        """Pick matchers per docs/training-pipeline.md §4.1-4.2.

        Aerial grids are connected by flight order (sequential) and cross-flight
        links come from the vocabulary tree. Indoors the vocabulary tree is the
        only affordable way to match *thousands* of photos that have no ordering
        at all — but for a single room (a few hundred photos) exhaustive
        matching is affordable and connects far more reliably, so that is what
        "auto" picks when no vocabulary tree is configured.
        """
        colmap = os.environ.get("THREEDGS_COLMAP_BIN", "colmap")
        vocab = os.environ.get("THREEDGS_VOCAB_TREE", "").strip()
        matcher = str(self.params.get("matcher") or "auto").lower()
        gpu = self._gpu_flag()

        def vocab_cmd() -> list[str]:
            return [
                colmap, "vocab_tree_matcher",
                "--database_path", str(database),
                "--VocabTreeMatching.vocab_tree_path", vocab,
                "--SiftMatching.use_gpu", gpu,
            ]

        def sequential_cmd() -> list[str]:
            return [
                colmap, "sequential_matcher",
                "--database_path", str(database),
                "--SiftMatching.use_gpu", gpu,
            ]

        def exhaustive_cmd() -> list[str]:
            return [
                colmap, "exhaustive_matcher",
                "--database_path", str(database),
                "--SiftMatching.use_gpu", gpu,
            ]

        if matcher == "vocab_tree":
            if not vocab:
                raise RuntimeError(
                    "选择了 vocab_tree 匹配，但没有配置 THREEDGS_VOCAB_TREE（vocab_tree.bin 的路径）"
                )
            return [vocab_cmd()]
        if matcher == "sequential":
            return [sequential_cmd()]
        if matcher == "exhaustive":
            return [exhaustive_cmd()]

        if self.kind == "outdoor":
            commands = [sequential_cmd()]
            if vocab:
                commands.append(vocab_cmd())
            return commands
        if vocab:
            return [vocab_cmd()]
        if len(self.photos) <= EXHAUSTIVE_MAX_PHOTOS:
            log(
                f"[info] 未配置 vocab tree，室内 {len(self.photos)} 张照片 → 用 exhaustive_matcher "
                f"（O(n²) 但 n≤{EXHAUSTIVE_MAX_PHOTOS} 时很快，连通性最好）"
            )
            return [exhaustive_cmd()]
        log(
            "[warn] 未配置 THREEDGS_VOCAB_TREE，室内照片又多，退化为 sequential_matcher。"
            "照片上传顺序大致等于拍摄顺序时可用，否则请下载 vocab_tree.bin。"
        )
        return [sequential_cmd()]

    def _align_model(self, colmap: str) -> None:
        """Graded COLMAP §4.1: put the outdoor model into real-world ENU."""
        if not (self.kind == "outdoor" and self.params.get("rtk_align") and self.gps_images > 0):
            return
        assert self.model_dir is not None
        target = self.output_dir / "sparse_geo"
        self.stage("sfm_align", 0.0, f"对齐到 RTK 地理坐标（{self.gps_images} 个参考点）")
        self._run_tool(
            [
                colmap, "model_aligner",
                "--input_path", str(self.model_dir),
                "--output_path", str(target),
                "--ref_images_path", str(self.output_dir / "gps.txt"),
                "--ref_is_gps", "1",
                "--alignment_type", "enu",
                "--robust_alignment", "1",
                "--robust_alignment_max_error", "3.0",
            ],
            label="COLMAP 对齐到地理坐标",
        )
        self.model_dir = target
        self.aligned = True
        self.stage("sfm_align", 1.0, "已对齐到 ENU 地理坐标")

    def _reuse_model(self) -> bool:
        """Reuse an earlier run's poses (used when retrying a single block)."""
        if self.reuse_dir is None:
            return False
        for candidate in ("sparse_geo", "sparse_txt"):
            source = self.reuse_dir / candidate
            if (source / "cameras.txt").exists() and (source / "images.txt").exists():
                target = self.output_dir / "sparse_txt"
                shutil.copytree(source, target, dirs_exist_ok=True)
                self.model_dir = target
                self.aligned = candidate == "sparse_geo"
                gps = self.reuse_dir / "gps.txt"
                if gps.exists():
                    shutil.copy2(gps, self.output_dir / "gps.txt")
                return True
        return False

    def _mock_sfm(self) -> None:
        """Walk the same stage sequence without COLMAP, writing a real text model."""
        self.stage("sfm_features", 0.5, "【模拟】提取特征点（SIFT）")
        self._pause()
        self.stage("sfm_features", 1.0, "【模拟】特征提取完成")

        self.stage("sfm_matching", 0.5, "【模拟】特征匹配")
        self._pause()
        self.stage("sfm_matching", 1.0, "【模拟】特征匹配完成")

        self.stage("sfm_mapping", 0.5, "【模拟】稀疏重建 / 相机位姿解算")
        self._pause()
        model_dir = self.output_dir / "sparse_txt"
        entries: list[tuple[str, tuple[float, float, float]]] = []
        for block_index, block in enumerate(self.blocks):
            center = _mock_block_center(block_index)
            for photo_index, name in enumerate(block.get("photos") or []):
                # Spread the cameras through the room volume
                offset = (
                    (photo_index % 3) * 0.8 - 0.8,
                    (photo_index % 5) * 0.6 - 1.2,
                    (photo_index % 2) * 0.4,
                )
                entries.append(
                    (
                        Path(name).name,
                        (
                            center[0] + offset[0],
                            center[1] + offset[1],
                            center[2] + offset[2],
                        ),
                    )
                )
        if not entries:
            raise RuntimeError("计划里没有任何照片，无法重建")
        splat.write_mock_colmap_model(model_dir, entries)
        self.model_dir = model_dir
        self.stage("sfm_mapping", 1.0, f"【模拟】位姿解算完成（{len(entries)} 张）")

        if self.kind == "outdoor" and self.params.get("rtk_align") and self.gps_images > 0:
            self.stage("sfm_align", 0.5, "【模拟】对齐到 RTK 地理坐标")
            self._pause()
            self.aligned = True
            self.stage("sfm_align", 1.0, "【模拟】已对齐到 ENU 地理坐标")

    # ------------------------------------------------------------ 3. split

    def _split(self) -> None:
        assert self.model_dir is not None
        total = max(1, len(self.blocks))
        for index, block in enumerate(self.blocks):
            names = [Path(name).name for name in (block.get("photos") or [])]
            target = self._block_dir(block["key"]) / "sparse"
            try:
                info = splat.write_colmap_subset_model(self.model_dir, target, names)
                self.block_stats[block["key"]] = {"model": info}
            except (ValueError, FileNotFoundError) as exc:
                self.failed.append(block["key"])
                self.block_done(
                    index, "failed", f"位姿切分失败：{exc}", error=str(exc)
                )
                self._write_block_log(block["key"], f"位姿切分失败：{exc}\n")
                continue
            self.stage(
                "split",
                (index + 1) / total,
                f"切出 {block['name']} 的位姿（{info['images']} 张）",
            )

    # ------------------------------------------------------------ 4. train

    def _train_blocks(self) -> None:
        for index, block in enumerate(self.blocks):
            if block["key"] in self.failed:
                continue
            try:
                self._train_block(index, block)
            except BlockFailed as exc:
                self.failed.append(block["key"])
                self._write_block_log(block["key"], f"\n[失败] {exc}\n")
                self.block_done(index, "failed", str(exc), error=str(exc))
            except Exception as exc:  # noqa: BLE001 - one block must not kill the run
                self.failed.append(block["key"])
                self._write_block_log(block["key"], f"\n[失败] {exc}\n")
                self.block_done(index, "failed", f"训练失败：{exc}", error=str(exc))

    def _train_block(self, index: int, block: dict) -> None:
        key = block["key"]
        block_dir = self._block_dir(key)
        block_dir.mkdir(parents=True, exist_ok=True)
        self._write_block_log(
            key, f"===== 训练块 {block['name']}（{len(block.get('photos') or [])} 张照片）=====\n"
        )
        self.block_stage(index, "block_init", 1.0, f"{block['name']}：准备训练输入")

        dense = block_dir / "dense"
        if self.mock:
            self.block_stage(index, "block_undistort", 1.0, f"{block['name']}：去畸变（模拟）")
            self._pause()
        else:
            colmap = os.environ.get("THREEDGS_COLMAP_BIN", "colmap")
            self.block_stage(index, "block_undistort", 0.0, f"{block['name']}：去畸变 / 生成训练输入")
            try:
                self._run_tool(
                    [
                        colmap, "image_undistorter",
                        "--image_path", str(self.input_dir),
                        "--input_path", str(block_dir / "sparse"),
                        "--output_path", str(dense),
                        "--output_type", "COLMAP",
                        "--max_image_size", str(self.params["train_resize"]),
                    ],
                    label=f"{block['name']} 去畸变",
                )
            except RuntimeError as exc:
                raise BlockFailed(str(exc)) from exc
            self.block_stage(index, "block_undistort", 1.0, f"{block['name']}：去畸变完成")

        if self.mock:
            self._mock_block_training(index, block)
        else:
            self._real_block_training(index, block, dense)

        # ---- export the block artifacts
        ply = self._find_ply(block_dir)
        if ply is None:
            raise BlockFailed(self._missing_ply_message(block))
        dest = block_dir / "point_cloud.ply"
        if ply != dest:
            shutil.copy2(ply, dest)
        summary = splat.summarize_ply(dest)
        self.block_plys[key] = dest
        self.block_stats.setdefault(key, {}).update(
            {"gaussians": summary["gaussians"], "size_bytes": summary["size_bytes"]}
        )
        self.block_stage(index, "block_export", 1.0, f"{block['name']}：导出完成")
        self.block_done(
            index,
            "succeeded",
            f"{block['name']}：完成（{summary['gaussians']:,} 个高斯点）",
            output=dest.relative_to(self.output_dir).as_posix(),
            gaussians=summary["gaussians"],
            size_bytes=summary["size_bytes"],
        )

    def _mock_block_training(self, index: int, block: dict) -> None:
        key = block["key"]
        steps = 4
        for step in range(steps):
            self.block_stage(
                index,
                "block_training",
                (step + 1) / steps,
                f"{block['name']}：高斯泼溅训练中（{int((step + 1) / steps * 100)}%）",
            )
            self._pause()
        count = min(MOCK_GAUSSIANS_PER_BLOCK, max(2000, len(block.get("photos") or []) * 60))
        splat.write_mock_splat(
            self._block_dir(key) / "point_cloud.ply",
            count=count,
            seed=index + 1,
            origin=_mock_block_origin(index),
            size=MOCK_ROOM_SIZE,
            color=_mock_block_color(index),
        )
        self._write_block_log(key, "[模拟] 已生成示例高斯点云（未真正训练）\n")

    def _real_block_training(self, index: int, block: dict, dense: Path) -> None:
        key = block["key"]
        chain = toolchain.normalize_toolchain(self.params.get("toolchain"))
        template = toolchain.template_for(chain)
        model_dir = self._block_dir(key) / "gs_model"
        iterations = int(self.params["iterations"])
        data_factor = int(self.params.get("data_factor") or 1)

        if not template:
            # The doc's own wording: 未设置 THREEDGS_GSPLAT_COMMAND — and the
            # reminder that 「工具链」 decides which of the two is read.
            raise BlockFailed(
                f"未设置 {toolchain.env_var(chain)}；请在 .env 中配置训练命令模板"
                "（占位符 {source} {model} {images} {iterations} {resolution} {data_factor}），"
                f"并确认训练页的「工具链」选的是 {chain}"
            )

        try:
            command = toolchain.render(
                template,
                {
                    "source": dense,
                    "model": model_dir,
                    "images": dense / "images",
                    "iterations": iterations,
                    "resolution": int(self.params["train_resize"]),
                    "data_factor": data_factor,
                },
            )
        except toolchain.CommandError as exc:
            raise BlockFailed(str(exc)) from exc

        log("[exec] " + command)
        self._write_block_log(key, "[exec] " + command + "\n")
        # The 已知坑 table of docs/training-toolchain.md, checked against the
        # template that is about to run: a forgotten --disable_viewer or a
        # missing --save_ply costs a whole block, so warn before, not after.
        for warning in toolchain.diagnose(
            template, toolchain=chain, iterations=iterations, data_factor=data_factor
        ):
            log(f"[warn] {warning}")
            self._write_block_log(key, f"[warn] {warning}\n")

        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        assert process.stdout is not None
        # Universal newlines on purpose: tqdm redraws its bar with \r, so
        # splitting on \n alone would leave the block at 15% until the very end
        # (doc §七 rule 4 — every trainer prints a percentage one way or another).
        stream = io.TextIOWrapper(
            process.stdout, encoding="utf-8", errors="replace", newline=None
        )
        last_percent = -1
        for line in stream:
            percent = _scrape_percent(line)
            if percent is None:
                print(line, end="", flush=True)
                self._write_block_log(key, line)
                continue
            # One progress update per integer percent: the bar moves smoothly and
            # neither the log nor the backend's progress handler drowns in tqdm.
            if int(percent) != last_percent:
                last_percent = int(percent)
                print(line, end="", flush=True)
                self._write_block_log(key, line)
            self.block_stage(
                index,
                "block_training",
                percent / 100.0,
                f"{block['name']}：训练中 {percent:.0f}%",
            )
        if process.wait() != 0:
            raise BlockFailed(f"{block['name']}：3DGS 训练进程异常退出（退出码 {process.returncode}）")

    def _missing_ply_message(self, block: dict) -> str:
        """The doc's most common dead end: the training ran, nothing was written.

        Doc §七 rule 3 + the 已知坑 table: the ply has to land inside {model},
        and gsplat does not write one at all unless --save_ply is passed.
        """
        chain = toolchain.normalize_toolchain(self.params.get("toolchain"))
        if chain == "gsplat":
            hint = (
                "gsplat 默认 save_ply=False：命令模板里必须有 --save_ply 和 --ply_steps {iterations}"
                "（docs/training-toolchain.md 的已知坑表）"
            )
        else:
            hint = "确认命令模板里的 {model} 就是输出目录（--result_dir / -m）"
        return f"{block['name']}：训练结束但没有找到 .ply 点云产物 —— ply 必须落在 {{model}} 目录内；{hint}"

    def _find_ply(self, block_dir: Path) -> Path | None:
        """Newest ply under the block directory.

        Every toolchain parks its output somewhere different — gsplat writes
        ``ply/point_cloud_29999.ply`` below ``--result_dir``, the original 3DGS
        writes ``point_cloud/iteration_30000/point_cloud.ply``, the mock
        pipeline writes straight into the block directory — so the scan is a
        recursive newest-wins search instead of a fixed path.
        """
        candidates = list(block_dir.rglob("*.ply"))
        if not candidates:
            return None
        return max(candidates, key=lambda path: path.stat().st_mtime)

    # ------------------------------------------------------------ 5. merge

    def _merge(self) -> None:
        plys = [self.block_plys[key] for key in self.block_plys]
        if not plys:
            raise RuntimeError("没有任何训练块产出点云，无法合并")

        merged = self.output_dir / "merged.ply"
        if len(plys) == 1:
            shutil.copy2(plys[0], merged)
            summary = splat.summarize_ply(merged)
            self.stage("merge", 1.0, f"只有 1 个训练块，直接输出 {merged.name}")
        elif self.params.get("merge_blocks", True):
            self.stage("merge", 0.0, f"合并 {len(plys)} 个训练块的点云（同坐标系，直接拼接）")
            try:
                summary = splat.merge_ply(plys, merged)
            except splat.PlyError as exc:
                raise RuntimeError(f"点云合并失败：{exc}") from exc
            self.stage("merge", 1.0, f"合并完成（{summary['gaussians']:,} 个高斯点）")
        else:
            self.stage("merge", 1.0, "按设置跳过合并，仅保留各块点云")
            return

        self.artifacts.append(
            {
                "kind": "ply",
                "name": "merged.ply",
                "path": merged.name,
                "size_bytes": merged.stat().st_size,
                "gaussians": summary.get("gaussians", 0),
                "merged": True,
            }
        )

    def _block_artifacts(self) -> list[dict]:
        items = []
        for block in self.blocks:
            key = block["key"]
            path = self.block_plys.get(key)
            if path is None or not path.exists():
                continue
            stats = self.block_stats.get(key, {})
            items.append(
                {
                    "kind": "ply",
                    "name": f"{block['name']}.ply",
                    "path": path.relative_to(self.output_dir).as_posix(),
                    "size_bytes": path.stat().st_size,
                    "gaussians": stats.get("gaussians", 0),
                    "block_key": key,
                    "block_name": block["name"],
                    "merged": False,
                }
            )
        return items

    # ------------------------------------------------------------ 6. export

    def _transforms(self) -> dict:
        blocks = []
        for block in self.blocks:
            key = block["key"]
            if key not in self.block_plys:
                continue
            sparse = self._block_dir(key) / "sparse"
            cache_key = str(sparse)
            if cache_key not in self._center_cache:
                try:
                    self._center_cache[cache_key] = splat.camera_centers(sparse)
                except Exception:
                    self._center_cache[cache_key] = {}
            centers = self._center_cache[cache_key]
            points = [
                centers[Path(name).name]
                for name in (block.get("photos") or [])
                if Path(name).name in centers
            ]
            center = (
                [sum(point[axis] for point in points) / len(points) for axis in range(3)]
                if points
                else [0.0, 0.0, 0.0]
            )
            stats = self.block_stats.get(key, {})
            blocks.append(
                {
                    "key": key,
                    "name": block["name"],
                    "part_index": block.get("part_index", 0),
                    "part_total": block.get("part_total", 1),
                    "checkpoint_id": block.get("checkpoint_id"),
                    "photo_count": len(block.get("photos") or []),
                    "gaussians": stats.get("gaussians", 0),
                    "ply": self.block_plys[key].relative_to(self.output_dir).as_posix(),
                    "camera_center": center,
                    # Every block shares the run's single COLMAP model, so the
                    # block-to-scene transform starts out as the identity. The
                    # admin can place a block by hand in the 3D preview, which
                    # rewrites this entry (see the transforms endpoint).
                    "transform": splat.identity_matrix(),
                    "placement": splat.identity_placement(center),
                    "transform_source": "identity",
                }
            )

        merged_artifact = next((item for item in self.artifacts if item["kind"] == "ply"), None)
        model_images = 0
        if self.model_dir is not None:
            try:
                model_images = len(splat.camera_centers(self.model_dir))
            except Exception:
                model_images = 0

        merged_pivot = (
            [
                sum(block["camera_center"][axis] for block in blocks) / len(blocks)
                for axis in range(3)
            ]
            if blocks
            else [0.0, 0.0, 0.0]
        )

        generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        return {
            "version": 1,
            "generated_at": generated_at,
            "updated_at": generated_at,
            "task": {
                "id": self.plan.get("task_id"),
                "name": self.plan.get("task_name"),
                "kind": self.kind,
            },
            "coordinate_system": "enu_metres" if self.aligned else "colmap_world",
            # Same poses for every block — this is why merging is a plain join.
            "shared_poses": True,
            "photo_count": len(self.photos),
            "sfm": {"model_images": model_images, "source": "reused" if self.reuse_dir else "computed"},
            "alignment": {
                "method": "rtk_enu" if self.aligned else "none",
                "reference_images": self.gps_images,
                "applied": self.aligned,
            },
            "blocks": blocks,
            "merged": (
                {
                    "ply": merged_artifact["path"],
                    "gaussians": merged_artifact.get("gaussians", 0),
                    "transform": splat.identity_matrix(),
                    "placement": splat.identity_placement(merged_pivot),
                    "transform_source": "identity",
                }
                if merged_artifact
                else None
            ),
            # Other runs' point clouds placed by hand against this run's
            # coordinate system (the indoor → outdoor step of the docs, which
            # needs control points and therefore a human in the loop).
            "placements": [],
        }

    def _export(self) -> None:
        self.stage("export", 0.0, "生成 transforms.json / manifest.json")
        transforms = self._transforms()
        transforms_path = self.output_dir / "transforms.json"
        transforms_path.write_text(
            json.dumps(transforms, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        manifest = {
            "run_id": self.plan.get("run_id"),
            "task": transforms["task"],
            "generated_at": transforms["generated_at"],
            "coordinate_system": transforms["coordinate_system"],
            "blocks": [
                {
                    "key": block["key"],
                    "name": block["name"],
                    "photo_count": block["photo_count"],
                    "gaussians": block["gaussians"],
                    "ply": block["ply"],
                    "status": "succeeded",
                }
                for block in transforms["blocks"]
            ],
            "failed_blocks": self.failed,
            "artifacts": [*self._block_artifacts(), *self.artifacts],
        }
        manifest_path = self.output_dir / "manifest.json"
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

        self.artifacts = [
            *self._block_artifacts(),
            *self.artifacts,
            {
                "kind": "transform",
                "name": "transforms.json",
                "path": transforms_path.name,
                "size_bytes": transforms_path.stat().st_size,
            },
            {
                "kind": "manifest",
                "name": "manifest.json",
                "path": manifest_path.name,
                "size_bytes": manifest_path.stat().st_size,
            },
        ]
        self.stage("export", 1.0, f"已导出 {len(self.artifacts)} 个产物")

    # ------------------------------------------------------------ 7. verify

    def _verify(self) -> None:
        self.stage("verify", 0.0, "检查产物")
        missing = [key for key, path in self.block_plys.items() if not path.exists()]
        if missing:
            raise RuntimeError(f"产物丢失：{', '.join(missing)}")
        report(
            stage="finished",
            progress=100.0,
            message=(
                f"完成：{len(self.block_plys)}/{len(self.blocks)} 个训练块成功"
                + (f"，{len(self.failed)} 个失败" if self.failed else "")
            ),
            output=str(self.output_dir),
            artifacts=self.artifacts,
        )

    # ------------------------------------------------------------ entry

    def execute(self) -> int:
        self._prepare()
        self._sfm()
        self._split()
        self._train_blocks()
        self._merge()
        self._export()
        self._verify()
        if self.failed:
            report(
                stage="failed",
                message=(
                    f"{len(self.failed)} 个训练块失败（其余已完成，可单独重试）："
                    + "、".join(self.failed)
                ),
            )
            return 1
        return 0


def _mock_block_origin(index: int) -> tuple[float, float, float]:
    return (index * MOCK_BLOCK_SPACING, 0.0, 0.0)


def _mock_block_center(index: int) -> tuple[float, float, float]:
    origin = _mock_block_origin(index)
    return (origin[0] + MOCK_ROOM_SIZE[0] / 2, MOCK_ROOM_SIZE[1] / 2, MOCK_ROOM_SIZE[2] / 2)


def _mock_block_color(index: int) -> tuple[float, float, float]:
    palette = [
        (0.80, 0.42, 0.36),
        (0.36, 0.64, 0.82),
        (0.44, 0.76, 0.46),
        (0.86, 0.74, 0.34),
        (0.62, 0.46, 0.82),
        (0.36, 0.78, 0.76),
    ]
    return palette[index % len(palette)]


def _scrape_percent(line: str) -> float | None:
    """Pull the percentage out of a tqdm/progress line."""
    if "%" not in line:
        return None
    try:
        chunk = line.split("%")[0].strip().split()[-1]
        value = float(chunk)
    except (ValueError, IndexError):
        return None
    if value < 0 or value > 100:
        return None
    return value


def load_plan(args: argparse.Namespace, env: dict[str, str]) -> dict:
    path = args.plan or env.get("THREEDGS_PLAN_FILE", "")
    if not path:
        return {"params": {}, "photos": [], "blocks": []}
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="校园 3DGS 分级重建流水线")
    parser.add_argument("--mock", action="store_true", help="强制使用模拟模式")
    parser.add_argument("--plan", help="覆盖 plan.json 路径")
    parser.add_argument("--input", help="覆盖输入目录")
    parser.add_argument("--output", help="覆盖输出目录")
    args = parser.parse_args()

    env = os.environ
    input_dir = Path(args.input or env.get("THREEDGS_INPUT_DIR", "data/training/input"))
    output_dir = Path(args.output or env.get("THREEDGS_OUTPUT_DIR", "data/training/output"))
    mode = "mock" if args.mock else env.get("THREEDGS_TRAINING_MODE", "mock").lower()
    step_seconds = float(env.get("THREEDGS_MOCK_STEP_SECONDS", "0.2") or 0.2)

    try:
        plan = load_plan(args, env)
    except Exception as exc:  # noqa: BLE001
        report(stage="failed", message=f"训练计划无法读取：{exc}")
        print(f"[error] 训练计划无法读取：{exc}", file=sys.stderr, flush=True)
        return 1

    mock = mode != "real"
    if mock:
        log(
            "提示：当前是 mock 模式，不会真正跑 COLMAP / 3DGS，但会走完整的分级流程并产出示例点云。\n"
            "      接入真实流程请设置 THREEDGS_TRAINING_MODE=real（见 docs/training-pipeline.md）。"
        )

    pipeline = Pipeline(plan, input_dir, output_dir, mock=mock, step_seconds=step_seconds)
    try:
        return pipeline.execute()
    except Exception as exc:  # noqa: BLE001
        report(stage="failed", message=f"训练失败：{exc}")
        print(f"[error] {exc}", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
