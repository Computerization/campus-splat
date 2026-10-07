"""Global pytest setup.

Important: the data directory has to point at a temp folder *before* `app` is
imported, otherwise tests would write into the repo's data/.
"""

from __future__ import annotations

import os
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
