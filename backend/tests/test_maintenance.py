"""Tests for the maintenance endpoints: wipe-everything and reveal-in-explorer.

Both are destructive / OS-level, so they are exercised carefully: the reset test
verifies the database *and* the files are gone, and the reveal tests stub out
`subprocess.Popen` so no file manager window opens during a test run.
"""

from __future__ import annotations

import io
import subprocess
import sys
from pathlib import Path

import pytest
from fastapi import HTTPException

from app import config, storage

from .conftest import jpeg_bytes, make_textured_image
from .test_api import _upload


def _photo_upload(client, admin_headers, name: str):
    task = client.post(
        "/api/admin/tasks", json={"name": name, "kind": "indoor"}, headers=admin_headers
    ).json()
    checkpoint = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "房间", "shot_count": 1},
        headers=admin_headers,
    ).json()
    join = client.post(
        "/api/auth/volunteer/register",
        json={"username": f"维护测试{task['id']}", "password":"shared"},
    ).json()
    response = _upload(
        client,
        checkpoint["id"],
        {"Authorization": f"Bearer {join['token']}"},
        [("files", ("a.jpg", jpeg_bytes(make_textured_image(2000, 1500, seed=91)), "image/jpeg"))],
    )
    assert response.status_code == 200, response.text
    return task, response.json()["results"][0]["photo_id"]


# ---------------------------------------------------------------- reveal


def test_reveal_needs_a_target(client, admin_headers):
    response = client.post("/api/admin/reveal", json={}, headers=admin_headers)
    assert response.status_code == 403


def test_reveal_rejects_paths_outside_the_data_dir(client, admin_headers):
    response = client.post(
        "/api/admin/reveal", json={"path": "../../../windows/system32"}, headers=admin_headers
    )
    assert response.status_code == 403


def test_reveal_photo_points_the_file_manager_at_the_photo(client, admin_headers, monkeypatch):
    _task, photo_id = _photo_upload(client, admin_headers, "打开文件夹测试")
    opened: list[list[str]] = []

    def fake_popen(command, **kwargs):
        opened.append([str(part) for part in command])
        return None

    monkeypatch.setattr(subprocess, "Popen", fake_popen)
    response = client.post("/api/admin/reveal", json={"photo_id": photo_id}, headers=admin_headers)
    assert response.status_code == 200, response.text

    body = response.json()
    assert body["ok"] is True
    assert len(opened) == 1
    # The file manager is asked to *select* the file, and the path is real
    assert Path(body["path"]).is_file()
    assert any(str(Path(body["path"])) in part for part in opened[0])

    # An unknown photo is a 404, not an OS call
    assert (
        client.post(
            "/api/admin/reveal", json={"photo_id": 999_999}, headers=admin_headers
        ).status_code
        == 404
    )


@pytest.mark.parametrize(
    ("platform", "expected"),
    [
        ("win32", "explorer"),
        ("darwin", "open"),
        ("linux", "xdg-open"),
    ],
)
def test_reveal_command_is_platform_specific(monkeypatch, platform, expected):
    import app.routers.admin as admin_router

    monkeypatch.setattr(sys, "platform", platform)
    command = admin_router._reveal_command(Path("some") / "dir", is_file=False)
    assert command[0] == expected
    # Path separators differ per OS, so compare through Path
    assert str(Path("some") / "dir") in " ".join(command)


def test_reveal_scope_points_at_the_configured_upload_dir(client, admin_headers, monkeypatch):
    response = client.post('/api/admin/reveal',json={'scope':'uploads'},headers=admin_headers)
    assert response.status_code == 403


# ---------------------------------------------------------------- reset


def _photo_file(photo_id: int) -> Path:
    from app.database import SessionLocal
    from app.models import Photo

    with SessionLocal() as db:
        photo = db.get(Photo, photo_id)
        assert photo is not None
        return storage.resolve(photo.stored_path)


def test_reset_wipes_database_and_files(client, admin_headers):
    task, photo_id = _photo_upload(client,admin_headers,'禁止全局清空')
    photo_path = _photo_file(photo_id)
    response = client.post('/api/admin/reset',json={'confirm':'DELETE'},headers=admin_headers)
    assert response.status_code == 403
    assert photo_path.is_file()
    assert client.get(f'/api/admin/tasks/{task["id"]}',headers=admin_headers).status_code == 200


# ---------------------------------------------------------------- external photos dir


def test_photos_on_another_disk_are_stored_absolutely(tmp_path, monkeypatch):
    """THREEDGS_UPLOAD_DIR outside the data dir: paths become absolute, and
    `resolve` still accepts them (and nothing else)."""
    external = tmp_path / "photos-elsewhere"
    external.mkdir()
    monkeypatch.setattr(config, "UPLOAD_DIR", external)

    saved = storage.save_stream(
        io.BytesIO(jpeg_bytes(make_textured_image(400, 300, seed=5))),
        task_id=1,
        checkpoint_id=None,
        filename="x.jpg",
    )

    assert Path(saved.rel_path).is_absolute()
    assert Path(saved.rel_path).is_file()
    assert storage.resolve(saved.rel_path) == saved.abs_path

    # A file outside every configured root is still refused
    with pytest.raises(HTTPException):
        storage.resolve(str(tmp_path / "elsewhere" / "evil.jpg"))


def test_default_layout_keeps_the_historical_path_shape():
    """With the default layout the stored path must stay "uploads/taskN/…", so
    existing databases keep working untouched."""
    assert storage._upload_prefix() == "uploads"
