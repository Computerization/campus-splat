// Type definitions mirroring the backend Pydantic models

export type Role = 'admin' | 'volunteer'
export type IssueLevel = 'error' | 'warn' | 'info'
export type PhotoStatus = 'ok' | 'warning' | 'rejected'
export type CheckpointStatus = 'pending' | 'in_progress' | 'done' | 'blocked'
export type TrainingStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'

export interface Session {
  token: string
  role: Role
  nickname: string | null
  task_id: number | null
  task_name: string | null
}

export interface Task {
  id: number
  name: string
  kind: 'indoor' | 'outdoor'
  description: string | null
  location_hint: string | null
  access_code: string
  status: 'active' | 'archived'
  cover_image: string | null
  created_at: string
  updated_at: string
}

export interface TaskProgress {
  task: Task
  checkpoint_total: number
  checkpoint_done: number
  checkpoint_in_progress: number
  photo_total: number
  photo_ok: number
  photo_warning: number
  photo_rejected: number
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
}

export interface TrainingRun {
  id: number
  task_id: number | null
  name: string
  status: TrainingStatus
  stage: string | null
  progress: number
  message: string | null
  params: Record<string, unknown> | null
  photo_count: number
  output_path: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
  duration_seconds: number | null
  created_by?: string | null
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
  }
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
  my_photos: Photo[]
  reference_url: string | null
}
