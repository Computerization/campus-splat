#!/usr/bin/env python
"""Launcher for the school 3DGS capture platform.

Why this logic lives in Python and not in the .cmd file: cmd.exe reads .cmd/.bat
using the system ANSI code page (GBK on Chinese Windows), so UTF-8 text inside
gets mis-decoded and can even split the command line apart. start-server.cmd
therefore only runs `uv sync` and calls this script.

Usage:
    uv run python scripts/serve.py
    uv run python scripts/serve.py --port 8080 --reload
"""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
DIST_INDEX = FRONTEND / "dist" / "index.html"

# Force UTF-8. Console output already goes through the Windows Unicode API, but
# when stdout is redirected to a file or a pipe Python would fall back to the
# ANSI code page and mangle non-ASCII text.
for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        try:
            _stream.reconfigure(encoding="utf-8", line_buffering=True)
        except Exception:
            pass

# Virtual / VPN interfaces. Volunteers' phones can't reach these, so printing
# them would only mislead whoever is deploying.
VIRTUAL_KEYWORDS = (
    "vethernet", "wsl", "loopback", "radmin", "vmware", "virtualbox",
    "hyper-v", "npcap", "bluetooth", "tap", "tun", "zerotier", "tailscale",
)


def lan_addresses() -> list[tuple[str, str]]:
    """Return (interface name, IPv4) pairs with virtual interfaces filtered out."""
    try:
        import psutil
    except ImportError:
        return []

    try:
        stats = psutil.net_if_stats()
        interfaces = psutil.net_if_addrs()
    except Exception:
        return []

    found: list[tuple[str, str]] = []
    for name, addrs in interfaces.items():
        status = stats.get(name)
        if status is not None and not status.isup:
            continue
        lowered = name.lower()
        if any(keyword in lowered for keyword in VIRTUAL_KEYWORDS):
            continue
        for addr in addrs:
            if addr.family != socket.AF_INET:
                continue
            ip = addr.address
            if ip.startswith("127.") or ip.startswith("169.254."):
                continue
            found.append((name, ip))
    return found


def ensure_frontend(skip: bool) -> bool:
    """Build the frontend if the bundle is missing. Returns whether it's usable."""
    if DIST_INDEX.exists():
        print("  [2/4] 前端构建产物已就绪")
        return True

    if skip:
        print("  [2/4] 已跳过前端构建（--skip-build）")
        return False

    npm = shutil.which("npm.cmd") or shutil.which("npm")
    if not npm:
        print("  [2/4] 没找到 Node.js，无法构建前端。")
        print("        正常从 GitHub 克隆的仓库里已经带上了 frontend/dist，")
        print("        如果你手工删过它，请先安装 Node.js：https://nodejs.org/")
        return False

    print("  [2/4] 正在构建前端（首次约 1-2 分钟）…")
    try:
        if not (FRONTEND / "node_modules").exists():
            subprocess.run([npm, "install"], cwd=str(FRONTEND), check=True)
        subprocess.run([npm, "run", "build"], cwd=str(FRONTEND), check=True)
    except subprocess.CalledProcessError as exc:
        print(f"  [!] 前端构建失败（退出码 {exc.returncode}），网页可能打不开。")
        return False
    return DIST_INDEX.exists()


def main() -> int:
    parser = argparse.ArgumentParser(description="校园 3DGS 采集平台启动器")
    parser.add_argument("--port", type=int, default=8000, help="监听端口，默认 8000")
    parser.add_argument("--host", default="0.0.0.0", help="监听地址，默认 0.0.0.0（局域网可访问）")
    parser.add_argument("--skip-build", action="store_true", help="跳过前端构建检查")
    parser.add_argument("--reload", action="store_true", help="代码改动自动重启（开发用）")
    args = parser.parse_args()

    print("=== 校园 3DGS 采集平台 ===")
    print(f"  [1/4] Python 环境：{sys.executable}")

    ensure_frontend(args.skip_build)

    print("  [3/4] 访问地址：")
    addresses = lan_addresses()
    if addresses:
        for name, ip in addresses:
            print(f"        http://{ip}:{args.port}    （手机浏览器打开这个 · {name}）")
    else:
        print("        没找到局域网 IP，检查一下网络连接")
    print(f"        本机自测：http://127.0.0.1:{args.port}")
    print(f"        管理端：http://<上面的IP>:{args.port}/admin")

    print("        管理员密码：admin001 至 admin005（固定账号，不能注销）")
    print("        志愿者：注册真实姓名与密码，然后登录接取任务")

    print()
    print("  [4/4] 启动服务（按 Ctrl+C 停止）…")
    print("        如果 Windows 弹出防火墙提示，请选择「允许访问」。")
    print("        如果手机连不上，请看 docs/deployment.md 的排错步骤。")
    print()

    # uvicorn needs backend/ on sys.path to import "app.main"
    sys.path.insert(0, str(BACKEND))
    os.chdir(BACKEND)

    import uvicorn  # imported here so it loads only after `uv sync`

    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level="info",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
