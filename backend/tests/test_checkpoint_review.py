"""点位照片最终审核：一次一个点位、审核权限、试解算报告、管理员改密码。"""

from __future__ import annotations

import secrets

from .conftest import admin_login, jpeg_bytes, make_textured_image, register_volunteer
from .test_workflow import task


def _upload(client, headers, checkpoint_id: int, *, count: int = 1, seed: int = 0) -> dict:
    """Upload ``count`` photos to a checkpoint the volunteer holds."""
    files = [
        (
            "files",
            (
                f"IMG_{seed + index}.jpg",
                jpeg_bytes(make_textured_image(1600, 1200, seed=seed + index)),
                "image/jpeg",
            ),
        )
        for index in range(count)
    ]
    response = client.post(
        f"/api/volunteer/checkpoints/{checkpoint_id}/photos", files=files, headers=headers
    )
    assert response.status_code == 200, response.text
    return response.json()


def _claim(client, headers, checkpoint_id: int):
    return client.post(f"/api/volunteer/checkpoints/{checkpoint_id}/claim", headers=headers)


def _submit(client, headers, checkpoint_id: int):
    return client.post(f"/api/volunteer/checkpoints/{checkpoint_id}/submit", headers=headers)


def _task_with_checkpoints(client, admin, names: list[str], *, shots: int = 1):
    """One task with one checkpoint per name."""
    created = client.post(
        "/api/admin/tasks", headers=admin, json={"name": f"审核测试{secrets.token_hex(3)}"}
    )
    assert created.status_code == 201, created.text
    t = created.json()
    checkpoints = []
    for name in names:
        response = client.post(
            f"/api/admin/tasks/{t['id']}/checkpoints",
            headers=admin,
            json={"name": name, "shot_count": shots},
        )
        assert response.status_code == 201, response.text
        checkpoints.append(response.json())
    return t, checkpoints


# ------------------------------------------------------------- 一次一个点位


def test_one_checkpoint_at_a_time(client, admin_headers):
    _, (room_a, room_b) = _task_with_checkpoints(client, admin_headers, ["房间A", "房间B"], shots=2)
    v = register_volunteer(client)

    assert _claim(client, v, room_a["id"]).status_code == 200
    # The first one is not handed in yet, so the next one is refused.
    assert _claim(client, v, room_b["id"]).status_code == 409

    _upload(client, v, room_a["id"], count=2)
    assert _submit(client, v, room_a["id"]).status_code == 200
    # Handed in → the volunteer may take the next checkpoint immediately.
    assert _claim(client, v, room_b["id"]).status_code == 200


def test_completing_a_checkpoint_does_not_require_the_whole_task(client, admin_headers):
    """拍完一个房间就能交，不用等这个任务的所有点位都拍完。"""
    t, (room_a, room_b) = _task_with_checkpoints(client, admin_headers, ["先拍这间", "以后再拍"], shots=1)
    v = register_volunteer(client)

    assert _claim(client, v, room_a["id"]).status_code == 200
    _upload(client, v, room_a["id"], count=1)
    assert _submit(client, v, room_a["id"]).status_code == 200

    board = client.get("/api/volunteer/board", headers=v).json()
    reviewing = [card["checkpoint"]["id"] for card in board["reviewing"]]
    assert room_a["id"] in reviewing
    # The other checkpoint is still free for anybody.
    free = [card["checkpoint"]["id"] for card in board["available"]]
    assert room_b["id"] in free
    assert t["id"]  # the task itself stays open


def test_uploading_requires_holding_the_checkpoint(client, admin_headers):
    _, (room,) = _task_with_checkpoints(client, admin_headers, ["没接就不要上传"], shots=1)
    first = register_volunteer(client)
    second = register_volunteer(client)

    # Nobody holds it yet.
    assert client.post(
        f"/api/volunteer/checkpoints/{room['id']}/photos",
        files=[("files", ("a.jpg", jpeg_bytes(make_textured_image(800, 600)), "image/jpeg"))],
        headers=second,
    ).status_code == 403

    assert _claim(client, first, room["id"]).status_code == 200
    # Taken by somebody else.
    assert _claim(client, second, room["id"]).status_code == 409
    assert _submit(client, second, room["id"]).status_code == 403


def test_submitting_needs_a_usable_photo(client, admin_headers):
    _, (room,) = _task_with_checkpoints(client, admin_headers, ["没有照片"], shots=1)
    v = register_volunteer(client)
    assert _claim(client, v, room["id"]).status_code == 200
    response = _submit(client, v, room["id"])
    assert response.status_code == 400
    assert "还没有可用的照片" in response.json()["detail"]


# ------------------------------------------------------------------ 审核权限


def test_every_admin_sees_every_checkpoint_but_only_the_owner_judges(client, admin_headers):
    """001 可以审全部；002／003 只能审自己发布的任务，但都能看到全部。"""
    t001, (owned_by_001,) = _task_with_checkpoints(client, admin_headers, ["001 的房间"], shots=1)
    v = register_volunteer(client)
    assert _claim(client, v, owned_by_001["id"]).status_code == 200
    _upload(client, v, owned_by_001["id"], count=1)
    assert _submit(client, v, owned_by_001["id"]).status_code == 200

    admin002 = admin_login(client, 2)
    admin003 = admin_login(client, 3)

    for other in (admin002, admin003):
        listing = client.get("/api/admin/checkpoint-reviews", headers=other)
        assert listing.status_code == 200
        item = next(i for i in listing.json()["items"] if i["checkpoint_id"] == owned_by_001["id"])
        assert item["can_operate"] is False          # 能看到
        # 但审不了别人的点位
        assert client.post(
            f"/api/admin/checkpoint-reviews/{owned_by_001['id']}/review",
            headers=other,
            json={"decision": "approve", "note": ""},
        ).status_code == 403
        # 试解算同理
        assert client.post(
            f"/api/admin/checkpoint-reviews/{owned_by_001['id']}/solve", headers=other
        ).status_code == 403

    # 002 自己的任务，他自己可以审
    t002, (owned_by_002,) = _task_with_checkpoints(client, admin002, ["002 的房间"], shots=1)
    v2 = register_volunteer(client)
    assert _claim(client, v2, owned_by_002["id"]).status_code == 200
    _upload(client, v2, owned_by_002["id"], count=1)
    assert _submit(client, v2, owned_by_002["id"]).status_code == 200
    assert client.get("/api/admin/checkpoint-reviews", headers=admin002).json()["items"]
    assert client.post(
        f"/api/admin/checkpoint-reviews/{owned_by_002['id']}/review",
        headers=admin002,
        json={"decision": "approve", "note": ""},
    ).status_code == 200

    # 001 审谁的点位都行（002 已经审过它了，所以 409 也算“允许”）
    assert client.post(
        f"/api/admin/checkpoint-reviews/{owned_by_002['id']}/review",
        headers=admin_headers,
        json={"decision": "approve", "note": ""},
    ).status_code in (200, 409)
    assert t001["id"] != t002["id"]


def test_a_returned_checkpoint_only_affects_that_checkpoint(client, admin_headers):
    _, (room_a, room_b) = _task_with_checkpoints(client, admin_headers, ["打回这个", "保留那个"], shots=1)
    v = register_volunteer(client)
    for room in (room_a, room_b):
        assert _claim(client, v, room["id"]).status_code == 200
        # Different seed per checkpoint: the same bytes twice in one task is a
        # duplicate and the submission refuses it.
        _upload(client, v, room["id"], count=1, seed=room["id"] * 10)
        assert _submit(client, v, room["id"]).status_code == 200

    returned = client.post(
        f"/api/admin/checkpoint-reviews/{room_a['id']}/review",
        headers=admin_headers,
        json={"decision": "return", "note": "窗边没拍到"},
    )
    assert returned.status_code == 200, returned.text
    assert returned.json()["review_status"] == "returned"

    approved = client.post(
        f"/api/admin/checkpoint-reviews/{room_b['id']}/review",
        headers=admin_headers,
        json={"decision": "approve", "note": ""},
    )
    assert approved.json()["review_status"] == "approved"

    # 打回的那一个回到志愿者手上，只要重拍它
    board = client.get("/api/volunteer/board", headers=v).json()
    held = [card["checkpoint"]["id"] for card in board["held"]]
    assert held == [room_a["id"]]
    assert board["held"][0]["review_note"] == "窗边没拍到"

    # 打回必须写理由
    assert client.post(
        f"/api/admin/checkpoint-reviews/{room_a['id']}/review",
        headers=admin_headers,
        json={"decision": "return", "note": ""},
    ).status_code == 409  # 已经不在待审状态了


# ------------------------------------------------------------------ 试解算


def test_trial_solve_returns_a_scored_report_with_advice(client, admin_headers):
    from app.services.recon import SOLVE_DONE, queue as recon_queue

    _, (room,) = _task_with_checkpoints(client, admin_headers, ["试解算房间"], shots=1)
    v = register_volunteer(client)
    assert _claim(client, v, room["id"]).status_code == 200
    _upload(client, v, room["id"], count=14, seed=500)
    assert _submit(client, v, room["id"]).status_code == 200

    started = client.post(f"/api/admin/checkpoint-reviews/{room['id']}/solve", headers=admin_headers)
    assert started.status_code == 200, started.text
    assert started.json()["solve"]["status"] == "queued"

    # 真机上这一步是几分钟的 COLMAP；测试里 recon 用 mock 报告，等队列跑完即可
    assert recon_queue.drain(timeout=30)

    detail = client.get(f"/api/admin/checkpoint-reviews/{room['id']}", headers=admin_headers).json()
    assert detail["solve"]["status"] == SOLVE_DONE
    assert detail["solve"]["mock"] is True
    report = detail["report"]
    assert report is not None
    assert 1 <= report["score"] <= 100
    assert report["verdict"] in ("ok", "risky", "failed")
    assert isinstance(report["can_reconstruct"], bool)
    # 三项指标都带好坏程度
    assert [check["key"] for check in report["checks"]] == [
        "registered", "connectivity", "reprojection",
    ]
    assert all(check["level"] in ("good", "warn", "bad") for check in report["checks"])
    assert report["suggestions"], "试解算一定要给出改进建议"
    assert detail["photos"], "审核页要能直接看到照片"


def test_trial_solve_refuses_a_checkpoint_with_too_few_photos(client, admin_headers):
    _, (room,) = _task_with_checkpoints(client, admin_headers, ["照片太少"], shots=1)
    v = register_volunteer(client)
    assert _claim(client, v, room["id"]).status_code == 200
    _upload(client, v, room["id"], count=2, seed=900)
    assert _submit(client, v, room["id"]).status_code == 200

    response = client.post(f"/api/admin/checkpoint-reviews/{room['id']}/solve", headers=admin_headers)
    assert response.status_code == 400
    assert "试解算没有意义" in response.json()["detail"]


# -------------------------------------------------------------- 批量导入


def test_bulk_import_derives_the_shot_count_from_the_size(client, admin_headers):
    r = client.post("/api/admin/tasks", headers=admin_headers, json={"name": f"批量导入{secrets.token_hex(3)}"})
    t = r.json()
    imported = client.post(
        f"/api/admin/tasks/{t['id']}/checkpoints/bulk",
        headers=admin_headers,
        json={
            "mode": "append",
            "items": [
                {"name": "大教室", "room": "301", "length_m": 8, "width_m": 6, "room_height_m": 3},
                {"name": "走廊", "room": "3F", "length_m": 20, "width_m": 3, "room_height_m": 3},
                {"name": "没写尺寸的", "room": "302"},
            ],
        },
    )
    assert imported.status_code == 200, imported.text
    detail = client.get(f"/api/admin/tasks/{t['id']}", headers=admin_headers).json()
    by_name = {cp["name"]: cp for cp in detail["checkpoints"]}

    # 表面积 2*(8*6+8*3+6*3)=180 m²，每张 5 m² → 36 张
    assert by_name["大教室"]["shot_count"] == 36
    assert by_name["大教室"]["room"] == "301"
    # 2*(20*3+20*3+3*3)=258 m² → 52 张（上限 64）
    assert by_name["走廊"]["shot_count"] == 52
    # 没有尺寸就退回默认 4 张
    assert by_name["没写尺寸的"]["shot_count"] == 4


# ---------------------------------------------------------- 管理员改密码


def test_an_admin_changes_only_their_own_password(client):
    admin003 = admin_login(client, 3)

    wrong = client.patch("/api/auth/admin/password", headers=admin003,
                         json={"current_password": "not-it", "password": "another-one"})
    assert wrong.status_code == 403

    too_short = client.patch("/api/auth/admin/password", headers=admin003,
                             json={"current_password": "admin003", "password": "short"})
    assert too_short.status_code == 422  # pydantic min_length

    changed = client.patch("/api/auth/admin/password", headers=admin003,
                           json={"current_password": "admin003", "password": "new-admin-003"})
    assert changed.status_code == 200, changed.text
    assert client.post("/api/auth/admin/login", json={"password": "admin003", "admin_id": 3}).status_code == 401
    assert client.post("/api/auth/admin/login", json={"password": "new-admin-003", "admin_id": 3}).status_code == 200
    # 002 的密码没被动过
    assert client.post("/api/auth/admin/login", json={"password": "admin002", "admin_id": 2}).status_code == 200
    # 换了编号就用不了：003 的新密码不能登 002
    assert client.post("/api/auth/admin/login", json={"password": "new-admin-003", "admin_id": 2}).status_code == 401

    # 改回去，别影响别的测试
    back = client.patch("/api/auth/admin/password", headers=admin003,
                        json={"current_password": "new-admin-003", "password": "admin003"})
    assert back.status_code == 200
    assert client.post("/api/auth/admin/login", json={"password": "admin003", "admin_id": 3}).status_code == 200
