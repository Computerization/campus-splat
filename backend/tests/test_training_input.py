"""What the trainer actually receives, after `TrainingManager._launch` prepared it.

Two requirements from the field drive this file:

* volunteers use **different phones**, and since the platform solves one COLMAP
  for the whole building, the photos have to be grouped per device so each phone
  gets its own intrinsics (``--ImageReader.single_camera_per_folder``) instead of
  having them averaged together;
* **COLMAP on Windows cannot read HEIC** (the default iPhone format), so whatever
  the volunteer uploaded has to be a plain JPEG by the time the pipeline starts.

Photos go in the way the platform takes them: one batch per submission.
"""

from __future__ import annotations

import io
import json
import time
from pathlib import Path

import pytest
from PIL import Image
from sqlalchemy import select

from app import config
from app.database import SessionLocal
from app.models import Photo
from app.quality import HEIF_SUPPORTED

from .conftest import make_textured_image, register_volunteer
from .test_training_pipeline import _wait_for_run

MAKE_TAG = 271
MODEL_TAG = 272


def _jpeg_with_camera(image: Image.Image, make: str, model: str) -> bytes:
    """A JPEG that claims to come from a specific phone."""
    exif = Image.Exif()
    exif[MAKE_TAG] = make
    exif[MODEL_TAG] = model
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=80, exif=exif.tobytes())
    return buffer.getvalue()


def _task_with_checkpoint(client, admin_headers, *, name: str):
    task = client.post(
        "/api/admin/tasks", json={"name": name, "kind": "indoor"}, headers=admin_headers
    ).json()
    checkpoint = client.post(
        f"/api/admin/tasks/{task['id']}/checkpoints",
        json={"name": "实验室", "shot_count": 1},
        headers=admin_headers,
    ).json()
    return task, checkpoint, register_volunteer(client)


def _submit_files(client, task_id: int, checkpoint_id: int, headers, files: list[tuple]) -> dict:
    """Claim the task and submit exactly ``files`` for one checkpoint.

    ``files`` is a list of ``(name, data, mime)``.
    """
    claim = client.post(f"/api/volunteer/tasks/{task_id}/claim", headers=headers)
    assert claim.status_code == 200, claim.text
    response = client.post(
        f"/api/volunteer/tasks/{task_id}/submit",
        data={"manifest": json.dumps([{"checkpoint_id": checkpoint_id} for _ in files])},
        files=[("files", entry) for entry in files],
        headers=headers,
    )
    assert response.status_code == 200, response.text
    return response.json()


def _run_and_get_input(client, admin_headers, task_id: int) -> Path:
    started = client.post(
        "/api/admin/training",
        json={"task_id": task_id, "params": {"iterations": 1000}},
        headers=admin_headers,
    ).json()
    detail = _wait_for_run(client, admin_headers, started["id"])
    assert detail["status"] == "succeeded", detail.get("message")
    # <run folder>/input — the run folder name comes from the API, not from a guess
    return (config.DATA_DIR / detail["output_path"]).parent / "input"


def test_training_input_is_grouped_per_device_and_all_jpeg(client, admin_headers):
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"训练输入 {time.time()}"
    )

    files = [
        # Two shots from one phone, one from another, one from the same phone at a
        # different resolution (a different camera model as far as COLMAP is
        # concerned), plus a PNG.
        (
            "iphone-0.jpg",
            _jpeg_with_camera(make_textured_image(2400, 1800, seed=0), "Apple", "iPhone 15"),
            "image/jpeg",
        ),
        (
            "iphone-1.jpg",
            _jpeg_with_camera(make_textured_image(2400, 1800, seed=1), "Apple", "iPhone 15"),
            "image/jpeg",
        ),
        (
            "xiaomi.jpg",
            _jpeg_with_camera(make_textured_image(2400, 1800, seed=7), "XiaoMi", "14"),
            "image/jpeg",
        ),
        (
            "iphone-small.jpg",
            _jpeg_with_camera(make_textured_image(1600, 1200, seed=9), "Apple", "iPhone 15"),
            "image/jpeg",
        ),
    ]
    png = io.BytesIO()
    make_textured_image(2400, 1800, seed=11).save(png, format="PNG")
    files.append(("shot.png", png.getvalue(), "image/png"))

    _submit_files(client, task["id"], checkpoint["id"], headers, files)
    input_dir = _run_and_get_input(client, admin_headers, task["id"])

    groups = sorted(path.name for path in input_dir.iterdir() if path.is_dir())
    # One folder per (device, resolution) — what the COLMAP flag relies on
    assert "AppleIPhone15_2400x1800" in groups, groups
    assert "XiaoMi14_2400x1800" in groups, groups
    assert "AppleIPhone15_1600x1200" in groups, groups
    assert "UnknownCamera_2400x1800" in groups, groups  # the PNG has no EXIF

    counts = {group: len(list((input_dir / group).iterdir())) for group in groups}
    assert counts["AppleIPhone15_2400x1800"] == 2
    assert counts["XiaoMi14_2400x1800"] == 1
    assert counts["AppleIPhone15_1600x1200"] == 1

    # Everything the pipeline sees is a JPEG, whatever was uploaded
    for group in groups:
        for path in (input_dir / group).iterdir():
            assert path.suffix == ".jpg", path
            with Image.open(path) as image:
                assert image.format == "JPEG"
                assert image.size in ((2400, 1800), (1600, 1200))

    # … and the plan points the split stage at those grouped names
    plan = json.loads((input_dir.parent / "plan.json").read_text(encoding="utf-8"))
    assert all("/" in photo["file"] for photo in plan["photos"])
    assert {photo["file"].split("/")[0] for photo in plan["photos"]} == set(groups)


@pytest.mark.skipif(not HEIF_SUPPORTED, reason="pillow-heif not installed")
def test_heic_from_an_iphone_reaches_the_trainer_as_jpeg(client, admin_headers):
    """The iPhone default format is HEIC, which COLMAP cannot read — it has to be
    transcoded before the pipeline starts (the upload itself keeps the original)."""
    task, checkpoint, headers = _task_with_checkpoint(
        client, admin_headers, name=f"HEIC 输入 {time.time()}"
    )

    buffer = io.BytesIO()
    try:
        make_textured_image(2400, 1800, seed=21).save(buffer, format="HEIF", quality=90)
    except Exception:  # pragma: no cover - encoder availability varies
        pytest.skip("this pillow-heif build cannot write HEIC")

    _submit_files(
        client,
        task["id"],
        checkpoint["id"],
        headers,
        [("IMG_0001.HEIC", buffer.getvalue(), "image/heic")],
    )

    # The archive keeps what the volunteer handed over (extension lower-cased) …
    with SessionLocal() as db:
        stored = db.execute(
            select(Photo.stored_path).where(Photo.task_id == task["id"])
        ).scalar_one()
    assert stored.endswith(".heic")
    assert (config.DATA_DIR / stored).is_file()

    # … and the trainer gets a readable JPEG of the same picture
    input_dir = _run_and_get_input(client, admin_headers, task["id"])
    files = [path for path in input_dir.rglob("*") if path.is_file()]
    assert len(files) == 1, files
    assert files[0].suffix == ".jpg"
    with Image.open(files[0]) as image:
        assert image.format == "JPEG"
        assert image.size == (2400, 1800)
