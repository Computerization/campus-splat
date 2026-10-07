"""Tests for the demo seeding script.

It is a plain HTTP client, so the Starlette TestClient stands in for a real
server: that covers the parts that can actually break — the stale-backend guard
and the cleanup of demo tasks.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import seed_demo  # noqa: E402


class _StaleClient:
    """Stand-in for a server started before this feature existed."""

    base_url = "http://stale/"

    def get(self, path: str):
        class Response:
            def json(self):
                return {"paths": {"/api/admin/tasks": {}, "/api/admin/training": {}}}

        return Response()


def test_check_server_accepts_the_current_backend(client):
    # The real app must expose every endpoint the script relies on
    seed_demo.check_server(client)


def test_check_server_rejects_a_stale_backend():
    with pytest.raises(SystemExit) as excinfo:
        seed_demo.check_server(_StaleClient())

    message = str(excinfo.value)
    assert "旧代码" in message
    assert "重启" in message


def test_cleanup_demo_removes_only_demo_tasks(client, admin_headers):
    """Uses the pre-authenticated headers on purpose: logging in again would
    depend on the login rate-limiter state left by other tests."""
    demo = client.post(
        "/api/admin/tasks",
        json={"name": f"{seed_demo.DEMO_PREFIX}清理测试楼", "kind": "indoor"},
        headers=admin_headers,
    ).json()
    keep = client.post(
        "/api/admin/tasks",
        json={"name": "不该被删的任务", "kind": "indoor"},
        headers=admin_headers,
    ).json()

    removed = seed_demo.cleanup_demo_tasks(client, admin_headers)
    assert removed >= 1

    tasks = client.get(
        "/api/admin/tasks?include_archived=true", headers=admin_headers
    ).json()
    names = [item["task"]["name"] for item in tasks]
    assert f"{seed_demo.DEMO_PREFIX}清理测试楼" not in names
    assert "不该被删的任务" in names
    assert all(item["task"]["id"] != demo["id"] for item in tasks)
    assert any(item["task"]["id"] == keep["id"] for item in tasks)


class _RejectingClient:
    """A server that refuses the login — no real request, so the rate limiter
    of the live app is left alone."""

    base_url = "http://stale/"

    def post(self, path: str, json=None):  # noqa: A002 - mirrors httpx's API
        class Response:
            status_code = 401

            def json(self):
                return {"detail": "wrong password"}

        return Response()


def test_login_reports_a_bad_password():
    with pytest.raises(SystemExit) as excinfo:
        seed_demo.login(_RejectingClient(), "definitely-not-the-password")
    assert "登录失败" in str(excinfo.value)
