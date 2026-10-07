import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import {
  Badge,
  Card,
  CopyButton,
  EmptyState,
  ErrorBox,
  Modal,
  ProgressBar,
  Spinner,
  Toast,
  formatDateTime,
  statusTone,
  useAsync,
  usePolling,
  useTimeFormat,
} from '../../components/common'
import { useI18n } from '../../i18n'
import type { CheckpointProgress, Photo } from '../../types'

interface CheckpointForm {
  id?: number
  name: string
  building: string
  floor: string
  room: string
  // Dimensions are kept as strings so the inputs can hold "" or "8.5"
  length_m: string
  width_m: string
  room_height_m: string
  shot_count: number
  indoor: boolean
  instructions: string
  find_hint: string
}

const EMPTY_CP: CheckpointForm = {
  name: '',
  building: '',
  floor: '',
  room: '',
  length_m: '',
  width_m: '',
  room_height_m: '',
  shot_count: 4,
  indoor: true,
  instructions: '',
  find_hint: '',
}

// ---------------------------------------------------------------- photo-count estimate
//
// A checkpoint needs enough shots to see every surface from several angles, so
// the count scales with the room's total interior surface area:
//     surface = 2 x (L*W + L*H + W*H)      <- floor + ceiling + four walls
// Each photo is assumed to cover COVERAGE_M2_PER_SHOT square metres of usable
// area (that figure already accounts for overlap between neighbouring shots).
//
// Calibration: an ordinary 8 x 6 x 3.5 m classroom -> ~194 m2 -> ~39 photos,
// which matches the 30-60 photos per classroom seen in practice.
//
// Tune these two constants if the estimate feels too high or too low, then
// rebuild the frontend.
const COVERAGE_M2_PER_SHOT = 5
const MIN_SUGGESTED_SHOTS = 4

function parsePositive(value: string): number | null {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function suggestShotCount(length: string, width: string, height: string): number | null {
  const l = parsePositive(length)
  const w = parsePositive(width)
  const h = parsePositive(height)
  if (l === null || w === null || h === null) return null
  const surface = 2 * (l * w + l * h + w * h)
  const shots = Math.ceil(surface / COVERAGE_M2_PER_SHOT)
  // The backend caps shot_count at 64
  return Math.max(MIN_SUGGESTED_SHOTS, Math.min(64, shots))
}

export default function AdminTaskDetail() {
  const { t } = useI18n()
  const { relativeTime } = useTimeFormat()
  const { id } = useParams()
  const taskId = Number(id)
  const navigate = useNavigate()

  const { data, error, loading, reload, silentRefresh } = useAsync(
    () => api.taskDetail(taskId),
    [taskId],
  )
  usePolling(silentRefresh, 15_000, Boolean(data))

  const { data: photoPage, silentRefresh: refreshPhotos } = useAsync(
    () => api.photos({ task_id: taskId, limit: 24 }),
    [taskId],
  )

  const [cpForm, setCpForm] = useState<CheckpointForm | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkMode, setBulkMode] = useState<'append' | 'replace'>('append')
  const [taskEditOpen, setTaskEditOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskLocation, setTaskLocation] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<unknown>(null)
  const [toast, setToast] = useState<string | null>(null)

  if (loading && !data) return <Spinner />
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const { task, checkpoints } = data

  function flash(text: string) {
    setToast(text)
    window.setTimeout(() => setToast(null), 3000)
  }

  async function refreshAll() {
    await Promise.all([reload(true), refreshPhotos()])
  }

  async function saveCheckpoint() {
    if (!cpForm || !cpForm.name.trim()) return
    setBusy(true)
    setFormError(null)
    const payload = {
      name: cpForm.name.trim(),
      building: cpForm.building.trim() || undefined,
      floor: cpForm.floor.trim() || undefined,
      room: cpForm.room.trim() || undefined,
      length_m: parsePositive(cpForm.length_m) ?? undefined,
      width_m: parsePositive(cpForm.width_m) ?? undefined,
      room_height_m: parsePositive(cpForm.room_height_m) ?? undefined,
      shot_count: cpForm.shot_count,
      indoor: cpForm.indoor,
      instructions: cpForm.instructions.trim() || undefined,
      find_hint: cpForm.find_hint.trim() || undefined,
    }
    try {
      if (cpForm.id) await api.patchCheckpoint(cpForm.id, payload)
      else await api.createCheckpoint(taskId, payload)
      setCpForm(null)
      await refreshAll()
    } catch (err) {
      setFormError(err)
    } finally {
      setBusy(false)
    }
  }

  async function removeCheckpoint(cp: CheckpointProgress) {
    if (!window.confirm(t('admin.cp.deleteConfirm', { name: cp.name }))) return
    await api.deleteCheckpoint(cp.id)
    await refreshAll()
  }

  async function importBulk() {
    const items = parseBulk(bulkText)
    if (!items.length) return
    setBusy(true)
    setFormError(null)
    try {
      const result = await api.bulkCheckpoints(taskId, items, bulkMode)
      setBulkOpen(false)
      setBulkText('')
      flash(t('admin.detail.importedCount', { count: result.created }))
      await refreshAll()
    } catch (err) {
      setFormError(err)
    } finally {
      setBusy(false)
    }
  }

  async function uploadReference(cp: CheckpointProgress, file: File) {
    try {
      await api.uploadReference(cp.id, file)
      flash(t('admin.detail.referenceUpdated', { name: cp.name }))
      await refreshAll()
    } catch (err) {
      setFormError(err)
    }
  }

  async function saveTask() {
    setBusy(true)
    try {
      await api.patchTask(taskId, {
        name: taskName.trim() || undefined,
        location_hint: taskLocation.trim(),
      })
      setTaskEditOpen(false)
      await refreshAll()
    } catch (err) {
      setFormError(err)
    } finally {
      setBusy(false)
    }
  }

  const shareLink = `${window.location.origin}/join?code=${task.task.access_code}`
  const separator = t('common.listSeparator')
  const suggestedShots = cpForm
    ? suggestShotCount(cpForm.length_m, cpForm.width_m, cpForm.room_height_m)
    : null

  return (
    <>
      <div className="page-head">
        <div>
          <div className="small muted">
            <Link to="/admin/tasks">{t('admin.nav.tasks')}</Link> / {task.task.name}
          </div>
          <h1>{task.task.name}</h1>
          <div className="sub">
            {task.task.kind === 'outdoor' ? t('task.kind.outdoor') : t('task.kind.indoor')}
            {task.task.location_hint ? ` · ${task.task.location_hint}` : ''}
          </div>
        </div>
        <div className="row">
          <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
            {t('common.refresh')}
          </button>
          <Link className="btn btn-ghost" to={`/admin/photos?task_id=${taskId}`}>
            {t('admin.photos.title')}
          </Link>
          <a className="btn btn-ghost" href={api.exportCsvUrl(taskId)}>
            {t('admin.photos.export')}
          </a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              try {
                const result = await api.reveal({ task_id: taskId })
                setToast(t('admin.tasks.folderOpened', { path: result.path }))
              } catch (err) {
                setToast(String(err))
              }
              window.setTimeout(() => setToast(null), 4000)
            }}
          >
            📂 {t('admin.tasks.openFolder')}
          </button>
        </div>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 18 }}>
        <Card>
          <h3>{t('admin.detail.accessCodeTitle')}</h3>
          <div className="row between">
            <span className="tag-code" style={{ fontSize: '1.2rem' }}>
              {task.task.access_code}
            </span>
            <CopyButton text={shareLink} label={t('common.copyShareLink')} />
          </div>
          <p className="hint" style={{ marginTop: 8 }}>
            {t('admin.detail.shareHint', { link: shareLink.replace(/^https?:\/\//, '') })}
          </p>
        </Card>

        <Card>
          <h3>{t('admin.detail.checkpointProgress')}</h3>
          <ProgressBar value={task.progress_percent} height={10} />
          <div className="kv" style={{ marginTop: 10 }}>
            <dt>{t('table.checkpoints')}</dt>
            <dd>
              {t('admin.detail.checkpointsDone', {
                done: task.checkpoint_done,
                total: task.checkpoint_total,
              })}
              {task.checkpoint_in_progress > 0 &&
                ` · ${t('admin.detail.inProgressCount', { count: task.checkpoint_in_progress })}`}
            </dd>
            <dt>{t('table.photos')}</dt>
            <dd>
              {t('admin.detail.photoStats', {
                total: task.photo_total,
                usable: task.photo_ok + task.photo_warning,
                rejected: task.photo_rejected,
              })}
            </dd>
            <dt>{t('table.contributors')}</dt>
            <dd className="small">{task.contributors.join(separator) || '—'}</dd>
          </div>
        </Card>

        <Card>
          <h3>{t('admin.detail.taskSettings')}</h3>
          <p className="small muted">{task.task.description || t('common.noDescription')}</p>
          <button
            type="button"
            className="btn btn-ghost sm"
            onClick={() => {
              setTaskName(task.task.name)
              setTaskLocation(task.task.location_hint ?? '')
              setTaskEditOpen(true)
            }}
          >
            {t('common.edit')}
          </button>
          <div className="divider" />
          <button
            type="button"
            className="btn btn-danger sm"
            onClick={async () => {
              if (!window.confirm(t('admin.tasks.deleteConfirm', { name: task.task.name }))) return
              await api.deleteTask(taskId)
              navigate('/admin/tasks')
            }}
          >
            {t('admin.detail.deleteTask')}
          </button>
        </Card>
      </div>

      <Card style={{ marginBottom: 18 }}>
        <div className="card-head">
          <h3>
            {t('admin.cp.title')} ({checkpoints.length})
          </h3>
          <div className="row">
            <button
              type="button"
              className="btn btn-ghost sm"
              onClick={() => {
                setBulkText('')
                setFormError(null)
                setBulkOpen(true)
              }}
            >
              {t('admin.cp.bulk')}
            </button>
            <button
              type="button"
              className="btn btn-primary sm"
              onClick={() => {
                setCpForm({ ...EMPTY_CP })
                setFormError(null)
              }}
            >
              + {t('admin.cp.add')}
            </button>
          </div>
        </div>

        {checkpoints.length === 0 ? (
          <EmptyState text={t('admin.cp.empty')} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('table.checkpoint')}</th>
                  <th>{t('table.location')}</th>
                  <th style={{ minWidth: 150 }}>{t('table.progress')}</th>
                  <th>{t('table.status')}</th>
                  <th>{t('table.contributors')}</th>
                  <th>{t('table.lastUpload')}</th>
                  <th>{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp) => (
                  <tr key={cp.id}>
                    <td className="muted">{cp.order_index + 1}</td>
                    <td>
                      <strong>{cp.name}</strong>
                      {cp.instructions && (
                        <div className="small muted" style={{ maxWidth: 260 }}>
                          {cp.instructions.slice(0, 60)}
                          {cp.instructions.length > 60 && '…'}
                        </div>
                      )}
                    </td>
                    <td className="small">
                      {[cp.building, cp.floor, cp.room].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td>
                      <ProgressBar
                        value={Math.min(100, (cp.uploaded_usable / Math.max(1, cp.shot_count)) * 100)}
                        tone={cp.status === 'done' ? 'ok' : 'warn'}
                        height={6}
                      />
                      <span className="small muted">
                        {t('admin.detail.usableOfTotal', {
                          usable: cp.uploaded_usable,
                          total: cp.shot_count,
                        })}
                        {cp.uploaded_rejected > 0 && (
                          <span style={{ color: 'var(--bad)' }}>
                            {' '}
                            · {t('admin.detail.rejectedInline', { count: cp.uploaded_rejected })}
                          </span>
                        )}
                      </span>
                    </td>
                    <td>
                      <Badge tone={statusTone(cp.status)}>{t(`status.${cp.status}` as never)}</Badge>
                    </td>
                    <td className="small">{cp.contributors.join(separator) || '—'}</td>
                    <td className="small muted">{relativeTime(cp.last_upload_at)}</td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-ghost sm"
                          onClick={() => {
                            setCpForm({
                              id: cp.id,
                              name: cp.name,
                              building: cp.building ?? '',
                              floor: cp.floor ?? '',
                              room: cp.room ?? '',
                              length_m: cp.length_m !== null ? String(cp.length_m) : '',
                              width_m: cp.width_m !== null ? String(cp.width_m) : '',
                              room_height_m:
                                cp.room_height_m !== null ? String(cp.room_height_m) : '',
                              shot_count: cp.shot_count,
                              indoor: cp.indoor,
                              instructions: cp.instructions ?? '',
                              find_hint: cp.find_hint ?? '',
                            })
                            setFormError(null)
                          }}
                        >
                          {t('common.edit')}
                        </button>
                        <label className="btn btn-ghost sm" style={{ cursor: 'pointer' }}>
                          {t('admin.cp.uploadReference')}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              if (file) void uploadReference(cp, file)
                              event.target.value = ''
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn-danger sm"
                          onClick={() => void removeCheckpoint(cp)}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <div className="card-head">
          <h3>{t('admin.detail.recentPhotos')}</h3>
          <Link className="btn btn-ghost sm" to={`/admin/photos?task_id=${taskId}`}>
            {t('common.viewAll')}
          </Link>
        </div>
        {(photoPage?.items.length ?? 0) === 0 ? (
          <EmptyState text={t('admin.photos.empty')} />
        ) : (
          <div className="photo-wall">
            {photoPage?.items.map((photo) => (
              <PhotoCardSmall key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </Card>

      {/* Checkpoint edit — the backdrop deliberately doesn't close it */}
      <Modal
        open={cpForm !== null}
        title={cpForm?.id ? t('admin.detail.editCheckpoint') : t('admin.cp.add')}
        onClose={() => setCpForm(null)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setCpForm(null)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !cpForm?.name.trim()}
              onClick={() => void saveCheckpoint()}
            >
              {busy ? t('common.loading') : t('common.save')}
            </button>
          </>
        }
      >
        {formError ? <ErrorBox error={formError} /> : null}
        {cpForm && (
          <>
            <label className="field">
              <span>{t('admin.cp.name')}</span>
              <input
                type="text"
                value={cpForm.name}
                onChange={(event) => setCpForm({ ...cpForm, name: event.target.value })}
                placeholder={t('admin.cp.namePlaceholder')}
              />
            </label>
            <div className="grid cols-2">
              <label className="field">
                <span>{t('admin.cp.building')}</span>
                <input
                  type="text"
                  value={cpForm.building}
                  onChange={(event) => setCpForm({ ...cpForm, building: event.target.value })}
                  placeholder={t('admin.cp.buildingPlaceholder')}
                />
              </label>
              <label className="field">
                <span>{t('admin.cp.floor')}</span>
                <input
                  type="text"
                  value={cpForm.floor}
                  onChange={(event) => setCpForm({ ...cpForm, floor: event.target.value })}
                  placeholder={t('admin.cp.floorPlaceholder')}
                />
              </label>
            </div>
            <label className="field">
              <span>{t('admin.cp.room')}</span>
              <input
                type="text"
                value={cpForm.room}
                onChange={(event) => setCpForm({ ...cpForm, room: event.target.value })}
                placeholder={t('admin.cp.roomPlaceholder')}
              />
            </label>
            <div className="field">
              <span>{t('admin.cp.roomSize')}</span>
              <div className="size-inputs">
                <label className="size-input">
                  <span>{t('admin.cp.length')}</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={cpForm.length_m}
                    onChange={(event) => setCpForm({ ...cpForm, length_m: event.target.value })}
                    placeholder={t('admin.cp.lengthPlaceholder')}
                  />
                </label>
                <label className="size-input">
                  <span>{t('admin.cp.width')}</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={cpForm.width_m}
                    onChange={(event) => setCpForm({ ...cpForm, width_m: event.target.value })}
                    placeholder={t('admin.cp.widthPlaceholder')}
                  />
                </label>
                <label className="size-input">
                  <span>{t('admin.cp.roomHeight')}</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={cpForm.room_height_m}
                    onChange={(event) =>
                      setCpForm({ ...cpForm, room_height_m: event.target.value })
                    }
                    placeholder={t('admin.cp.roomHeightPlaceholder')}
                  />
                </label>
              </div>
              <span className="hint">{t('admin.cp.roomSizeHint')}</span>
            </div>

            <label className="field">
              <span>{t('admin.cp.shotCount')}</span>
              <div className="row" style={{ alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={cpForm.shot_count}
                  onChange={(event) =>
                    setCpForm({ ...cpForm, shot_count: Number(event.target.value) || 1 })
                  }
                  style={{ maxWidth: 120 }}
                />
                {suggestedShots !== null && (
                  <>
                    <span className="badge badge-info">
                      {t('admin.cp.suggestion', { count: suggestedShots })}
                    </span>
                    {cpForm.shot_count !== suggestedShots && (
                      <button
                        type="button"
                        className="btn btn-ghost sm"
                        onClick={() => setCpForm({ ...cpForm, shot_count: suggestedShots })}
                      >
                        {t('admin.cp.applySuggestion')}
                      </button>
                    )}
                  </>
                )}
              </div>
              <span className="hint">{t('admin.cp.shotCountHint')}</span>
            </label>
            <label className="field">
              <span>{t('admin.cp.instructions')}</span>
              <textarea
                value={cpForm.instructions}
                onChange={(event) => setCpForm({ ...cpForm, instructions: event.target.value })}
                placeholder={t('admin.cp.instructionsPlaceholder')}
              />
            </label>
            <label className="field">
              <span>{t('admin.cp.findHint')}</span>
              <textarea
                value={cpForm.find_hint}
                onChange={(event) => setCpForm({ ...cpForm, find_hint: event.target.value })}
                placeholder={t('admin.cp.findHintPlaceholder')}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={cpForm.indoor}
                onChange={(event) => setCpForm({ ...cpForm, indoor: event.target.checked })}
              />
              {t('admin.cp.indoor')}
            </label>
          </>
        )}
      </Modal>

      {/* Bulk import */}
      <Modal
        open={bulkOpen}
        title={t('admin.cp.bulk')}
        onClose={() => setBulkOpen(false)}
        wide
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setBulkOpen(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !bulkText.trim()}
              onClick={() => void importBulk()}
            >
              {busy ? t('common.loading') : t('common.save')}
            </button>
          </>
        }
      >
        {formError ? <ErrorBox error={formError} /> : null}
        <label className="field">
          <span>{t('admin.cp.bulkMode')}</span>
          <select value={bulkMode} onChange={(event) => setBulkMode(event.target.value as never)}>
            <option value="append">{t('admin.cp.bulkAppend')}</option>
            <option value="replace">{t('admin.cp.bulkReplace')}</option>
          </select>
        </label>
        <label className="field">
          <span>{t('admin.detail.checkpointList')}</span>
          <textarea
            style={{ minHeight: 190 }}
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            placeholder={t('admin.cp.bulkPlaceholder')}
          />
          <span className="hint">{t('admin.cp.bulkHint')}</span>
        </label>
      </Modal>

      {/* Task edit */}
      <Modal
        open={taskEditOpen}
        title={t('admin.detail.editTask')}
        onClose={() => setTaskEditOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setTaskEditOpen(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void saveTask()}
            >
              {busy ? t('common.loading') : t('common.save')}
            </button>
          </>
        }
      >
        <label className="field">
          <span>{t('admin.tasks.name')}</span>
          <input type="text" value={taskName} onChange={(event) => setTaskName(event.target.value)} />
        </label>
        <label className="field">
          <span>{t('admin.tasks.location')}</span>
          <input
            type="text"
            value={taskLocation}
            onChange={(event) => setTaskLocation(event.target.value)}
          />
        </label>
      </Modal>

      {toast && <Toast text={toast} />}
    </>
  )
}

function PhotoCardSmall({ photo }: { photo: Photo }) {
  const { t } = useI18n()
  return (
    <div className="photo-card">
      <div className="pic">
        {photo.thumb_url && <img src={photo.thumb_url} alt={photo.original_filename} loading="lazy" />}
        {photo.quality && <span className="score-pill">{photo.quality.score}</span>}
      </div>
      <div className="info">
        <span>{photo.checkpoint_name ?? t('common.unbound')}</span>
        <span>
          {photo.nickname ?? t('common.anonymous')} · {formatDateTime(photo.uploaded_at)}
        </span>
        <Badge tone={statusTone(photo.status)}>{t(`status.${photo.status}` as never)}</Badge>
      </div>
    </div>
  )
}

function parseBulk(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, building, floor, room, shots] = line.split('|').map((part) => part.trim())
      const count = Number(shots)
      return {
        name: name ?? '',
        building: building || undefined,
        floor: floor || undefined,
        room: room || undefined,
        shot_count: Number.isFinite(count) && count > 0 ? Math.min(64, Math.round(count)) : 4,
      }
    })
    .filter((item) => item.name.length > 0)
}
