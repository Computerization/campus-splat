import type {
  Board,
  Checkpoint,
  CheckpointDetail,
  Metrics,
  Overview,
  Photo,
  PhotoPage,
  PhotoStatus,
  PlacementUpdate,
  ReviewStatus,
  Session,
  SystemInfo,
  Task,
  TaskDetail,
  TaskProgress,
  TrainingParams,
  TrainingPreview,
  TrainingPreflight,
  TrainingRun,
  TrainingRunDetail,
  UploadBatch,
  UploadResult,
} from './types'

const TOKEN_KEY = 'threedgs.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Send a request.
 *
 * Error messages are localized here: the api layer has no access to React
 * context, so I18nProvider pushes the current language in via setApiLanguage.
 */
let currentLang: 'zh' | 'en' = 'zh'

export function setApiLanguage(lang: 'zh' | 'en'): void {
  currentLang = lang
}

const MESSAGES = {
  zh: {
    sessionExpired: '登录已过期，请重新进入',
    badResponse: '返回内容无法解析',
    uploadFailed: '上传失败',
    network: '网络中断，请检查是否还连着校园网',
  },
  en: {
    sessionExpired: 'Session expired, please sign in again',
    badResponse: 'Could not parse the response',
    uploadFailed: 'Upload failed',
    network: 'Network lost — check your Wi-Fi connection',
  },
} as const

function msg(key: keyof (typeof MESSAGES)['zh']): string {
  return MESSAGES[currentLang][key]
}

export const UNAUTHORIZED_EVENT = 'threedgs:unauthorized'

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, { ...options, headers })

  if (response.status === 401) {
    clearToken()
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    throw new ApiError(401, msg('sessionExpired'))
  }

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const data = await response.json()
      if (typeof data?.detail === 'string') detail = data.detail
      else if (Array.isArray(data?.detail)) detail = data.detail.map((d: any) => d.msg).join('；')
    } catch {
      /* Response wasn't JSON; keep the default message */
    }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

function json(body: unknown): RequestInit {
  return { body: JSON.stringify(body) }
}

export const api = {
  // ---- auth
  adminLogin: (password: string) =>
    request<Session>('/api/auth/admin/login', { method: 'POST', ...json({ password }) }),
  volunteerJoin: (accessCode: string, nickname: string) =>
    request<Session>('/api/auth/volunteer/join', {
      method: 'POST',
      ...json({ access_code: accessCode, nickname }),
    }),
  me: () => request<Session>('/api/auth/me'),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),

  // ---- volunteer
  board: () => request<Board>('/api/volunteer/board'),
  checkpointDetail: (id: number) => request<CheckpointDetail>(`/api/volunteer/checkpoints/${id}`),
  myPhotos: (limit = 80) => request<Photo[]>(`/api/volunteer/my/photos?limit=${limit}`),
  // The verdicts of photos already uploaded — the quality check runs in the
  // background, so the page polls this until nothing is left "checking"
  photoResults: (ids: number[]) =>
    request<UploadResult[]>(`/api/volunteer/photos?ids=${ids.join(',')}`),
  uploadPhotos: (checkpointId: number, files: File[], onProgress?: (percent: number) => void) =>
    uploadWithProgress<UploadBatch>(
      `/api/volunteer/checkpoints/${checkpointId}/photos`,
      files,
      onProgress,
    ),

  // ---- admin: overview
  overview: (includeArchived = false) =>
    request<Overview>(`/api/admin/overview?include_archived=${includeArchived}`),
  systemInfo: () => request<SystemInfo>('/api/admin/system'),
  metrics: () => request<Metrics>('/api/admin/metrics'),

  // ---- admin: tasks
  listTasks: (includeArchived = true) =>
    request<TaskProgress[]>(`/api/admin/tasks?include_archived=${includeArchived}`),
  createTask: (payload: Partial<Task> & { name: string }) =>
    request<Task>('/api/admin/tasks', { method: 'POST', ...json(payload) }),
  taskDetail: (id: number) => request<TaskDetail>(`/api/admin/tasks/${id}`),
  patchTask: (id: number, payload: Partial<Task>) =>
    request<Task>(`/api/admin/tasks/${id}`, { method: 'PATCH', ...json(payload) }),
  deleteTask: (id: number) => request<{ ok: boolean }>(`/api/admin/tasks/${id}`, { method: 'DELETE' }),

  // ---- admin: checkpoints
  createCheckpoint: (taskId: number, payload: Partial<Checkpoint> & { name: string }) =>
    request<Checkpoint>(`/api/admin/tasks/${taskId}/checkpoints`, { method: 'POST', ...json(payload) }),
  bulkCheckpoints: (taskId: number, items: Partial<Checkpoint>[], mode: 'append' | 'replace') =>
    request<{ ok: boolean; created: number }>(`/api/admin/tasks/${taskId}/checkpoints/bulk`, {
      method: 'POST',
      ...json({ items, mode }),
    }),
  patchCheckpoint: (id: number, payload: Partial<Checkpoint>) =>
    request<Checkpoint>(`/api/admin/checkpoints/${id}`, { method: 'PATCH', ...json(payload) }),
  deleteCheckpoint: (id: number, purgePhotos = false) =>
    request<{ ok: boolean }>(
      `/api/admin/checkpoints/${id}?purge_photos=${purgePhotos}`,
      { method: 'DELETE' },
    ),
  uploadReference: (checkpointId: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<{ ok: boolean }>(`/api/admin/checkpoints/${checkpointId}/reference`, {
      method: 'POST',
      body: form,
    })
  },

  // ---- admin: photos
  photos: (params: {
    task_id?: number
    checkpoint_id?: number
    status?: PhotoStatus
    q?: string
    duplicates_only?: boolean
    limit?: number
    offset?: number
  }) => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
    })
    return request<PhotoPage>(`/api/admin/photos?${search.toString()}`)
  },
  reviewPhoto: (id: number, status: ReviewStatus, note?: string) =>
    request<Photo>(`/api/admin/photos/${id}`, { method: 'PATCH', ...json({ status, note }) }),
  deletePhoto: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/photos/${id}`, { method: 'DELETE' }),
  exportCsvUrl: (taskId: number) => {
    const base = `/api/admin/tasks/${taskId}/export.csv`
    const token = getToken()
    return token ? `${base}?token=${encodeURIComponent(token)}` : base
  },

  // ---- admin: training
  trainingRuns: (limit = 30) => request<TrainingRun[]>(`/api/admin/training?limit=${limit}`),
  trainingRun: (id: number) => request<TrainingRunDetail>(`/api/admin/training/${id}`),
  trainingPreflight: (taskId: number, params: Partial<TrainingParams> = {}) => {
    const query = new URLSearchParams({ task_id: String(taskId) })
    if (params.block_max_photos) query.set('block_max_photos', String(params.block_max_photos))
    // The trainer parameters decide which command template (and which of its
    // pitfalls) the preflight reports on
    if (params.toolchain) query.set('toolchain', params.toolchain)
    if (params.data_factor) query.set('data_factor', String(params.data_factor))
    if (params.iterations) query.set('iterations', String(params.iterations))
    return request<TrainingPreflight>(`/api/admin/training/preflight?${query.toString()}`)
  },
  createTrainingRun: (payload: {
    task_id: number
    name?: string
    params?: Partial<TrainingParams>
  }) => request<TrainingRunDetail>('/api/admin/training', { method: 'POST', ...json(payload) }),
  cancelTrainingRun: (id: number) =>
    request<TrainingRunDetail>(`/api/admin/training/${id}/cancel`, { method: 'POST' }),
  /** Drop a run's record; `purgeFiles` also deletes data/training/runN. */
  deleteTrainingRun: (id: number, purgeFiles: boolean) =>
    request<{
      ok: boolean
      run_id: number
      files_deleted: boolean
      freed_bytes: number
      kept_at: string | null
    }>(`/api/admin/training/${id}?purge_files=${purgeFiles}`, { method: 'DELETE' }),
  trainingLog: (id: number, tail = 200) =>
    request<{ lines: string[]; path: string | null; total?: number }>(
      `/api/admin/training/${id}/log?tail=${tail}`,
    ),
  trainingBlockLog: (blockId: number, tail = 300) =>
    request<{ lines: string[]; path: string | null; total?: number; block_id: number }>(
      `/api/admin/training/blocks/${blockId}/log?tail=${tail}`,
    ),
  retryTrainingBlock: (blockId: number) =>
    request<TrainingRunDetail>(`/api/admin/training/blocks/${blockId}/retry`, { method: 'POST' }),
  trainingPreview: (runId: number, withRuns: number[] = []) =>
    request<TrainingPreview>(
      `/api/admin/training/${runId}/preview` +
        (withRuns.length ? `?with_runs=${withRuns.join(',')}` : ''),
    ),
  updateTrainingTransforms: (runId: number, placements: PlacementUpdate[]) =>
    request<{
      ok: boolean
      saved: number
      updated_at: string | null
      /** Omitted by the backend when an empty save is a no-op */
      manual?: number
      placement_count: number
    }>(`/api/admin/training/${runId}/transforms`, {
      method: 'PUT',
      ...json({ placements }),
    }),
  pruneSessions: () =>
    request<{ ok: boolean; removed: number }>('/api/admin/prune-sessions', { method: 'POST' }),

  // ---- admin: maintenance
  reveal: (payload: { photo_id?: number; task_id?: number; scope?: string; path?: string }) =>
    request<{ ok: boolean; path: string; command: string }>('/api/admin/reveal', {
      method: 'POST',
      ...json(payload),
    }),
  resetAll: (confirm: string) =>
    request<{
      ok: boolean
      tasks: number
      photos: number
      runs: number
      volunteer_sessions: number
      freed_bytes: number
    }>('/api/admin/reset', { method: 'POST', ...json({ confirm }) }),
}

/** Upload with progress events (fetch can't report upload progress, XHR can). */
function uploadWithProgress<T>(
  path: string,
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const form = new FormData()
    files.forEach((file) => form.append('files', file))

    const xhr = new XMLHttpRequest()
    xhr.open('POST', path)
    const token = getToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as T)
        } catch {
          reject(new ApiError(xhr.status, msg('badResponse')))
        }
        return
      }
      if (xhr.status === 401) {
        clearToken()
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
      }
      let detail = `${msg('uploadFailed')} (${xhr.status})`
      try {
        const data = JSON.parse(xhr.responseText)
        if (typeof data?.detail === 'string') detail = data.detail
      } catch {
        /* ignore */
      }
      reject(new ApiError(xhr.status, detail))
    }
    xhr.onerror = () => reject(new ApiError(0, msg('network')))
    xhr.send(form)
  })
}
