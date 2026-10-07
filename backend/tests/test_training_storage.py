"""Managing the training output on disk (services/training.py + admin router).

Every run keeps its own directory (``data/training/runN/``), which is what makes
"archive it or delete it" a single-folder decision. These tests cover the two
things the console needs for that: deleting a run record (with or without its
files) and knowing how much disk the platform actually uses — including the fact
that a run's ``input/`` holds hard links to the uploaded photos and must not be
counted twice.
"""

from __future__ import annotations

import re
import secrets
import time
from pathlib import Path

from app import config, storage
from app.database import SessionLocal
from app.models import Task, TrainingRun

from .conftest import jpeg_bytes, make_textured_image
from .test_api import _upload
from .test_training_pipeline import _create_task_with_photos, _wait_for_run


def _finished_run(client, admin_headers, *, name: str) -> dict:
    task, _checkpoints = _create_task_with_photos(
        client, admin_headers, name=name, checkpoint_names=["走廊"], photos_each=2
    )
    started = client.post(
        "/api/admin/training",
        json={"task_id": task["id"], "params": {"iterations": 1000}},
        headers=admin_headers,
    ).json()
    detail = _wait_for_run(client, admin_headers, started["id"])
    assert detail["status"] == "succeeded", detail.get("message")
    return detail


def test_deleting_a_run_keeps_the_files_by_default(client, admin_headers):
    run = _finished_run(client, admin_headers, name=f"删除保留文件 {time.time()}")
    output = Path(config.DATA_DIR) / run["output_path"]
    assert (output / "merged.ply").exists()

    response = client.delete(f"/api/admin/training/{run['id']}", headers=admin_headers)
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["files_deleted"] is False
    assert body["kept_at"] == run["output_path"]
    assert body["freed_bytes"] == 0

    # Gone from the API …
    assert (
        client.get(f"/api/admin/training/{run['id']}", headers=admin_headers).status_code == 404
    )
    assert all(
        item["id"] != run["id"]
        for item in client.get("/api/admin/training", headers=admin_headers).json()
    )
    # … but a few hours of GPU time are still on disk
    assert (output / "merged.ply").exists()
    assert (output / "transforms.json").exists()


def test_deleting_a_run_with_purge_files_frees_the_space(client, admin_headers):
    run = _finished_run(client, admin_headers, name=f"删除连文件 {time.time()}")
    work_dir = (config.DATA_DIR / run["output_path"]).parent
    log_path = config.LOG_DIR / f"training_run{run['id']}.log"
    assert work_dir.exists()
    assert log_path.exists()

    response = client.delete(
        f"/api/admin/training/{run['id']}", params={"purge_files": True}, headers=admin_headers
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["files_deleted"] is True
    assert body["freed_bytes"] > 0
    assert body["kept_at"] is None

    assert not work_dir.exists()
    assert not log_path.exists()
    assert (
        client.get(f"/api/admin/training/{run['id']}", headers=admin_headers).status_code == 404
    )


def test_a_running_train_cannot_be_deleted(client, admin_headers):
    """A running run is still writing into its directory, so it has to be
    cancelled first — the API says so instead of yanking the files away."""
    with SessionLocal() as db:
        # The run has to belong to a task this admin owns (admin_scope checks the
        # identifiers in the path), so create one.
        task = Task(
            name="运行中的任务",
            kind="indoor",
            access_code=secrets.token_hex(4).upper(),
            owner_admin_id=1,
        )
        db.add(task)
        db.commit()
        run = TrainingRun(
            task_id=task.id,
            name="运行中的训练",
            status="running",
            stage="train",
            progress=10.0,
        )
        db.add(run)
        db.commit()
        run_id = run.id

    response = client.delete(f"/api/admin/training/{run_id}", headers=admin_headers)
    assert response.status_code == 400
    assert "取消" in response.json()["detail"]

    # Once it stopped, the record can go
    with SessionLocal() as db:
        row = db.get(TrainingRun, run_id)
        row.status = "failed"
        db.commit()
    assert client.delete(f"/api/admin/training/{run_id}", headers=admin_headers).status_code == 200


def test_disk_report_counts_training_and_dedupes_hard_links(client, admin_headers):
    """A run's input/ is hard links to the photos: reporting both would double
    count the same bytes and make "how big are the photos" meaningless."""
    run = _finished_run(client, admin_headers, name=f"占用统计 {time.time()}")
    work_dir = (config.DATA_DIR / run["output_path"]).parent
    input_files = [path for path in (work_dir / "input").rglob("*") if path.is_file()]
    assert input_files
    # Sanity: the trainer's input really is hard-linked to the archived photo
    assert input_files[0].stat().st_nlink > 1

    usage = client.get("/api/admin/system", headers=admin_headers).json()["storage"]
    assert usage["photos_bytes"] > 0
    assert usage["thumbnails_bytes"] > 0
    assert usage["training_bytes"] >= 0
    # The photos are counted once, where they live
    assert usage["photos_bytes"] == storage.tree_bytes(config.UPLOAD_DIR)
    assert usage["managed_bytes"] >= usage["photos_bytes"]

    # Deleting the run WITH its files frees what the training directory held
    before = usage["training_bytes"]
    client.delete(
        f"/api/admin/training/{run['id']}", params={"purge_files": True}, headers=admin_headers
    )
    after = client.get("/api/admin/system", headers=admin_headers).json()["storage"]
    assert after["training_bytes"] < before
    assert after["photos_bytes"] == usage["photos_bytes"]  # photos untouched


def test_deleting_a_run_drops_its_blocks(client, admin_headers):
    run = _finished_run(client, admin_headers, name=f"删块记录 {time.time()}")
    block_ids = [block["id"] for block in run["blocks"]]
    assert block_ids

    client.delete(f"/api/admin/training/{run['id']}", headers=admin_headers)

    for block_id in block_ids:
        assert (
            client.get(f"/api/admin/training/blocks/{block_id}/log", headers=admin_headers).status_code
            == 404
        )


def test_run_folder_is_named_after_its_task(client, admin_headers):
    """data/training/<任务名>/<时间戳>/ — one look at the tree says which building
    it is, and a second run of the same task gets its own folder instead of
    writing over the first one."""
    run = _finished_run(client, admin_headers, name=f"目录命名 {time.time()}")

    parts = Path(run["output_path"]).parts
    assert parts[0] == "training"
    task_folder, stamp, leaf = parts[1], parts[2], parts[3]
    assert leaf == "output"
    assert re.fullmatch(r"\d{8}-\d{4}(-\d+)?", stamp), stamp
    assert task_folder and all(ord(char) < 128 for char in task_folder), task_folder
    assert (config.DATA_DIR / run["output_path"]).exists()

    # Running the same task again does not touch the first run's files
    again = client.post(
        "/api/admin/training",
        json={"task_id": run["task_id"], "params": {"iterations": 1000}},
        headers=admin_headers,
    ).json()
    second = _wait_for_run(client, admin_headers, again["id"])
    assert second["status"] == "succeeded", second.get("message")

    second_parts = Path(second["output_path"]).parts
    assert second["output_path"] != run["output_path"]
    assert second_parts[1] == task_folder
    assert second_parts[2] != stamp
    assert (config.DATA_DIR / run["output_path"] / "merged.ply").exists()
