import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import {
  Badge,
  Card,
  EmptyState,
  ErrorBox,
  ProgressBar,
  Spinner,
  formatDateTime,
  statusTone,
  useAsync,
  usePolling,
  useTimeFormat,
} from '../../components/common'
import { useI18n } from '../../i18n'
import type { TrainingRun } from '../../types'

export default function AdminTraining() {
  const { t } = useI18n()
  const { formatDuration } = useTimeFormat()
  const [selectedTask, setSelectedTask] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [logRunId, setLogRunId] = useState<number | null>(null)

  const { data: runs, loading, reload, silentRefresh } = useAsync(() => api.trainingRuns(30), [])
  const { data: tasks } = useAsync(() => api.listTasks(false), [])
  const { data: system, silentRefresh: refreshSystem } = useAsync(() => api.systemInfo(), [])

  // Progress moves quickly while training runs, so poll every 5s
  usePolling(
    async () => {
      await Promise.all([silentRefresh(), refreshSystem()])
    },
    5_000,
    Boolean(runs),
  )

  async function start() {
    setBusy(true)
    setError(null)
    try {
      await api.createTrainingRun({
        task_id: selectedTask ? Number(selectedTask) : undefined,
      })
      await Promise.all([reload(true), refreshSystem()])
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  async function cancel(run: TrainingRun) {
    if (!window.confirm(t('admin.training.cancelConfirm', { name: run.name }))) return
    await api.cancelTrainingRun(run.id)
    await reload(true)
  }

  const eligible = (tasks ?? []).filter(
    (item) => item.photo_ok + item.photo_warning > 0 && item.task.status !== 'archived',
  )
  const queue = system?.training_queue

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.training.title')}</h1>
          <div className="sub">{t('admin.training.subtitle')}</div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
          {t('common.refresh')}
        </button>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        <Card>
          <h3>{t('admin.training.start')}</h3>
          {queue && (
            <p className="small muted">
              {t('admin.training.queue', {
                queued: queue.queued,
                running: queue.running,
                max: queue.max_concurrent,
              })}
            </p>
          )}
          <label className="field">
            <span>{t('admin.training.selectTask')}</span>
            <select value={selectedTask} onChange={(event) => setSelectedTask(event.target.value)}>
              <option value="">{t('admin.training.allPhotos')}</option>
              {eligible.map((item) => (
                <option key={item.task.id} value={item.task.id}>
                  {t('admin.training.taskOption', {
                    name: item.task.name,
                    count: item.photo_ok + item.photo_warning,
                  })}
                </option>
              ))}
            </select>
            {eligible.length === 0 && <span className="hint">{t('admin.training.noEligible')}</span>}
          </label>
          {error ? <ErrorBox error={error} /> : null}
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={() => void start()}
          >
            🚀 {busy ? t('common.loading') : t('admin.training.start')}
          </button>
        </Card>

        <Card>
          <h3>{t('admin.training.env')}</h3>
          <div className="kv">
            <dt>{t('admin.training.mode')}</dt>
            <dd>
              {queue?.script_configured ? (
                <Badge tone="ok">{t('admin.training.real')}</Badge>
              ) : (
                <Badge tone="warn">{t('admin.training.mock')}</Badge>
              )}
            </dd>
            <dt>{t('admin.training.concurrency')}</dt>
            <dd>{queue?.max_concurrent ?? '—'}</dd>
            <dt>{t('admin.training.queuedRunning')}</dt>
            <dd>
              {queue?.queued ?? 0} / {queue?.running ?? 0}
            </dd>
            <dt>{t('admin.training.doneFailed')}</dt>
            <dd>
              {queue?.succeeded ?? 0} / {queue?.failed ?? 0}
            </dd>
          </div>
          <div className="divider" />
          <Link className="btn btn-ghost sm" to="/admin/system">
            {t('admin.nav.system')}
          </Link>
        </Card>
      </div>

      {loading && !runs ? (
        <Spinner />
      ) : (runs?.length ?? 0) === 0 ? (
        <EmptyState text={t('admin.training.empty')} />
      ) : (
        <div className="timeline">
          {runs?.map((run) => (
            <div key={run.id} className="run-item">
              <div className="head">
                <div>
                  <strong>{run.name}</strong>
                  <div className="small muted">
                    #{run.id} · {formatDateTime(run.created_at)} ·{' '}
                    {run.created_by ?? t('common.admin')}
                  </div>
                </div>
                <div className="row">
                  <Badge tone={statusTone(run.status)}>
                    {t(`training.status.${run.status}` as never)}
                  </Badge>
                  <span className="small muted">
                    {run.stage ? t(`training.stage.${run.stage}` as never) : ''}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <ProgressBar value={run.progress} height={8} />
              </div>

              <div className="row between" style={{ marginTop: 8 }}>
                <span className="small muted">{run.message ?? ''}</span>
                <span className="small muted">
                  {t('admin.training.photos')} {run.photo_count} · {t('admin.training.duration')}{' '}
                  {formatDuration(run.duration_seconds)}
                </span>
              </div>

              <div className="row" style={{ marginTop: 10, gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost sm"
                  onClick={() => setLogRunId(logRunId === run.id ? null : run.id)}
                >
                  {logRunId === run.id ? t('admin.training.hideLog') : t('admin.training.log')}
                </button>
                {run.status === 'running' || run.status === 'queued' ? (
                  <button
                    type="button"
                    className="btn btn-danger sm"
                    onClick={() => void cancel(run)}
                  >
                    {t('admin.training.cancel')}
                  </button>
                ) : null}
                {run.output_path && <span className="small muted mono">{run.output_path}</span>}
              </div>

              {logRunId === run.id && <RunLog runId={run.id} />}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function RunLog({ runId }: { runId: number }) {
  const { t } = useI18n()
  const { data, error } = useAsync(() => api.trainingLog(runId, 300), [runId])
  if (error) return <ErrorBox error={error} />
  if (!data) return <Spinner />
  if (data.lines.length === 0) {
    return <p className="small muted">{t('admin.training.noLog')}</p>
  }
  return <pre className="log-view">{data.lines.join('\n')}</pre>
}
