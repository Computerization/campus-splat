#!/usr/bin/env python
"""One command to get demo data for the 3D preview / placement editor.

The preview needs a *finished* run to look at, which is awkward when there is no
capture material yet. This script manufactures everything against a running
server: synthetic photos -> two tasks (one indoor, one outdoor) -> uploads ->
two mock reconstructions. Afterwards it prints the preview URLs.

Mock mode produces real, renderable point clouds (rooms laid out on a grid), so
the placement editor behaves exactly like it does with a real reconstruction —
you just don't need COLMAP or a GPU.

Usage (server must already be running — this script never starts one):
    uv run python backend/scripts/seed_demo.py
    uv run python backend/scripts/seed_demo.py --base-url http://127.0.0.1:8080
    uv run python backend/scripts/seed_demo.py --password your-password
    uv run python backend/scripts/seed_demo.py --cleanup     # delete demo tasks
"""

from __future__ import annotations

import argparse
import io
import secrets
import sys
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import config  # noqa: E402  (reads .env, so the default password is right)

try:  # keep Chinese output readable on a cp936 console
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:  # pragma: no cover
    pass

DEMO_PREFIX = "演示 · "
# Endpoints this script needs; their absence means the server runs old code
REQUIRED_PATHS = (
    "/api/auth/volunteer/register",
    "/api/volunteer/checkpoints/{checkpoint_id}/submit",
    "/api/admin/checkpoint-reviews/{checkpoint_id}/review",
    "/api/admin/training/preflight",
    "/api/admin/training/{run_id}/preview",
    "/api/admin/training/{run_id}/transforms",
)


def check_server(client) -> None:
    """Refuse to run against a stale backend, with an actionable message.

    uvicorn only hot-reloads with `--reload`, so a service started before an
    update keeps serving the old code — which surfaces as missing response
    fields (e.g. `block_total`) rather than an obvious error.
    """
    try:
        spec = client.get("/openapi.json").json()
    except Exception as exc:  # pragma: no cover - network failure
        raise SystemExit(f"读不到 openapi.json（{exc}）：确认服务在跑、地址对不对。")

    paths = set((spec.get("paths") or {}).keys())
    missing = [path for path in REQUIRED_PATHS if path not in paths]
    if not missing:
        return

    raise SystemExit(
        "这个服务跑的是旧代码，缺少接口： "
        + "、".join(missing)
        + "\nuvicorn 不带 --reload 不会加载改动，请重启服务："
        + "\n  1) 关掉正在运行服务的那个窗口（或结束对应的 python 进程）"
        + "\n  2) 再执行 .\\start-server.cmd"
        + "\n（这个脚本自己不会启动服务。）"
    )


def make_photo(seed: int, width: int = 2000, height: int = 1500) -> bytes:
    """A synthetic 'photo': texture plus a few bright structures.

    Different seeds produce clearly different layouts, so the near-duplicate
    detector (dHash) leaves them alone — the point is to get past the quality
    check, not to look pretty.
    """
    import numpy as np
    from PIL import Image, ImageDraw

    rng = np.random.default_rng(seed)
    noise = rng.integers(40, 216, size=(height, width), dtype=np.uint8)
    image = Image.fromarray(noise, mode="L").convert("RGB")

    draw = ImageDraw.Draw(image)
    for _ in range(int(rng.integers(3, 7))):
        x0 = int(rng.integers(0, width - 420))
        y0 = int(rng.integers(0, height - 420))
        x1 = x0 + int(rng.integers(140, 400))
        y1 = y0 + int(rng.integers(140, 400))
        color = tuple(int(value) for value in rng.integers(0, 255, 3))
        draw.rectangle([x0, y0, x1, y1], outline=color, width=int(rng.integers(5, 16)))

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=80)
    return buffer.getvalue()


def build_client(base_url: str, timeout: float):
    try:
        import httpx
    except ImportError:  # pragma: no cover
        raise SystemExit("缺少 httpx：先跑 `uv sync`（或 `pip install httpx`）再试。")

    client = httpx.Client(base_url=base_url, timeout=timeout)
    try:
        client.get("/api/health").raise_for_status()
    except Exception as exc:
        raise SystemExit(f"连不上 {base_url}（{exc}）。先启动服务：.\\start-server.cmd")
    return client


def login(client, password: str) -> dict:
    response = client.post("/api/auth/admin/login", json={"password": password})
    if response.status_code == 429:
        raise SystemExit(
            "管理员登录被限流（429）：失败次数太多，等几分钟再试，或用 --password 给出正确密码。"
        )
    if response.status_code != 200:
        raise SystemExit(
            f"管理员登录失败（{response.status_code}）：密码不对？用 --password 指定。"
        )
    return {"Authorization": f"Bearer {response.json()['token']}"}


def remove_tasks(client, headers: dict, task_ids: list[int]) -> int:
    removed = 0
    for task_id in task_ids:
        if client.delete(f"/api/admin/tasks/{task_id}", headers=headers).status_code == 200:
            removed += 1
    return removed


def cleanup_demo_tasks(client, headers: dict, *, prefix: str = DEMO_PREFIX) -> int:
    """Delete every task this script created before (photos and output included)."""
    tasks = client.get("/api/admin/tasks?include_archived=true", headers=headers).json()
    ids = [
        item["task"]["id"]
        for item in tasks
        if str(item["task"]["name"]).startswith(prefix)
    ]
    removed = remove_tasks(client, headers, ids)
    print(f"已删除 {removed} 个演示任务（照片和训练产物一并删除）")
    return removed


def cleanup_demo(client, *, password: str, prefix: str = DEMO_PREFIX) -> int:
    return cleanup_demo_tasks(client, login(client, password), prefix=prefix)


def make_task(
    client,
    headers: dict,
    *,
    name: str,
    kind: str,
    checkpoint_names: list[str],
    photos_each: int,
    seed: int,
) -> dict:
    task = client.post(
        "/api/admin/tasks", json={"name": name, "kind": kind}, headers=headers
    ).json()
    checkpoints = [
        client.post(
            f"/api/admin/tasks/{task['id']}/checkpoints",
            json={"name": checkpoint_name, "shot_count": photos_each},
            headers=headers,
        ).json()
        for checkpoint_name in checkpoint_names
    ]

    join = client.post('/api/auth/volunteer/register', json={
        'username': f'演示志愿者{secrets.token_hex(4)}', 'password':secrets.token_urlsafe(12)})
    join.raise_for_status()
    volunteer_headers = {'Authorization': f'Bearer {join.json()["token"]}'}

    # 一次一个点位：接取 → 上传 → 交卷，再接下一个（和真人在手机上做的一样）
    uploaded = 0
    for checkpoint in checkpoints:
        claim = client.post(f'/api/volunteer/checkpoints/{checkpoint["id"]}/claim',
                            headers=volunteer_headers)
        claim.raise_for_status()
        files = []
        for _ in range(photos_each):
            seed += 13
            files.append(('files', (f'demo{seed}.jpg', make_photo(seed), 'image/jpeg')))
            uploaded += 1
        response = client.post(f'/api/volunteer/checkpoints/{checkpoint["id"]}/photos',
                               files=files, headers=volunteer_headers)
        response.raise_for_status()
        handed = client.post(f'/api/volunteer/checkpoints/{checkpoint["id"]}/submit',
                             headers=volunteer_headers)
        handed.raise_for_status()

    # The quality check runs in the background, and a reconstruction only uses
    # judged photos — wait for it before judging the checkpoints.
    wait_for_quality(client, headers)
    for checkpoint in checkpoints:
        reviewed = client.post(f'/api/admin/checkpoint-reviews/{checkpoint["id"]}/review',
                               headers=headers, json={'decision': 'approve', 'note': ''})
        reviewed.raise_for_status()
    client.delete('/api/auth/volunteer/account', headers=volunteer_headers).raise_for_status()
    print(f"  {task['name']}：{len(checkpoints)} 个点位，上传 {uploaded} 张（全部可用）")
    return task


def wait_for_quality(client, headers: dict, *, timeout: float = 300.0) -> None:
    """Wait until the background quality worker has judged every uploaded photo.

    An upload reply no longer waits for its check (services/quality_jobs.py) —
    but a reconstruction only uses judged photos, so the demo does what a
    volunteer watching their phone does: poll until nothing is left in
    `checking`.
    """
    deadline = time.time() + timeout
    announced = False
    while True:
        # `total` counts photos of every task; in a demo database that is the
        # ones this script just uploaded.
        page = client.get(
            "/api/admin/photos", params={"status": "checking", "limit": 1}, headers=headers
        ).json()
        pending = page.get("total", 0)
        if not pending:
            if announced:
                print("  后台质检完成")
            return
        if time.time() > deadline:
            raise RuntimeError(f"后台质检 {timeout:.0f}s 内没有跑完（还剩 {pending} 张）")
        if not announced:
            print(f"  等待后台质检（{pending} 张待检）…")
            announced = True
        time.sleep(0.4)


def run_reconstruction(client, headers: dict, task_id: int, label: str) -> dict:
    started = client.post(
        "/api/admin/training", json={"task_id": task_id}, headers=headers
    ).json()
    run_id = started["id"]
    blocks = started.get("block_total") or 0
    print(f"  发起重建 run #{run_id}（{blocks} 个训练块）…")

    deadline = time.time() + 600
    run = started
    while time.time() < deadline:
        run = client.get(f"/api/admin/training/{run_id}", headers=headers).json()
        if run["status"] in ("succeeded", "failed", "cancelled"):
            break
        time.sleep(1.0)

    if run["status"] != "succeeded":
        print(f"  ✗ {label} 重建未成功：{run['status']} — {run.get('message')}")
        print(f"    日志：/api/admin/training/{run_id}/log")
        raise RuntimeError("重建失败")

    plys = [item for item in (run.get("artifacts") or []) if item.get("kind") == "ply"]
    print(f"  ✓ 重建完成：{run['photo_count']} 张照片，{len(plys)} 个点云产物")
    return run


def seed(
    client,
    *,
    password: str,
    photos_per_checkpoint: int,
    skip_outdoor: bool,
    cleanup_on_error: bool,
) -> int:
    """Create the demo tasks, run two mock reconstructions, print the URLs."""
    check_server(client)
    headers = login(client, password)

    stamp = time.strftime("%m%d-%H%M")
    created: list[int] = []
    try:
        indoor_task = make_task(
            client,
            headers,
            name=f"{DEMO_PREFIX}教学楼 {stamp}",
            kind="indoor",
            checkpoint_names=["3F 走廊", "3F 实验室 302"],
            photos_each=photos_per_checkpoint,
            seed=1000,
        )
        created.append(indoor_task["id"])
        print("  解算位姿 + 分块训练（mock）…")
        indoor_run = run_reconstruction(client, headers, indoor_task["id"], "室内")

        outdoor_run = None
        if not skip_outdoor:
            outdoor_task = make_task(
                client,
                headers,
                name=f"{DEMO_PREFIX}无人机航拍 {stamp}",
                kind="outdoor",
                checkpoint_names=["外立面"],
                photos_each=photos_per_checkpoint,
                seed=5000,
            )
            created.append(outdoor_task["id"])
            print("  解算位姿 + 分块训练（mock）…")
            outdoor_run = run_reconstruction(client, headers, outdoor_task["id"], "室外")
    except BaseException:
        if cleanup_on_error:
            removed = remove_tasks(client, headers, created)
            if removed:
                print(f"（失败，已清理刚建的 {removed} 个任务；要保留请加 --keep-on-error）")
        raise

    base = str(client.base_url).rstrip("/")
    print("\n完成。打开这个地址试摆放：")
    print(f"  {base}/admin/training/{indoor_run['id']}/preview")
    if outdoor_run is not None:
        print("\n验证步骤：")
        print("  1. 右侧「叠加其它重建任务」勾上室外那个 run（点云会一起加载）")
        print("  2. 「点云」列表里点选一个块（比如 b000）")
        print("  3. 右侧「人工摆放」直接改位置 / 旋转 / 缩放")
        print("     或者点顶部「进入编辑模式」，然后拖动 / 右键拖动 / 滚轮")
        print("  4. 「保存摆放」→ 结果写进该任务的 transforms.json")
    print(
        "\n注意：这是 mock 模式生成的示例点云（房间摆成一排），位姿是假的，"
        "但位姿之外的整条链路都是真的。清理：--cleanup"
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="生成 3D 预览用的演示数据（不会自己启动服务）")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="已经运行中的服务地址")
    parser.add_argument(
        "--password",
        default="admin001",
        help="固定管理员密码（默认 admin001）",
    )
    parser.add_argument("--photos-per-checkpoint", type=int, default=3, help="每个点位生成几张")
    parser.add_argument("--skip-outdoor", action="store_true", help="只造室内任务")
    parser.add_argument(
        "--keep-on-error", action="store_true", help="失败时保留刚建的任务（默认会清理掉）"
    )
    parser.add_argument("--cleanup", action="store_true", help="删除所有「演示 · 」任务后退出")
    args = parser.parse_args()

    client = build_client(args.base_url, timeout=180)
    if args.cleanup:
        cleanup_demo(client, password=args.password)
        return 0

    return seed(
        client,
        password=args.password,
        photos_per_checkpoint=args.photos_per_checkpoint,
        skip_outdoor=args.skip_outdoor,
        cleanup_on_error=not args.keep_on_error,
    )


if __name__ == "__main__":
    raise SystemExit(main())
