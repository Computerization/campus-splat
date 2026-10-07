"""Trainer command templates — the platform side of docs/training-toolchain.md.

The platform never guesses how a trainer is called. The admin writes **one
command template per toolchain** into `.env` (method A of the doc: gsplat in
`THREEDGS_GSPLAT_COMMAND`, inside `THREEDGS_GS_COMMAND`) and this module owns
the contract between that text and the pipeline:

  * which environment variable belongs to which toolchain (doc §二/§八)
  * which placeholders a template may use
  * the pitfalls that silently ruin an unattended run (the doc's 已知坑 table)

Rendering is shared by `backend/scripts/run_training.py`, which actually builds
the command line, and by the admin preflight, which points out a broken
template *before* a run is queued instead of after 20 minutes of COLMAP.
"""

from __future__ import annotations

import os
import re
import shlex
import shutil
from pathlib import Path
from typing import Mapping

# The doc's rule: 训练页「工具链」选什么，平台就读哪个变量。
TOOLCHAIN_ENV: dict[str, str] = {
    "3dgs": "THREEDGS_GS_COMMAND",
    "gsplat": "THREEDGS_GSPLAT_COMMAND",
}
DEFAULT_TOOLCHAIN = "3dgs"

# Placeholders the pipeline substitutes.
PLACEHOLDERS: tuple[str, ...] = (
    "source",
    "model",
    "images",
    "iterations",
    "resolution",
    "data_factor",
)
# These are filesystem paths: a deployment whose data directory contains a space
# ("C:\Users\Student Name\...") would otherwise hand the trainer a broken command.
PATH_PLACEHOLDERS: tuple[str, ...] = ("source", "model", "images")
# Without these two a run cannot be attributed to a block afterwards: {source}
# is what gets trained and {model} is the directory the pipeline scans for the
# produced .ply (doc §七 rule 3).
REQUIRED_PLACEHOLDERS: tuple[str, ...] = ("source", "model")


class CommandError(RuntimeError):
    """The template cannot be turned into a command line."""


def normalize_toolchain(value: str | None) -> str:
    name = str(value or "").strip().lower()
    return name if name in TOOLCHAIN_ENV else DEFAULT_TOOLCHAIN


def env_var(toolchain: str | None) -> str:
    return TOOLCHAIN_ENV[normalize_toolchain(toolchain)]


def template_for(toolchain: str | None, env: Mapping[str, str] | None = None) -> str:
    """The raw template as configured, empty when the toolchain is not set up."""
    source = os.environ if env is None else env
    return (source.get(env_var(toolchain)) or "").strip()


def training_mode(env: Mapping[str, str] | None = None) -> str:
    """mock | real — mock walks the whole pipeline without launching a trainer.

    Read at call time (not from config) because the admin console and the tests
    flip it while the process is running.
    """
    source = os.environ if env is None else env
    raw = (source.get("THREEDGS_TRAINING_MODE") or "mock").strip().lower()
    return "real" if raw == "real" else "mock"


def program(template: str | None) -> str | None:
    """First token of the template — the executable the platform launches."""
    text = (template or "").strip()
    if not text:
        return None
    try:
        parts = shlex.split(text, posix=os.name != "nt")
    except ValueError:
        parts = text.split()
    if not parts:
        return None
    return parts[0].strip().strip('"').strip("'") or None


def program_available(template: str | None) -> bool:
    """Can the executable be found? (PATH lookup, or an absolute path on disk.)"""
    exe = program(template)
    if not exe:
        return False
    if shutil.which(exe):
        return True
    try:
        return Path(exe).exists()
    except OSError:  # pragma: no cover - unparsable paths on exotic platforms
        return False


def render(template: str, values: Mapping[str, object]) -> str:
    """Substitute the known placeholders, leaving anything else untouched.

    Unknown ``{...}`` sequences are kept verbatim on purpose: a trainer may want
    them (LichtFeld config files, shell syntax) and `str.format` would either
    raise or eat them.
    """
    text = (template or "").strip()
    if not text:
        raise CommandError("训练命令模板是空的")
    missing = [name for name in REQUIRED_PLACEHOLDERS if f"{{{name}}}" not in text]
    if missing:
        raise CommandError(
            "训练命令模板缺少占位符 "
            + "、".join(f"{{{name}}}" for name in missing)
            + "（{source} 是要训练的数据，{model} 是产物目录，ply 必须落在它里面）"
        )
    rendered = text
    for name in PLACEHOLDERS:
        if name not in values or values[name] is None:
            continue
        token = f"{{{name}}}"
        if token not in rendered:
            continue
        value = str(values[name])
        if name in PATH_PLACEHOLDERS and any(char.isspace() for char in value):
            # Quote exactly once: a template that already quotes the placeholder
            # keeps its quotes, one that does not gets them.
            quoted = f'"{token}"'
            if quoted in rendered:
                rendered = rendered.replace(quoted, f'"{value}"')
            else:
                rendered = rendered.replace(token, f'"{value}"')
        else:
            rendered = rendered.replace(token, value)
    return rendered


def diagnose(
    template: str | None,
    *,
    toolchain: str | None,
    iterations: int = 0,
    data_factor: int = 1,
    mode: str = "real",
) -> list[str]:
    """Everything that will go wrong with this template at 2 a.m. unattended.

    These are the entries of the doc's 已知坑 table, checked against the actual
    text of the template instead of being left to the operator's memory.

    ``mode``: in mock mode no trainer is launched at all, so a missing template
    is not a problem — warning about it there would be noise on every default
    installation.
    """
    name = normalize_toolchain(toolchain)
    text = (template or "").strip()
    if not text:
        if mode != "real":
            return []
        return [
            f"还没有配置 {env_var(name)}：真实模式下每个训练块都会立刻失败（训练页的「工具链」选 {name}）"
        ]

    warnings: list[str] = []
    if not program_available(text):
        warnings.append(
            f"{env_var(name)} 的可执行文件 {program(text)!r} 找不到，训练进程无法启动"
        )
    if "{iterations}" not in text:
        # Same class of mistake as a hardcoded --data_factor: the training page
        # shows a number that never reaches the trainer.
        chosen = f"{int(iterations):,}" if isinstance(iterations, int) else str(iterations or "")
        warnings.append(
            f"模板里没有 {{iterations}}：训练页选的迭代数（{chosen}）不会生效，模板里的步数是写死的"
        )

    try:
        data_factor = int(data_factor or 1)
    except (TypeError, ValueError):
        data_factor = 1

    if name == "gsplat":
        if "--disable_viewer" not in text:
            warnings.append(
                "gsplat 模板缺少 --disable_viewer：无人值守时它会等浏览器 viewer，训练看起来卡在开始处"
            )
        if "--save_ply" not in text:
            warnings.append(
                "gsplat 默认 save_ply=False，不会写出 .ply —— 加上 --save_ply 和 --ply_steps {iterations}，"
                "否则会报「训练结束但没有找到 .ply 点云产物」"
            )
        elif "--ply_steps" not in text:
            warnings.append(
                "模板有 --save_ply 但没有 --ply_steps：gsplat 只在默认的 7000 / 30000 步写 ply，"
                "迭代数不是这两个值时不会产出点云"
            )
        if "--eval_steps" not in text:
            warnings.append(
                "模板没有 --eval_steps：gsplat 会在默认步数（500 / 7000 / 30000）做评测，白花时间"
                "（无人值守时建议 --eval_steps 1000000）"
            )
        if "--data_factor" not in text:
            if data_factor != 1:
                warnings.append(
                    f"训练页选了图像降采样 {data_factor}，但模板里没有 --data_factor：这个参数不会生效"
                    "（模板里写 --data_factor {data_factor} 才能由训练页控制）"
                )
            else:
                warnings.append(
                    "模板里没有 --data_factor：gsplat 会用它自己的默认降采样倍数，"
                    "训练页的「图像降采样」在模板写 --data_factor {data_factor} 之前不会生效"
                )
        elif "{data_factor}" not in text:
            warnings.append(
                "模板里的 --data_factor 是个写死的值：训练页改「图像降采样」不会生效"
            )
    else:
        if re.search(r"--data_device[\s=]+cpu", text):
            warnings.append(
                "模板带了 --data_device cpu：那是显存极小时的省显存开关，3090 上会明显拖慢训练（文档 §五）"
            )
        if data_factor != 1:
            warnings.append(
                "图像降采样（--data_factor）只对 gsplat 生效；原版 3DGS 请改用训练分辨率 {resolution}"
            )
    return warnings


def status(env: Mapping[str, str] | None = None) -> dict:
    """Which toolchains are wired up — shown in the admin console's 运行状态."""
    source = os.environ if env is None else env
    toolchains: dict[str, dict] = {}
    for name, var in TOOLCHAIN_ENV.items():
        template = (source.get(var) or "").strip()
        exe = program(template) if template else None
        toolchains[name] = {
            "env_var": var,
            "configured": bool(template),
            "program": exe,
            "program_available": program_available(template) if template else None,
        }
    return {"toolchains": toolchains}
