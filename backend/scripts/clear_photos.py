#!/usr/bin/env python
"""Delete every photo, keeping the tasks and checkpoints.

For the one-off switch to the readable upload layout
(``data/uploads/<任务名>/<点位名>/0001_ZhangSan.jpg``): the photos uploaded before
it sit under random file names, so starting the photo collection over is simpler
than shuffling every old file into the new shape. Tasks, checkpoints and their
shot counts are kept as they are.

The server must already be running — this script never starts one.

Usage:
    uv run python backend/scripts/clear_photos.py               # asks first
    uv run python backend/scripts/clear_photos.py --yes         # no prompt
    uv run python backend/scripts/clear_photos.py --task 3      # one task only
    uv run python backend/scripts/clear_photos.py --base-url http://127.0.0.1:8080
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import config  # noqa: E402  (so the default password matches the .env)

try:  # keep Chinese output readable on a cp936 console
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:  # pragma: no cover
    pass

CONFIRM_WORD = "DELETE"


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if value < 1024 or unit == "TB":
            return f"{value:.1f} {unit}"
        value /= 1024
    return f"{value:.1f} TB"


def main() -> int:
    parser = argparse.ArgumentParser(description="删除全部照片（任务与点位保留）")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="已经运行中的服务地址")
    parser.add_argument(
        "--password",
        default=config.ADMIN_PASSWORD,
        help="管理员密码（默认读 .env / 环境变量，再退回代码里的默认值）",
    )
    parser.add_argument("--task", type=int, default=None, help="只清这个任务的照片")
    parser.add_argument("--yes", action="store_true", help="跳过交互确认")
    args = parser.parse_args()

    try:
        import httpx
    except ImportError:  # pragma: no cover
        raise SystemExit("缺少 httpx：先跑 `uv sync`（或 `pip install httpx`）再试。")

    client = httpx.Client(base_url=args.base_url, timeout=300)
    try:
        client.get("/api/health").raise_for_status()
    except Exception as exc:
        raise SystemExit(f"连不上 {args.base_url}（{exc}）。先启动服务：.\\start-server.cmd")

    paths = set((client.get("/openapi.json").json().get("paths") or {}).keys())
    if "/api/admin/photos/purge" not in paths:
        raise SystemExit(
            "这个服务跑的是旧代码（没有 /api/admin/photos/purge）。重启服务再试：.\\start-server.cmd"
        )

    login = client.post("/api/auth/admin/login", json={"password": args.password})
    if login.status_code != 200:
        raise SystemExit(f"管理员登录失败（{login.status_code}）：密码不对？用 --password 指定。")
    headers = {"Authorization": f"Bearer {login.json()['token']}"}

    scope = f"任务 #{args.task}" if args.task is not None else "全部任务"
    filters: dict = {"limit": 1}
    if args.task is not None:
        filters["task_id"] = args.task
    listed = client.get("/api/admin/photos", params=filters, headers=headers).json()
    total = listed.get("total", 0)
    print(f"将要删除 {scope} 的 {total} 张照片（含缩略图/预览），任务和点位保留")
    if total == 0:
        print("没有照片可删。")
        return 0

    if not args.yes:
        typed = input(f"不可撤销。输入 {CONFIRM_WORD} 继续，其它任意键取消：").strip()
        if typed.upper() != CONFIRM_WORD:
            print("已取消。")
            return 1

    response = client.post(
        "/api/admin/photos/purge",
        params={"task_id": args.task} if args.task is not None else {},
        headers=headers,
    )
    if response.status_code != 200:
        raise SystemExit(f"删除失败（{response.status_code}）：{response.text}")

    result = response.json()
    print(
        f"已删除 {result['deleted_photos']} 张照片"
        + (f" + {result['orphan_files']} 个无记录的文件" if result.get("orphan_files") else "")
        + f"，释放 {human_bytes(result['freed_bytes'])}；"
        "现在新上传的照片会存成 data/uploads/任务名/点位名/序号_拍摄者.jpg"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
