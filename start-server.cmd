@echo off
REM ============================================================
REM  One-click launcher for the school 3DGS capture platform.
REM
REM  Just double-click this file.
REM
REM  IMPORTANT: keep this file PURE ASCII.
REM  cmd.exe reads .cmd/.bat using the system ANSI code page (GBK
REM  on a Chinese Windows). Non-ASCII bytes in here get
REM  mis-decoded and can even split the command line apart.
REM  All Chinese output is printed by scripts/serve.py instead.
REM
REM  Usage:
REM    start-server.cmd
REM    start-server.cmd --port 8080
REM    start-server.cmd --reload
REM ============================================================
setlocal
cd /d "%~dp0"

where uv >nul 2>nul
if errorlevel 1 (
    if exist ".venv\Scripts\python.exe" goto local_python
    echo.
    echo [ERROR] "uv" was not found in PATH.
    echo.
    echo   This project manages its Python environment with uv.
    echo   Install it from: https://docs.astral.sh/uv/
    echo   Windows one-liner:
    echo     powershell -c "irm https://astral.sh/uv/install.ps1 ^| iex"
    echo.
    pause
    exit /b 1
)

echo Syncing Python dependencies (uv sync) ...
uv sync
if errorlevel 1 (
    echo.
    echo [ERROR] "uv sync" failed. See the message above.
    echo   If it is a network / mirror problem, edit the
    echo   [[tool.uv.index]] section at the bottom of pyproject.toml.
    echo.
    pause
    exit /b 1
)

echo.
uv run python scripts\serve.py %*
if errorlevel 1 (
    echo.
    echo [ERROR] The server exited with an error. See the message above.
    echo.
    pause
)
exit /b

:local_python
echo Starting with the existing project Python environment...
".venv\Scripts\python.exe" scripts\serve.py %*
if errorlevel 1 pause
