"""Background quality checks.

An upload request does only the part it cannot avoid — stream the file to disk,
compute its sha256, refuse byte-identical repeats — and then hands the photo to
this worker. The expensive part (decode, heuristic metrics, thumbnail,
near-duplicate scan) runs here, so a volunteer standing in a corridor can start
the next batch of 20 immediately instead of watching a spinner. The phone polls
``GET /api/volunteer/photos?ids=...`` and watches each photo flip from
``checking`` to its verdict.

Two properties fall out of this design, both deliberate:

* **A photo exists as soon as it is on disk.** With the verdict missing it is
  stored as ``checking``, which counts towards neither "usable" nor "rejected" in
  the progress numbers — so a checkpoint never looks finished on the strength of
  photos nobody has judged yet.
* **The check is idempotent and restart-safe.** Anything left in ``checking``
  after a crash (or a server restart) is re-queued at startup.

The trade-off: a burst of nearly identical photos uploaded in the *same* batch
may not all be flagged, because their dHash values are only computed while the
worker gets to them. Photos uploaded in a later batch are still compared against
everything already checked.

``THREEDGS_QUALITY_INLINE=1`` runs the check inside the request instead; the test
suite and tiny single-user deployments use that.
"""

from __future__ import annotations

import queue
import threading
import time

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from .. import config, storage
from ..database import SessionLocal
from ..models import Photo, QualityReport
from ..quality import analyze_image
from ..quality.pipeline import LEVEL_ERROR, LEVEL_WARN, Issue, detect_duplicate
from ..schemas import UploadResultOut

CHECKING_STATUS = "checking"
DUPLICATE_CANDIDATE_LIMIT = 800

_UNREADABLE_ADVICE = (
    "这张照片打不开（可能已损坏，或者是本机不支持的格式）。请从相册直接上传原图。"
)


def _status_from_issues(issues: list[Issue]) -> str:
    if any(i.level == "error" for i in issues):
        return "rejected"
    if any(i.level == "warning" for i in issues):
        return "warning"
    return "ok"


def _report_for(db: OrmSession, photo: Photo) -> QualityReport:
    """The photo's report row, created on first use (the worker and the inline
    path both need this and must not race each other into two rows)."""
    report = photo.quality
    if report is None:
        report = QualityReport(photo_id=photo.id)
        db.add(report)
    return report


def _store_failure(db: OrmSession, photo: Photo, message: str) -> None:
    """The file on disk cannot be decoded — an unreadable photo is a rejection,
    and it has to say so instead of sitting in ``checking`` forever."""
    current = db.execute(select(Photo.status).where(Photo.id == photo.id)).scalar_one_or_none()
    if current != CHECKING_STATUS:
        return  # an admin already judged it by hand; that verdict stands
    photo.status = "rejected"
    report = _report_for(db, photo)
    report.passed = False
    report.score = 0
    report.issues = [Issue("unreadable", LEVEL_ERROR, message).to_dict()]
    report.metrics = None
    report.advice = _UNREADABLE_ADVICE
    db.commit()


def _find_duplicate(
    db: OrmSession, photo: Photo, dhash_value: str | None
) -> tuple[int | None, int]:
    """Nearest dHash among the other photos of the same task."""
    candidates = db.execute(
        select(Photo.id, Photo.dhash)
        .where(
            Photo.task_id == photo.task_id,
            Photo.id != photo.id,
            Photo.dhash.is_not(None),
        )
        .order_by(Photo.uploaded_at.desc())
        .limit(DUPLICATE_CANDIDATE_LIMIT)
    ).all()
    return detect_duplicate(dhash_value, [(row[0], row[1]) for row in candidates])


def run_check(db: OrmSession, photo: Photo) -> None:
    """Analyze one stored photo and write its verdict. Safe to run twice."""
    try:
        path = storage.resolve(photo.stored_path)
    except HTTPException:
        path = None
    if path is None or not path.exists():
        _store_failure(db, photo, "照片文件已丢失，无法质检（磁盘可能被清理过）")
        return

    try:
        analysis = analyze_image(path, size_bytes=photo.size_bytes)
    except Exception as exc:  # noqa: BLE001 - a broken file must not kill the worker
        _store_failure(db, photo, f"照片无法解析（格式异常或已损坏）：{exc}")
        return

    duplicate_id, distance = _find_duplicate(db, photo, analysis.dhash)
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
    thumb_rel, preview_rel = storage.make_derivatives(
        photo.stored_path, prefix=photo.sha256[:16]
    )

    # The admin may have overruled this photo while we were decoding it (the
    # review page stays open, the photo is still "checking"): a manual verdict
    # wins over the heuristic one, so only write if nobody got there first.
    current = db.execute(select(Photo.status).where(Photo.id == photo.id)).scalar_one_or_none()
    if current != CHECKING_STATUS:
        return

    exif = analysis.exif
    photo.status = status
    photo.width = analysis.width
    photo.height = analysis.height
    photo.captured_at = exif.get("captured_at")
    photo.gps_lat = exif.get("gps_lat")
    photo.gps_lng = exif.get("gps_lng")
    photo.gps_alt = exif.get("gps_alt")
    photo.camera_model = exif.get("camera_model") or None
    photo.orientation = exif.get("orientation")
    photo.dhash = analysis.dhash
    photo.duplicate_of = duplicate_id
    if thumb_rel:
        photo.thumb_path = thumb_rel
    if preview_rel:
        photo.preview_path = preview_rel

    report = _report_for(db, photo)
    report.passed = status != "rejected"
    report.score = score
    report.issues = [i.to_dict() for i in issues]
    report.metrics = analysis.metrics
    report.advice = "\n".join(advice_parts)
    db.commit()


def result_from_photo(photo: Photo) -> UploadResultOut:
    """The phone-facing result of one photo, in whatever state it is.

    Same shape as the synchronous upload reply, so the volunteer page can render
    a photo that is still ``checking`` and the finished verdict with one
    component.
    """
    if photo.status == CHECKING_STATUS:
        return UploadResultOut(
            ok=True,
            photo_id=photo.id,
            original_filename=photo.original_filename,
            status=CHECKING_STATUS,
            captured_at=photo.captured_at,
        )

    quality = photo.quality
    return UploadResultOut(
        ok=photo.status != "rejected",
        photo_id=photo.id,
        original_filename=photo.original_filename,
        status=photo.status,
        score=quality.score if quality else None,
        passed=quality.passed if quality else None,
        issues=list(quality.issues or []) if quality else [],
        advice=quality.advice if quality else None,
        metrics=quality.metrics if quality else None,
        captured_at=photo.captured_at,
        error=None if photo.status != "rejected" else "这张不合格，请按建议重拍",
    )


class QualityQueue:
    """A tiny single-process worker pool.

    Not a distributed queue on purpose: this deployment is one uvicorn process on
    one club-room computer, so a thread pool plus the ``photos`` table (the truth
    about what still needs checking) is all the machinery that is justified.
    """

    def __init__(self) -> None:
        self._queue: queue.Queue[int | None] = queue.Queue()
        self._threads: list[threading.Thread] = []
        self._lock = threading.Lock()

    # ------------------------------------------------------------ lifecycle

    def start(self) -> None:
        with self._lock:
            if any(thread.is_alive() for thread in self._threads):
                return
            self.requeue_stale()
            for index in range(config.quality_workers()):
                thread = threading.Thread(
                    target=self._loop, name=f"quality-worker-{index}", daemon=True
                )
                thread.start()
                self._threads.append(thread)

    def requeue_stale(self) -> int:
        """Re-submit every photo left in ``checking`` (crash, restart, or a test
        that puts a row back into that state). Returns how many were queued."""
        with SessionLocal() as db:
            ids = [
                row
                for (row,) in db.execute(
                    select(Photo.id).where(Photo.status == CHECKING_STATUS)
                )
            ]
        for photo_id in ids:
            self._queue.put(photo_id)
        return len(ids)

    def shutdown(self) -> None:
        with self._lock:
            threads = list(self._threads)
            self._threads.clear()
        for _ in threads:
            self._queue.put(None)  # one sentinel per worker
        for thread in threads:
            thread.join(timeout=2.0)

    # ------------------------------------------------------------ work

    def submit(self, photo_id: int) -> None:
        self.start()  # lazy: the API never has to remember to start it
        self._queue.put(photo_id)

    def pending(self) -> int:
        """How many submissions are queued or in flight (for tests / diagnostics)."""
        return self._queue.unfinished_tasks

    def drain(self, timeout: float = 60.0) -> bool:
        """Block until everything submitted so far has been checked.

        Used by tests and by backend/scripts/seed_demo.py; the API itself never
        waits (that is the whole point of this module).
        """
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if self._queue.unfinished_tasks == 0:
                return True
            time.sleep(0.05)
        return self._queue.unfinished_tasks == 0

    def _loop(self) -> None:
        while True:
            photo_id = self._queue.get()
            try:
                if photo_id is None:
                    return
                self._check(photo_id)
            except Exception:  # noqa: BLE001 - one bad photo must not kill the worker
                pass
            finally:
                self._queue.task_done()

    @staticmethod
    def _check(photo_id: int) -> None:
        with SessionLocal() as db:
            photo = db.get(Photo, photo_id)
            # Gone, or already judged (duplicate submit / another worker won)
            if photo is None or photo.status != CHECKING_STATUS:
                return
            run_check(db, photo)


queue = QualityQueue()
