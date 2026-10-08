"""试解算的进度/ETA、目录布局，以及 001 能看到全部任务。"""

from __future__ import annotations

import secrets
from datetime import timedelta

from app import config
from app.database import SessionLocal
from app.models import Checkpoint, Task, utcnow
from app.services import recon

from .conftest import admin_login, register_volunteer, submit_photos
from .test_workflow import task


# ------------------------------------------------------------------ 进度与 ETA


def test_estimate_remaining_stays_quiet_until_it_knows():
    """才跑 3% 就报"还剩 10 分钟"比不报更糟，所以小进度一律不猜。"""
    started = utcnow() - timedelta(seconds=60)
    assert recon.estimate_remaining(3.0, started) is None
    assert recon.estimate_remaining(50.0, None) is None

    halfway = recon.estimate_remaining(50.0, started)
    assert halfway is not None and 55 <= halfway <= 61
    assert recon.estimate_remaining(100.0, started) == 0


def test_stage_weights_cover_the_whole_bar_in_order():
    spans = [recon.STAGES[key] for key in ("feature_extractor", "exhaustive_matcher", "mapper")]
    for (_, start, end), (_, next_start, _) in zip(spans, spans[1:]):
        assert start < end <= next_start
    assert spans[-1][2] == 100.0
    # 每个阶段都要有名字，否则进度条上会显示空字符串
    assert all(name for name, _, _ in spans)


# ------------------------------------------------------------------ 目录布局


def test_recon_dir_says_which_task_and_checkpoint(client, admin_headers):
    """data/recon/<任务 folder>/<点位 folder>/ — 一眼能看出属于哪个点位。"""
    t, cp = task(client, admin_headers, f"试解算目录{secrets.token_hex(2)}")
    with SessionLocal() as db:
        row_task = db.get(Task, t["id"])
        row_checkpoint = db.get(Checkpoint, cp["id"])
        path = recon.recon_dir(row_task, row_checkpoint)

    assert path.parent.parent == config.RECON_DIR
    assert path.parent.name == row_task.folder
    assert path.name == row_checkpoint.folder
    # 报告里会带上这个路径，出问题了才知道去哪儿翻
    assert config.DATA_DIR in path.parents


# ------------------------------------------------------- 训练前的算力提示


def test_preflight_lists_a_running_trial_solve(client, admin_headers):
    t, cp = task(client, admin_headers, f"训练提示{secrets.token_hex(2)}", shots=2)
    volunteer = register_volunteer(client)
    submit_photos(client, t["id"], volunteer, per_checkpoint={cp["id"]: 2}, seed=8800)

    with SessionLocal() as db:
        row = db.get(Checkpoint, cp["id"])
        row.solve_status = recon.SOLVE_RUNNING
        row.solve_progress = 42
        row.solve_stage = "match"
        row.solve_eta_s = 180
        db.commit()

    try:
        response = client.get(
            f"/api/admin/training/preflight?task_id={t['id']}", headers=admin_headers
        )
        assert response.status_code == 200, response.text
        active = response.json()["active_solves"]
        assert [item["checkpoint_id"] for item in active] == [cp["id"]]
        assert active[0]["progress"] == 42
        assert active[0]["eta_s"] == 180
        assert active[0]["status"] == recon.SOLVE_RUNNING
    finally:
        with SessionLocal() as db:
            row = db.get(Checkpoint, cp["id"])
            row.solve_status = recon.SOLVE_NONE
            row.solve_progress = 0
            row.solve_stage = None
            row.solve_eta_s = None
            db.commit()


def test_preflight_has_nothing_to_warn_about_by_default(client, admin_headers):
    t, cp = task(client, admin_headers, f"没有试解算{secrets.token_hex(2)}", shots=2)
    volunteer = register_volunteer(client)
    submit_photos(client, t["id"], volunteer, per_checkpoint={cp["id"]: 2}, seed=8900)
    response = client.get(f"/api/admin/training/preflight?task_id={t['id']}", headers=admin_headers)
    assert response.status_code == 200, response.text
    assert response.json()["active_solves"] == []


# ------------------------------------------------------- 001 的任务可见范围


def test_admin_001_sees_every_task_but_002_sees_its_own(client, admin_headers):
    """001 是超管（训练要选整栋楼）：任务列表和总览都是全部；002 只看自己发布的。"""
    admin002 = admin_login(client, 2)
    owned_by_002, _ = task(client, admin002, f"002的任务{secrets.token_hex(2)}")
    owned_by_001, _ = task(client, admin_headers, f"001的任务{secrets.token_hex(2)}")

    ids_001 = {item["task"]["id"] for item in client.get("/api/admin/tasks", headers=admin_headers).json()}
    assert {owned_by_001["id"], owned_by_002["id"]} <= ids_001

    ids_002 = {item["task"]["id"] for item in client.get("/api/admin/tasks", headers=admin002).json()}
    assert owned_by_002["id"] in ids_002
    assert owned_by_001["id"] not in ids_002

    overview_001 = client.get("/api/admin/overview", headers=admin_headers).json()
    assert {item["task"]["id"] for item in overview_001["tasks"]} >= {
        owned_by_001["id"], owned_by_002["id"],
    }
    overview_002 = client.get("/api/admin/overview", headers=admin002).json()
    overview_002_ids = {item["task"]["id"] for item in overview_002["tasks"]}
    assert owned_by_002["id"] in overview_002_ids
    assert owned_by_001["id"] not in overview_002_ids
