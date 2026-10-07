"""Naming rules for the on-disk layout (data/uploads/<task>/<checkpoint>/...).

The point of these tests is that a human can still find a photo six months later:
the path is ASCII, it is spelled the way a person would say it, and the file name
says which shot it is and who took it — while the display name in the UI keeps
whatever the admin typed.
"""

from __future__ import annotations

import pytest

from app.services.naming import normalize, photo_name, unique_folder


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        # Plain English: spaces dropped, CamelCase, first letter capitalized
        ("building b floor 3", "BuildingBFloor3"),
        ("corridor", "Corridor"),
        ("BUILDING 3", "Building3"),
        ("3F lab 302", "3FLab302"),
        # Chinese -> pinyin, one syllable per character
        ("三号楼", "SanHaoLou"),
        ("走廊", "ZouLang"),
        ("实验室302", "ShiYanShi302"),
        # Mixed: the Chinese part is transliterated, the rest is kept
        ("3号楼 A 座", "3HaoLouAZuo"),
        ("Zhang伟", "ZhangWei"),
        # Punctuation and emoji are just separators
        ("3F 实验室·东端", "3FShiYanShiDongDuan"),
        ("宿舍 (8 床)", "SuShe8Chuang"),
        ("a/b\\c:d", "ABCD"),
    ],
)
def test_normalize_makes_ascii_camel_case(raw: str, expected: str) -> None:
    assert normalize(raw) == expected


def test_normalize_falls_back_for_empty_or_unusable_names() -> None:
    assert normalize("") == "Untitled"
    assert normalize(None) == "Untitled"
    assert normalize("   ") == "Untitled"
    assert normalize("🎓🎓") == "Untitled"
    assert normalize("!!!", fallback="anon") == "anon"


def test_normalize_truncates_long_names() -> None:
    long_name = normalize("实验室" * 40)
    assert len(long_name) <= 40
    assert long_name.startswith("ShiYanShi")


def test_photo_name_is_numbered_and_says_who_took_it() -> None:
    assert photo_name(1, "张三", ".jpg") == "0001_ZhangSan.jpg"
    assert photo_name(42, "ZhangSan", ".png") == "0042_ZhangSan.png"
    # Mixed input: pinyin for the Chinese half
    assert photo_name(7, "Zhang伟", ".jpg") == "0007_ZhangWei.jpg"
    # A volunteer who never gave a name still gets a valid file
    assert photo_name(3, None, ".jpg") == "0003_anon.jpg"
    assert photo_name(3, "", ".HEIC") == "0003_anon.HEIC"


def test_photo_name_numbers_do_not_collide_for_same_name() -> None:
    a = photo_name(1, "张伟", ".jpg")
    b = photo_name(2, "张伟", ".jpg")
    assert a != b


def test_unique_folder_keeps_names_readable() -> None:
    assert unique_folder("SanHaoLou", []) == "SanHaoLou"
    assert unique_folder("SanHaoLou", ["buildinga"]) == "SanHaoLou"
    # Same name twice: not silently merged, and still human-readable
    assert unique_folder("SanHaoLou", ["sanhaolou"]) == "SanHaoLou-2"
    assert unique_folder("SanHaoLou", ["SanHaoLou", "sanhaolou-2"]) == "SanHaoLou-3"
