"""How many photos a checkpoint needs, estimated from the size of the space.

The bulk import format is ``点位名|位置|长x宽x高`` and has no column for the shot
count any more: the server derives it here (an admin can still type a number by
hand, and can still override it afterwards). Kept in one place so the number the
admin previews on the phone-sized form and the number the import writes are the
same.
"""

from __future__ import annotations

import math

# Usable surface one photo covers. 5 m² is the working number from
# docs/shooting-guide.md: at ~1 m from the wall a phone frames roughly 1.5 × 3 m,
# and neighbouring shots overlap by about half.
COVERAGE_M2_PER_SHOT = 5.0
# Below this a room cannot be reconstructed at all (COLMAP needs the overlap).
MIN_SHOTS = 4
# Matches the cap in schemas.CheckpointCreateIn.
MAX_SHOTS = 64


def suggest_shot_count(
    length_m: float | None, width_m: float | None, height_m: float | None
) -> int | None:
    """Photos for a box of that size, or None when the size is not usable.

    Counts the surface a complete capture has to cover — four walls, floor and
    ceiling — and divides it by the per-photo coverage.
    """
    try:
        values = [float(length_m), float(width_m), float(height_m)]  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    if any(not math.isfinite(value) or value <= 0 for value in values):
        return None
    length, width, height = values
    surface = 2 * (length * width + length * height + width * height)
    return max(MIN_SHOTS, min(MAX_SHOTS, math.ceil(surface / COVERAGE_M2_PER_SHOT)))
