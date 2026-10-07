import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import {
  Card,
  CopyButton,
  EmptyState,
  ErrorBox,
  Modal,
  ProgressBar,
  Spinner,
  Toast,
  useAsync,
  useTimeFormat,
  usePolling,
} from '../../components/common'
import { useI18n } from '../../i18n'

interface FormState {
  name: string
  kind: 'indoor' | 'outdoor'
  description: string
  location_hint: string
  access_code: string
}

const EMPTY_FORM: FormState = {
  name: '',
  kind: 'indoor',
  description: '',
  location_hint: '',
  access_code: '',
}

export default function AdminTasks() {
  const { t } = useI18n()
  const { relativeTime } = useTimeFormat()
  const navigate = useNavigate()
  const { data, error, loading, reload, silentRefresh } = useAsync(() => api.listTasks(true), [])
  usePolling(silentRefresh, 2000, true)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<unknown>(null)
  const [toast, setToast] = useState<string | null>(null)

  if (loading && !data) return <Spinner />
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />

  const tasks = data ?? []

  async function create() {
    if (!form.name.trim()) return
    setBusy(true)
    setFormError(null)
    try {
      const task = await api.createTask({
        name: form.name.trim(),
        kind: form.kind,
        description: form.description.trim() || undefined,
        location_hint: form.location_hint.trim() || undefined,
      })
      setOpen(false)
      setForm(EMPTY_FORM)
      setToast(t('admin.tasks.created', { code: task.access_code }))
      window.setTimeout(() => setToast(null), 4000)
      await reload()
    } catch (err) {
      setFormError(err)
    } finally {
      setBusy(false)
    }
  }

  async function archive(id: number, name: string) {
    if (!window.confirm(t('admin.tasks.archiveConfirm', { name }))) return
    await api.patchTask(id, { status: 'archived' })
    await reload()
  }

  async function remove(id: number, name: string) {
    if (!window.confirm(t('admin.tasks.deleteConfirm', { name }))) return
    await api.deleteTask(id)
    await reload()
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.tasks.title')}</h1>
          <div className="sub">{t('admin.tasks.subtitle')}</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          + {t('admin.tasks.new')}
        </button>
      </div>

      <Card>
        {tasks.length === 0 ? (
          <EmptyState text={t('admin.tasks.empty')} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('table.task')}</th>
                  <th>{t('table.accessCode')}</th>
                  <th>{t('table.type')}</th>
                  <th style={{ minWidth: 180 }}>{t('table.progress')}</th>
                  <th>{t('table.checkpoints')}</th>
                  <th>{t('table.photos')}</th>
                  <th>{t('table.lastUpload')}</th>
                  <th>{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((item) => (
                  <tr key={item.task.id}>
                    <td>
                      <Link to={`/admin/tasks/${item.task.id}`}>
                        <strong>{item.task.name}</strong>
                      </Link>
                      {item.task.status === 'archived' && (
                        <span className="badge" style={{ marginLeft: 8 }}>
                          {t('admin.tasks.archived')}
                        </span>
                      )}
                      {item.task.location_hint && (
                        <div className="small muted">{item.task.location_hint}</div>
                      )}
                      <div className="small muted">正在进行：{item.active_volunteers.join('、') || '暂无志愿者'}</div>
                    </td>
                    <td>
                      <span className="tag-code">{item.task.access_code}</span>
                      <div style={{ marginTop: 4 }}>
                        <CopyButton
                          text={`${window.location.origin}/v/tasks/${item.task.id}`}
                          label={t('common.copyLink')}
                        />
                      </div>
                    </td>
                    <td className="small">
                      {item.task.kind === 'outdoor' ? t('task.kind.outdoor') : t('task.kind.indoor')}
                    </td>
                    <td>
                      <ProgressBar value={item.progress_percent} />
                      <span className="small muted">{item.progress_percent}%</span>
                    </td>
                    <td className="small">
                      {item.checkpoint_done}/{item.checkpoint_total}
                    </td>
                    <td className="small">
                      {item.photo_total}
                      {item.photo_rejected > 0 && (
                        <span style={{ color: 'var(--bad)' }}>
                          {' '}
                          ({t('admin.overview.rejected')} {item.photo_rejected})
                        </span>
                      )}
                    </td>
                    <td className="small muted">{relativeTime(item.last_upload_at)}</td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-ghost sm"
                          onClick={() => navigate(`/admin/tasks/${item.task.id}`)}
                        >
                          {t('admin.tasks.open')}
                        </button>
                        {item.task.status !== 'archived' && (
                          <button
                            type="button"
                            className="btn btn-ghost sm"
                            onClick={() => void archive(item.task.id, item.task.name)}
                          >
                            {t('admin.tasks.archive')}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger sm"
                          onClick={() => void remove(item.task.id, item.task.name)}
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

      <Modal
        open={open}
        title={t('admin.tasks.new')}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !form.name.trim()}
              onClick={() => void create()}
            >
              {busy ? t('common.loading') : t('common.create')}
            </button>
          </>
        }
      >
        {formError ? <ErrorBox error={formError} /> : null}
        <label className="field">
          <span>{t('admin.tasks.name')}</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t('admin.tasks.namePlaceholder')}
          />
        </label>
        <label className="field">
          <span>{t('admin.tasks.kind')}</span>
          <select
            value={form.kind}
            onChange={(event) =>
              setForm({ ...form, kind: event.target.value as 'indoor' | 'outdoor' })
            }
          >
            <option value="indoor">{t('admin.tasks.kind.indoor')}</option>
            <option value="outdoor">{t('admin.tasks.kind.outdoor')}</option>
          </select>
        </label>
        <label className="field">
          <span>{t('admin.tasks.location')}</span>
          <input
            type="text"
            value={form.location_hint}
            onChange={(event) => setForm({ ...form, location_hint: event.target.value })}
            placeholder={t('admin.tasks.locationPlaceholder')}
          />
        </label>
        <label className="field">
          <span>{t('admin.tasks.description')}</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <label className="field">
          <span>{t('admin.tasks.accessCode')}</span>
          <input
            type="text"
            value={form.access_code}
            onChange={(event) => setForm({ ...form, access_code: event.target.value.toUpperCase() })}
            placeholder="创建后自动生成随机 5 位任务码"
            disabled
          />
          <span className="hint">任务码由系统生成并永久绑定，不可修改。</span>
        </label>
      </Modal>

      {toast && <Toast text={toast} />}
    </>
  )
}
