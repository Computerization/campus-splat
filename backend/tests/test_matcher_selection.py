"""Tests for how the pipeline picks COLMAP matchers and GPU flags.

These decisions decide whether a real reconstruction succeeds at all, and they
are pure argument building — so they can be checked without COLMAP installed.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import run_training as rt  # noqa: E402


def _pipeline(*, kind: str = "indoor", photos: int = 86, matcher: str = "auto"):
    plan = {
        "kind": kind,
        "params": {"matcher": matcher},
        "photos": [{"file": f"{index:06d}.jpg"} for index in range(photos)],
        "blocks": [{"key": "b000", "name": "房间", "photos": [f"{index:06d}.jpg" for index in range(photos)]}],
    }
    return rt.Pipeline(plan, Path("in"), Path("out"), mock=True)


@pytest.fixture(autouse=True)
def _no_vocab_tree(monkeypatch):
    monkeypatch.delenv("THREEDGS_VOCAB_TREE", raising=False)
    monkeypatch.delenv("THREEDGS_COLMAP_USE_GPU", raising=False)


def test_small_indoor_scope_uses_exhaustive_matching():
    """A single room connects best with exhaustive matching — O(n²) is a
    non-issue at a few hundred photos."""
    database = Path("db")
    commands = _pipeline(photos=86)._matcher_commands(database)
    assert [command[1] for command in commands] == ["exhaustive_matcher"]


def test_large_indoor_scope_falls_back_to_sequential():
    commands = _pipeline(photos=rt.EXHAUSTIVE_MAX_PHOTOS + 1)._matcher_commands(Path("db"))
    assert [command[1] for command in commands] == ["sequential_matcher"]


def test_outdoor_scope_matches_by_flight_order():
    commands = _pipeline(kind="outdoor", photos=500)._matcher_commands(Path("db"))
    assert [command[1] for command in commands] == ["sequential_matcher"]


def test_vocabulary_tree_wins_when_configured(monkeypatch):
    monkeypatch.setenv("THREEDGS_VOCAB_TREE", r"D:\colmap\vocab_tree.bin")
    commands = _pipeline(photos=4000)._matcher_commands(Path("db"))
    assert [command[1] for command in commands] == ["vocab_tree_matcher"]
    assert "--VocabTreeMatching.vocab_tree_path" in commands[0]


def test_outdoor_with_vocab_runs_both_matchers(monkeypatch):
    monkeypatch.setenv("THREEDGS_VOCAB_TREE", r"D:\colmap\vocab_tree.bin")
    commands = _pipeline(kind="outdoor", photos=800)._matcher_commands(Path("db"))
    assert [command[1] for command in commands] == ["sequential_matcher", "vocab_tree_matcher"]


def test_explicit_matcher_choice_is_respected():
    assert [c[1] for c in _pipeline(matcher="sequential")._matcher_commands(Path("db"))] == [
        "sequential_matcher"
    ]
    assert [c[1] for c in _pipeline(matcher="exhaustive")._matcher_commands(Path("db"))] == [
        "exhaustive_matcher"
    ]


def test_vocab_tree_matcher_without_configuration_is_an_error():
    with pytest.raises(RuntimeError, match="THREEDGS_VOCAB_TREE"):
        _pipeline(matcher="vocab_tree")._matcher_commands(Path("db"))


def test_gpu_flag_follows_the_environment(monkeypatch):
    monkeypatch.setenv("THREEDGS_COLMAP_USE_GPU", "0")
    assert rt.Pipeline._gpu_flag() == "0"
    # The flag reaches both the feature extractor and the matchers
    assert "--SiftMatching.use_gpu" in _pipeline(photos=10)._matcher_commands(Path("db"))[0]

    monkeypatch.setenv("THREEDGS_COLMAP_USE_GPU", "1")
    assert rt.Pipeline._gpu_flag() == "1"
    monkeypatch.delenv("THREEDGS_COLMAP_USE_GPU")
    assert rt.Pipeline._gpu_flag() == "1"
