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

## Where the data lives, and starting over

`data/` holds everything: photos, the SQLite database, training output and logs. Two settings move it around:

| Want to | Set |
|---|---|
| Put everything on a big disk | `THREEDGS_DATA_DIR=E:\campus-splat-data` |
| Keep only the photos elsewhere (they are the bulky part) | `THREEDGS_UPLOAD_DIR=F:\campus-photos` |

With an external photo folder the database stores absolute paths, so moving that disk later means updating the variable too.

**Opening folders:** the admin console has 📂 buttons (System page: data / photo folders; task detail: that task's photos; photo review: show the selected photo). They open the file manager **on the machine running the server** — clicking from your laptop still opens it on the server, not on your laptop.

**Starting over:** the System page has a red *清空全部数据 / Delete all data* button (type `DELETE` to confirm) — it removes every task, checkpoint, photo and training run, files included, while keeping your admin login. Same thing from the command line:

```powershell
uv run python backend\scripts\reset_data.py           # shows what would go, then asks
uv run python backend\scripts\reset_data.py --yes     # no prompt
```

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
- **Training** — the graded pipeline of [`docs/training-pipeline.md`](docs/training-pipeline.md): pick a task, see the **block plan** (one block per room, oversized rooms split further) and the VRAM risk *before* starting, then watch the stages (one COLMAP per building → per-room blocks → merge → align → export). Failed blocks can be retried on their own, reusing the poses that were already solved. Produced point clouds open in a **3D preview that is also a placement editor**: load an outdoor run next to an indoor one, then drag / rotate / scale the blocks into place (or type exact position, X/Y/Z rotation and scale) — two independent COLMAP solves share no features, so this step can never be automatic, and the result is saved as a similarity transform in `transforms.json`. No capture material yet? `uv run python backend/scripts/seed_demo.py` builds demo tasks, synthetic photos and two mock runs, then prints the preview URL. Going real on the 3090 machine: [`docs/training-toolchain.md`](docs/training-toolchain.md) — which trainer to install, the exact `.env` command template for each, and the pitfalls that break unattended runs. gsplat (method A) comes with a one-click installer (`powershell -ExecutionPolicy Bypass -File scripts\setup_gsplat.ps1`), a VRAM-downsampling knob on the training page, and the console's *Status* / block preflight check the command template of whichever toolchain is selected — including the `--save_ply` default that would otherwise end a run with "训练结束但没有找到 .ply"
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
├─ scripts/setup_gsplat.ps1   One-click gsplat install (method A of the toolchain doc)
├─ backend/                  FastAPI backend
│  ├─ app/
│  │  ├─ main.py             App entry point (also serves the built frontend)
│  │  ├─ config.py           Every tunable + quality thresholds
│  │  ├─ models.py           Task / Checkpoint / Photo / QualityReport / TrainingRun
│  │  ├─ quality/            Heuristic quality engine
│  │  ├─ routers/            auth · admin · volunteer · media
│  │  └─ services/           Ingest, stats, training pipeline, point-cloud
│  │                         plumbing (splat.py), system metrics
│  ├─ scripts/run_training.py   The graded pipeline: COLMAP per scope → block
│  │                           split → 3DGS per block → merge/align/export
│  │                           (with a mock mode that walks the same stages)
│  ├─ scripts/seed_demo.py      Demo data for the preview: synthetic photos →
│  │                           tasks → uploads → two mock runs
│  └─ tests/                 pytest suite
├─ frontend/                 React + Vite + TypeScript
│  ├─ dist/                  Build output — committed on purpose
│  └─ src/pages/             admin/ (desktop) and volunteer/ (phone)
├─ data/                     Runtime data: photos, SQLite DB, training output (git-ignored)
└─ docs/                     Pipeline design, trainer setup for the 3090 box, drone selection, deployment
```