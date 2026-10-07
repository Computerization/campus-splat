"""Global pytest setup.

Important: the data directory has to point at a temp folder *before* `app` is
imported, otherwise tests would write into the repo's data/.
"""

from __future__ import annotations

import json
import os
import secrets
import sys
import tempfile
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

TMP_DATA = Path(tempfile.mkdtemp(prefix="threedgs-test-"))
os.environ["THREEDGS_DATA_DIR"] = str(TMP_DATA)
os.environ["THREEDGS_ADMIN_PASSWORD"] = "test-password"
os.environ["THREEDGS_TRAINING_MODE"] = "mock"
os.environ["THREEDGS_MOCK_STEP_SECONDS"] = "0.01"
# In production the quality check runs in a background worker
# (services/quality_jobs.py) and the phone polls for the verdict. Tests use the
# inline path so a finished upload is a finished check; the asynchronous path
# has its own tests in test_quality_jobs.py.
os.environ["THREEDGS_QUALITY_INLINE"] = "1"

import numpy as np  # noqa: E402
import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from PIL import Image, ImageFilter  # noqa: E402

from app.main import app  # noqa: E402


def make_textured_image(
    width: int = 3000,
    height: int = 2000,
    *,
    seed: int = 0,
    blur_radius: float = 0.0,
    scale: float = 1.0,
) -> Image.Image:
    """Make a textured image for testing the sharpness / brightness checks."""
    rng = np.random.default_rng(seed)
    noise = rng.integers(40, 216, size=(height, width), dtype=np.uint8)
    if scale != 1.0:
        noise = np.clip(noise.astype(np.float32) * scale, 0, 255).astype(np.uint8)
    image = Image.fromarray(noise, mode="L").convert("RGB")
    if blur_radius > 0:
        image = image.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    return image


def png_bytes(image: Image.Image) -> bytes:
    import io

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def jpeg_bytes(image: Image.Image, quality: int = 95) -> bytes:
    import io

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    return buffer.getvalue()


@pytest.fixture(scope="session")
def client():
    # The `with` block triggers lifespan (create tables, start the dispatcher)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def isolated_login_limiter():
    from app.routers.auth import _failures
    _failures.clear()
    yield
    _failures.clear()


@pytest.fixture(scope="session")
def admin_headers(client: TestClient) -> dict:
    response = client.post("/api/auth/admin/login", json={"password": "admin001"})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['token']}"}


# ---------------------------------------------------------------- volunteer flow
#
# Volunteers are accounts of their own (username + password) and claim a task
# before submitting photos as one batch. These two helpers are what the tests use
# to get photos into the database, so they mirror the real client flow.


def register_volunteer(client, *, username: str | None = None) -> dict:
    """Register a volunteer account; returns its Authorization headers."""
    name = username or f"测试同学{secrets.token_hex(3)}"
    response = client.post(
        "/api/auth/volunteer/register",
        json={"username": name, "password": "test-password"},
    )
    assert response.status_code == 201, response.text
    return {"Authorization": f"Bearer {response.json()['token']}"}


def submit_photos(
    client,
    task_id: int,
    headers: dict,
    *,
    per_checkpoint: dict[int, int],
    seed: int = 0,
    size: tuple[int, int] = (2000, 1500),
) -> dict:
    """Claim the task and submit ``per_checkpoint[cp_id]`` photos for each point.

    Returns the submission payload (``assignment`` + per-photo ``results``).
    """
    claim = client.post(f"/api/volunteer/tasks/{task_id}/claim", headers=headers)
    assert claim.status_code == 200, claim.text

    files = []
    manifest = []
    index = 0
    for checkpoint_id, count in per_checkpoint.items():
        for _ in range(count):
            index += 1
            files.append(
                (
                    "files",
                    (
                        f"IMG_{seed + index}.jpg",
                        jpeg_bytes(make_textured_image(size[0], size[1], seed=seed + index), quality=80),
                        "image/jpeg",
                    ),
                )
            )
            manifest.append({"checkpoint_id": checkpoint_id})

    response = client.post(
        f"/api/volunteer/tasks/{task_id}/submit",
        data={"manifest": json.dumps(manifest)},
        files=files,
        headers=headers,
    )
    assert response.status_code == 200, response.text
    return response.json()
