"""FastAPI entry point.

The built frontend is mounted here, so volunteers only ever open one address:
    http://<this-machine-lan-ip>:8000
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from . import config
from .database import init_db
from .quality import HEIF_SUPPORTED
from .routers import admin, auth, media, reviews, volunteer, workflow
from .services.quality_jobs import queue as quality_queue
from .services.recon import queue as recon_queue
from .services.training import manager as training_manager

logger = logging.getLogger("threedgs")


@asynccontextmanager
async def lifespan(app: FastAPI):
    config.ensure_dirs()
    init_db()
    logger.info("数据目录：%s", config.DATA_DIR)
    if not HEIF_SUPPORTED:
        logger.warning("未安装 pillow-heif，iPhone 的 HEIC 原图将无法直接解析（建议 pip install pillow-heif）")
    if config.quality_inline():
        logger.info("质检在请求内同步执行（THREEDGS_QUALITY_INLINE=1）")
    else:
        quality_queue.start()  # background checks; uploads never wait for them
    training_manager.start()
    # A restart loses track of the trial solver, so rows that still say "running"
    # are marked failed instead of showing a job that spins forever.
    recon_queue.requeue_stale()
    recon_queue.start()
    try:
        yield
    finally:
        recon_queue.shutdown()
        training_manager.shutdown()
        quality_queue.shutdown()


app = FastAPI(
    title="校园 3DGS 采集平台",
    description="无人机/志愿者照片采集 → 启发式质检 → 3DGS 训练调度",
    version="0.1.0",
    lifespan=lifespan,
)

# Only needed during development, when the frontend runs on :5173. In production
# everything is same-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(volunteer.router)
app.include_router(workflow.router)
app.include_router(reviews.router)
app.include_router(media.router)


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "service": "campus-splat", "version": app.version}


# ---------------------------------------------------------------- static frontend

_dist: Path = config.FRONTEND_DIST
if _dist.exists() and (_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(_dist / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str, request: Request):
        # Anything that isn't /api belongs to the frontend router
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="接口不存在")
        candidate = (_dist / full_path).resolve()
        if full_path and candidate.is_file() and candidate.is_relative_to(_dist.resolve()):
            return FileResponse(candidate)
        return FileResponse(_dist / "index.html")

else:

    @app.get("/", include_in_schema=False)
    async def no_frontend() -> JSONResponse:
        return JSONResponse(
            {
                "message": "后端已启动，但还没有前端构建产物。",
                "how_to_build": "在 frontend 目录执行：npm install && npm run build",
                "dev_mode": "开发时直接在 frontend 目录跑 npm run dev（已配置代理到本服务）",
                "api_docs": "/docs",
            }
        )
