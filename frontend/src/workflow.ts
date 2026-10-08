/**
 * Volunteer-account administration.
 *
 * This file used to hold the whole task-level submission client (claim a task,
 * submit one batch, review it). Volunteers work per checkpoint now — that lives
 * in `api.ts` (`board`, `claimCheckpoint`, `submitCheckpoint`, `checkpointReviews`)
 * and `types.ts`. What is left here is the one part still in use: managing
 * volunteer accounts from the admin console.
 */
import { request } from './api'

export interface Account {
  id: string
  username: string
  password: string
  active: boolean
  created_at: string
}

export const workflow = {
  accounts: () => request<Account[]>('/api/admin/volunteers'),
  editAccount: (id: string, body: { username: string; password: string }) =>
    request<Account>(`/api/admin/volunteers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  archiveAccount: (id: string) =>
    request(`/api/admin/volunteers/${id}`, { method: 'DELETE' }),
}
