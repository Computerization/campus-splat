"""Point-cloud plumbing for the graded training pipeline.

Three jobs live here, all of them pure file manipulation (no COLMAP, no GPU), so
they can be unit tested and reused by both the backend and the training script:

* ``merge_ply``     — concatenate 3DGS point clouds. Every block of a run shares
                      one COLMAP reconstruction, so the coordinate systems are
                      identical and merging really is just "join the vertex
                      lists" (docs/training-pipeline.md §6.1).
* ``write_colmap_subset_model`` — cut one block's poses out of the building-wide
                      sparse model, so all blocks keep that same coordinate
                      system.
* ``write_gps_file`` / ``write_mock_splat`` — the RTK reference file for
                      ``colmap model_aligner``, and a renderable ply so the mock
                      pipeline can be previewed without a GPU.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable, Sequence

import numpy as np

PLY_MAGIC = b"ply"

# 3DGS stores f_dc_* as spherical-harmonics coefficients; this is the degree-0
# basis constant used to go from a colour in [0, 1] to f_dc (and back).
SH_C0 = 0.28209479177387814

# Number of extra SH coefficients for degree 3 (what the original 3DGS writes)
SH_REST_COUNT = 45

_TYPE_SIZES = {
    "char": 1, "int8": 1,
    "uchar": 1, "uint8": 1,
    "short": 2, "int16": 2,
    "ushort": 2, "uint16": 2,
    "int": 4, "int32": 4,
    "uint": 4, "uint32": 4,
    "float": 4, "float32": 4,
    "double": 8, "float64": 8,
}

# The property layout the original 3DGS writes. The viewer needs the same names.
GAUSSIAN_PROPERTIES: list[tuple[str, str]] = (
    [("float", name) for name in ("x", "y", "z", "nx", "ny", "nz")]
    + [("float", f"f_dc_{i}") for i in range(3)]
    + [("float", f"f_rest_{i}") for i in range(SH_REST_COUNT)]
    + [("float", "opacity")]
    + [("float", f"scale_{i}") for i in range(3)]
    + [("float", f"rot_{i}") for i in range(4)]
)


class PlyError(ValueError):
    """Raised when a ply file is not a binary little-endian point cloud we can
    concatenate (a broken or ascii file, say)."""


@dataclass
class PlyHeader:
    header_lines: list[str]
    vertex_count: int
    properties: list[tuple[str, str]]
    stride: int
    data_offset: int


def read_ply_header(path: str | Path) -> PlyHeader:
    """Parse the header of a binary little-endian ply and locate its data."""
    path = Path(path)
    if not path.exists():
        raise PlyError(f"ply 文件不存在：{path}")

    raw = bytearray()
    data_offset = 0
    with path.open("rb") as handle:
        if handle.readline().strip() != PLY_MAGIC:
            raise PlyError(f"不是 ply 文件：{path}")
        while True:
            line = handle.readline()
            if not line:
                raise PlyError(f"ply 头没有正常结束：{path}")
            raw.extend(line)
            if line.strip() == b"end_header":
                data_offset = handle.tell()
                break

    lines = raw.decode("ascii", errors="replace").splitlines()
    fmt = ""
    vertex_count = -1
    properties: list[tuple[str, str]] = []
    current_element = ""
    for line in lines:
        tokens = line.split()
        if not tokens:
            continue
        if tokens[0] == "format":
            fmt = tokens[1]
        elif tokens[0] == "element":
            current_element = tokens[1]
            if current_element == "vertex":
                vertex_count = int(tokens[2])
        elif tokens[0] == "property" and current_element == "vertex":
            if tokens[1] == "list":
                raise PlyError(f"不支持含 list 属性的 ply：{path}")
            properties.append((tokens[1], tokens[2]))

    if fmt != "binary_little_endian":
        raise PlyError(f"只支持 binary_little_endian 的 ply，实际是 {fmt or '未知'}：{path}")
    if vertex_count < 0 or not properties:
        raise PlyError(f"ply 缺少 vertex 元素或属性：{path}")

    stride = sum(_TYPE_SIZES[dtype] for dtype, _ in properties)
    return PlyHeader(
        header_lines=["ply", *lines],
        vertex_count=vertex_count,
        properties=properties,
        stride=stride,
        data_offset=data_offset,
    )


def summarize_ply(path: str | Path) -> dict:
    """Vertex count / file size, used for the admin artifact list."""
    path = Path(path)
    try:
        header = read_ply_header(path)
        return {
            "gaussians": header.vertex_count,
            "size_bytes": path.stat().st_size,
            "properties": len(header.properties),
        }
    except PlyError:
        return {"gaussians": 0, "size_bytes": path.stat().st_size if path.exists() else 0}


def merge_ply(
    sources: Sequence[str | Path],
    dest: str | Path,
    *,
    on_progress: Callable[[float], None] | None = None,
) -> dict:
    """Concatenate several 3DGS point clouds into one file.

    The sources must share the exact property layout — which is the case for any
    two outputs of the same training toolchain. No transformation is applied:
    identical COLMAP poses mean identical coordinate systems.
    """
    sources = [Path(p) for p in sources]
    if not sources:
        raise PlyError("没有可合并的 ply")

    headers = [read_ply_header(p) for p in sources]
    base = headers[0]
    for header, path in zip(headers[1:], sources[1:]):
        if header.properties != base.properties:
            raise PlyError(f"属性不一致，无法直接拼接：{path}")

    total_vertices = sum(header.vertex_count for header in headers)
    total_bytes = sum(header.vertex_count * header.stride for header in headers)

    out_lines: list[str] = []
    replaced = False
    for line in base.header_lines:
        if line.startswith("element vertex "):
            out_lines.append(f"element vertex {total_vertices}")
            replaced = True
        else:
            out_lines.append(line)
    if not replaced:
        raise PlyError("ply 头里找不到 element vertex")

    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)

    written = 0
    with dest.open("wb") as out:
        out.write(("\n".join(out_lines) + "\n").encode("ascii"))
        for path, header in zip(sources, headers):
            remaining = header.vertex_count * header.stride
            with path.open("rb") as src:
                src.seek(header.data_offset)
                while remaining > 0:
                    chunk = src.read(min(1 << 22, remaining))
                    if not chunk:
                        raise PlyError(f"ply 数据被截断：{path}")
                    remaining -= len(chunk)
            # Re-read in chunks after the size check, so a truncated file fails
            # before we start copying gigabytes into the destination.
            with path.open("rb") as src:
                src.seek(header.data_offset)
                copied = 0
                while copied < header.vertex_count * header.stride:
                    chunk = src.read(min(1 << 22, header.vertex_count * header.stride - copied))
                    if not chunk:
                        break
                    out.write(chunk)
                    copied += len(chunk)
                    written += len(chunk)
                    if on_progress and total_bytes:
                        on_progress(min(1.0, written / (total_bytes + 1)))

    return {
        "sources": [str(p) for p in sources],
        "gaussians": total_vertices,
        "size_bytes": dest.stat().st_size,
    }


# ---------------------------------------------------------------- COLMAP models


def _read_colmap_lines(path: Path, *, keep_empty: bool = False) -> list[str]:
    """Read a COLMAP text model file.

    ``keep_empty`` matters for images.txt: the second line of an image (its 2D
    observations) is *legitimately* empty when nothing was triangulated, and
    dropping it would shift every following pair.
    """
    if not path.exists():
        raise FileNotFoundError(f"COLMAP 模型缺少 {path.name}：{path}")
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    if keep_empty:
        return [line for line in lines if not line.lstrip().startswith("#")]
    return [line for line in lines if line.strip() and not line.lstrip().startswith("#")]


def write_colmap_subset_model(
    model_txt_dir: str | Path,
    out_dir: str | Path,
    image_names: Iterable[str],
) -> dict:
    """Write a COLMAP text model containing only ``image_names``.

    This is the "split" stage of the pipeline: the poses come from the single
    building-wide reconstruction, so every block inherits the same coordinate
    system and no later registration is needed.

    Ids are renumbered from 1 so the written model is self-consistent.
    """
    model_dir = Path(model_txt_dir)
    out_dir = Path(out_dir)
    keep_names = {Path(name).name for name in image_names}
    if not keep_names:
        raise ValueError("没有指定要保留的图像")

    cameras = _read_colmap_lines(model_dir / "cameras.txt")
    image_lines = _read_colmap_lines(model_dir / "images.txt", keep_empty=True)
    points_lines = _read_colmap_lines(model_dir / "points3D.txt")

    # images.txt is two lines per image: the pose, then its 2D observations.
    kept_images: list[tuple[int, str, str, str]] = []
    for index in range(0, len(image_lines) - 1, 2):
        pose = image_lines[index]
        observations = image_lines[index + 1]
        tokens = pose.split()
        if len(tokens) < 10:
            continue
        image_id = int(tokens[0])
        name = tokens[9]
        if Path(name).name not in keep_names:
            continue
        kept_images.append((image_id, pose, observations, name))

    if not kept_images:
        raise ValueError(
            "整栋楼的 COLMAP 模型里没有这个房间的照片 —— "
            "通常是连接键（走廊重叠 / 楼梯间 / 门口朝外那张）拍漏了"
        )

    kept_images.sort(key=lambda item: item[0])
    image_id_map = {old: new for new, (old, _, _, _) in enumerate(kept_images, start=1)}

    # Camera ids are renumbered too, keeping only the cameras we actually use.
    camera_tokens: dict[int, list[str]] = {}
    for line in cameras:
        tokens = line.split()
        if tokens:
            camera_tokens[int(tokens[0])] = tokens
    used_cameras = sorted(
        {int(pose.split()[8]) for _, pose, _, _ in kept_images}
    )
    camera_id_map = {old: new for new, old in enumerate(used_cameras, start=1)}

    out_dir.mkdir(parents=True, exist_ok=True)

    with (out_dir / "cameras.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Camera list with one line of data per camera:\n")
        handle.write("#   CAMERA_ID, MODEL, WIDTH, HEIGHT, PARAMS[]\n")
        for old_id in used_cameras:
            tokens = camera_tokens.get(old_id)
            if tokens is None:
                continue
            handle.write(" ".join([str(camera_id_map[old_id]), *tokens[1:]]) + "\n")

    with (out_dir / "images.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Image list with two lines of data per image:\n")
        handle.write("#   IMAGE_ID, QW, QX, QY, QZ, TX, TY, TZ, CAMERA_ID, NAME\n")
        handle.write("#   POINTS2D[] as (X, Y, POINT3D_ID)\n")
        for old_id, pose, observations, _ in kept_images:
            tokens = pose.split()
            tokens[0] = str(image_id_map[old_id])
            tokens[8] = str(camera_id_map.get(int(tokens[8]), 1))
            handle.write(" ".join(tokens) + "\n")
            handle.write(observations + "\n")

    # points3D.txt: keep the points observed by at least one kept image, and
    # remap both their own ids and the ids inside the track.
    with (out_dir / "points3D.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# 3D point list with one line of data per point:\n")
        handle.write("#   POINT3D_ID, X, Y, Z, R, G, B, ERROR, TRACK[] as (IMAGE_ID, POINT2D_IDX)\n")
        next_point_id = 1
        for line in points_lines:
            tokens = line.split()
            if len(tokens) < 8:
                continue
            track: list[tuple[int, str]] = []
            index = 8
            while index + 1 < len(tokens):
                old_image_id = int(tokens[index])
                point2d_index = tokens[index + 1]
                if old_image_id in image_id_map:
                    track.append((image_id_map[old_image_id], point2d_index))
                index += 2
            if not track:
                continue
            head = [str(next_point_id), *tokens[1:8]]
            tail = [str(value) for pair in track for value in pair]
            handle.write(" ".join(head + tail) + "\n")
            next_point_id += 1

    return {
        "images": len(kept_images),
        "cameras": len(used_cameras),
        "points": next_point_id - 1,
    }


def camera_centers(model_txt_dir: str | Path) -> dict[str, list[float]]:
    """Camera centre per image (world coordinates) from a COLMAP text model.

    COLMAP stores world-to-camera (q, t); the camera centre is ``-R^T t``. Used
    for the block positions in transforms.json, i.e. what the viewer needs in
    order to lay the blocks out next to each other.
    """
    model_dir = Path(model_txt_dir)
    lines = _read_colmap_lines(model_dir / "images.txt", keep_empty=True)
    centers: dict[str, list[float]] = {}
    for index in range(0, len(lines) - 1, 2):
        tokens = lines[index].split()
        if len(tokens) < 10:
            continue
        qw, qx, qy, qz, tx, ty, tz = (float(value) for value in tokens[1:8])
        name = tokens[9]

        norm = math.sqrt(qw * qw + qx * qx + qy * qy + qz * qz) or 1.0
        qw, qx, qy, qz = qw / norm, qx / norm, qy / norm, qz / norm
        # Rotation from the unit quaternion (world-to-camera)
        rotation = np.array(
            [
                [1 - 2 * (qy * qy + qz * qz), 2 * (qx * qy - qz * qw), 2 * (qx * qz + qy * qw)],
                [2 * (qx * qy + qz * qw), 1 - 2 * (qx * qx + qz * qz), 2 * (qy * qz - qx * qw)],
                [2 * (qx * qz - qy * qw), 2 * (qy * qz + qx * qw), 1 - 2 * (qx * qx + qy * qy)],
            ],
            dtype=np.float64,
        )
        center = -rotation.T @ np.array([tx, ty, tz], dtype=np.float64)
        centers[Path(name).name] = [float(value) for value in center]
    return centers


def write_gps_file(entries: Iterable[tuple[str, float, float, float | None]], dest: str | Path) -> int:
    """Write the reference file for ``colmap model_aligner --ref_is_gps 1``.

    One line per image: ``name latitude longitude altitude``. Images without a
    GPS tag are skipped, and the return value is how many lines were written.
    """
    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    written = 0
    with dest.open("w", encoding="utf-8", newline="\n") as handle:
        for name, lat, lng, alt in entries:
            if lat is None or lng is None:
                continue
            handle.write(f"{Path(name).name} {lat:.10f} {lng:.10f} {float(alt or 0.0):.4f}\n")
            written += 1
    return written


def write_mock_colmap_model(
    dest_dir: str | Path,
    images: Sequence[tuple[str, Sequence[float]]],
    *,
    camera_id: int = 1,
    width: int = 4000,
    height: int = 3000,
) -> dict:
    """Write a tiny, valid COLMAP text model (used by the mock pipeline).

    Being a real text model means the mock run exercises the *actual* split
    logic — pose cutting, id renumbering, track filtering — instead of a
    stand-in.
    """
    dest_dir = Path(dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    focal = 0.9 * max(width, height)

    with (dest_dir / "cameras.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Camera list with one line of data per camera:\n")
        handle.write("#   CAMERA_ID, MODEL, WIDTH, HEIGHT, PARAMS[]\n")
        handle.write(
            f"{camera_id} PINHOLE {width} {height} {focal:.4f} {focal:.4f} "
            f"{width / 2:.4f} {height / 2:.4f}\n"
        )

    with (dest_dir / "images.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Image list with two lines of data per image:\n")
        handle.write("#   IMAGE_ID, QW, QX, QY, QZ, TX, TY, TZ, CAMERA_ID, NAME\n")
        handle.write("#   POINTS2D[] as (X, Y, POINT3D_ID)\n")
        for index, (name, center) in enumerate(images, start=1):
            # Identity rotation, so the camera centre is simply -t.
            handle.write(
                f"{index} 1.0 0.0 0.0 0.0 "
                f"{-center[0]:.6f} {-center[1]:.6f} {-center[2]:.6f} {camera_id} {name}\n"
            )
            handle.write(f"0.0 0.0 {index}\n")

    with (dest_dir / "points3D.txt").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("# 3D point list with one line of data per point:\n")
        handle.write("#   POINT3D_ID, X, Y, Z, R, G, B, ERROR, TRACK[] as (IMAGE_ID, POINT2D_IDX)\n")
        for index, (_name, center) in enumerate(images, start=1):
            handle.write(
                f"{index} {center[0]:.6f} {center[1]:.6f} {center[2]:.6f} "
                f"200 200 200 0.5 {index} 0\n"
            )

    return {"images": len(images), "cameras": 1, "points": len(images)}


# ---------------------------------------------------------------- mock output


def _room_surface_points(
    count: int,
    rng: np.random.Generator,
    origin: np.ndarray,
    size: np.ndarray,
) -> np.ndarray:
    """Sample points on the walls / floor / ceiling of a box, weighted by area."""
    width, depth, height = size
    faces = [
        # (area, sampler returning local offsets)
        (depth * height, lambda n, r: np.stack([np.zeros(n), r.uniform(0, depth, n), r.uniform(0, height, n)], axis=1)),
        (depth * height, lambda n, r: np.stack([np.full(n, width), r.uniform(0, depth, n), r.uniform(0, height, n)], axis=1)),
        (width * height, lambda n, r: np.stack([r.uniform(0, width, n), np.zeros(n), r.uniform(0, height, n)], axis=1)),
        (width * height, lambda n, r: np.stack([r.uniform(0, width, n), np.full(n, depth), r.uniform(0, height, n)], axis=1)),
        (width * depth, lambda n, r: np.stack([r.uniform(0, width, n), r.uniform(0, depth, n), np.zeros(n)], axis=1)),
        (width * depth, lambda n, r: np.stack([r.uniform(0, width, n), r.uniform(0, depth, n), np.full(n, height)], axis=1)),
    ]
    weights = np.array([area for area, _ in faces], dtype=np.float64)
    weights /= weights.sum()

    counts = np.floor(weights * count).astype(int)
    counts[0] += count - int(counts.sum())

    chunks: list[np.ndarray] = []
    for (_area, sampler), face_count in zip(faces, counts):
        if face_count <= 0:
            continue
        chunks.append(sampler(face_count, rng))

    stacked = np.concatenate(chunks, axis=0)[:count]
    return stacked + origin


def write_mock_splat(
    dest: str | Path,
    *,
    count: int = 8000,
    seed: int = 0,
    origin: Sequence[float] = (0.0, 0.0, 0.0),
    size: Sequence[float] = (5.0, 4.0, 3.0),
    color: Sequence[float] | None = None,
    scale: float = 0.045,
) -> dict:
    """Write a small, renderable 3DGS-format ply (used by the mock pipeline).

    The property layout matches the original 3DGS output, so the admin preview
    works without ever touching a GPU.
    """
    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(seed)

    points = _room_surface_points(
        count, rng, np.asarray(origin, dtype=np.float64), np.asarray(size, dtype=np.float64)
    )

    # Colour: a base tint plus a little per-point noise and a vertical gradient,
    # so blocks are visually distinguishable in the preview.
    base = np.asarray(color if color is not None else (0.72, 0.74, 0.78), dtype=np.float64)
    gradient = (points[:, 2] - points[:, 2].min()) / max(1e-6, float(np.ptp(points[:, 2])))
    tint = base[None, :] * (0.75 + 0.35 * gradient[:, None])
    tint += rng.normal(0.0, 0.03, size=tint.shape)
    rgb = np.clip(tint, 0.02, 0.98)

    vertex_count = len(points)
    dtype = []
    for name in ("x", "y", "z", "nx", "ny", "nz"):
        dtype.append((name, "<f4"))
    for index in range(3):
        dtype.append((f"f_dc_{index}", "<f4"))
    for index in range(SH_REST_COUNT):
        dtype.append((f"f_rest_{index}", "<f4"))
    dtype.append(("opacity", "<f4"))
    for index in range(3):
        dtype.append((f"scale_{index}", "<f4"))
    for index in range(4):
        dtype.append((f"rot_{index}", "<f4"))

    data = np.zeros(vertex_count, dtype=np.dtype(dtype))
    data["x"], data["y"], data["z"] = points[:, 0], points[:, 1], points[:, 2]
    # The original 3DGS writes zero normals — keep the layout identical
    data["nx"], data["ny"], data["nz"] = 0.0, 0.0, 0.0
    for index in range(3):
        data[f"f_dc_{index}"] = (rgb[:, index] - 0.5) / SH_C0
    # opacity is stored as a logit; 0.9 alpha looks solid without being a wall
    data["opacity"] = math.log(0.9 / 0.1)
    for index in range(3):
        data[f"scale_{index}"] = math.log(scale)
    data["rot_0"] = 1.0

    header = ["ply", "format binary_little_endian 1.0", f"element vertex {vertex_count}"]
    for dtype_name, name in GAUSSIAN_PROPERTIES:
        header.append(f"property {dtype_name} {name}")
    header.append("end_header")

    with dest.open("wb") as handle:
        handle.write(("\n".join(header) + "\n").encode("ascii"))
        data.tofile(handle)

    return {"gaussians": vertex_count, "size_bytes": dest.stat().st_size}


def gaussian_estimate(photo_count: int) -> int:
    """Very rough gaussian count for a block, for the VRAM warning."""
    # Imported lazily so this module stays importable from the training script
    # without dragging the whole app config in at import time.
    from .. import config

    per_million = max(1, config.TRAINING_PHOTOS_PER_MILLION_GAUSSIANS)
    return int(photo_count / per_million * 1_000_000)


# ---------------------------------------------------------------- placements


def identity_matrix() -> list[list[float]]:
    """4x4 identity, row major."""
    return [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]


def identity_placement(pivot: Sequence[float] = (0.0, 0.0, 0.0)) -> dict:
    return {
        "pivot": [float(value) for value in pivot],
        "offset": [0.0, 0.0, 0.0],
        "yaw": 0.0,
        "pitch": 0.0,
        "roll": 0.0,
        "scale": 1.0,
    }


def matrix_for_placement(placement: dict | None) -> list[list[float]]:
    """Derive the 4x4 from a structured placement (missing angles read as 0)."""
    data = placement or {}
    return similarity_matrix(
        data.get("pivot") or (0.0, 0.0, 0.0),
        data.get("offset") or (0.0, 0.0, 0.0),
        float(data.get("yaw") or 0.0),
        float(data.get("scale") or 1.0),
        float(data.get("pitch") or 0.0),
        float(data.get("roll") or 0.0),
    )


def similarity_matrix(
    pivot: Sequence[float],
    offset: Sequence[float],
    yaw: float,
    scale: float,
    pitch: float = 0.0,
    roll: float = 0.0,
) -> list[list[float]]:
    """Matrix for ``T(pivot + offset) · R · S(scale) · T(-pivot)``.

    Human placement of a block is a similarity transform: the indoor and
    outdoor reconstructions are two independent SfM solves, so they differ by
    rotation *and scale*, not just by a rigid motion
    (docs/training-pipeline.md §6.2).

    ``R`` is the ZYX Euler rotation ``Rz(roll) · Ry(yaw) · Rx(pitch)`` — the
    aviation convention, which keeps the old yaw-only behaviour intact when the
    other two angles are zero. Rotating/scaling around the pivot keeps the cloud
    anchored where the admin put it, which is what makes dragging feel right.
    """
    px, py, pz = (float(value) for value in pivot)
    ox, oy, oz = (float(value) for value in offset)
    alpha, beta, gamma = float(pitch), float(yaw), float(roll)

    ca, sa = math.cos(alpha), math.sin(alpha)
    cb, sb = math.cos(beta), math.sin(beta)
    cg, sg = math.cos(gamma), math.sin(gamma)

    # R = Rz(roll) · Ry(yaw) · Rx(pitch), row major
    r00 = cb * cg
    r01 = cg * sb * sa - ca * sg
    r02 = ca * cg * sb + sa * sg
    r10 = cb * sg
    r11 = sa * sb * sg + ca * cg
    r12 = ca * sb * sg - cg * sa
    r20 = -sb
    r21 = cb * sa
    r22 = ca * cb

    s = float(scale)
    # t = pivot + offset - R·S·pivot
    tx = px + ox - s * (r00 * px + r01 * py + r02 * pz)
    ty = py + oy - s * (r10 * px + r11 * py + r12 * pz)
    tz = pz + oz - s * (r20 * px + r21 * py + r22 * pz)

    return [
        [s * r00, s * r01, s * r02, tx],
        [s * r10, s * r11, s * r12, ty],
        [s * r20, s * r21, s * r22, tz],
        [0.0, 0.0, 0.0, 1.0],
    ]


def is_valid_matrix(value: object) -> bool:
    """True for a finite 4x4 nested list."""
    if not isinstance(value, list) or len(value) != 4:
        return False
    for row in value:
        if not isinstance(row, list) or len(row) != 4:
            return False
        for entry in row:
            if not isinstance(entry, (int, float)) or isinstance(entry, bool):
                return False
            if not math.isfinite(float(entry)):
                return False
    return True


def sanitize_placement(raw: dict | None, fallback_pivot: Sequence[float]) -> dict:
    """Clamp a placement coming from the admin UI into a known-good shape."""
    data = raw or {}

    def vec3(name: str, default: Sequence[float]) -> list[float]:
        value = data.get(name)
        if not isinstance(value, (list, tuple)) or len(value) != 3:
            return [float(item) for item in default]
        out = []
        for item in value:
            try:
                number = float(item)
            except (TypeError, ValueError):
                return [float(part) for part in default]
            if not math.isfinite(number):
                return [float(part) for part in default]
            out.append(number)
        return out

    def angle(name: str) -> float:
        try:
            value = float(data.get(name) or 0.0)
        except (TypeError, ValueError):
            return 0.0
        if not math.isfinite(value):
            return 0.0
        # Wrap into (-180°, 180°] so repeated dragging can't pile up to 70000°
        wrapped = ((value + math.pi) % (2 * math.pi)) - math.pi
        return wrapped

    try:
        scale = float(data.get("scale") or 1.0)
    except (TypeError, ValueError):
        scale = 1.0
    if not math.isfinite(scale) or scale <= 0:
        scale = 1.0
    scale = max(0.02, min(50.0, scale))

    return {
        "pivot": vec3("pivot", fallback_pivot),
        "offset": vec3("offset", (0.0, 0.0, 0.0)),
        "yaw": angle("yaw"),
        "pitch": angle("pitch"),
        "roll": angle("roll"),
        "scale": scale,
    }
