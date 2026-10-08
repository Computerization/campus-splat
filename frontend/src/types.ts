// Type definitions mirroring the backend Pydantic models

export type Role = 'admin' | 'volunteer'
export type IssueLevel = 'error' | 'warn' | 'info'
export type PhotoStatus = 'ok' | 'warning' | 'rejected' | 'checking'
/** What an admin may set by hand; `checking` is a state, not a verdict. */
export type ReviewStatus = 'ok' | 'warning' | 'rejected'
export type CheckpointStatus = 'pending' | 'in_progress' | 'done' | 'blocked'
export type TrainingStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'

export interface Session {
  admin_id: number | null
  volunteer_id: string | null
  token: string
  role: Role
  nickname: string | null
  task_id: number | null
  task_name: string | null
}

export interface Task {
  owner_admin_id: number
  id: number
  name: string
  kind: 'indoor' | 'outdoor'
  description: string | null
  location_hint: string | null
  /** ASCII folder under data/uploads/ that holds this task's photos */
  folder: string | null
  access_code: string
  status: 'active' | 'archived'
  cover_image: string | null
  created_at: string
  updated_at: string
}

export interface TaskProgress {
  active_volunteers: string[]
  task: Task
  checkpoint_total: number
  checkpoint_done: number
  checkpoint_in_progress: number
  photo_total: number
  photo_ok: number
  photo_warning: number
  photo_rejected: number
  /** Uploaded but still in the background quality check (neither usable nor rejected) */
  photo_checking: number
  contributors: string[]
  progress_percent: number
  last_upload_at: string | null
}

export interface AngleSpec {
  label: string
  pitch?: number | null
  yaw?: number | null
  tip?: string | null
}

export interface Checkpoint {
  id: number
  task_id: number
  order_index: number
  name: string
  /** ASCII folder under data/uploads/<task folder>/ that holds these photos */
  folder: string | null
  building: string | null
  floor: string | null
  room: string | null
  lat: number | null
  lng: number | null
  height_m: number | null
  length_m: number | null
  width_m: number | null
  room_height_m: number | null
  indoor: boolean
  instructions: string | null
  find_hint: string | null
  shot_count: number
  angles: AngleSpec[] | null
  reference_image: string | null
  status: CheckpointStatus
  admin_note: string | null
}

export interface CheckpointProgress extends Checkpoint {
  uploaded_ok: number
  uploaded_warning: number
  uploaded_rejected: number
  /** Uploaded but still in the background quality check */
  uploaded_checking: number
  uploaded_total: number
  uploaded_usable: number
  remaining: number
  contributors: string[]
  last_upload_at: string | null
}

export interface Issue {
  code: string
  level: IssueLevel
  message: string
}

export interface Quality {
  passed: boolean
  score: number
  issues: Issue[] | null
  metrics: Record<string, number> | null
  advice: string | null
  checked_at: string
}

export interface Photo {
  id: number
  task_id: number
  checkpoint_id: number | null
  nickname: string | null
  original_filename: string
  width: number | null
  height: number | null
  size_bytes: number
  captured_at: string | null
  gps_lat: number | null
  gps_lng: number | null
  camera_model: string | null
  status: PhotoStatus
  duplicate_of: number | null
  uploaded_at: string
  thumb_url: string | null
  preview_url: string | null
  file_url: string | null
  checkpoint_name: string | null
  quality: Quality | null
}

export interface PhotoPage {
  items: Photo[]
  total: number
  limit: number
  offset: number
}

export interface UploadResult {
  ok: boolean
  photo_id: number | null
  original_filename: string
  status: PhotoStatus | null
  score: number | null
  passed: boolean | null
  issues: Issue[]
  advice: string | null
  metrics: Record<string, number> | null
  captured_at: string | null
  error: string | null
}

export interface UploadBatch {
  results: UploadResult[]
  checkpoint: CheckpointProgress
}

export interface StorageInfo {
  total_bytes: number
  free_bytes: number
  photos_bytes: number
  /** Training output (data/training) — hard links to photos are not double counted */
  training_bytes: number
  thumbnails_bytes: number
  logs_bytes: number
  /** Everything the platform manages (photos/training/thumbnails/logs) */
  managed_bytes: number
}

export interface TrainingRun {
  id: number
  task_id: number | null
  name: string
  status: TrainingStatus
  stage: string | null
  progress: number
  message: string | null
  params: TrainingParams | Record<string, unknown> | null
  photo_count: number
  output_path: string | null
  scope_kind: 'indoor' | 'outdoor' | 'mixed'
  block_total: number
  block_done: number
  artifacts: TrainingArtifact[] | null
  reuse_run_id: number | null
  created_at: string
  started_at: string | null
  finished_at: string | null
  duration_seconds: number | null
  created_by?: string | null
}

export type TrainingBlockStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'skipped'
  | 'cancelled'

/** One training chunk: a room / corridor sharing the run's single COLMAP model. */
export interface TrainingBlock {
  id: number
  run_id: number
  checkpoint_id: number | null
  order_index: number
  key: string
  name: string
  part_index: number
  part_total: number
  photo_count: number
  status: TrainingBlockStatus
  stage: string | null
  progress: number
  message: string | null
  output_path: string | null
  log_path: string | null
  metrics: { gaussians?: number; size_bytes?: number } | null
  started_at: string | null
  finished_at: string | null
}

export interface TrainingArtifact {
  kind: 'ply' | 'transform' | 'manifest' | string
  name: string
  /** Path relative to the data directory (never served as a download) */
  path: string
  size_bytes: number
  gaussians?: number
  block_key?: string | null
  block_name?: string
  merged?: boolean
}

export interface TrainingRunDetail extends TrainingRun {
  blocks: TrainingBlock[]
}

export interface TrainingParams {
  iterations: number
  image_resize: number
  train_resize: number
  toolchain: '3dgs' | 'gsplat'
  /** gsplat only: train on images downsampled by this factor (--data_factor) */
  data_factor: 1 | 2 | 4
  matcher: 'auto' | 'vocab_tree' | 'sequential' | 'exhaustive'
  block_max_photos: number
  merge_blocks: boolean
  rtk_align: boolean
}

export interface TrainingBlockPlan {
  key: string
  name: string
  checkpoint_id: number | null
  part_index: number
  part_total: number
  photo_count: number
}

export interface TrainingPreflight {
  task_id: number
  task_name: string
  kind: 'indoor' | 'outdoor'
  photo_count: number
  gps_photos: number
  block_max_photos: number
  blocks: TrainingBlockPlan[]
  estimated_gaussians_per_block: number
  gaussian_budget: number
  warnings: string[]
  /** Which trainer command the selected toolchain reads, and whether it is usable */
  toolchain: '3dgs' | 'gsplat'
  toolchain_env_var: string
  command_configured: boolean
  command_program: string | null
  command_program_available: boolean | null
  command_warnings: string[]
}

export interface TrainingPreviewScene {
  key: string
  name: string
  url: string
  run_id: number
  is_reference: boolean
  block_key: string | null
  merged: boolean
  gaussians: number
  size_bytes: number
  color: number[]
  placement: Placement
  transform: number[][]
  transform_source: 'identity' | 'manual' | string
}

/** Structured placement: T(pivot + offset) · R(pitch,yaw,roll) · S(scale) · T(-pivot). */
export interface Placement {
  pivot: [number, number, number] | number[]
  offset: [number, number, number] | number[]
  /** Radians. ZYX order: Rz(roll) · Ry(yaw) · Rx(pitch) */
  yaw: number
  pitch: number
  roll: number
  scale: number
}

export interface PlacementUpdate {
  key: string
  /** NULL / omitted = a cloud of the run being edited, otherwise its owner */
  run_id?: number | null
  offset: number[]
  yaw: number
  pitch: number
  roll: number
  scale: number
}

export interface TrainingPreview {
  run_id: number
  name: string
  status: TrainingStatus
  coordinate_system: string
  scenes: TrainingPreviewScene[]
}

export interface Overview {
  tasks: TaskProgress[]
  totals: {
    tasks: number
    photos: number
    photos_usable: number
    photos_rejected: number
    checkpoints: number
    checkpoints_done: number
    contributors: number
  }
  storage: StorageInfo
  training: TrainingRun[]
}

export interface HardwareInfo {
  hostname: string
  os: string
  os_version: string
  cpu: {
    name: string
    physical_cores: number | null
    logical_cores: number | null
    max_freq_mhz: number | null
  }
  memory_total_bytes: number
  gpu: {
    available: boolean
    name?: string
    memory_total_bytes?: number | null
    driver_version?: string | null
  }
  python_version: string
}

export interface ToolchainStatus {
  /** The .env variable this toolchain reads (doc §二 「接进网站」) */
  env_var: string
  configured: boolean
  program: string | null
  program_available: boolean | null
}

export interface SystemInfo {
  hardware: HardwareInfo
  data_dir: string
  storage: StorageInfo
  photo_status_counts: Record<string, number>
  heif_supported: boolean
  opencv_available: boolean
  training_queue: {
    queued: number
    running: number
    succeeded: number
    failed: number
    cancelled: number
    max_concurrent: number
    script_configured: boolean
    mode: 'mock' | 'real'
    colmap_configured: boolean
    vocab_tree_configured: boolean
    toolchains: Record<'3dgs' | 'gsplat', ToolchainStatus>
  } | null
}

export interface Metrics {
  timestamp: number
  uptime_seconds: number
  cpu: {
    percent: number
    per_core: number[]
    freq_mhz: number | null
  }
  memory: {
    total_bytes: number
    used_bytes: number
    available_bytes: number
    percent: number
  }
  disk: {
    path: string
    total_bytes?: number
    used_bytes?: number
    free_bytes?: number
    percent: number | null
  }
  gpu: {
    available: boolean
    utilization?: number | null
    memory_used_bytes?: number | null
    memory_total_bytes?: number | null
    memory_percent?: number | null
    temperature_c?: number | null
  }
}

export interface TaskDetail {
  task: TaskProgress
  checkpoints: CheckpointProgress[]
}

export interface Board {
  task: Task
  checkpoints: CheckpointProgress[]
  nickname: string | null
  my_photo_count: number
  my_ok_count: number
}

export interface CheckpointDetail {
  checkpoint: CheckpointProgress
  task: { id: number; name: string; kind: string }
  review: {
    status: CheckpointReviewStatus
    note: string | null
    reviewed_at: string | null
    attempt: number
  }
  held_by_me: boolean
  held_by_other: boolean
  my_photos: Photo[]
  reference_url: string | null
}

/** 点位大厅：志愿者一次接一个点位。 */
export interface CheckpointCard {
  checkpoint: CheckpointProgress
  task_id: number
  task_name: string
  task_kind: string
  review_status: CheckpointReviewStatus
  review_note: string | null
  attempt: number
  mine: boolean
  my_photo_count: number
  my_usable_count: number
  claimed_by_someone_else: boolean
}

export interface CheckpointBoard {
  busy: boolean
  held: CheckpointCard[]
  reviewing: CheckpointCard[]
  approved: CheckpointCard[]
  available: CheckpointCard[]
}

// ---------------------------------------------------- 点位照片最终审核 + 试解算

/** One checkpoint's review verdict. (Different from `ReviewStatus` above, which
 *  is an admin's manual override of a single photo's quality verdict.) */
export type CheckpointReviewStatus = 'pending' | 'submitted' | 'approved' | 'returned'
export type SolveStatus = 'none' | 'queued' | 'running' | 'done' | 'failed'
export type SolveVerdict = 'ok' | 'risky' | 'failed'
export type SolveLevel = 'good' | 'warn' | 'bad'

export interface SolveCheck {
  key: 'registered' | 'connectivity' | 'reprojection'
  level: SolveLevel
  points: number
  max_points: number
}

export interface SolveSuggestion {
  level: SolveLevel
  text: string
}

export interface SolveComponent {
  model: string
  images: number
  points3d: number
  mean_error_px: number
}

/** The short version shown in the review list. */
export interface SolveSummary {
  status: SolveStatus
  error: string | null
  mock: boolean
  score: number | null
  verdict: SolveVerdict | null
  can_reconstruct: boolean | null
  registered_ratio: number | null
  components: number
  images: number | null
  registered: number | null
  mean_error_px: number | null
  elapsed_s: number | null
  finished_at: string | null
}

/** The whole report produced by services/recon.py. */
export interface SolveReport {
  generated_at: string
  mock: boolean
  note?: string
  images: number
  registered: number
  registered_ratio: number
  components: SolveComponent[]
  points3d: number
  mean_error_px: number
  median_error_px: number
  worst_images: { name: string; error: number }[]
  unregistered_images: string[]
  skipped_images: string[]
  elapsed_s: number
  log_tail: string[]
  score: number
  checks: SolveCheck[]
  can_reconstruct: boolean
  verdict: SolveVerdict
  suggestions: SolveSuggestion[]
}

export interface CheckpointReviewItem {
  checkpoint_id: number
  name: string
  room: string | null
  order_index: number
  task_id: number
  task_name: string
  task_kind: string
  owner_admin_id: number
  volunteer: string | null
  required: number
  usable_photos: number
  total_photos: number
  review_status: CheckpointReviewStatus
  review_note: string | null
  reviewed_by: number | null
  submitted_at: string | null
  reviewed_at: string | null
  attempt: number
  can_operate: boolean
  solve: SolveSummary | null
}

export interface CheckpointReviewDetail extends CheckpointReviewItem {
  photos: Photo[]
  report: SolveReport | null
  shots_note: string | null
  find_hint: string | null
  reference_url: string | null
  pending_siblings: number[]
}

export interface CheckpointReviewList {
  items: CheckpointReviewItem[]
  counts: Record<string, number>
  status: string
}
