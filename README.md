# School 3DGS Capture Platform

> My CAS project as vice president of the computerization club. The goal is to build a 3D Gaussian Splatting model of the **entire school** and enter it in [Explorer Global](https://tryout.explorerglobal.cn/). Buildings are planned to be shot by drone, and the interiors are shot by student volunteers with their phones. Collecting that many indoor photos by hand doesn't scale, so this web app exists: volunteers upload photos and get told **immediately** whether each photo is usable — nobody finds out three weeks later that a whole floor has to be re-shot.

The whole thing is designed to run on one ordinary desktop in the club room (i5-12400F + 32 GB + RTX 3090), which also does the reconstruction work.

---

## Contents

- [School 3DGS Capture Platform](#school-3dgs-capture-platform)
  - [Contents](#contents)
  - [What it does](#what-it-does)
  - [Requirements](#requirements)
  - [Quick start](#quick-start)
    - [Windows](#windows)
    - [macOS / Linux](#macos--linux)
    - [Manual (any platform)](#manual-any-platform)
  - [Setting the admin password](#setting-the-admin-password)
    - [Option 1 — a `.env` file (recommended)](#option-1--a-env-file-recommended)
    - [Option 2 — an environment variable](#option-2--an-environment-variable)
  - [How volunteers and admins use it](#how-volunteers-and-admins-use-it)
    - [Volunteers — open `/v` on a phone](#volunteers--open-v-on-a-phone)
    - [Admins — open `/admin` on the club-room computer](#admins--open-admin-on-the-club-room-computer)
  - [The photo quality check](#the-photo-quality-check)
  - [Project layout](#project-layout)

---

## What it does

| | Volunteers (phone, `/v`) | Admins (desktop, `/admin`) |
|---|---|---|
| **How they get in** | Task access code + their name, no account | Admin password |
| **What they see** | Where to go, how to shoot, how many photos, instant per-photo feedback | Global progress, checkpoint planning, photo review, training jobs, live server metrics |

Everything runs behind a single port: the FastAPI backend also serves the built React frontend, so volunteers just open `http://<lan-ip>:8000` on their phones.

## Requirements

- **Python 3.11+** and **[uv](https://docs.astral.sh/uv/)** — required
- **Node.js 18+** — *only* if you change the frontend. The built `frontend/dist` is committed to this repo on purpose, so a deployment machine never needs Node.
- Enough disk space for the photos (a full school is tens of GB)
- A decent GPU for the training part of 3dgs

## Quick start

Every platform goes through the same two steps — `uv sync`, then launch — the wrapper scripts just make it one action.

### Windows

```powershell
git clone <repo-url>
cd campus-splat
.\start-server.cmd
```

### macOS / Linux

```bash
git clone <repo-url>
cd campus-splat
chmod +x start-server.sh     # only needed once
./start-server.sh
```

### Manual (any platform)

```bash
uv sync
uv run python scripts/serve.py            # add --port 8080 / --reload / --skip-build
```

Whatever route you take, the launcher will:

1. sync the Python environment with `uv sync`
2. check for the frontend build (and build it if Node is available and it's missing)
3. print the LAN address volunteers should open
4. start the server on `0.0.0.0:8000`

Then open:

| | URL |
|---|---|
| App entry | <http://127.0.0.1:8000> |
| Admin console | <http://127.0.0.1:8000/admin> |
| API docs (Swagger) | <http://127.0.0.1:8000/docs> |

Volunteers on the same network use the LAN address the launcher prints, e.g. `http://192.168.1.25:8000`.

## Setting the admin password

**The default password is `admin123`, and it is public in this repository** — change it before anyone else can reach the site. Pick either method below.

### Option 1 — a `.env` file (recommended)

```bash
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Then open `.env` in any text editor and set the password:

```
THREEDGS_ADMIN_PASSWORD=your-own-password
```

Restart the server. That's it — `.env` is git-ignored, so the password stays on that machine and never ends up on GitHub.

### Option 2 — an environment variable

Windows, permanent (reopen the terminal afterwards):

```powershell
setx THREEDGS_ADMIN_PASSWORD "your-own-password"
```

Windows, current session only:

```powershell
$env:THREEDGS_ADMIN_PASSWORD = "your-own-password"
```

macOS / Linux (append to `~/.bashrc` or `~/.zshrc` to make it permanent):

```bash
export THREEDGS_ADMIN_PASSWORD="your-own-password"
```

Precedence: **process environment variable > `.env` > the built-in default**.

## How volunteers and admins use it

### Volunteers — open `/v` on a phone

1. Enter the **task access code** your teacher/classmate gave you, plus your name
2. The board lists every checkpoint and shows which ones are done and which still need photos
3. Open a checkpoint to see **where to go**, **how to shoot** (an angle-by-angle script), a find-it hint and an example reference photo
4. Pick photos and upload — the server checks each one and replies with a verdict: *good*, *usable but imperfect*, or *rejected + exactly why and how to fix it*
5. Checkpoints tick themselves off once enough usable photos have arrived

### Admins — open `/admin` on the club-room computer

- **Overview** — global progress, disk usage, training status; auto-refreshes every 10s
- **Tasks & checkpoints** — create tasks, hand out access codes (or copy a ready-made join link), bulk-import checkpoints, upload reference images, and let the form **estimate how many photos a checkpoint needs from the room's dimensions** (length × width × height; the estimate is only a suggestion and can always be overridden by hand)
- **Photo review** — filter by task / status / duplicates, search, download originals, export a CSV manifest, and manually override the quality verdict when the heuristic gets it wrong
- **Training** — queue, start and cancel reconstruction jobs; watch the stage progress and live log
- **System** — server hardware (CPU / RAM / GPU and driver), plus **live gauges for CPU, memory, GPU, VRAM and disk** and a per-core load chart

The interface is available in **Chinese and English** (switchable from the landing page, the admin sidebar, and the volunteer header).

## The photo quality check

Deliberately **heuristic**, not a full photogrammetry run — so a volunteer standing in a corridor gets an answer in milliseconds instead of waiting minutes:

| Check | Method |
|---|---|
| Blur | Laplacian variance, normalized to a 1024 px long side |
| Over/under-exposure | Ratio of blown (`>=250`) and crushed (`<=8`) pixels |
| Brightness & contrast | Grayscale mean and standard deviation |
| Resolution | Long side in pixels |
| Compression artifacts | Bytes per pixel — catches photos re-sent through WeChat/QQ |
| Missing capture info | EXIF presence (time, GPS, camera) |
| Near-duplicate frames | 64-bit dHash, Hamming distance (catches "shoot 20 of the same wall") |

Each photo gets a 0–100 score, structured issues, and actionable advice in the volunteer's own language. Admins can always override a verdict manually.

## Project layout

```
campus-splat/
├─ pyproject.toml            Python dependencies + PyPI mirror (used by uv)
├─ uv.lock                   Locked dependency versions
├─ .python-version           Pins Python 3.11
├─ start-server.cmd          One-click launcher — Windows
├─ start-server.sh           One-click launcher — macOS / Linux
├─ scripts/serve.py          Launcher logic: env check, frontend check, LAN addresses
├─ backend/                  FastAPI backend
│  ├─ app/
│  │  ├─ main.py             App entry point (also serves the built frontend)
│  │  ├─ config.py           Every tunable + quality thresholds
│  │  ├─ models.py           Task / Checkpoint / Photo / QualityReport / TrainingRun
│  │  ├─ quality/            Heuristic quality engine
│  │  ├─ routers/            auth · admin · volunteer · media
│  │  └─ services/           Ingest, stats, training scheduler, system metrics
│  ├─ scripts/run_training.py   COLMAP + 3DGS entry point (with a mock mode)
│  └─ tests/                 pytest suite
├─ frontend/                 React + Vite + TypeScript
│  ├─ dist/                  Build output — committed on purpose
│  └─ src/pages/             admin/ (desktop) and volunteer/ (phone)
├─ data/                     Runtime data: photos, SQLite DB, training output (git-ignored)
└─ docs/                     Drone selection guide, deployment notes
```