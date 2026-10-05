"""Quality engine tests: sharp / blurry / dark / bright / low-resolution must all
be detected.
"""

from __future__ import annotations

from app.quality import analyze_image
from app.quality.hashing import dhash, dhash_distance

from .conftest import make_textured_image, png_bytes


def _analyze(tmp_path, image, name="test.png"):
    path = tmp_path / name
    path.write_bytes(png_bytes(image))
    return analyze_image(path, size_bytes=path.stat().st_size)


def codes(result) -> set[str]:
    return {issue.code for issue in result.issues}


def errors(result) -> set[str]:
    return {issue.code for issue in result.issues if issue.level == "error"}


def test_sharp_image_passes(tmp_path):
    result = _analyze(tmp_path, make_textured_image())
    assert "blurry" not in errors(result)
    assert result.passed is True
    assert result.status in ("ok", "warning")  # no EXIF on synthetic images -> warning
    assert result.metrics["sharpness"] > 200


def test_blurry_image_is_rejected(tmp_path):
    result = _analyze(tmp_path, make_textured_image(blur_radius=12))
    assert "blurry" in errors(result)
    assert result.passed is False
    assert result.status == "rejected"
    assert "重拍" in result.advice or "手抖" in result.advice


def test_dark_image_is_rejected(tmp_path):
    result = _analyze(tmp_path, make_textured_image(scale=0.15))
    assert "too_dark" in errors(result)
    assert result.passed is False


def test_bright_flat_image_is_rejected(tmp_path):
    from PIL import Image

    flat = Image.new("RGB", (3000, 2000), (245, 245, 245))
    result = _analyze(tmp_path, flat)
    assert "too_bright" in errors(result)
    assert result.passed is False


def test_low_resolution_is_rejected(tmp_path):
    result = _analyze(tmp_path, make_textured_image(800, 600))
    assert "low_resolution" in errors(result)
    assert result.passed is False


def test_heavy_compression_warning(tmp_path):
    """Many pixels but a tiny file -> probably re-sent through WeChat/QQ."""
    image = make_textured_image(3000, 2000)
    path = tmp_path / "tiny.jpg"
    from .conftest import jpeg_bytes

    path.write_bytes(jpeg_bytes(image, quality=8))
    result = analyze_image(path, size_bytes=path.stat().st_size)
    assert "heavy_compression" in codes(result)
    assert "no_exif" in codes(result)


def test_score_drops_with_issues(tmp_path):
    good = _analyze(tmp_path, make_textured_image(seed=1), name="good.png")
    bad = _analyze(tmp_path, make_textured_image(seed=1, blur_radius=12), name="bad.png")
    assert bad.score < good.score
    assert 0 <= bad.score <= 100


def test_dhash_detects_duplicates():
    image = make_textured_image(400, 300, seed=7)
    same = image.copy()
    other = make_textured_image(400, 300, seed=8)

    assert dhash_distance(dhash(image), dhash(same)) == 0
    # A completely different texture should differ a lot
    assert dhash_distance(dhash(image), dhash(other)) > 8
    # A missing hash must not be mistaken for a duplicate
    assert dhash_distance(None, dhash(image)) > 100
