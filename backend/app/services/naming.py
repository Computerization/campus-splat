"""Readable, ASCII-only names for the on-disk layout.

The data directory is the only place a photo can be found again later, so the
path has to say what it is:

    data/uploads/BuildingB/Corridor/0001_ZhangSan.jpg

Humans type task, checkpoint and volunteer names in whatever language they like
(usually Chinese), so the *derived* folder/file name is normalized while the
display name is left exactly as typed:

* ASCII words keep their letters and are joined in CamelCase
  ("building b floor 3" -> ``BuildingBFloor3``)
* Chinese characters are transliterated to pinyin ("三号楼" -> ``SanHaoLou``)
* everything else (spaces, punctuation, emoji) is a word separator
* the result is truncated, because Windows still has path-length limits

Nothing here touches the database — callers store the result in
``Task.folder`` / ``Checkpoint.folder`` and use it for storage paths.
"""

from __future__ import annotations

import re
from collections.abc import Iterable

from pypinyin import lazy_pinyin

# CJK ideographs (incl. the extension-A and compatibility blocks)
_CJK = r"\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
_CHUNK = re.compile(rf"[{_CJK}]+|[A-Za-z0-9]+")
_IS_CJK = re.compile(rf"^[{_CJK}]+$")

DEFAULT_MAX_LENGTH = 40


def _title(word: str) -> str:
    """Capitalize a word without destroying deliberate inner capitals.

    ``floor`` -> ``Floor``, ``FLOOR`` -> ``Floor``, ``iPhone`` -> ``IPhone``,
    ``3F`` -> ``3F`` (a leading digit must not drag the letter down).
    """
    if not word:
        return ""
    if len(word) > 1 and word.isupper() and word[0].isalpha():
        return word.capitalize()
    return word[0].upper() + word[1:]


def normalize(text: str | None, *, fallback: str = "Untitled", max_length: int = DEFAULT_MAX_LENGTH) -> str:
    """Turn a human name into a CamelCase ASCII token (pinyin for Chinese)."""
    raw = (text or "").strip()
    if not raw:
        return fallback

    words: list[str] = []
    for chunk in _CHUNK.findall(raw):
        if _IS_CJK.match(chunk):
            # One syllable per character: 三号楼 -> san hao lou
            words.extend(lazy_pinyin(chunk))
        else:
            words.append(chunk)

    name = "".join(_title(word) for word in words if word)
    if max_length and len(name) > max_length:
        name = name[:max_length]
    return name or fallback


def unique_folder(base: str, taken: Iterable[str]) -> str:
    """``base``, or ``base-2``/``base-3``… when that folder name is already used."""
    used = {item.lower() for item in taken if item}
    if base.lower() not in used:
        return base
    for suffix in range(2, 1000):
        candidate = f"{base}-{suffix}"
        if candidate.lower() not in used:
            return candidate
    return base


def photo_name(index: int, nickname: str | None, ext: str) -> str:
    """``0001_ZhangSan.jpg`` — its position in the checkpoint plus who shot it.

    The index makes the name unique inside the checkpoint, so two volunteers with
    the same name never collide.
    """
    who = normalize(nickname, fallback="anon", max_length=24)
    return f"{index:04d}_{who}{ext}"
