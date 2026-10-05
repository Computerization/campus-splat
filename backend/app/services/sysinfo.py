"""Server hardware information and live resource usage.

Split out because the platform-specific ugly parts live here:
  * CPU model — on Windows this needs a registry read; `platform.processor()`
    returns a string nobody can read.
  * GPU utilization / VRAM — only reachable through `nvidia-smi`, and it has to
    degrade gracefully when there is no NVIDIA card.
"""

from __future__ import annotations

import platform
import subprocess
import sys
import time
from functools import lru_cache

import psutil

from .. import config

_CREATE_NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)


# ---------------------------------------------------------------- helpers


def _mib_to_bytes(value: str) -> int | None:
    number = _to_float(value)
    return None if number is None else int(number * 1024 * 1024)


def _to_float(value: str) -> float | None:
    try:
        text = str(value).strip()
        if not text or text.upper() in {"N/A", "[N/A]", "UNKNOWN"}:
            return None
        return float(text)
    except (TypeError, ValueError):
        return None


def _run_nvidia_smi(fields: str) -> str | None:
    """Ask nvidia-smi for one CSV line. Returns None (never raises) if the tool
    is missing, there is no GPU, or it times out.
    """
    try:
        result = subprocess.run(
            ["nvidia-smi", f"--query-gpu={fields}", "--format=csv,noheader,nounits"],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=_CREATE_NO_WINDOW,
        )
    except (FileNotFoundError, OSError, subprocess.TimeoutExpired):
        return None
    if result.returncode != 0:
        return None
    lines = (result.stdout or "").strip().splitlines()
    return lines[0].strip() if lines else None


# ---------------------------------------------------------------- static info


@lru_cache(maxsize=1)
def cpu_name() -> str:
    if sys.platform == "win32":
        try:
            import winreg

            with winreg.OpenKey(
                winreg.HKEY_LOCAL_MACHINE,
                r"HARDWARE\DESCRIPTION\System\CentralProcessor\0",
            ) as key:
                value, _ = winreg.QueryValueEx(key, "ProcessorNameString")
                name = str(value).strip()
                if name:
                    return name
        except Exception:
            pass
    return platform.processor() or platform.machine() or "Unknown CPU"


@lru_cache(maxsize=1)
def cpu_max_freq_mhz() -> int | None:
    try:
        freq = psutil.cpu_freq()
        if freq and freq.max:
            return round(freq.max)
    except Exception:
        pass
    if sys.platform == "win32":
        try:
            import winreg

            with winreg.OpenKey(
                winreg.HKEY_LOCAL_MACHINE,
                r"HARDWARE\DESCRIPTION\System\CentralProcessor\0",
            ) as key:
                value, _ = winreg.QueryValueEx(key, "~MHz")
                return int(value)
        except Exception:
            pass
    return None


def gpu_static() -> dict:
    """GPU model / total VRAM / driver version."""
    line = _run_nvidia_smi("name,memory.total,driver_version")
    if not line:
        return {"available": False}
    parts = [part.strip() for part in line.split(",")]
    if len(parts) < 3:
        return {"available": False}
    return {
        "available": True,
        "name": parts[0],
        "memory_total_bytes": _mib_to_bytes(parts[1]),
        "driver_version": parts[2] or None,
    }


@lru_cache(maxsize=1)
def hardware_info() -> dict:
    memory = psutil.virtual_memory()
    return {
        "hostname": platform.node(),
        "os": f"{platform.system()} {platform.release()}".strip(),
        "os_version": platform.version(),
        "cpu": {
            "name": cpu_name(),
            "physical_cores": psutil.cpu_count(logical=False),
            "logical_cores": psutil.cpu_count(logical=True),
            "max_freq_mhz": cpu_max_freq_mhz(),
        },
        "memory_total_bytes": memory.total,
        "gpu": gpu_static(),
        "python_version": platform.python_version(),
    }


# ---------------------------------------------------------------- live usage


def realtime_metrics() -> dict:
    # One percpu call gives both the per-core numbers and the overall average,
    # so the two never disagree.
    per_core = psutil.cpu_percent(interval=0.25, percpu=True) or []
    cpu_percent = round(sum(per_core) / len(per_core), 1) if per_core else 0.0

    freq = None
    try:
        current = psutil.cpu_freq()
        freq = round(current.current) if current and current.current else None
    except Exception:
        pass

    memory = psutil.virtual_memory()
    try:
        disk = psutil.disk_usage(str(config.DATA_DIR))
        disk_payload = {
            "path": str(config.DATA_DIR),
            "total_bytes": disk.total,
            "used_bytes": disk.used,
            "free_bytes": disk.free,
            "percent": round(disk.percent, 1),
        }
    except Exception:
        disk_payload = {"path": str(config.DATA_DIR), "percent": None}

    return {
        "timestamp": time.time(),
        "uptime_seconds": round(time.time() - psutil.boot_time()),
        "cpu": {
            "percent": cpu_percent,
            "per_core": [round(value, 1) for value in per_core],
            "freq_mhz": freq,
        },
        "memory": {
            "total_bytes": memory.total,
            "used_bytes": memory.total - memory.available,
            "available_bytes": memory.available,
            "percent": round(memory.percent, 1),
        },
        "disk": disk_payload,
        "gpu": gpu_realtime(),
    }


def gpu_realtime() -> dict:
    line = _run_nvidia_smi("utilization.gpu,memory.used,memory.total,temperature.gpu")
    if not line:
        return {"available": False}

    parts = [part.strip() for part in line.split(",")]
    while len(parts) < 4:
        parts.append("")

    utilization = _to_float(parts[0])
    memory_used = _mib_to_bytes(parts[1])
    memory_total = _mib_to_bytes(parts[2])
    temperature = _to_float(parts[3])

    percent = None
    if memory_used is not None and memory_total:
        percent = round(memory_used / memory_total * 100, 1)

    return {
        "available": True,
        "utilization": utilization,
        "memory_used_bytes": memory_used,
        "memory_total_bytes": memory_total,
        "memory_percent": percent,
        "temperature_c": temperature,
    }
