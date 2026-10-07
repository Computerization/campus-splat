"""The asynchronous quality path (services/quality_jobs.py).

Photos arrive as one batch per submission (a volunteer account claims a task,
fills every checkpoint and submits everything at once), but the *check* is still
deferred: the submission request only writes the files, the background worker in
services/quality_jobs.py produces the verdicts, and the phone watches each photo
flip from ``checking`` to its result.

The rest of the suite runs with ``THREEDGS_QUALITY_INLINE=1`` (see conftest), so
this file is what exercises the queue, the polling contract, the restart recovery
and the unreadable-file path.
"""

from __future__ import annotations

import json
import time

import pytest
from sqlalchemy import select

from app import config
from app.database import SessionLocal
from app.models import Photo
from app.services.quality_jobs import CHECKING_STATUS, queue

from .conftest import jpeg_bytes, make_textured_image, register_volunteer, submit_photos


@pytest.fixture
def async_quality(monkeypatch):
    """Submissions land in the background worker for the duration of one test."""
    monkeypatch.setenv("THREEDGS_QUALITY_INLINE", "0")
    assert config.quality_inline() is False
    yield queue
    # Don't leave work behind for the next test (the pool is a module singleton)
    assert queue.drain(timeout=60)


def _task_with_checkpoint(client, admin_headers, *, name: str, shot_count: int = 1):
    task = client.post(
        "/api/admin/tasks", json={"name": name, "kind": "indoor"}, headers=admin_headers
    ).json()
    checkpoint = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "3F 实验室 302", "shot_count": shot_count},
        headers=admin_headers,
    ).json()
    return task, checkpoint, register_volunteer(client)


def _submit_raw(client, task_id: int, headers, checkpoint_id: int, files: list):
    """Submit a batch directly, so the failure cases can be asserted."""
    manifest = [{"checkpoint_id": checkpoint_id} for _ in files]
    return client.post(
        f"/api/volunteer/tasks/{task_id}/submit",
        data={"manifest": json.dumps(manifest)},
        files=files,
        headers=headers,
    )


def _progress(client, admin_headers, task_id: int, checkpoint_id: int) -> dict:
    """How the checkpoint looks to the admin console (which always sees it)."""
    detail = client.get(f"/api/admin/tasks/{task_id}", headers=admin_headers).json()
    return next(cp for cp in detail["checkpoints"] if cp["id"] == checkpoint_id)


def _verdicts(client, headers, photo_ids) -> dict[int, dict]:
    rows = client.get(
        f"/api/volunteer/photos?ids={','.join(map(str, photo_ids))}", headers=headers
    ).json()
    return {row["photo_id"]: row for row in rows}


def test_a_submission_returns_before_the_checks_finish(client, admin_headers, async_quality):
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"异步提交 {time.time()}", shot_count=3
    )

    body = submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 3})
    results = body["results"]

    # Every photo is accepted and waiting for its verdict — the volunteer can move
    # on without waiting for the analysis
    assert [item["status"] for item in results] == [CHECKING_STATUS] * 3
    assert all(item["ok"] for item in results)
    assert all(item["photo_id"] for item in results)
    assert body["assignment"]["status"] == "submitted"

    # ... and nothing counts as usable yet
    progress = _progress(client, admin_headers, task["id"], checkpoint["id"])
    assert progress["uploaded_checking"] == 3
    assert progress["uploaded_usable"] == 0
    assert progress["uploaded_total"] == 3

    ids = [item["photo_id"] for item in results]
    assert set(_verdicts(client, headers, ids)) == set(ids)

    # The worker gets there on its own
    assert queue.drain(timeout=60)

    done = _verdicts(client, headers, ids)
    assert len(done) == 3
    assert all(item["status"] in ("ok", "warning", "rejected") for item in done.values())
    assert all(item["score"] is not None for item in done.values())

    after = _progress(client, admin_headers, task["id"], checkpoint["id"])
    assert after["uploaded_checking"] == 0
    assert after["uploaded_usable"] == 3

    with SessionLocal() as db:
        rows = db.execute(
            select(Photo.status, Photo.thumb_path).where(Photo.status != CHECKING_STATUS)
        ).all()
    assert rows and all(status in ("ok", "warning", "rejected") for status, _ in rows)
    # The thumbnail is part of the deferred work, so it exists once judged
    assert any(thumb for _, thumb in rows)


def test_only_your_own_photos_are_answered(client, admin_headers, async_quality):
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"轮询归属 {time.time()}"
    )
    body = submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 1})
    photo_id = body["results"][0]["photo_id"]

    other = register_volunteer(client)
    assert _verdicts(client, other, [photo_id]) == {}
    assert client.get("/api/volunteer/photos?ids=abc,", headers=other).json() == []
    assert client.get("/api/volunteer/photos?ids=1", headers={}).status_code == 401


def test_an_unreadable_file_is_refused_by_the_submission(client, admin_headers, async_quality):
    """A file that is not a picture at all fails the submission itself, which is
    what lets the whole batch roll back (ingest.py step 3)."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"损坏文件 {time.time()}"
    )
    client.post(f"/api/volunteer/tasks/{task['id']}/claim", headers=headers)

    response = _submit_raw(
        client,
        task["id"],
        headers,
        checkpoint["id"],
        [("files", ("broken.jpg", b"\xff\xd8\xff\xe0not really a jpeg", "image/jpeg"))],
    )
    assert response.status_code == 400
    assert "无法解析" in response.json()["detail"]

    with SessionLocal() as db:
        assert db.execute(select(Photo).where(Photo.task_id == task["id"])).scalars().all() == []


def test_byte_identical_content_is_refused_by_the_submission(client, admin_headers, async_quality):
    """The sha256 check stays synchronous: it decides whether the file is kept."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"完全重复 {time.time()}"
    )
    payload = jpeg_bytes(make_textured_image(2000, 1500, seed=99), quality=80)

    client.post(f"/api/volunteer/tasks/{task['id']}/claim", headers=headers)
    first = _submit_raw(
        client, task["id"], headers, checkpoint["id"], [("files", ("a.jpg", payload, "image/jpeg"))]
    )
    assert first.status_code == 200, first.text
    assert first.json()["results"][0]["status"] == CHECKING_STATUS

    # A second volunteer submits the identical bytes
    other = register_volunteer(client)
    client.post(f"/api/volunteer/tasks/{task['id']}/claim", headers=other)
    again = _submit_raw(
        client, task["id"], other, checkpoint["id"], [("files", ("b.jpg", payload, "image/jpeg"))]
    )
    assert again.status_code == 400
    assert "已经上传过" in again.json()["detail"]


def test_a_restart_requeues_photos_left_in_checking(client, admin_headers, async_quality):
    """Whatever a crash interrupted is picked up at startup, because a photo stuck
    in ``checking`` would otherwise never get a verdict."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"重启恢复 {time.time()}", shot_count=2
    )
    body = submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 2})
    ids = [item["photo_id"] for item in body["results"]]

    # Pretend the process died right after the rows were written
    with SessionLocal() as db:
        for photo_id in ids:
            photo = db.get(Photo, photo_id)
            photo.status = CHECKING_STATUS
            if photo.quality is not None:
                db.delete(photo.quality)
        db.commit()
    assert queue.drain(timeout=60)  # let the first pass finish

    queue.shutdown()
    queue.start()
    assert queue.drain(timeout=60)

    done = _verdicts(client, headers, ids)
    assert all(item["status"] != CHECKING_STATUS for item in done.values())
    with SessionLocal() as db:
        assert db.execute(select(Photo).where(Photo.status == CHECKING_STATUS)).scalars().all() == []


def test_a_manual_verdict_is_not_overwritten_by_the_worker(client, admin_headers, async_quality):
    """An admin may judge a photo that is still queued; the background check must
    not undo that."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"人工判定优先 {time.time()}", shot_count=2
    )
    body = submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 2})
    ids = [item["photo_id"] for item in body["results"]]

    for photo_id in ids:
        reviewed = client.patch(
            f"/api/admin/photos/{photo_id}",
            json={"status": "rejected", "note": "测试：人工判定"},
            headers=admin_headers,
        )
        assert reviewed.status_code == 200, reviewed.text
        assert reviewed.json()["status"] == "rejected"

    assert queue.drain(timeout=60)

    final = _verdicts(client, headers, ids)
    assert [final[photo_id]["status"] for photo_id in ids] == ["rejected", "rejected"]
    assert all("人工判定" in (final[photo_id]["advice"] or "") for photo_id in ids)


def test_still_checking_photos_are_visible_and_excluded_from_training(
    client, admin_headers, async_quality, monkeypatch
):
    """A run started while a batch is still in the queue uses only judged photos —
    and says so instead of silently leaving them out."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"质检中的照片 {time.time()}", shot_count=2
    )
    body = submit_photos(client, task["id"], headers, per_checkpoint={checkpoint["id"]: 2})
    ids = [item["photo_id"] for item in body["results"]]
    # The submission reply itself already shows them as in flight
    assert _progress(client, admin_headers, task["id"], checkpoint["id"])["uploaded_checking"] == 2
    assert queue.drain(timeout=60)

    # Put them back into the state the worker sees while it is busy (the real
    # thing is over in milliseconds, so it is set up explicitly here)
    with SessionLocal() as db:
        for photo_id in ids:
            db.get(Photo, photo_id).status = CHECKING_STATUS
        db.commit()

    progress = next(
        item
        for item in client.get("/api/admin/tasks", headers=admin_headers).json()
        if item["task"]["id"] == task["id"]
    )
    assert progress["photo_checking"] == 2
    assert progress["photo_ok"] + progress["photo_warning"] == 0
    assert progress["photo_total"] == 2  # in flight, so not usable yet
    listed = client.get(
        "/api/admin/photos", params={"status": "checking"}, headers=admin_headers
    ).json()
    assert listed["total"] >= 2

    # The preflight warns that a run started now would not include them
    monkeypatch.setenv("THREEDGS_TRAINING_MODE", "real")
    preflight = client.get(
        f"/api/admin/training/preflight?task_id={task['id']}", headers=admin_headers
    ).json()
    assert any("在后台质检" in warning for warning in preflight.get("warnings", []))
    assert preflight["photo_count"] == 0  # only judged photos are planned

    # Give the photos back to the worker — the same path a restart takes
    assert queue.requeue_stale() >= 2
    assert queue.drain(timeout=60)

    after = next(
        item
        for item in client.get("/api/admin/tasks", headers=admin_headers).json()
        if item["task"]["id"] == task["id"]
    )
    assert after["photo_checking"] == 0
    assert after["photo_ok"] + after["photo_warning"] == 2
