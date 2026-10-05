"""End-to-end API tests: admin sets things up -> volunteer uploads -> progress
statistics -> training dispatch.
"""

from __future__ import annotations

import time

from app import config

from .conftest import jpeg_bytes, make_textured_image


def _upload(client, checkpoint_id, headers, files):
    return client.post(
        f"/api/volunteer/checkpoints/{checkpoint_id}/photos",
        files=files,
        headers=headers,
    )


def test_health(client):
    assert client.get("/api/health").json()["ok"] is True


def test_requires_login(client):
    assert client.get("/api/admin/overview").status_code == 401
    assert client.get("/api/volunteer/board").status_code == 401


def test_wrong_admin_password(client):
    response = client.post("/api/auth/admin/login", json={"password": "nope"})
    assert response.status_code == 401


def test_full_capture_flow(client, admin_headers):
    # Admin creates the task
    created = client.post(
        "/api/admin/tasks",
        json={"name": "测试楼室内", "kind": "indoor", "location_hint": "东校区"},
        headers=admin_headers,
    )
    assert created.status_code == 201, created.text
    task = created.json()
    assert len(task["access_code"]) >= 6

    # Bulk-import checkpoints (what an admin would paste in)
    bulk = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints/bulk",
        json={
            "mode": "append",
            "items": [
                {"name": "3F 走廊东端", "building": "测试楼", "floor": "3F", "shot_count": 2},
                {"name": "3F 实验室 302", "building": "测试楼", "floor": "3F", "shot_count": 1},
            ],
        },
        headers=admin_headers,
    )
    assert bulk.status_code == 200, bulk.text
    assert bulk.json()["created"] == 2

    detail = client.get(f"/api/admin/tasks/{task['id']}", headers=admin_headers).json()
    checkpoints = detail["checkpoints"]
    assert len(checkpoints) == 2
    assert [cp["order_index"] for cp in checkpoints] == [0, 1]
    target = checkpoints[0]

    # Volunteer joins with the access code
    join = client.post(
        "/api/auth/volunteer/join",
        json={"access_code": task["access_code"].lower(), "nickname": "小明"},
    )
    assert join.status_code == 200, join.text
    volunteer_headers = {"Authorization": f"Bearer {join.json()['token']}"}

    board = client.get("/api/volunteer/board", headers=volunteer_headers).json()
    assert board["task"]["id"] == task["id"]
    assert board["nickname"] == "小明"

    # Upload two good photos
    sharp = jpeg_bytes(make_textured_image(3000, 2000, seed=11))
    response = _upload(
        client,
        target["id"],
        volunteer_headers,
        [
            ("files", ("a.jpg", sharp, "image/jpeg")),
            ("files", ("b.jpg", jpeg_bytes(make_textured_image(3000, 2000, seed=12)), "image/jpeg")),
        ],
    )
    assert response.status_code == 200, response.text
    batch = response.json()
    assert len(batch["results"]) == 2
    assert all(item["photo_id"] for item in batch["results"])
    assert batch["checkpoint"]["uploaded_usable"] == 2
    assert batch["checkpoint"]["status"] == "done"

    # Uploading the same file again must be caught by sha256
    duplicate = _upload(
        client, target["id"], volunteer_headers, [("files", ("a-copy.jpg", sharp, "image/jpeg"))]
    ).json()
    assert duplicate["results"][0]["ok"] is False
    assert "已经上传过" in (duplicate["results"][0]["error"] or "")
    assert duplicate["checkpoint"]["uploaded_usable"] == 2  # not double counted

    # Upload a blurry one: it must be rejected and not counted as usable
    blurred = jpeg_bytes(make_textured_image(3000, 2000, seed=13, blur_radius=14))
    rejected = _upload(
        client, target["id"], volunteer_headers, [("files", ("blur.jpg", blurred, "image/jpeg"))]
    ).json()
    assert rejected["results"][0]["status"] == "rejected"
    assert rejected["checkpoint"]["uploaded_rejected"] == 1
    assert rejected["checkpoint"]["uploaded_usable"] == 2

    # A volunteer from another task must not see this checkpoint: 404
    other = client.post(
        "/api/admin/tasks", json={"name": "另一个任务"}, headers=admin_headers
    ).json()
    other_join = client.post(
        "/api/auth/volunteer/join",
        json={"access_code": other["access_code"], "nickname": "小红"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_join['token']}"}
    assert client.get(f"/api/volunteer/checkpoints/{target['id']}", headers=other_headers).status_code == 404

    # Admin overview
    overview = client.get("/api/admin/overview", headers=admin_headers).json()
    mine = next(item for item in overview["tasks"] if item["task"]["id"] == task["id"])
    assert mine["photo_total"] == 3
    assert mine["photo_rejected"] == 1
    assert mine["checkpoint_done"] == 1
    assert "小明" in mine["contributors"]

    # Photo list with filtering
    photos = client.get(
        f"/api/admin/photos?task_id={task['id']}&status=rejected", headers=admin_headers
    ).json()
    assert photos["total"] == 1
    rejected_photo = photos["items"][0]

    # Admin manual override
    reviewed = client.patch(
        f"/api/admin/photos/{rejected_photo['id']}",
        json={"status": "ok", "note": "实际可用"},
        headers=admin_headers,
    )
    assert reviewed.status_code == 200
    assert reviewed.json()["status"] == "ok"

    # Media access (thumbnails take the token as a query parameter)
    thumb = client.get(f"/api/media/thumb/{rejected_photo['id']}")
    assert thumb.status_code == 401  # must be refused without a token
    with_token = client.get(
        f"/api/media/thumb/{rejected_photo['id']}?token={join.json()['token']}"
    )
    assert with_token.status_code == 200

    # CSV export
    csv_response = client.get(
        f"/api/admin/tasks/{task['id']}/export.csv", headers=admin_headers
    )
    assert csv_response.status_code == 200
    assert "photo_id" in csv_response.text
    assert "a.jpg" in csv_response.text


def test_checkpoint_room_size_roundtrip(client, admin_headers):
    """Room dimensions must survive create/patch/read — the frontend uses them
    to suggest a photo count.
    """
    task = client.post(
        "/api/admin/tasks", json={"name": "尺寸测试楼"}, headers=admin_headers
    ).json()

    created = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={
            "name": "教室 201",
            "shot_count": 39,
            "length_m": 8,
            "width_m": 6,
            "room_height_m": 3.5,
        },
        headers=admin_headers,
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert (body["length_m"], body["width_m"], body["room_height_m"]) == (8.0, 6.0, 3.5)

    # Changing one field must not drop the others (patch uses setattr)
    patched = client.patch(
        f"/api/admin/checkpoints/{body['id']}",
        json={"shot_count": 45, "room_height_m": 4.0},
        headers=admin_headers,
    )
    assert patched.status_code == 200, patched.text
    after = patched.json()
    assert after["shot_count"] == 45
    assert after["room_height_m"] == 4.0
    assert after["length_m"] == 8.0
    assert after["width_m"] == 6.0

    # Leaving the dimensions empty must be fine too (they are only for the estimate)
    plain = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "没量的走廊", "shot_count": 6},
        headers=admin_headers,
    )
    assert plain.status_code == 201
    assert plain.json()["length_m"] is None

    detail = client.get(f"/api/admin/tasks/{task['id']}", headers=admin_headers).json()
    names = [cp["name"] for cp in detail["checkpoints"]]
    assert "教室 201" in names and "没量的走廊" in names


def test_training_run_lifecycle(client, admin_headers):
    task = client.post(
        "/api/admin/tasks", json={"name": "训练测试楼"}, headers=admin_headers
    ).json()
    checkpoint = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "一楼大厅", "shot_count": 1},
        headers=admin_headers,
    ).json()

    join = client.post(
        "/api/auth/volunteer/join",
        json={"access_code": task["access_code"], "nickname": "测试同学"},
    ).json()
    headers = {"Authorization": f"Bearer {join['token']}"}

    response = _upload(
        client,
        checkpoint["id"],
        headers,
        [("files", ("hall.jpg", jpeg_bytes(make_textured_image(3000, 2000, seed=21)), "image/jpeg"))],
    )
    assert response.json()["checkpoint"]["uploaded_usable"] == 1

    # A task with no photos must be refused
    empty = client.post(
        "/api/admin/tasks", json={"name": "空任务"}, headers=admin_headers
    ).json()
    blocked = client.post(
        "/api/admin/training", json={"task_id": empty["id"]}, headers=admin_headers
    )
    assert blocked.status_code == 400

    # Normal launch (mock mode finishes in a few seconds)
    started = client.post(
        "/api/admin/training", json={"task_id": task["id"]}, headers=admin_headers
    )
    assert started.status_code == 201, started.text
    run_id = started.json()["id"]
    assert started.json()["status"] in ("queued", "running")

    deadline = time.time() + 40
    status = None
    while time.time() < deadline:
        detail = client.get(f"/api/admin/training/{run_id}", headers=admin_headers).json()
        status = detail["status"]
        if status in ("succeeded", "failed", "cancelled"):
            break
        time.sleep(0.5)

    assert status == "succeeded", f"训练没有成功结束，最后状态 {status}"
    detail = client.get(f"/api/admin/training/{run_id}", headers=admin_headers).json()
    assert detail["progress"] == 100.0
    assert detail["photo_count"] == 1
    assert detail["output_path"]

    log = client.get(f"/api/admin/training/{run_id}/log", headers=admin_headers).json()
    assert log["lines"], "训练应该产生日志"


def test_upload_size_limit(client, admin_headers, monkeypatch):
    """An oversized file must be stopped *during* the write, not after it has
    filled the disk.
    """
    monkeypatch.setattr(config, "MAX_UPLOAD_MB", 1)  # don't actually build 60MB here

    task = client.post(
        "/api/admin/tasks", json={"name": "超限测试"}, headers=admin_headers
    ).json()
    checkpoint = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "大厅", "shot_count": 1},
        headers=admin_headers,
    ).json()
    join = client.post(
        "/api/auth/volunteer/join",
        json={"access_code": task["access_code"], "nickname": "超限同学"},
    ).json()
    headers = {"Authorization": f"Bearer {join['token']}"}

    oversize = b"\xff\xd8\xff" + b"0" * (2 * 1024 * 1024)  # 2MB > the 1MB limit
    response = _upload(
        client, checkpoint["id"], headers, [("files", ("huge.jpg", oversize, "image/jpeg"))]
    )
    assert response.status_code == 200, response.text
    item = response.json()["results"][0]
    assert item["ok"] is False
    assert "太大" in (item["error"] or "")

    # The important bit: no half-written file may be left on disk
    uploads = config.UPLOAD_DIR / f"task{task['id']}"
    leftovers = [str(p) for p in uploads.rglob("*") if p.is_file()] if uploads.exists() else []
    assert leftovers == [], f"超限文件残留了：{leftovers}"


def test_login_lockout_after_repeated_failures(client):
    """The default password is public in this repo, so repeated failures must be
    rate-limited.

    This test pollutes the limiter, so it runs last.
    """
    codes = [
        client.post("/api/auth/admin/login", json={"password": "definitely-wrong"}).status_code
        for _ in range(config.LOGIN_MAX_FAILURES + 2)
    ]
    assert 429 in codes, f"连续输错密码没有被限流：{codes}"

    # Even the correct password is refused while locked out
    locked = client.post("/api/auth/admin/login", json={"password": "test-password"})
    assert locked.status_code == 429
    assert "Retry-After" in locked.headers
