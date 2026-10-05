"""Upload ingest + quality check.

Pipeline for one upload:
    write to disk (computing sha256 as we go)
      -> reject byte-identical files (sha256 is unique per task)
      -> heuristic quality check (sharpness / exposure / resolution / compression / EXIF)
      -> dHash near-duplicate check against recent photos of the same task
      -> store photos / quality_reports and reply to the volunteer's phone
"""

from __future__ import annotations

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..models import AuthSession, Checkpoint, Photo, QualityReport, Task
from ..quality import analyze_image
from ..quality.pipeline import LEVEL_WARN, Issue
from ..schemas import UploadResultOut

DUPLICATE_CANDIDATE_LIMIT = 800


def _status_from_issues(issues: list[Issue]) -> str:
    if any(i.level == "error" for i in issues):
        return "rejected"
    if any(i.level == "warning" for i in issues):
        return "warning"
    return "ok"


def ingest_upload(
    db: OrmSession,
    *,
    task: Task,
    checkpoint: Checkpoint | None,
    session: AuthSession | None,
    upload: UploadFile,
) -> UploadResultOut:
    filename = (upload.filename or "unnamed").strip() or "unnamed"

    # 1. write to disk; the size limit aborts mid-write so a huge file can't
    #    fill the disk first
    try:
        saved = storage.save_stream(
            upload.file,
            task_id=task.id,
            checkpoint_id=checkpoint.id if checkpoint else None,
            filename=filename,
            max_bytes=config.MAX_UPLOAD_MB * 1024 * 1024,
        )
    except HTTPException as exc:
        return UploadResultOut(ok=False, original_filename=filename, error=str(exc.detail))
    except Exception as exc:  # disk full, permissions, ...
        return UploadResultOut(ok=False, original_filename=filename, error=f"保存文件失败：{exc}")

    # 2. identical content is rejected outright
    existing = db.execute(
        select(Photo).where(Photo.task_id == task.id, Photo.sha256 == saved.sha256)
    ).scalar_one_or_none()
    if existing is not None:
        storage.delete_file(saved.rel_path)
        return UploadResultOut(
            ok=False,
            original_filename=filename,
            status="rejected",
            score=0,
            passed=False,
            issues=[
                Issue("duplicate", LEVEL_WARN, "这张照片已经上传过了（内容完全相同）").to_dict()
            ],
            advice="换个角度再拍一张；如果确实需要同一视角的补拍，请稍微移动站位。",
            error="这张照片之前已经上传过了（内容完全相同），没有重复入库",
        )

    # 3. quality check
    try:
        analysis = analyze_image(saved.abs_path, size_bytes=saved.size_bytes)
    except Exception as exc:
        storage.delete_file(saved.rel_path)
        return UploadResultOut(
            ok=False, original_filename=filename, error=f"照片无法解析（格式异常或已损坏）：{exc}"
        )

    # 4. near-duplicate scan
    candidates = db.execute(
        select(Photo.id, Photo.dhash)
        .where(Photo.task_id == task.id, Photo.dhash.is_not(None))
        .order_by(Photo.uploaded_at.desc())
        .limit(DUPLICATE_CANDIDATE_LIMIT)
    ).all()
    duplicate_id, distance = _find_duplicate(analysis.dhash, [(r[0], r[1]) for r in candidates])

    issues: list[Issue] = list(analysis.issues)
    advice_parts = [analysis.advice] if analysis.advice else []
    if duplicate_id is not None:
        issues.append(
            Issue(
                "duplicate",
                LEVEL_WARN,
                f"与照片 #{duplicate_id} 高度相似（差异仅 {distance}/64），可能重复拍摄",
            )
        )
        tip = "这张和之前某张几乎一样，换个位置或角度再拍效果更好。"
        if tip not in advice_parts:
            advice_parts.append(tip)

    status = _status_from_issues(issues)
    score = max(0, min(100, analysis.score - (10 if duplicate_id is not None else 0)))

    # 5. thumbnail / preview
    prefix = saved.sha256[:16]
    thumb_rel, preview_rel = storage.make_derivatives(saved.rel_path, prefix=prefix)

    exif = analysis.exif
    photo = Photo(
        task_id=task.id,
        checkpoint_id=checkpoint.id if checkpoint else None,
        session_id=session.token if session else None,
        nickname=session.nickname if session else None,
        original_filename=filename[:255],
        stored_path=saved.rel_path,
        thumb_path=thumb_rel,
        preview_path=preview_rel,
        sha256=saved.sha256,
        size_bytes=saved.size_bytes,
        width=analysis.width,
        height=analysis.height,
        captured_at=exif.get("captured_at"),
        gps_lat=exif.get("gps_lat"),
        gps_lng=exif.get("gps_lng"),
        gps_alt=exif.get("gps_alt"),
        camera_model=(exif.get("camera_model") or None),
        orientation=exif.get("orientation"),
        dhash=analysis.dhash,
        duplicate_of=duplicate_id,
        status=status,
    )
    db.add(photo)
    db.flush()

    db.add(
        QualityReport(
            photo_id=photo.id,
            passed=status != "rejected",
            score=score,
            issues=[i.to_dict() for i in issues],
            metrics=analysis.metrics,
            advice="\n".join(advice_parts),
        )
    )
    db.commit()
    db.refresh(photo)

    return UploadResultOut(
        ok=status != "rejected",
        photo_id=photo.id,
        original_filename=filename,
        status=status,
        score=score,
        passed=status != "rejected",
        issues=[i.to_dict() for i in issues],
        advice="\n".join(advice_parts),
        metrics=analysis.metrics,
        captured_at=photo.captured_at,
        error=None if status != "rejected" else "这张不合格，请按建议重拍",
    )


def _find_duplicate(dhash_value: str | None, candidates: list[tuple[int, str | None]]):
    from ..quality.pipeline import detect_duplicate

    return detect_duplicate(dhash_value, candidates)
