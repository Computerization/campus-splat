#!/usr/bin/env python
"""Wipe every task / photo / training record from a running server.

Exactly what the admin console's red "清空全部数据" button does, for when you
would rather type it. The server must already be running — this script never
starts one.

Usage:
    uv run python backend/scripts/reset_data.py              # asks first
    uv run python backend/scripts/reset_data.py --yes        # no prompt
    uv run python backend/scripts/reset_data.py --base-url http://127.0.0.1:8080
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
    parser = argparse.ArgumentParser(description="清空服务器上的全部数据（任务/照片/训练记录）")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="已经运行中的服务地址")
    parser.add_argument(
        "--password",
        default=config.ADMIN_PASSWORD,
        help="管理员密码（默认读 .env / 环境变量，再退回代码里的默认值）",
    )
    parser.add_argument("--yes", action="store_true", help="跳过交互确认")
    args = parser.parse_args()

    try:
        import httpx
    except ImportError:  # pragma: no cover
        raise SystemExit("缺少 httpx：先跑 `uv sync`（或 `pip install httpx`）再试。")

    client = httpx.Client(base_url=args.base_url, timeout=180)
    try:
        client.get("/api/health").raise_for_status()
    except Exception as exc:
        raise SystemExit(f"连不上 {args.base_url}（{exc}）。先启动服务：.\\start-server.cmd")

    spec_paths = set((client.get("/openapi.json").json().get("paths") or {}).keys())
    if "/api/admin/reset" not in spec_paths:
        raise SystemExit(
            "这个服务跑的是旧代码（没有 /api/admin/reset）。重启服务再试：.\\start-server.cmd"
        )

    login = client.post("/api/auth/admin/login", json={"password": args.password})
    if login.status_code != 200:
        raise SystemExit(f"管理员登录失败（{login.status_code}）：密码不对？用 --password 指定。")
    headers = {"Authorization": f"Bearer {login.json()['token']}"}

    # Show what is about to be destroyed before asking
    overview = client.get("/api/admin/overview?include_archived=true", headers=headers).json()
    totals = overview.get("totals", {})
    print(
        "将要删除："
        f"{totals.get('tasks', 0)} 个任务 / "
        f"{totals.get('photos', 0)} 张照片 / "
        f"{totals.get('checkpoints', 0)} 个点位"
    )
    runs = client.get("/api/admin/training?limit=200", headers=headers).json()
    print(f"           {len(runs)} 条训练记录，以及 data 目录下的照片、缩略图和训练产物")

    if not args.yes:
        typed = input(f"不可撤销。输入 {CONFIRM_WORD} 继续，其它任意键取消：").strip()
        if typed.upper() != CONFIRM_WORD:
            print("已取消。")
            return 1

    response = client.post("/api/admin/reset", json={"confirm": CONFIRM_WORD}, headers=headers)
    if response.status_code != 200:
        raise SystemExit(f"清空失败（{response.status_code}）：{response.text}")

    result = response.json()
    print(
        "已清空："
        f"{result['tasks']} 个任务、{result['photos']} 张照片、{result['runs']} 条训练记录，"
        f"释放 {human_bytes(result['freed_bytes'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
