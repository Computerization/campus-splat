"""End-to-end tests of the graded reconstruction pipeline.

The mock mode walks the *whole* flow of docs/training-pipeline.md — planning,
one SfM model per scope, splitting it into per-room blocks, training each block,
merging them, exporting transforms.json — so the orchestration, the block
bookkeeping and the admin endpoints are all covered without COLMAP or a GPU.
"""

from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np
import pytest

from app import config
from app.database import SessionLocal
from app.models import Photo, TrainingBlock
from app.services import splat
from app.services.training import build_block_plan, normalize_params

from .conftest import jpeg_bytes, make_textured_image


def _create_task_with_photos(
    client, admin_headers, *, name, checkpoint_names, photos_each, kind="indoor"
):
    task = client.post(
        "/api/admin/tasks", json={"name": name, "kind": kind}, headers=admin_headers
    ).json()
    checkpoints = [
        client.post(
            f"/api/admin/tasks/{task['id']}/checkpoints",
            json={"name": cp_name, "shot_count": 1},
            headers=admin_headers,
        ).json()
        for cp_name in checkpoint_names
    ]

    joined = client.post('/api/auth/volunteer/register', json={
        'username': f'训练同学{task["id"]}', 'password':'shared'}).json()
    headers = {'Authorization': f'Bearer {joined["token"]}'}
    client.post(f'/api/volunteer/tasks/{task["id"]}/claim', headers=headers)
    seed = abs(hash(name)) % 5000
    files = []
    manifest = []
    for checkpoint in checkpoints:
        for index in range(photos_each):
            seed += 13
            manifest.append({'checkpoint_id':checkpoint['id']})
            files.append(('files',(f'p{seed}.jpg',jpeg_bytes(make_textured_image(2000,1500,seed=seed),quality=80),'image/jpeg')))
    response = client.post(f'/api/volunteer/tasks/{task["id"]}/submit', headers=headers,
        data={'manifest':json.dumps(manifest)}, files=files)
    assert response.status_code == 200, response.text
    assignment_id = response.json()['assignment']['id']
    accepted = client.post(f'/api/admin/submissions/{assignment_id}/review', headers=admin_headers,
        json={'decision':'accept'})
    assert accepted.status_code == 200, accepted.text
    return task, checkpoints


def _wait_for_run(client, admin_headers, run_id: int, timeout: float = 90.0) -> dict:
    deadline = time.time() + timeout
    detail = {}
    while time.time() < deadline:
        detail = client.get(f"/api/admin/training/{run_id}", headers=admin_headers).json()
        if detail["status"] in ("succeeded", "failed", "cancelled"):
            return detail
        time.sleep(0.3)
    raise AssertionError(f"训练没有在 {timeout}s 内结束，最后状态 {detail.get('status')}")


def test_preflight_and_parameter_validation(client, admin_headers):
    task, _checkpoints = _create_task_with_photos(
        client,
        admin_headers,
        name=f"预检楼 {time.time()}",
        checkpoint_names=["3F 走廊", "3F 实验室 302"],
        photos_each=3,
    )

    response = client.get(
        f"/api/admin/training/preflight?task_id={task['id']}&block_max_photos=20",
        headers=admin_headers,
    )
    assert response.status_code == 200, response.text
    preflight = response.json()
    assert preflight["photo_count"] == 6
    # One block per checkpoint below the limit (splitting is unit tested)
    assert len(preflight["blocks"]) == 2
    assert preflight["blocks"][0]["part_total"] == 1
    assert preflight["blocks"][0]["photo_count"] == 3
    assert preflight["gaussian_budget"] > 0
    assert preflight["warnings"], "室内无 GPS 应当给出提示"

    # Out-of-range parameters are rejected before anything is queued
    bad = client.post(
        "/api/admin/training",
        json={"task_id": task["id"], "params": {"iterations": 10}},
        headers=admin_headers,
    )
    assert bad.status_code == 422, bad.text

    # A task without photos cannot be trained
    empty = client.post(
        "/api/admin/tasks", json={"name": f"空任务 {time.time()}"}, headers=admin_headers
    ).json()
    blocked = client.post(
        "/api/admin/training", json={"task_id": empty["id"]}, headers=admin_headers
    )
    assert blocked.status_code == 400

    # A run must name a task (a global run cannot be split into blocks)
    assert (
        client.post("/api/admin/training", json={}, headers=admin_headers).status_code == 400
    )


def test_graded_pipeline_produces_merged_splat_and_transforms(client, admin_headers):
    task, _checkpoints = _create_task_with_photos(
        client,
        admin_headers,
        name=f"分级重建楼 {time.time()}",
        checkpoint_names=["走廊", "实验室"],
        photos_each=3,
    )

    started = client.post(
        "/api/admin/training",
        json={
            "task_id": task["id"],
            "name": "分级重建测试",
            "params": {"iterations": 1000},
        },
        headers=admin_headers,
    )
    assert started.status_code == 201, started.text
    run = started.json()
    assert run["status"] in ("queued", "running")
    assert run["block_total"] == 2, run
    assert len(run["blocks"]) == 2
    assert run["scope_kind"] == "indoor"
    assert run["params"]["iterations"] == 1000

    detail = _wait_for_run(client, admin_headers, run["id"])
    assert detail["status"] == "succeeded", detail.get("message")
    assert detail["progress"] == 100.0
    assert detail["block_done"] == 2
    assert [block["status"] for block in detail["blocks"]] == ["succeeded"] * 2
    assert all(block["photo_count"] > 0 for block in detail["blocks"])
    assert all(block["metrics"]["gaussians"] > 0 for block in detail["blocks"])
    assert detail["photo_count"] == 6

    kinds = {artifact["kind"] for artifact in detail["artifacts"]}
    assert {"ply", "transform", "manifest"} <= kinds
    merged = next(a for a in detail["artifacts"] if a.get("merged"))
    assert merged["gaussians"] > 0

    output = Path(config.DATA_DIR) / detail["output_path"]
    assert (output / "merged.ply").exists()
    assert (output / "manifest.json").exists()
    assert (output / "gps.txt").exists()
    # One COLMAP model for the whole scope is what makes merging free
    assert (output / "sparse_txt" / "images.txt").exists()

    transforms = json.loads((output / "transforms.json").read_text(encoding="utf-8"))
    assert transforms["shared_poses"] is True
    assert transforms["coordinate_system"] == "colmap_world"
    assert transforms["alignment"]["applied"] is False
    assert len(transforms["blocks"]) == 2
    assert all(len(block["transform"]) == 4 for block in transforms["blocks"])
    assert all(len(block["camera_center"]) == 3 for block in transforms["blocks"])
    assert transforms["merged"]["ply"] == "merged.ply"

    # Every block got its own log
    for block in detail["blocks"]:
        log = client.get(
            f"/api/admin/training/blocks/{block['id']}/log", headers=admin_headers
        ).json()
        assert log["lines"], f"{block['name']} 应该有块日志"

    # The preview lists the merged cloud first, then every block
    preview = client.get(f"/api/admin/training/{run['id']}/preview", headers=admin_headers).json()
    assert len(preview["scenes"]) == 3
    assert preview["scenes"][0]["merged"] is True
    assert preview["scenes"][0]["gaussians"] > 0
    # Read back from transforms.json, not from the task kind
    assert preview["coordinate_system"] == "colmap_world"

    streamed = client.get(preview["scenes"][0]["url"])
    assert streamed.status_code == 200, streamed.text
    assert streamed.content[:3] == b"ply"
    # The path must end in .ply: the WebGL loader picks its parser from the
    # suffix, so a query string after the extension breaks loading
    assert preview["scenes"][0]["url"].split("?")[0].endswith(".ply")
    assert all(scene["url"].split("?")[0].endswith(".ply") for scene in preview["scenes"])

    # Only point clouds this run registered can be streamed
    assert (
        client.get(
            f"/api/admin/training/{run['id']}/artifacts/../../../app.db",
            headers=admin_headers,
        ).status_code
        == 404
    )
    assert (
        client.get(
            f"/api/admin/training/{run['id']}/artifacts/nope.ply",
            headers=admin_headers,
        ).status_code
        == 404
    )

    listed = client.get("/api/admin/training?limit=5", headers=admin_headers).json()
    assert any(item["id"] == run["id"] for item in listed)


def test_failed_block_can_be_retried_reusing_the_poses(client, admin_headers):
    task, checkpoints = _create_task_with_photos(
        client,
        admin_headers,
        name=f"重试楼 {time.time()}",
        checkpoint_names=["大厅"],
        photos_each=2,
    )

    started = client.post(
        "/api/admin/training",
        json={"task_id": task["id"], "params": {"iterations": 1000}},
        headers=admin_headers,
    )
    run = started.json()
    detail = _wait_for_run(client, admin_headers, run["id"])
    assert detail["status"] == "succeeded", detail.get("message")
    block = detail["blocks"][0]

    # A successful block must not be re-queued by accident
    assert (
        client.post(
            f"/api/admin/training/blocks/{block['id']}/retry", headers=admin_headers
        ).status_code
        == 400
    )

    # Pretend this block failed (the mock pipeline never does)
    with SessionLocal() as db:
        row = db.get(TrainingBlock, block["id"])
        row.status = "failed"
        row.message = "测试用：伪造失败"
        db.commit()

    retried = client.post(
        f"/api/admin/training/blocks/{block['id']}/retry", headers=admin_headers
    )
    assert retried.status_code == 201, retried.text
    new_run = retried.json()
    assert new_run["block_total"] == 1
    assert new_run["reuse_run_id"] == run["id"]
    assert new_run["blocks"][0]["checkpoint_id"] == checkpoints[0]["id"]

    finished = _wait_for_run(client, admin_headers, new_run["id"])
    assert finished["status"] == "succeeded", finished.get("message")
    assert finished["blocks"][0]["status"] == "succeeded"

    # The retry reused the original run's poses instead of solving them again
    output = Path(config.DATA_DIR) / finished["output_path"]
    assert (output / "sparse_txt" / "images.txt").exists()
    transforms = json.loads((output / "transforms.json").read_text(encoding="utf-8"))
    assert transforms["sfm"]["source"] == "reused"


def test_cancel_run_marks_blocks(client, admin_headers):
    task, _checkpoints = _create_task_with_photos(
        client,
        admin_headers,
        name=f"取消楼 {time.time()}",
        checkpoint_names=["走廊"],
        photos_each=2,
    )
    started = client.post(
        "/api/admin/training", json={"task_id": task["id"]}, headers=admin_headers
    ).json()

    cancelled = client.post(
        f"/api/admin/training/{started['id']}/cancel", headers=admin_headers
    )
    assert cancelled.status_code == 200
    body = cancelled.json()
    assert body["status"] == "cancelled"
    assert all(block["status"] == "cancelled" for block in body["blocks"])


def test_manual_placement_is_saved_against_another_run(client, admin_headers):
    """The indoor → outdoor step of the docs cannot be automated (two SfM
    solves, no shared features), so the admin places one run's clouds by hand
    against another run's coordinate system and the result lands in
    transforms.json."""
    indoor_task, _ = _create_task_with_photos(
        client,
        admin_headers,
        name=f"室内摆放楼 {time.time()}",
        checkpoint_names=["3F 走廊"],
        photos_each=2,
    )
    outdoor_task, _ = _create_task_with_photos(
        client,
        admin_headers,
        name=f"室外基准楼 {time.time()}",
        checkpoint_names=["外立面"],
        photos_each=2,
        kind="outdoor",
    )

    indoor_start = client.post(
        "/api/admin/training", json={"task_id": indoor_task["id"]}, headers=admin_headers
    ).json()
    outdoor_start = client.post(
        "/api/admin/training", json={"task_id": outdoor_task["id"]}, headers=admin_headers
    ).json()
    indoor = _wait_for_run(client, admin_headers, indoor_start["id"])
    outdoor = _wait_for_run(client, admin_headers, outdoor_start["id"])
    assert indoor["status"] == "succeeded", indoor.get("message")
    assert outdoor["status"] == "succeeded", outdoor.get("message")

    # On its own, every scene starts at the identity placement
    alone = client.get(f"/api/admin/training/{indoor['id']}/preview", headers=admin_headers).json()
    assert len(alone["scenes"]) == 2  # merged + one block
    assert all(not scene["is_reference"] for scene in alone["scenes"])
    assert all(scene["transform_source"] == "identity" for scene in alone["scenes"])
    assert alone["scenes"][0]["placement"]["scale"] == 1.0
    assert len(alone["scenes"][0]["transform"]) == 4

    # Stack the outdoor run on top of it
    stacked = client.get(
        f"/api/admin/training/{indoor['id']}/preview?with_runs={outdoor['id']}",
        headers=admin_headers,
    ).json()
    assert len(stacked["scenes"]) == 4
    reference = [scene for scene in stacked["scenes"] if scene["is_reference"]]
    assert len(reference) == 2
    assert all(scene["run_id"] == outdoor["id"] for scene in reference)
    assert all(scene["key"].startswith(f"{outdoor['id']}:") for scene in reference)
    target = next(scene for scene in reference if scene["block_key"])
    assert len(target["placement"]["pivot"]) == 3

    # Every scene the editor can show must exist, with a size the UI can display
    assert all(scene["size_bytes"] > 0 for scene in stacked["scenes"])
    assert all(scene["gaussians"] > 0 for scene in stacked["scenes"])

    # Place that cloud, and move this run's own merged cloud as well
    response = client.put(
        f"/api/admin/training/{indoor['id']}/transforms",
        json={
            "placements": [
                {
                    "key": target["block_key"],
                    "run_id": outdoor["id"],
                    "offset": [12.0, 1.5, -3.0],
                    "yaw": 0.5,
                    "scale": 1.25,
                },
                {"key": "merged", "offset": [0.0, 2.0, 0.0]},
            ]
        },
        headers=admin_headers,
    )
    assert response.status_code == 200, response.text
    assert response.json()["saved"] == 2

    after = client.get(
        f"/api/admin/training/{indoor['id']}/preview?with_runs={outdoor['id']}",
        headers=admin_headers,
    ).json()
    moved = next(scene for scene in after["scenes"] if scene["key"] == target["key"])
    assert moved["transform_source"] == "manual"
    assert moved["placement"]["offset"] == [12.0, 1.5, -3.0]
    assert moved["placement"]["yaw"] == pytest.approx(0.5)
    assert moved["placement"]["scale"] == pytest.approx(1.25)
    assert moved["transform"] == pytest.approx(
        np.array(splat.matrix_for_placement(moved["placement"]))
    )
    own_merged = next(
        scene for scene in after["scenes"] if scene["merged"] and not scene["is_reference"]
    )
    assert own_merged["placement"]["offset"] == [0.0, 2.0, 0.0]

    # Everything landed in transforms.json
    output = Path(config.DATA_DIR) / indoor["output_path"]
    data = json.loads((output / "transforms.json").read_text(encoding="utf-8"))
    assert len(data["placements"]) == 1
    entry = data["placements"][0]
    assert entry["run_id"] == outdoor["id"]
    assert entry["key"] == target["block_key"]
    assert entry["transform_source"] == "manual"
    assert len(entry["transform"]) == 4
    assert data["alignment"]["manual_placements"] == 2
    assert data["updated_at"]

    # Hostile or nonsense input is refused
    assert (
        client.put(
            f"/api/admin/training/{indoor['id']}/transforms",
            json={"placements": [{"key": "b999", "offset": [0, 0, 0]}]},
            headers=admin_headers,
        ).status_code
        == 400
    )
    assert (
        client.put(
            f"/api/admin/training/{indoor['id']}/transforms",
            json={"placements": [{"key": "merged", "run_id": 999_999, "offset": [0, 0, 0]}]},
            headers=admin_headers,
        ).status_code
        == 400
    )
    assert (
        client.put(
            f"/api/admin/training/{indoor['id']}/transforms",
            json={"placements": [{"key": "merged", "offset": [0, 0]}]},
            headers=admin_headers,
        ).status_code
        == 422
    )
    assert (
        client.put(
            f"/api/admin/training/{indoor['id']}/transforms",
            json={
                "placements": [
                    {"key": "b999", "run_id": outdoor["id"], "offset": [0, 0, 0]}
                ]
            },
            headers=admin_headers,
        ).status_code
        == 400
    )

    # Repeating a reference run must not list its clouds twice
    duplicated = client.get(
        f"/api/admin/training/{indoor['id']}/preview?with_runs={outdoor['id']},{outdoor['id']}",
        headers=admin_headers,
    ).json()
    assert len(duplicated["scenes"]) == 4

    # An empty save is a no-op and must not touch updated_at
    before = json.loads((output / "transforms.json").read_text(encoding="utf-8"))["updated_at"]
    empty = client.put(
        f"/api/admin/training/{indoor['id']}/transforms",
        json={"placements": []},
        headers=admin_headers,
    )
    assert empty.status_code == 200
    assert empty.json()["saved"] == 0
    after_empty = json.loads((output / "transforms.json").read_text(encoding="utf-8"))["updated_at"]
    assert after_empty == before

    # Absurdly large payloads are rejected up front
    flood = client.put(
        f"/api/admin/training/{indoor['id']}/transforms",
        json={"placements": [{"key": "merged"}] * 201},
        headers=admin_headers,
    )
    assert flood.status_code == 422


def _photo(photo_id: int, checkpoint_id: int | None) -> Photo:    return Photo(
        id=photo_id,
        task_id=1,
        checkpoint_id=checkpoint_id,
        original_filename=f"{photo_id}.jpg",
        stored_path=f"uploads/{photo_id}.jpg",
        sha256=f"{photo_id:064d}",
        status="ok",
    )


def test_block_plan_splits_oversized_checkpoints():
    """A checkpoint beyond the limit becomes several blocks (docs: 200-600
    photos per room is the safe range, and one block is one 3DGS run)."""
    rows = [(_photo(index, 1), "3F 走廊") for index in range(1, 46)]
    rows.append((_photo(100, None), None))

    blocks = build_block_plan(rows, 20)

    assert [len(block.photos) for block in blocks] == [20, 20, 5, 1]
    assert [block.key for block in blocks] == ["b000", "b001", "b002", "b003"]
    assert blocks[0].name == "3F 走廊（1/3）"
    assert blocks[2].part_total == 3
    # Photos that were never assigned to a checkpoint still get trained
    assert blocks[3].checkpoint_id is None
    assert "未分配" in blocks[3].name
    # No photo is ever trained twice or dropped
    trained = [photo.id for block in blocks for photo in block.photos]
    assert sorted(trained) == sorted(photo.id for photo, _ in rows)


def test_block_plan_keeps_small_checkpoints_whole():
    rows = [(_photo(1, 5), "302"), (_photo(2, 5), "302"), (_photo(3, 6), "303")]
    blocks = build_block_plan(rows, 600)
    assert [block.name for block in blocks] == ["302", "303"]
    assert all(block.part_total == 1 for block in blocks)


def test_normalize_params_merges_defaults_and_drops_unknown_keys():
    merged = normalize_params({"iterations": 5000, "toolchain": "gsplat", "nonsense": 1})
    assert merged["iterations"] == 5000
    assert merged["toolchain"] == "gsplat"
    assert "nonsense" not in merged
    assert merged["block_max_photos"] == config.TRAINING_DEFAULTS["block_max_photos"]
