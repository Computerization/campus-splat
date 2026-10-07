import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api'
import {
  Badge,
  EmptyState,
  ErrorBox,
  Modal,
  Spinner,
  Toast,
  formatBytes,
  formatDateTime,
  statusTone,
  useAsync,
} from '../../components/common'
import { issueLabel, useI18n } from '../../i18n'
import type { Photo, PhotoStatus } from '../../types'

const PAGE_SIZE = 60

export default function AdminPhotos() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [taskId, setTaskId] = useState(searchParams.get('task_id') ?? '')
  const [status, setStatus] = useState<PhotoStatus | ''>('')
  const [duplicatesOnly, setDuplicatesOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<Photo | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { data: tasks } = useAsync(() => api.listTasks(false), [])

  const { data, error, loading, reload } = useAsync(
    () =>
      api.photos({
        task_id: taskId ? Number(taskId) : undefined,
        status: status || undefined,
        q: query || undefined,
        duplicates_only: duplicatesOnly || undefined,
        limit: PAGE_SIZE,
        offset,
      }),
    [taskId, status, duplicatesOnly, query, offset],
  )

  function flash(text: string) {
    setToast(text)
    window.setTimeout(() => setToast(null), 2500)
  }

  async function review(photo: Photo, next: PhotoStatus) {
    try {
      await api.reviewPhoto(photo.id, next)
      flash(
        t('admin.photos.marked', {
          filename: photo.original_filename,
          status: t(`status.${next}` as never),
        }),
      )
      await reload(true)
    } catch (err) {
      flash(String(err))
    }
  }

  async function remove(photo: Photo) {
    if (!window.confirm(t('admin.photos.deleteConfirm'))) return
    await api.deletePhoto(photo.id)
    setSelected(null)
    await reload(true)
  }

  const total = data?.total ?? 0

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.photos.title')}</h1>
          <div className="sub">{t('admin.photos.total', { count: total })}</div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
          {t('common.refresh')}
        </button>
      </div>

      <div className="filter-bar">
        <label className="field">
          <span>{t('table.task')}</span>
          <select
            value={taskId}
            onChange={(event) => {
              setTaskId(event.target.value)
              setOffset(0)
              const next = new URLSearchParams(searchParams)
              if (event.target.value) next.set('task_id', event.target.value)
              else next.delete('task_id')
              setSearchParams(next, { replace: true })
            }}
          >
            <option value="">{t('admin.photos.allTasks')}</option>
            {(tasks ?? []).map((item) => (
              <option key={item.task.id} value={item.task.id}>
                {item.task.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t('admin.photos.filterStatus')}</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as PhotoStatus | '')
              setOffset(0)
            }}
          >
            <option value="">{t('admin.photos.all')}</option>
            <option value="ok">{t('status.ok')}</option>
            <option value="warning">{t('status.warning')}</option>
            <option value="rejected">{t('status.rejected')}</option>
          </select>
        </label>

        <label className="field grow">
          <span>{t('common.search')}</span>
          <input
            type="search"
            value={query}
            placeholder={t('admin.photos.searchPlaceholder')}
            onChange={(event) => {
              setQuery(event.target.value)
              setOffset(0)
            }}
          />
        </label>

        <label className="checkbox" style={{ paddingBottom: 10 }}>
          <input
            type="checkbox"
            checked={duplicatesOnly}
            onChange={(event) => {
              setDuplicatesOnly(event.target.checked)
              setOffset(0)
            }}
          />
          {t('admin.photos.duplicatesOnly')}
        </label>
      </div>

      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState text={t('admin.photos.empty')} />
      ) : (
        <>
          <div className="photo-wall">
            {data?.items.map((photo) => (
              <div key={photo.id} className="photo-card">
                <div
                  className="pic"
                  style={{ cursor: 'zoom-in' }}
                  onClick={() => setSelected(photo)}
                >
                  {photo.thumb_url && (
                    <img src={photo.thumb_url} alt={photo.original_filename} loading="lazy" />
                  )}
                  {photo.quality && <span className="score-pill">{photo.quality.score}</span>}
                </div>
                <div className="info">
                  <span>{photo.checkpoint_name ?? t('common.unbound')}</span>
                  <span>
                    {photo.nickname ?? t('common.anonymous')} · {formatDateTime(photo.uploaded_at)}
                  </span>
                  <span>
                    {photo.width && photo.height ? `${photo.width}×${photo.height}` : '—'} ·{' '}
                    {formatBytes(photo.size_bytes)}
                  </span>
                  <div className="row" style={{ gap: 6 }}>
                    <Badge tone={statusTone(photo.status)}>
                      {t(`status.${photo.status}` as never)}
                    </Badge>
                    {photo.duplicate_of && (
                      <Badge tone="info">
                        {t('admin.photos.duplicateOf', { id: photo.duplicate_of })}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="actions">
                  <button
                    type="button"
                    className="btn btn-ghost sm"
                    onClick={() => void review(photo, 'ok')}
                  >
                    {t('admin.photos.markOk')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger sm"
                    onClick={() => void review(photo, 'rejected')}
                  >
                    {t('admin.photos.markRejected')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="row between" style={{ marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              {t('common.prev')}
            </button>
            <span className="small muted">
              {offset + 1} – {Math.min(offset + PAGE_SIZE, total)} / {total}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              {t('common.next')}
            </button>
          </div>
        </>
      )}

      <Modal
        open={selected !== null}
        title={selected?.original_filename ?? ''}
        onClose={() => setSelected(null)}
        wide
        footer={
          selected && (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => void remove(selected)}
              >
                {t('common.delete')}
              </button>
              <a className="btn btn-ghost" href={`${selected.file_url}&download=true`} target="_blank" rel="noreferrer">
                {t('admin.photos.download')}
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={async () => {
                  try {
                    const result = await api.reveal({ photo_id: selected.id })
                    setToast(t('admin.photos.revealed', { path: result.path }))
                  } catch (err) {
                    setToast(String(err))
                  }
                  window.setTimeout(() => setToast(null), 4000)
                }}
              >
                📂 {t('admin.photos.reveal')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void review(selected, selected.status === 'rejected' ? 'ok' : 'rejected')}
              >
                {selected.status === 'rejected'
                  ? t('admin.photos.markOk')
                  : t('admin.photos.markRejected')}
              </button>
            </>
          )
        }
      >
        {selected && (
          <>
            {selected.preview_url && (
              <img
                src={selected.preview_url}
                alt={selected.original_filename}
                style={{ width: '100%', borderRadius: 8, marginBottom: 14 }}
              />
            )}

            <div className="kv">
              <dt>{t('admin.photos.detail.checkpoint')}</dt>
              <dd>{selected.checkpoint_name ?? t('common.unbound')}</dd>
              <dt>{t('admin.photos.detail.uploader')}</dt>
              <dd>{selected.nickname ?? t('common.anonymous')}</dd>
              <dt>{t('admin.photos.detail.uploadedAt')}</dt>
              <dd>{formatDateTime(selected.uploaded_at)}</dd>
              <dt>{t('admin.photos.detail.capturedAt')}</dt>
              <dd>{formatDateTime(selected.captured_at)}</dd>
              <dt>{t('admin.photos.detail.camera')}</dt>
              <dd>{selected.camera_model ?? '—'}</dd>
              <dt>{t('admin.photos.detail.size')}</dt>
              <dd>
                {selected.width && selected.height
                  ? `${selected.width}×${selected.height}`
                  : '—'}{' '}
                · {formatBytes(selected.size_bytes)}
              </dd>
              <dt>GPS</dt>
              <dd>
                {selected.gps_lat !== null && selected.gps_lng !== null
                  ? `${selected.gps_lat.toFixed(6)}, ${selected.gps_lng.toFixed(6)}`
                  : '—'}
              </dd>
              <dt>{t('admin.photos.detail.score')}</dt>
              <dd>{selected.quality?.score ?? '—'}</dd>
            </div>

            {(selected.quality?.issues ?? []).length > 0 && (
              <>
                <div className="divider" />
                <div className="stack" style={{ gap: 6 }}>
                  {(selected.quality?.issues ?? []).map((issue, index) => (
                    <div key={`${issue.code}-${index}`} className={`issue-row ${issue.level}`}>
                      <span className="code">{issueLabel(issue.code, issue.message, t)}</span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selected.quality?.metrics && (
              <>
                <div className="divider" />
                <h4>{t('admin.photos.metrics')}</h4>
                <div className="kv">
                  {Object.entries(selected.quality.metrics).map(([key, value]) => (
                    <div key={key} style={{ display: 'contents' }}>
                      <dt>{key}</dt>
                      <dd>{typeof value === 'number' ? value.toFixed(2) : String(value)}</dd>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selected.quality?.advice && (
              <>
                <div className="divider" />
                <p className="small muted" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selected.quality.advice}
                </p>
              </>
            )}
          </>
        )}
      </Modal>

      {toast && <Toast text={toast} />}
    </>
  )
}
