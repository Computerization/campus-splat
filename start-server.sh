#!/usr/bin/env bash
# ============================================================
#  One-click launcher for the school 3DGS capture platform.
#
#  macOS / Linux version. On Windows double-click start-server.cmd.
#
#  Usage:
#    ./start-server.sh
#    ./start-server.sh --port 8080
#    ./start-server.sh --reload
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v uv >/dev/null 2>&1; then
    cat <<'EOF'

[ERROR] "uv" was not found in PATH.

  This project manages its Python environment with uv.
  Install it from: https://docs.astral.sh/uv/
    macOS / Linux:   curl -LsSf https://astral.sh/uv/install.sh | sh

EOF
    exit 1
fi

echo "Syncing Python dependencies (uv sync) ..."
if ! uv sync; then
    echo
    echo '[ERROR] "uv sync" failed. See the message above.'
    echo "  If it is a network / mirror problem, edit the"
    echo "  [[tool.uv.index]] section at the bottom of pyproject.toml."
    echo
    exit 1
fi

echo
uv run python scripts/serve.py "$@"
