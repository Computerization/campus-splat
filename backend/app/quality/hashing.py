"""Perceptual hashing (dHash) — catches re-uploads and burst shots of the same
frame.
"""

from __future__ import annotations

import numpy as np
from PIL import Image

HASH_SIZE = 8  # 8x8 = 64 bit


def dhash(img: Image.Image, hash_size: int = HASH_SIZE) -> str:
    """Difference hash as a 16-character hex string.

    Insensitive to lighting changes, which makes it a good "is this basically
    the same photo?" test.
    """
    gray = img.convert("L").resize((hash_size + 1, hash_size), Image.LANCZOS)
    arr = np.asarray(gray, dtype=np.int16)
    # Compare neighbours within each row -> hash_size*hash_size bits
    bits = (arr[:, 1:] > arr[:, :-1]).flatten()
    value = 0
    for bit in bits:
        value = (value << 1) | int(bit)
    return f"{value:016x}"


def dhash_distance(left: str | None, right: str | None) -> int:
    """Hamming distance between two dHashes; a large value if not comparable."""
    if not left or not right:
        return 999
    try:
        return bin(int(left, 16) ^ int(right, 16)).count("1")
    except ValueError:
        return 999
