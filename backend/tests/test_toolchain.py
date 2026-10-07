"""Method A (gsplat) of docs/training-toolchain.md, verified without a GPU.

Three layers are covered:

1. the command-template contract in ``app.services.toolchain`` — which variable
   belongs to which toolchain, which placeholders exist, and the doc's 已知坑
   table turned into warnings the admin sees *before* a run is queued;
2. the preflight / queue payloads the training page renders its 运行状态 from;
3. a real block run through ``run_training.Pipeline`` against
   ``tests/fixtures/fake_gsplat_trainer.py`` — a stand-in that imitates gsplat's
   CLI, its ``\\r``-redrawn tqdm bar and its ``ply/point_cloud_<step>.ply``
   output, including the ``save_ply=False`` default that produces the doc's most
   common dead end.
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import pytest

from app import config
from app.database import SessionLocal
from app.models import Task
from app.services import toolchain
from app.services.training import normalize_params, preflight, queue_depth

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import run_training as rt  # noqa: E402

FAKE_TRAINER = Path(__file__).resolve().parent / "fixtures" / "fake_gsplat_trainer.py"


def _gsplat_template(*, save_ply: bool = True, steps: str = "{iterations}") -> str:
    """The command template of docs/training-toolchain.md §二/§八."""
    flags = [
        "--data_dir {source}",
        "--result_dir {model}",
        f"--max_steps {steps}",
        "--save_steps {iterations}",
        "--eval_steps 1000000",
        "--data_factor {data_factor}",
        "--disable_viewer",
    ]
    if save_ply:
        flags.insert(4, "--ply_steps {iterations}")
        flags.insert(4, "--save_ply")
    return f'"{sys.executable}" "{FAKE_TRAINER}" default ' + " ".join(flags)


@pytest.fixture(autouse=True)
def _isolated_toolchain_env(monkeypatch):
    """No test inherits the developer's .env trainer commands."""
    monkeypatch.delenv("THREEDGS_GS_COMMAND", raising=False)
    monkeypatch.delenv("THREEDGS_GSPLAT_COMMAND", raising=False)


# ---------------------------------------------------------------- template contract


def test_render_fills_the_known_placeholders_and_keeps_the_rest():
    template = (
        'tool {source} {model} {images} {iterations} {resolution} {data_factor} '
        '--config {"sh_degree": 3}'
    )
    rendered = toolchain.render(
        template,
        {
            "source": Path(r"D:\out\blocks\b000\dense"),
            "model": Path(r"D:\out\blocks\b000\gs_model"),
            "images": Path(r"D:\out\blocks\b000\dense\images"),
            "iterations": 30_000,
            "resolution": 1600,
            "data_factor": 2,
        },
    )
    assert "D:\\out\\blocks\\b000\\dense" in rendered
    assert "30000" in rendered and "1600" in rendered
    assert rendered.endswith('--config {"sh_degree": 3}')


def test_render_quotes_paths_with_spaces_exactly_once():
    values = {
        "source": Path(r"D:\my captures\run1\blocks\b000\dense"),
        "model": Path(r"D:\out\b000"),
        "iterations": 300,
    }
    quoted = toolchain.render("trainer --data_dir {source} --result_dir {model} --max_steps {iterations}", values)
    assert '--data_dir "D:\\my captures\\run1\\blocks\\b000\\dense"' in quoted
    # A path without spaces stays bare
    assert "--result_dir D:\\out\\b000" in quoted

    already = toolchain.render('trainer -s "{source}" -m {model}', values)
    assert '-s "D:\\my captures\\run1\\blocks\\b000\\dense"' in already
    assert '""' not in already


def test_render_refuses_a_template_that_cannot_be_attributed_to_a_block():
    with pytest.raises(toolchain.CommandError, match="model"):
        # Without {model} the produced ply cannot be found again (doc §七 rule 3)
        toolchain.render("trainer -s {source}", {"source": "x"})
    with pytest.raises(toolchain.CommandError, match="source"):
        toolchain.render("trainer --result_dir {model}", {"model": "x"})


def test_diagnose_walks_the_documented_pitfalls():
    # Exactly the doc's §八 example line: no viewer flag, no ply output, no eval
    # step and no downsampling — every one of these bites on the GPU machine.
    bare = (
        f'"{sys.executable}" D:\\gsplat\\examples\\simple_trainer.py default '
        "--data_dir {source} --result_dir {model} --max_steps {iterations}"
    )
    warnings = toolchain.diagnose(
        bare, toolchain="gsplat", iterations=30_000, data_factor=2
    )
    joined = "\n".join(warnings)
    assert "--disable_viewer" in joined
    assert "--save_ply" in joined
    assert "--data_factor" in joined
    assert "--eval_steps" in joined
    assert len(warnings) == 4

    # The recommended template is clean
    assert (
        toolchain.diagnose(
            _gsplat_template(), toolchain="gsplat", iterations=30_000, data_factor=2
        )
        == []
    )


def test_diagnose_notices_save_ply_without_ply_steps():
    template = _gsplat_template(save_ply=True).replace("--ply_steps {iterations} ", "")
    warnings = toolchain.diagnose(
        template, toolchain="gsplat", iterations=30_000, data_factor=1
    )
    assert any("--ply_steps" in warning for warning in warnings)


def test_diagnose_flags_hardcoded_data_factor():
    template = _gsplat_template().replace("--data_factor {data_factor}", "--data_factor 1")
    warnings = toolchain.diagnose(
        template, toolchain="gsplat", iterations=30_000, data_factor=2
    )
    assert any("写死" in warning for warning in warnings)


def test_diagnose_mentions_data_factor_even_without_downsampling():
    """With no --data_factor the page's downsampling choice cannot reach the
    trainer, whatever value is selected — and gsplat's own default is not ours
    to assume."""
    template = _gsplat_template().replace(" --data_factor {data_factor}", "")
    warnings = toolchain.diagnose(
        template, toolchain="gsplat", iterations=30_000, data_factor=1
    )
    assert any("--data_factor" in warning for warning in warnings)


def test_diagnose_notices_a_hardcoded_iteration_count():
    """The training page's iteration count is only real if the template passes
    the placeholder through."""
    template = _gsplat_template(steps="30000").replace("{iterations}", "30000")
    warnings = toolchain.diagnose(
        template, toolchain="gsplat", iterations=50_000, data_factor=1
    )
    assert any("{iterations}" in warning for warning in warnings)
    assert any("50,000" in warning for warning in warnings)
    # ... and the recommended template says nothing about it
    assert (
        toolchain.diagnose(
            _gsplat_template(), toolchain="gsplat", iterations=50_000, data_factor=1
        )
        == []
    )


def test_diagnose_guards_the_original_3dgs_template():
    warnings = toolchain.diagnose(
        "python train.py -s {source} -m {model} --iterations {iterations} --data_device cpu",
        toolchain="3dgs",
        iterations=30_000,
        data_factor=1,
    )
    assert any("data_device" in warning for warning in warnings)
    # --data_factor is gsplat-only; asking for it on 3DGS has to be pointed out
    scaled = toolchain.diagnose(
        "python train.py -s {source} -m {model} --iterations {iterations} --resolution {resolution}",
        toolchain="3dgs",
        iterations=30_000,
        data_factor=2,
    )
    assert any("gsplat" in warning for warning in scaled)


def test_diagnose_without_a_template_says_which_variable_to_set():
    warnings = toolchain.diagnose("", toolchain="gsplat", iterations=30_000)
    assert len(warnings) == 1
    assert "THREEDGS_GSPLAT_COMMAND" in warnings[0]


def test_a_missing_template_is_not_a_problem_in_mock_mode():
    """The console ships in mock mode: an unset trainer command must not look
    like an error there (nothing is launched at all)."""
    assert toolchain.diagnose("", toolchain="gsplat", mode="mock") == []
    assert toolchain.diagnose("", toolchain="gsplat", mode="real") != []

    # A template that IS configured is still checked for pitfalls either way
    pitfalls = toolchain.diagnose(
        f'"{sys.executable}" trainer.py --data_dir {{source}} --result_dir {{model}}',
        toolchain="gsplat",
        mode="mock",
    )
    assert any("--save_ply" in warning for warning in pitfalls)


def test_status_maps_each_toolchain_to_its_own_variable(monkeypatch):
    monkeypatch.setenv("THREEDGS_GS_COMMAND", f'"{sys.executable}" train.py')
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", "D:\\nowhere\\python.exe examples\\simple_trainer.py")

    status = toolchain.status()["toolchains"]
    assert status["3dgs"]["env_var"] == "THREEDGS_GS_COMMAND"
    assert status["3dgs"]["configured"] is True
    assert status["3dgs"]["program_available"] is True
    assert status["gsplat"]["env_var"] == "THREEDGS_GSPLAT_COMMAND"
    assert status["gsplat"]["program_available"] is False


def test_a_wrong_toolchain_choice_is_visible_in_the_queue(client, monkeypatch):
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    monkeypatch.setenv("THREEDGS_TRAINING_MODE", "real")
    with SessionLocal() as db:
        depth = queue_depth(db)

    assert depth["mode"] == "real"
    assert depth["toolchains"]["gsplat"]["configured"] is True
    assert depth["toolchains"]["gsplat"]["program_available"] is True
    # Nothing set THREEDGS_GS_COMMAND: picking 「3dgs」 would fail per block
    assert depth["toolchains"]["3dgs"]["configured"] is False


def test_preflight_warns_about_the_selected_toolchain(client, monkeypatch):
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    monkeypatch.setenv("THREEDGS_TRAINING_MODE", "real")
    with SessionLocal() as db:
        task = Task(
            name=f"工具链预检 {time.time()}",
            kind="indoor",
            access_code=f"T{int(time.time() * 1000) % 10**8}",
        )
        db.add(task)
        db.commit()
        task_id = task.id

        gsplat = preflight(
            db,
            task_id=task_id,
            block_max_photos=600,
            params={"toolchain": "gsplat", "data_factor": 2, "iterations": 30_000},
        )
        legacy = preflight(
            db,
            task_id=task_id,
            block_max_photos=600,
            params={"toolchain": "3dgs", "data_factor": 1, "iterations": 30_000},
        )

    assert gsplat["toolchain"] == "gsplat"
    assert gsplat["toolchain_env_var"] == "THREEDGS_GSPLAT_COMMAND"
    assert gsplat["command_configured"] is True
    assert gsplat["command_program_available"] is True
    assert gsplat["command_warnings"] == []
    # No photos yet — the preflight still answers, it just says so
    assert any("可用的照片" in warning for warning in gsplat["warnings"])

    assert legacy["toolchain"] == "3dgs"
    assert legacy["toolchain_env_var"] == "THREEDGS_GS_COMMAND"
    assert legacy["command_configured"] is False
    assert legacy["command_program_available"] is None
    assert any("THREEDGS_GS_COMMAND" in warning for warning in legacy["command_warnings"])


def test_normalize_params_defaults_the_downsampling_factor():
    assert normalize_params({})["data_factor"] == config.TRAINING_DEFAULTS["data_factor"] == 1
    assert normalize_params({"data_factor": 4})["data_factor"] == 4


def test_preflight_endpoint_answers_for_the_selected_toolchain(client, admin_headers, monkeypatch):
    """The training page asks the preflight with the parameters on screen, so
    the answer has to be about that toolchain — that is what its 运行状态 and
    warning list are rendered from."""
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    monkeypatch.setenv("THREEDGS_TRAINING_MODE", "real")
    task = client.post(
        "/api/admin/tasks", json={"name": f"预检端点 {time.time()}"}, headers=admin_headers
    ).json()

    response = client.get(
        f"/api/admin/training/preflight?task_id={task['id']}"
        "&toolchain=gsplat&data_factor=2&iterations=30000",
        headers=admin_headers,
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["toolchain"] == "gsplat"
    assert body["toolchain_env_var"] == "THREEDGS_GSPLAT_COMMAND"
    assert body["command_configured"] is True
    assert body["command_program_available"] is True
    assert body["command_warnings"] == []

    # The other toolchain has no template configured: say so instead of failing later
    legacy = client.get(
        f"/api/admin/training/preflight?task_id={task['id']}&toolchain=3dgs",
        headers=admin_headers,
    ).json()
    assert legacy["command_configured"] is False
    assert any("THREEDGS_GS_COMMAND" in warning for warning in legacy["command_warnings"])

    # Back in mock mode the same preflight is quiet: nothing is launched, so a
    # missing template is not an error (the console defaults to mock)
    monkeypatch.setenv("THREEDGS_TRAINING_MODE", "mock")
    quiet = client.get(
        f"/api/admin/training/preflight?task_id={task['id']}&toolchain=3dgs",
        headers=admin_headers,
    ).json()
    assert quiet["command_configured"] is False
    assert quiet["command_warnings"] == []

    # Nonsense parameters never reach the pipeline
    assert (
        client.get(
            f"/api/admin/training/preflight?task_id={task['id']}&data_factor=3",
            headers=admin_headers,
        ).status_code
        == 400
    )
    assert (
        client.get(
            f"/api/admin/training/preflight?task_id={task['id']}&toolchain=lichtfeld",
            headers=admin_headers,
        ).status_code
        == 422
    )
    assert (
        client.get("/api/admin/training/preflight?task_id=999999", headers=admin_headers).status_code
        == 404
    )


def test_system_info_lists_both_trainer_commands(client, admin_headers, monkeypatch):
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    info = client.get("/api/admin/system", headers=admin_headers).json()
    toolchains = info["training_queue"]["toolchains"]

    assert toolchains["gsplat"]["env_var"] == "THREEDGS_GSPLAT_COMMAND"
    assert toolchains["gsplat"]["configured"] is True
    assert toolchains["3dgs"]["configured"] is False


# ---------------------------------------------------------------- block run


def _pipeline(tmp_path: Path, params: dict | None = None) -> rt.Pipeline:
    plan = {
        "kind": "indoor",
        "params": {"iterations": 300, **(params or {})},
        "photos": [{"file": "000000.jpg"}],
        "blocks": [
            {"key": "b000", "name": "3F 实验室 302", "checkpoint_id": 1, "photos": ["000000.jpg"]}
        ],
    }
    return rt.Pipeline(plan, tmp_path / "input", tmp_path / "output", mock=False)


def _prepare_dense(pipeline: rt.Pipeline, block: dict) -> Path:
    """The COLMAP directory the platform hands to the trainer."""
    dense = pipeline._block_dir(block["key"]) / "dense"
    (dense / "images").mkdir(parents=True, exist_ok=True)
    (dense / "sparse" / "0").mkdir(parents=True, exist_ok=True)
    return dense


def test_gsplat_block_lands_in_the_block_directory(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    pipeline = _pipeline(tmp_path, {"toolchain": "gsplat", "data_factor": 2})
    block = pipeline.blocks[0]

    # Stand in for `colmap image_undistorter`, which needs a real COLMAP
    def fake_undistort(cmd, *, label):
        dense = Path(cmd[cmd.index("--output_path") + 1])
        (dense / "images").mkdir(parents=True, exist_ok=True)
        (dense / "sparse" / "0").mkdir(parents=True, exist_ok=True)
        return {"returncode": 0}

    monkeypatch.setattr(pipeline, "_run_tool", fake_undistort)
    pipeline._train_block(0, block)

    # `_train_block` copies whatever it found into the block's own point_cloud.ply
    exported = pipeline._block_dir("b000") / "point_cloud.ply"
    assert exported.exists()
    summary = rt.splat.summarize_ply(exported)
    assert summary["gaussians"] > 0
    assert pipeline.block_plys["b000"] == exported

    # gsplat parks its output in <result_dir>/ply/point_cloud_<step>.ply, with the
    # 0-indexed step in the name — the recursive scan has to find that
    produced = pipeline._block_dir("b000") / "gs_model" / "ply" / "point_cloud_299.ply"
    assert produced.exists()

    # The placeholders really reached the trainer
    args = json.loads(
        (pipeline._block_dir("b000") / "gs_model" / "run_args.json").read_text(encoding="utf-8")
    )
    assert args["data_factor"] == 2
    assert args["disable_viewer"] is True
    assert args["save_ply"] is True
    assert args["max_steps"] == 300
    assert args["ply_steps"] == [300]
    assert Path(args["data_dir"]) == pipeline._block_dir("b000") / "dense"
    assert Path(args["result_dir"]) == pipeline._block_dir("b000") / "gs_model"

    out = capsys.readouterr().out
    # Progress is scraped off a bar that is redrawn with \r (doc §七 rule 4) ...
    assert out.count('"stage": "block_training"') >= 50
    # ... and the block finishes with the real artifact statistics
    assert '"status": "succeeded"' in out
    assert '"gaussians": 2000' in out


def test_gsplat_template_survives_a_path_with_spaces(tmp_path, monkeypatch):
    """A data directory like "C:\\Users\\Student Name\\..." must not break the
    command line — the placeholder renderer quotes the paths that need it."""
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template())
    pipeline = _pipeline(tmp_path / "my captures", {"toolchain": "gsplat"})
    block = pipeline.blocks[0]
    dense = _prepare_dense(pipeline, block)

    pipeline._real_block_training(0, block, dense)

    args = json.loads(
        (pipeline._block_dir("b000") / "gs_model" / "run_args.json").read_text(encoding="utf-8")
    )
    assert Path(args["data_dir"]) == dense
    assert Path(args["result_dir"]) == pipeline._block_dir("b000") / "gs_model"


def test_missing_save_ply_is_diagnosed_as_the_documented_dead_end(tmp_path, monkeypatch, capsys):
    """gsplat ships with save_ply=False: the template without it trains fine and
    then has nothing to show — which is the failure the docs warn about."""
    monkeypatch.setenv("THREEDGS_GSPLAT_COMMAND", _gsplat_template(save_ply=False))
    pipeline = _pipeline(tmp_path, {"toolchain": "gsplat"})
    block = pipeline.blocks[0]
    dense = _prepare_dense(pipeline, block)

    pipeline._real_block_training(0, block, dense)

    block_dir = pipeline._block_dir("b000")
    assert pipeline._find_ply(block_dir) is None
    message = pipeline._missing_ply_message(block)
    assert "--save_ply" in message and "--ply_steps" in message
    # The pitfall is also reported before the training even starts
    assert "[warn]" in capsys.readouterr().out


def test_missing_command_template_fails_the_block_with_the_variable_name(tmp_path):
    pipeline = _pipeline(tmp_path, {"toolchain": "gsplat"})
    block = pipeline.blocks[0]
    dense = _prepare_dense(pipeline, block)

    with pytest.raises(rt.BlockFailed, match="THREEDGS_GSPLAT_COMMAND"):
        pipeline._real_block_training(0, block, dense)


def test_scrape_percent_reads_a_tqdm_bar():
    assert rt._scrape_percent("  1%|          | 300/30000 [00:05<08:00, 56.25it/s]") == 1.0
    assert rt._scrape_percent("100%|##########| 300/300") == 100.0
    assert rt._scrape_percent("Step: 29999 num_GS=167459") is None
    assert rt._scrape_percent("only 120% of nothing") is None
