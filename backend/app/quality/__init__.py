"""Heuristic photo quality checks.

Design goals:
  * no heavy dependencies (no COLMAP) — a single photo is judged in milliseconds
  * opencv is optional; without it everything falls back to pure numpy
  * only judges the photo itself; "can this reconstruct?" is left to the
    checkpoint progress and the admin
"""

from __future__ import annotations

from .pipeline import AnalyzeResult, Issue, analyze_image

# Register the HEIC/HEIF decoder (iPhone default). Failing here doesn't affect
# other formats.
try:  # pragma: no cover - depends on pillow-heif being installed
    import pillow_heif

    pillow_heif.register_heif_opener()
    HEIF_SUPPORTED = True
except Exception:  # pragma: no cover
    HEIF_SUPPORTED = False

__all__ = ["AnalyzeResult", "Issue", "analyze_image", "HEIF_SUPPORTED"]
