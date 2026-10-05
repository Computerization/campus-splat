"""Quality check pipeline: turns metrics + EXIF into pass / warn / reject plus
actionable advice.

The result is a structured list of issue codes with Chinese messages; the
frontend localizes by code, so it never relies on the message text itself.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageOps

from .. import config
from .exif import read_exif
from .hashing import dhash
from .metrics import ImageMetrics, compute_metrics

LEVEL_ERROR = "error"
LEVEL_WARN = "warn"
LEVEL_INFO = "info"

_SCORE_PENALTY = {LEVEL_ERROR: 30, LEVEL_WARN: 10, LEVEL_INFO: 0}

# issue code -> what the volunteer should do differently
_ADVICE: dict[str, str] = {
    "blurry": "手抖或飞行速度太快。双手夹紧手机、站稳再按，无人机请降速到 3–4 m/s。",
    "soft": "画面偏软。点击屏幕对焦到墙面纹理再拍，或靠近一点。",
    "too_dark": "太暗了。开灯、拉窗帘让自然光进来，或换个有光的时段重拍。",
    "dark": "偏暗。建议开灯或靠近窗户拍摄。",
    "too_bright": "太亮了。避开直射阳光和反光面，换个机位或侧一点角度。",
    "bright": "偏亮。稍微降低曝光（点击屏幕后向下拖动小太阳）。",
    "overexposed": "高光区域死白。避开玻璃反光和天空直射，重新构图。",
    "underexposed": "暗部死黑看不清细节。补光或在更亮的时段重拍。",
    "low_contrast": "画面发灰、对比度不足。注意镜头是否脏了/有雾气/逆光。",
    "low_resolution": "分辨率太低。请用手机主摄、原图上传，不要用滤镜或压缩过的图。",
    "resolution_soft": "分辨率偏低。请用主摄原图上传，别用前置摄像头或截图。",
    "heavy_compression": "图片被压缩过（像是通过微信/QQ 传过的）。请从相册直接上传原图。",
    "no_exif": "这张没有拍摄信息。请不要用截图、不要从聊天软件转发，直接从相册原图上传。",
    "panorama": "疑似全景/超宽图。三维重建需要普通透视照片，请用普通模式拍摄。",
    "duplicate": "这张跟已上传的某张几乎一样。同一个位置换个角度再拍一张。",
}

# issue code -> short title
_TITLE: dict[str, str] = {
    "blurry": "照片模糊",
    "soft": "清晰度偏低",
    "too_dark": "严重欠曝",
    "dark": "偏暗",
    "too_bright": "严重过曝",
    "bright": "偏亮",
    "overexposed": "高光溢出",
    "underexposed": "暗部死黑",
    "low_contrast": "对比度过低",
    "low_resolution": "分辨率过低",
    "resolution_soft": "分辨率偏低",
    "heavy_compression": "疑似被压缩/转发过",
    "no_exif": "缺少拍摄信息",
    "panorama": "疑似全景图",
    "duplicate": "与已有照片重复",
}


@dataclass
class Issue:
    code: str
    level: str
    message: str

    def to_dict(self) -> dict:
        return {"code": self.code, "level": self.level, "message": self.message}


@dataclass
class AnalyzeResult:
    width: int
    height: int
    metrics: dict
    exif: dict
    dhash: str
    issues: list[Issue] = field(default_factory=list)
    score: int = 100
    passed: bool = True
    advice: str = ""

    @property
    def status(self) -> str:
        """Maps to the status stored on the photo."""
        if any(i.level == LEVEL_ERROR for i in self.issues):
            return "rejected"
        if any(i.level == LEVEL_WARN for i in self.issues):
            return "warning"
        return "ok"

    def to_dict(self) -> dict:
        return {
            "width": self.width,
            "height": self.height,
            "metrics": self.metrics,
            "exif": self.exif,
            "dhash": self.dhash,
            "issues": [i.to_dict() for i in self.issues],
            "score": self.score,
            "passed": self.passed,
            "status": self.status,
            "advice": self.advice,
        }


def _issue(code: str, level: str, message: str | None = None) -> Issue:
    return Issue(code=code, level=level, message=message or _TITLE.get(code, code))


def analyze_image(
    path: Path,
    *,
    size_bytes: int = 0,
    thresholds: dict | None = None,
) -> AnalyzeResult:
    """Analyze one photo. Never raises — a failure here must not break uploads."""
    t = {**config.QUALITY, **(thresholds or {})}

    with Image.open(path) as raw:
        raw.load()
        exif = read_exif(raw)
        img = ImageOps.exif_transpose(raw) or raw
        img = img.convert("RGB")
        width, height = img.size
        metrics: ImageMetrics = compute_metrics(
            img,
            size_bytes=size_bytes or path.stat().st_size,
            normalize_long_side=int(t["sharpness_normalize_long_side"]),
        )
        dhash_value = dhash(img)

    issues = _collect_issues(metrics, exif, t)
    score = 100
    for issue in issues:
        score -= _SCORE_PENALTY.get(issue.level, 0)
    score = max(0, min(100, score))

    advice = _build_advice(issues)
    return AnalyzeResult(
        width=width,
        height=height,
        metrics=metrics.to_dict(),
        exif=exif,
        dhash=dhash_value,
        issues=issues,
        score=score,
        passed=not any(i.level == LEVEL_ERROR for i in issues),
        advice=advice,
    )


def _collect_issues(metrics: ImageMetrics, exif: dict, t: dict) -> list[Issue]:
    issues: list[Issue] = []

    # Sharpness
    if metrics.sharpness < t["sharpness_fail"]:
        issues.append(_issue("blurry", LEVEL_ERROR))
    elif metrics.sharpness < t["sharpness_warn"]:
        issues.append(_issue("soft", LEVEL_WARN))

    # Brightness
    if metrics.brightness < t["brightness_too_dark"]:
        issues.append(_issue("too_dark", LEVEL_ERROR))
    elif metrics.brightness < t["brightness_dark_warn"]:
        issues.append(_issue("dark", LEVEL_WARN))
    elif metrics.brightness > t["brightness_too_bright"]:
        issues.append(_issue("too_bright", LEVEL_ERROR))
    elif metrics.brightness > t["brightness_bright_warn"]:
        issues.append(_issue("bright", LEVEL_WARN))

    # Highlights / shadows
    if metrics.overexposed_ratio >= t["overexposed_fail"]:
        issues.append(_issue("overexposed", LEVEL_ERROR))
    elif metrics.overexposed_ratio >= t["overexposed_warn"]:
        issues.append(_issue("overexposed", LEVEL_WARN))

    if metrics.underexposed_ratio >= t["underexposed_fail"]:
        issues.append(_issue("underexposed", LEVEL_ERROR))
    elif metrics.underexposed_ratio >= t["underexposed_warn"]:
        issues.append(_issue("underexposed", LEVEL_WARN))

    # Contrast
    if metrics.contrast < t["contrast_low_fail"]:
        issues.append(_issue("low_contrast", LEVEL_ERROR))
    elif metrics.contrast < t["contrast_low_warn"]:
        issues.append(_issue("low_contrast", LEVEL_WARN))

    # Resolution
    long_side = max(metrics.width, metrics.height)
    if long_side < t["min_long_side"]:
        issues.append(
            _issue("low_resolution", LEVEL_ERROR, f"分辨率过低：长边仅 {long_side}px，建议 ≥ {t['min_long_side']}px")
        )
    elif long_side < t["good_long_side"]:
        issues.append(
            _issue("resolution_soft", LEVEL_WARN, f"分辨率偏低：长边 {long_side}px，建议 ≥ {t['good_long_side']}px")
        )

    # Compression artifacts
    if metrics.bytes_per_pixel < t["compression_warn_bpp"]:
        issues.append(
            _issue(
                "heavy_compression",
                LEVEL_WARN,
                f"数据量偏小（{metrics.bytes_per_pixel:.2f} 字节/像素），疑似被压缩或转发过",
            )
        )

    # EXIF
    if not exif.get("has_exif"):
        issues.append(_issue("no_exif", LEVEL_WARN))
    elif not exif.get("captured_at"):
        issues.append(_issue("no_exif", LEVEL_INFO, "照片缺少拍摄时间"))

    # Panorama / extreme aspect ratio
    if metrics.height > 0:
        ratio = metrics.width / metrics.height
        if ratio >= 1.9 or ratio <= 0.32:
            issues.append(
                _issue("panorama", LEVEL_INFO, f"宽高比 {ratio:.2f}，疑似全景图，重建时需特殊处理")
            )

    return issues


def _build_advice(issues: list[Issue]) -> str:
    """Deduplicated action list for the volunteer."""
    seen: list[str] = []
    for issue in issues:
        if issue.level == LEVEL_INFO:
            continue
        text = _ADVICE.get(issue.code)
        if text and text not in seen:
            seen.append(text)
    if not seen:
        errors_and_warns = [i for i in issues if i.level != LEVEL_INFO]
        if errors_and_warns:
            return "可以重拍一张更清晰的吗？"
        return "这张可以，继续拍下一个角度。"
    return "\n".join(seen)


def detect_duplicate(
    dhash_value: str | None,
    candidates: list[tuple[int, str | None]],
    *,
    max_distance: int | None = None,
) -> tuple[int | None, int]:
    """Find the most similar photo among `candidates` (a list of (id, dhash)).

    Returns (duplicate photo id or None, smallest Hamming distance).
    """
    from .hashing import dhash_distance

    limit = config.QUALITY["duplicate_hamming"] if max_distance is None else max_distance
    best_id: int | None = None
    best_distance = 999
    for photo_id, other in candidates:
        distance = dhash_distance(dhash_value, other)
        if distance < best_distance:
            best_distance = distance
            best_id = photo_id
    if best_id is not None and best_distance <= limit:
        return best_id, best_distance
    return None, best_distance
