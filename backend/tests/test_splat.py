"""Unit tests for the point-cloud plumbing of the graded pipeline.

These are pure file manipulations (no COLMAP, no GPU), so they run anywhere:
ply merging, cutting one room's poses out of the building-wide model, the RTK
reference file, and the mock point cloud the preview relies on.
"""

from __future__ import annotations

import math

import numpy as np
import pytest

from app.services import splat


def test_mock_splat_is_a_valid_3dgs_ply(tmp_path):
    path = tmp_path / "block.ply"
    info = splat.write_mock_splat(path, count=500, seed=3)

    assert info["gaussians"] == 500
    header = splat.read_ply_header(path)
    assert header.vertex_count == 500
    names = [name for _dtype, name in header.properties]
    # The original 3DGS layout, which is what the browser viewers expect
    assert names[:6] == ["x", "y", "z", "nx", "ny", "nz"]
    assert names[6:9] == ["f_dc_0", "f_dc_1", "f_dc_2"]
    assert len([name for name in names if name.startswith("f_rest_")]) == 45
    assert names[-8:] == ["opacity", "scale_0", "scale_1", "scale_2", "rot_0", "rot_1", "rot_2", "rot_3"]
    assert path.stat().st_size == header.data_offset + 500 * header.stride


def test_merge_ply_concatenates_without_transforming(tmp_path):
    first = tmp_path / "a.ply"
    second = tmp_path / "b.ply"
    splat.write_mock_splat(first, count=300, seed=1, origin=(0, 0, 0))
    splat.write_mock_splat(second, count=200, seed=2, origin=(8, 0, 0))

    merged = tmp_path / "merged.ply"
    info = splat.merge_ply([first, second], merged)

    assert info["gaussians"] == 500
    header = splat.read_ply_header(merged)
    assert header.vertex_count == 500
    # One header + both vertex blocks, byte for byte
    assert merged.stat().st_size == header.data_offset + 500 * header.stride


def test_merge_ply_rejects_mismatched_layouts(tmp_path):
    good = tmp_path / "good.ply"
    splat.write_mock_splat(good, count=10)

    other = tmp_path / "other.ply"
    other.write_bytes(
        b"ply\nformat binary_little_endian 1.0\nelement vertex 1\n"
        b"property float x\nend_header\n" + b"\x00" * 4
    )
    with pytest.raises(splat.PlyError):
        splat.merge_ply([good, other], tmp_path / "out.ply")


def test_read_ply_header_rejects_ascii(tmp_path):
    ascii_ply = tmp_path / "ascii.ply"
    ascii_ply.write_text(
        "ply\nformat ascii 1.0\nelement vertex 1\nproperty float x\nend_header\n0\n",
        encoding="utf-8",
    )
    with pytest.raises(splat.PlyError):
        splat.read_ply_header(ascii_ply)


def test_colmap_subset_keeps_one_room_and_renumbers(tmp_path):
    model = tmp_path / "model"
    splat.write_mock_colmap_model(
        model,
        [
            ("room_a/0001.jpg", (0, 0, 0)),
            ("room_a/0002.jpg", (1, 0, 0)),
            ("corridor/0003.jpg", (5, 0, 0)),
        ],
    )

    out = tmp_path / "block"
    info = splat.write_colmap_subset_model(model, out, ["0001.jpg", "0002.jpg"])

    assert info["images"] == 2
    lines = [line for line in (out / "images.txt").read_text(encoding="utf-8").splitlines() if line and not line.startswith("#")]
    # Two lines per image, ids renumbered from 1
    assert len(lines) == 4
    assert lines[0].split()[0] == "1"
    assert lines[0].split()[9] == "room_a/0001.jpg"
    assert lines[2].split()[0] == "2"

    points = [line for line in (out / "points3D.txt").read_text(encoding="utf-8").splitlines() if line and not line.startswith("#")]
    assert len(points) == 2  # the corridor point is dropped
    assert points[0].split()[0] == "1"
    assert points[0].split()[-2] == "1"  # track still points at a valid image id


def test_colmap_subset_fails_when_the_room_is_missing(tmp_path):
    model = tmp_path / "model"
    splat.write_mock_colmap_model(model, [("room_a/0001.jpg", (0, 0, 0))])
    with pytest.raises(ValueError, match="连接键"):
        splat.write_colmap_subset_model(model, tmp_path / "block", ["missing.jpg"])


def test_camera_centers_round_trip(tmp_path):
    model = tmp_path / "model"
    splat.write_mock_colmap_model(model, [("a.jpg", (1.0, 2.0, 3.0)), ("b.jpg", (-4.0, 0.5, 2.0))])
    centers = splat.camera_centers(model)
    assert centers["a.jpg"] == pytest.approx([1.0, 2.0, 3.0])
    assert centers["b.jpg"] == pytest.approx([-4.0, 0.5, 2.0])


def test_gps_file_skips_photos_without_a_fix(tmp_path):
    dest = tmp_path / "gps.txt"
    written = splat.write_gps_file(
        [
            ("000001.jpg", 31.2304, 121.4737, 12.5),
            ("000002.jpg", None, None, None),
            ("000003.jpg", 31.2310, 121.4740, None),
        ],
        dest,
    )
    assert written == 2
    lines = dest.read_text(encoding="utf-8").splitlines()
    assert lines[0].startswith("000001.jpg 31.2304000000 121.4737000000 12.5000")
    assert lines[1].endswith(" 0.0000")


def test_gaussian_estimate_grows_with_the_block():
    assert splat.gaussian_estimate(0) == 0
    assert splat.gaussian_estimate(600) > splat.gaussian_estimate(200)


def test_summarize_ply_on_a_missing_file_still_reports_size(tmp_path):
    assert splat.summarize_ply(tmp_path / "nope.ply")["gaussians"] == 0


# ---------------------------------------------------------------- placements


def test_identity_placement_is_the_identity_matrix():
    matrix = splat.similarity_matrix([1.0, 2.0, 3.0], [0.0, 0.0, 0.0], 0.0, 1.0)
    assert matrix == splat.identity_matrix()
    assert splat.is_valid_matrix(matrix)


def test_similarity_keeps_the_pivot_and_applies_yaw_around_it():
    pivot = [10.0, 0.0, 5.0]
    offset = [1.0, 2.0, -3.0]
    yaw = 0.5
    scale = 2.0
    matrix = np.array(splat.similarity_matrix(pivot, offset, yaw, scale), dtype=float)

    # The pivot ends up exactly at pivot + offset …
    pivot_point = np.append(np.array(pivot, dtype=float), 1.0)
    moved = matrix @ pivot_point
    assert moved[:3] == pytest.approx(np.array(pivot, dtype=float) + np.array(offset, dtype=float))

    # … and a point offset from it is rotated/scaled around it
    delta = np.array([0.5, 0.0, -0.25])
    point = np.append(np.array(pivot) + delta, 1.0)
    expected = (
        np.array(pivot)
        + np.array(offset)
        + np.array(
            [
                scale * (np.cos(yaw) * delta[0] + np.sin(yaw) * delta[2]),
                scale * delta[1],
                scale * (-np.sin(yaw) * delta[0] + np.cos(yaw) * delta[2]),
            ]
        )
    )
    assert (matrix @ point)[:3] == pytest.approx(expected)


def test_scale_is_applied_uniformly():
    matrix = np.array(splat.similarity_matrix([0, 0, 0], [0, 0, 0], 0.0, 3.0), dtype=float)
    point = np.array([1.0, -2.0, 0.5, 1.0])
    assert (matrix @ point)[:3] == pytest.approx([3.0, -6.0, 1.5])


def test_pitch_rotates_around_x():
    """R = Rz·Ry·Rx: a 90° pitch sends local +Y to world +Z."""
    matrix = np.array(
        splat.similarity_matrix([0, 0, 0], [0, 0, 0], 0.0, 1.0, math.pi / 2, 0.0),
        dtype=float,
    )
    assert (matrix @ np.array([0.0, 1.0, 0.0, 1.0]))[:3] == pytest.approx([0.0, 0.0, 1.0])


def test_roll_rotates_around_z():
    matrix = np.array(
        splat.similarity_matrix([0, 0, 0], [0, 0, 0], 0.0, 1.0, 0.0, math.pi / 2),
        dtype=float,
    )
    assert (matrix @ np.array([1.0, 0.0, 0.0, 1.0]))[:3] == pytest.approx([0.0, 1.0, 0.0])


def test_three_axis_rotation_still_keeps_the_pivot():
    pivot = [2.0, -1.0, 0.5]
    offset = [5.0, 0.0, 0.0]
    placement = {
        "pivot": pivot,
        "offset": offset,
        "yaw": 0.3,
        "pitch": -0.7,
        "roll": 1.1,
        "scale": 0.5,
    }
    matrix = np.array(splat.matrix_for_placement(placement), dtype=float)
    moved = matrix @ np.array([*pivot, 1.0])
    assert moved[:3] == pytest.approx([pivot[0] + offset[0], pivot[1], pivot[2]])

    # The rotation part stays orthogonal and the determinant is scale^3
    rotation = matrix[:3, :3] / 0.5
    assert rotation @ rotation.T == pytest.approx(np.eye(3), abs=1e-12)
    assert float(np.linalg.det(matrix[:3, :3])) == pytest.approx(0.5**3)


def test_sanitize_placement_clamps_hostile_input():
    fallback = [1.0, 2.0, 3.0]
    cleaned = splat.sanitize_placement(
        {
            "offset": [float("nan"), 1, 2],
            "yaw": 99.0,
            "pitch": float("inf"),
            "roll": -99.0,
            "scale": -5.0,
        },
        fallback,
    )
    assert cleaned["pivot"] == fallback
    assert cleaned["offset"] == [0.0, 0.0, 0.0]  # NaN in the vector -> default
    assert all(abs(cleaned[name]) <= math.pi + 1e-9 for name in ("yaw", "pitch", "roll"))
    assert cleaned["scale"] == 1.0

    empty = splat.sanitize_placement(None, fallback)
    assert empty == {
        "pivot": fallback,
        "offset": [0.0, 0.0, 0.0],
        "yaw": 0.0,
        "pitch": 0.0,
        "roll": 0.0,
        "scale": 1.0,
    }


def test_angles_wrap_instead_of_piling_up():
    cleaned = splat.sanitize_placement({"yaw": 3 * 2 * math.pi + 0.25}, [0, 0, 0])
    assert cleaned["yaw"] == pytest.approx(0.25, abs=1e-9)


def test_is_valid_matrix_rejects_junk():
    assert splat.is_valid_matrix(splat.identity_matrix())
    assert not splat.is_valid_matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    assert not splat.is_valid_matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, "x"]])
    assert not splat.is_valid_matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, float("inf")]])
