"""The on-disk layout of uploads.

Requirement: six months later, a photo in data/uploads must still be findable by
a person reading the path, and the path must be pure ASCII (COLMAP, tar, rsync
and Windows all behave better that way). So the tests here assert the *shape* of
what ends up on disk, not just that a file exists.

Photos go in through the volunteer flow of the platform (register an account,
claim the task, submit one batch) — see ``conftest.submit_photos``.
"""

from __future__ import annotations

import secrets
import time
from pathlib import Path

from sqlalchemy import select

from app import config
from app.database import SessionLocal
from app.models import Checkpoint, Photo

from .conftest import register_volunteer, submit_photos

# The name lands in the file name, so it doubles as a pinyin check
# (张伟 -> ZhangWei). Usernames must be unique, hence the random suffix.
VOLUNTEER_PREFIX = "张伟"


def _task_and_checkpoint(client, admin_headers, *, task_name, checkpoint_names, shot_count=1):
    task = client.post(
        "/api/admin/tasks", json={"name": task_name, "kind": "indoor"}, headers=admin_headers
    ).json()
    checkpoints = [
        client.post(
            f"/api/admin/tasks/{task['id']}/checkpoints",
            json={"name": name, "shot_count": shot_count},
            headers=admin_headers,
        ).json()
        for name in checkpoint_names
    ]
    headers = register_volunteer(client, username=f"{VOLUNTEER_PREFIX}{secrets.token_hex(2)}")
    return task, checkpoints, headers


def _stored_paths(task_id: int) -> list[str]:
    with SessionLocal() as db:
        return [
            row
            for (row,) in db.execute(
                select(Photo.stored_path).where(Photo.task_id == task_id).order_by(Photo.id)
            )
        ]


def test_upload_path_is_readable_ascii_and_numbered(client, admin_headers):
    task, (checkpoint,), headers = _task_and_checkpoint(
        client,
        admin_headers,
        task_name="三号楼 3F",
        checkpoint_names=["3F 实验室 302"],
    )

    submit_photos(
        client, task["id"], headers, per_checkpoint={checkpoint["id"]: 2}, seed=0
    )

    paths = _stored_paths(task["id"])
    assert len(paths) == 2
    for path in paths:
        # uploads/<Task name in pinyin-camel>/<checkpoint name>/<index>_<who>.jpg
        assert path.startswith("uploads/")
        assert all(ord(char) < 128 for char in path), path
        assert Path(path).stem.startswith("_") is False
        assert "_ZhangWei" in Path(path).stem, path
        assert (config.DATA_DIR / path).is_file()

    # "三号楼 3F" -> SanHaoLou3F, "3F 实验室 302" -> 3FShiYanShi302
    assert "SanHaoLou3F/3FShiYanShi302/" in paths[0]
    # Numbered inside the checkpoint, so the folder reads like a shot list
    assert Path(paths[0]).stem.startswith("0001_ZhangWei"), paths[0]
    assert Path(paths[1]).stem.startswith("0002_ZhangWei"), paths[1]

    # The original name from the phone is kept in the database for reference
    with SessionLocal() as db:
        originals = [
            row
            for (row,) in db.execute(
                select(Photo.original_filename).where(Photo.task_id == task["id"]).order_by(Photo.id)
            )
        ]
    assert originals == ["IMG_1.jpg", "IMG_2.jpg"]


def test_same_name_twice_gets_a_readable_suffix(client, admin_headers):
    """Two identical checkpoint names must not merge into one folder."""
    task, checkpoints, _headers = _task_and_checkpoint(
        client,
        admin_headers,
        task_name=f"重名测试 {time.time()}",
        checkpoint_names=["走廊", "走廊"],
    )
    with SessionLocal() as db:
        folders = [
            row
            for (row,) in db.execute(
                select(Checkpoint.folder)
                .where(Checkpoint.task_id == task["id"])
                .order_by(Checkpoint.order_index)
            )
        ]
    assert folders == ["ZouLang", "ZouLang-2"], folders

    # … and a checkpoint added later with the same name keeps going
    third = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "走廊"},
        headers=admin_headers,
    ).json()
    assert third["folder"] == "ZouLang-3"


def test_bulk_import_keeps_folder_names_unique(client, admin_headers):
    task = client.post(
        "/api/admin/tasks",
        json={"name": f"批量导入 {time.time()}", "kind": "indoor"},
        headers=admin_headers,
    ).json()
    response = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints/bulk",
        json={
            "mode": "append",
            "items": [{"name": "实验室"}, {"name": "实验室"}, {"name": "Lab"}],
        },
        headers=admin_headers,
    )
    assert response.status_code == 200, response.text

    with SessionLocal() as db:
        folders = [
            row
            for (row,) in db.execute(
                select(Checkpoint.folder)
                .where(Checkpoint.task_id == task["id"])
                .order_by(Checkpoint.order_index)
            )
        ]
    assert folders == ["ShiYanShi", "ShiYanShi-2", "Lab"], folders


def test_renaming_never_moves_the_photos(client, admin_headers):
    """The folder is fixed at creation: renaming a task or checkpoint keeps the
    photos where they are (and keeps the old name readable in the path)."""
    task, (checkpoint,), headers = _task_and_checkpoint(
        client,
        admin_headers,
        task_name=f"原名楼 {time.time()}",
        checkpoint_names=["走廊"],
    )
    submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 1}, seed=40)

    before = _stored_paths(task["id"])[0]
    client.patch(
        f"/api/admin/tasks/{task['id']}", json={"name": "改了个名字"}, headers=admin_headers
    )
    client.patch(
        f"/api/admin/checkpoints/{checkpoint['id']}", json={"name": "也改了"}, headers=admin_headers
    )

    assert _stored_paths(task["id"])[0] == before
    assert (config.DATA_DIR / before).is_file()


def test_purge_photos_keeps_tasks_and_checkpoints(client, admin_headers):
    """The one-off switch to the new layout: photos go, the plan stays."""
    task, (checkpoint,), headers = _task_and_checkpoint(
        client,
        admin_headers,
        task_name=f"清空照片 {time.time()}",
        checkpoint_names=["走廊"],
    )
    submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 2}, seed=50)

    paths = _stored_paths(task["id"])
    assert len(paths) == 2
    folder = (config.DATA_DIR / paths[0]).parent

    purged = client.post("/api/admin/photos/purge", headers=admin_headers)
    assert purged.status_code == 200, purged.text
    # Other tests in this session share the database, so "at least these two"
    assert purged.json()["deleted_photos"] >= 2
    assert purged.json()["freed_bytes"] > 0

    # Photos are gone — records, files and the now-empty folder
    assert _stored_paths(task["id"]) == []
    assert not (config.DATA_DIR / paths[0]).exists()
    assert not folder.exists()
    assert client.get("/api/admin/photos", headers=admin_headers).json()["total"] == 0

    # Files with no database row at all (left behind by an earlier cleanup) go too
    orphan = config.UPLOAD_DIR / "task99" / "cp1" / "abandoned.jpg"
    orphan.parent.mkdir(parents=True, exist_ok=True)
    orphan.write_bytes(b"old upload with no record")
    client.post("/api/admin/photos/purge", headers=admin_headers)
    assert not orphan.exists()
    assert not (config.UPLOAD_DIR / "task99").exists()

    # … while the task and its checkpoint are untouched
    detail = client.get(f"/api/admin/tasks/{task['id']}", headers=admin_headers).json()
    assert detail["task"]["task"]["name"].startswith("清空照片")
    assert [cp["name"] for cp in detail["checkpoints"]] == ["走廊"]
    assert detail["checkpoints"][0]["folder"] == "ZouLang"

    # A photo submitted afterwards starts the numbering over (a fresh account,
    # because one volunteer cannot claim the same task twice)
    fresh = register_volunteer(client, username=f"{VOLUNTEER_PREFIX}{secrets.token_hex(2)}")
    submit_photos(client, task["id"], fresh, per_checkpoint={checkpoint["id"]: 1}, seed=60)
    assert Path(_stored_paths(task["id"])[0]).stem.startswith("0001_ZhangWei")


def test_purge_can_be_limited_to_one_task(client, admin_headers):
    keep_task, (keep_cp,), keep_headers = _task_and_checkpoint(
        client, admin_headers, task_name=f"保留任务 {time.time()}", checkpoint_names=["走廊"]
    )
    drop_task, (drop_cp,), drop_headers = _task_and_checkpoint(
        client, admin_headers, task_name=f"清空任务 {time.time()}", checkpoint_names=["走廊"]
    )
    submit_photos(client, keep_task["id"], keep_headers, per_checkpoint={keep_cp["id"]: 1}, seed=70)
    submit_photos(client, drop_task["id"], drop_headers, per_checkpoint={drop_cp["id"]: 1}, seed=80)

    purged = client.post(
        "/api/admin/photos/purge", params={"task_id": drop_task["id"]}, headers=admin_headers
    ).json()
    assert purged["deleted_photos"] == 1
    assert _stored_paths(keep_task["id"]) != []
    assert _stored_paths(drop_task["id"]) == []
