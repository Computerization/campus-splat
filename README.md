# School 3DGS Capture Platform

> My CAS project as vice president of the computerization club. The goal is to build a 3D Gaussian Splatting model of the **entire school** and enter it in [Explorer Global](https://tryout.explorerglobal.cn/). Buildings are planned to be shot by drone, and the interiors are shot by student volunteers with their phones. Collecting that many indoor photos by hand doesn't scale, so this web app exists: volunteers upload photos and get per-photo quality results when submitting their complete task — nobody finds out three weeks later that a whole floor has to be re-shot.

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
  - [Fixed administrator accounts](#fixed-administrator-accounts)
  - [How volunteers and admins use it](#how-volunteers-and-admins-use-it)
    - [Volunteers — open `/v` on a phone](#volunteers--open-v-on-a-phone)
    - [Admins — open `/admin` on the club-room computer](#admins--open-admin-on-the-club-room-computer)
  - [The photo quality check](#the-photo-quality-check)
  - [Project layout](#project-layout)

---

## What it does

| | Volunteers (phone, `/v`) | Admins (desktop, `/admin`) |
|---|---|---|
| **How they get in** | Real-name account + password | One of three fixed admin passwords |
| **What they see** | Where to go, how to shoot, how many photos, instant per-photo feedback | Global progress, checkpoint planning, photo review, submission decisions, volunteer accounts, training jobs, live server metrics |

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

## Fixed administrator accounts

Three permanent administrator identities log in using only their assigned password.
Obtain the password for your administrator identity from the platform maintainer.
They cannot be deleted. Signing out ends only the current session.
Each administrator owns the tasks they create and can edit/delete only their own
 tasks, checkpoints, photos and submissions. Only administrator 001 can access
 training, logs, model previews and exports for their own tasks. Training executes
 on the computer running the platform backend and saves output in its local
 `data/training/` directory (or the configured data directory). To store output on
 administrator 001's computer, run the platform backend on that computer.
 Existing tasks migrate
 to administrator 001. Task codes are generated automatically: five random letters
 and digits, unique and immutable. Newest tasks appear first, including in the sidebar.
 All three administrators can list active volunteer accounts and change their
 usernames/passwords or archive them. As requested, this list includes current
 passwords; these recoverable credentials are stored with the account ID.

## Where the data lives, and starting over

`data/` holds everything: photos, the SQLite database, training output and logs. Two settings move it around:

| Want to | Set |
|---|---|
| Put everything on a big disk | `THREEDGS_DATA_DIR=E:\campus-splat-data` |
| Keep only the photos elsewhere (they are the bulky part) | `THREEDGS_UPLOAD_DIR=F:\campus-photos` |

With an external photo folder the database stores absolute paths, so moving that disk later means updating the variable too.

**The photo tree is meant to be readable.** Every folder and file name is ASCII, so you can find a photo without opening the app:

```
data/uploads/SanHaoLou/3FShiYanShi302/0001_ZhangSan.jpg
             │         │               │    └ who shot it (pinyin of the name they joined with)
             │         │               └ its position inside that checkpoint
             │         └ the checkpoint — 点位名, transliterated ("3F 实验室 302")
             └ the task — 任务名, transliterated ("三号楼")
```

Task and checkpoint names are normalized when they are created (CamelCase for English, pinyin for Chinese), so
typing in Chinese is fine — the name only ever changes *on disk*. Renaming a task later does **not** move its
photos: the folder is fixed at creation. Vendors, tools and scripts all get plain ASCII paths, which is what makes
`find`, `rsync`, COLMAP and Windows happy.

**Training output** lives in `data/training/<task folder>/<YYYYMMDD-HHMM>/` — one self-contained folder per run,
grouped under the task it belongs to, so `ls data/training` says which building it is and a second run of the same
task gets its own timestamped folder instead of overwriting the first. Inside: `plan.json`, the hard-linked
`input/`, and `output/` with the poses, block clouds, `merged.ply`, `transforms.json` and `manifest.json`. The
System page breaks the disk usage down by photos / training output / thumbnails, and each run in the Training page
has a 🗑 button: delete the record, optionally together with the files. Deleting the record alone is the default
because a run is hours of GPU time — and note that a run's `input/` is hard links, so a photo removed from
`uploads/` keeps living (and taking space) inside the run that used it until that run's folder is deleted too.

**Opening folders:** the admin console has 📂 buttons (System page: data / photo folders; task detail: that task's photos; photo review: show the selected photo). They open the file manager **on the machine running the server** — clicking from your laptop still opens it on the server, not on your laptop.

**Deleting tasks:** use the task page. Global reset is disabled for all fixed
administrators so other administrators' tasks and permanent volunteer IDs cannot
be erased. Deleted tasks release unfinished task slots; account and assignment
records remain in the database. Original media is removed when requested.

## How volunteers and admins use it

### Volunteers — open `/join` or `/v`

1. Register with a real name and a password. Active usernames must be unique;
   passwords may repeat. Registration assigns a permanent ID, starting at `00000`.
2. Log in with username/password. Volunteers cannot edit their name or ID, but can
   change their password in Settings.
3. Browse published tasks and claim up to ten at once. In-progress and submitted
   tasks count towards this limit; the backend enforces it under concurrent requests.
4. Follow every checkpoint's shooting instructions. Selected photos are drafts in
   IndexedDB on the current browser/device; they survive a reload but do not sync
   between devices. The task page shows progress and allows removing/replacing photos.
5. After every checkpoint meets its required photo count, submit all photos together.
   The batch is validated on submission (byte-identical duplicates, unreadable files)
   and rolls back as a whole when something is wrong. The heuristic quality checks —
   blur, exposure, near-duplicates — then run in the background, so the admin sees the
   verdicts when reviewing. Pending submissions are locked and cannot be abandoned.
6. A returned submission goes back to in-progress, retaining the photos and review
   feedback. The volunteer can change photos, resubmit, or abandon.
7. Accepted submissions appear under Successful submissions and release their slot.
   Abandoning clears the attempt and releases its slot; claiming again starts fresh.

Account archival permanently preserves the ID, name, password and historical
records, revokes sessions and releases the username. Registering the same name
later allocates a new ID; old IDs never get reused. The display pads IDs to at least
five digits, allowing registration beyond 100,000 accounts. Unfinished assignments
are closed on archival; already-submitted data remains available for administrator
review. Volunteers and administrators see participant names update every two seconds.

### Administrators — open `/admin`

- **Tasks & checkpoints:** create, edit descriptions, configure required photos and
  reference images, or delete your own tasks. Automatically generated task codes
  cannot be changed. Your tasks appear above the navigation's task-management entry.
- **Volunteer accounts:** view every active volunteer's name, permanent ID and
  password; edit names/passwords or archive accounts. Changing a password revokes
  the volunteer's existing sessions.
- **Submissions:** inspect each complete submission, download originals, add feedback,
  then accept or return the entire submission. Decisions are serialized and a
  submission cannot be reviewed twice.
- **Photo review, training and 3D preview:** the original quality override, CSV export,
  reconstruction pipeline and placement editor remain available for your own tasks.
- **System:** monitor server hardware and resource usage. Global data deletion is disabled.

Legacy password-only administrator sessions and task-code volunteer sessions are
invalidated once during migration. New accounts persist across server restarts.

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

Consequently it runs in a **background worker** (`backend/app/services/quality_jobs.py`): the upload request only streams the file to disk and refuses byte-identical repeats, then returns; the phone watches each photo flip from *checking* to its verdict, and the photo page can start the next batch meanwhile. Set `THREEDGS_QUALITY_INLINE=1` to judge inside the request instead. A photo left in *checking* by a crash is re-queued at the next startup, a photo that cannot be decoded ends up rejected with the reason, and a **manual verdict from the review page always wins** over the heuristic one — including when the admin judges a photo the worker has not finished checking yet.

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
