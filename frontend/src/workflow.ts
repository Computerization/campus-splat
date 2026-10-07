import { request } from './api'
import type { Checkpoint, Photo, Task, UploadResult } from './types'

export interface Account { id: string; username: string; password: string; active: boolean; created_at: string }
export interface Assignment {
  id: number; task_id: number; status: string; attempt: number; username: string; volunteer_id: string
  account_active: boolean; review_note: string | null; submitted_at: string | null; accepted_at: string | null
  manifest: {checkpoint_id: number; name: string; required: number; submitted: number}[] | null
}
export interface TaskItem { task: Task; assignment: Assignment | null; active_volunteers: string[]; checkpoint_count: number }
export interface Workspace extends TaskItem { checkpoints: Checkpoint[]; photos: Photo[] }
const post = (body?: unknown): RequestInit => ({method: 'POST', ...(body === undefined ? {} : {body: JSON.stringify(body)})})
export const workflow = {
  tasks: () => request<{items: TaskItem[]; slots_used: number; slots_max: number}>('/api/volunteer/tasks'),
  task: (id: number) => request<Workspace>(`/api/volunteer/tasks/${id}`),
  claim: (id: number) => request<Assignment>(`/api/volunteer/tasks/${id}/claim`, post()),
  abandon: (id: number) => request(`/api/volunteer/tasks/${id}/abandon`, post()),
  submit: (id: number, form: FormData) => request<{assignment: Assignment; results: UploadResult[]}>(`/api/volunteer/tasks/${id}/submit`, {method: 'POST', body: form}),
  accounts: () => request<Account[]>('/api/admin/volunteers'),
  editAccount: (id: string, body: {username: string; password: string}) => request<Account>(`/api/admin/volunteers/${id}`, {method: 'PATCH', body: JSON.stringify(body)}),
  archiveAccount: (id: string) => request(`/api/admin/volunteers/${id}`, {method: 'DELETE'}),
  submissions: () => request<(Assignment & {task_name: string})[]>('/api/admin/submissions'),
  submission: (id: number) => request<{assignment: Assignment; photos: Photo[]}>(`/api/admin/submissions/${id}`),
  review: (id: number, decision: 'accept' | 'return', note: string) => request<Assignment>(`/api/admin/submissions/${id}/review`, post({decision, note})),
  password: (current_password: string, password: string) => request('/api/auth/volunteer/password', {method: 'PATCH', body: JSON.stringify({current_password, password})}),
  archiveSelf: () => request('/api/auth/volunteer/account', {method: 'DELETE'}),
}
export const assignmentLabel: Record<string, string> = {
  in_progress: '进行中', submitted: '待管理员审核', accepted: '成功提交', abandoned: '未接取',
  task_deleted: '任务已删除', account_archived: '账号已注销',
}

export interface DraftPhoto { key: string; checkpointId: number; file: File }
function openDrafts(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('campus-task-drafts', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('drafts')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
export async function draftRead(key: string): Promise<DraftPhoto[]> {
  const db = await openDrafts()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readonly')
    const req = tx.objectStore('drafts').get(key)
    req.onsuccess = () => resolve(req.result ?? [])
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}
export async function draftWrite(key: string, photos: DraftPhoto[]): Promise<void> {
  const db = await openDrafts()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite')
    if (photos.length) tx.objectStore('drafts').put(photos, key)
    else tx.objectStore('drafts').delete(key)
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => { db.close(); reject(tx.error) }
    tx.onabort = () => { db.close(); reject(tx.error) }
  })
}
