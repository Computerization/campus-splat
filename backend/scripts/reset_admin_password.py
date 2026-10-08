#!/usr/bin/env python
"""Reset one fixed administrator's password (the "forgot it" way out).

An administrator normally changes their own password from the console (System
页) — nobody can change somebody else's. This script is for the case where they
can no longer log in at all, and has to be run on the server:

    uv run python backend/scripts/reset_admin_password.py 002
    uv run python backend/scripts/reset_admin_password.py 002 --password NewPass123

The server must NOT be running (SQLite is the only writer here).
"""

from __future__ import annotations

import argparse
import getpass
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import config  # noqa: E402
from app.database import SessionLocal, init_db  # noqa: E402
from app.models import AdminAccount  # noqa: E402
from app.services.passwords import hash_password  # noqa: E402

MIN_LENGTH = 8


def main() -> int:
    parser = argparse.ArgumentParser(description="重置固定管理员密码")
    parser.add_argument("admin_id", type=int, choices=list(config.ADMIN_IDS),
                        help="管理员编号：1、2 或 3")
    parser.add_argument("--password", help="新密码；不传则交互式输入两次")
    args = parser.parse_args()

    password = args.password
    if not password:
        password = getpass.getpass("新密码：")
        if password != getpass.getpass("再输一次："):
            print("两次输入不一致，未修改。", file=sys.stderr)
            return 1
    if len(password) < MIN_LENGTH:
        print(f"密码至少 {MIN_LENGTH} 位，未修改。", file=sys.stderr)
        return 1

    # Also creates the table and the three rows on a database that predates them.
    init_db()
    with SessionLocal() as db:
        account = db.get(AdminAccount, args.admin_id)
        if account is None:
            print(f"数据库里没有管理员 {args.admin_id:03d}。", file=sys.stderr)
            return 1
        account.password_hash = hash_password(password)
        db.commit()

    print(f"管理员 {args.admin_id:03d} 的密码已重置（用新密码登录即可）。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
