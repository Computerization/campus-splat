import { Link } from 'react-router-dom'
import { api } from '../../api'
import {
  Badge,
  Card,
  EmptyState,
  ErrorBox,
  ProgressBar,
  Spinner,
  formatBytes,
  statusTone,
  useAsync,
  usePolling,
  useTimeFormat,
} from '../../components/common'
import { useI18n } from '../../i18n'
import { useAuth } from '../../auth'

export default function AdminOverview() {
  const { session } = useAuth()
  const { t } = useI18n()
  const { relativeTime } = useTimeFormat()
  const { data, error, loading, reload, silentRefresh } = useAsync(() => api.overview(), [])
  // The admin console is watched live, so refresh every 10s
  usePolling(silentRefresh, 2000, Boolean(data))

  if (loading && !data) return <Spinner />
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const { totals, storage, tasks, training } = data

  return (
    <>
      <div className="page-head">
        <div>
          <h1>我的任务总览</h1>
          <div className="sub">
            每 2 秒自动刷新 ·{' '}
            {t('admin.overview.lastRefresh', { time: new Date().toLocaleTimeString() })}
          </div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
          {t('common.refresh')}
        </button>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <Metric label={t('admin.overview.tasks')} value={totals.tasks} />
        <Metric
          label={t('admin.overview.photos')}
          value={totals.photos}
          extra={t('admin.overview.usableCount', { count: totals.photos_usable })}
        />
        <Metric
          label={t('admin.overview.rejected')}
          value={totals.photos_rejected}
          tone={totals.photos_rejected > 0 ? 'bad' : undefined}
          extra={t('admin.overview.checkpointsDone', {
            done: totals.checkpoints_done,
            total: totals.checkpoints,
          })}
        />
        <Metric label={t('admin.overview.contributors')} value={totals.contributors} />
      </div>

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        <Card>
          <div className="card-head">
            <h3>{t('admin.overview.disk')}</h3>
            <span className="muted small">
              {t('admin.overview.photosSize', { size: formatBytes(storage.photos_bytes) })}
            </span>
          </div>
          <ProgressBar
            value={
              storage.total_bytes
                ? ((storage.total_bytes - storage.free_bytes) / storage.total_bytes) * 100
                : 0
            }
            tone={
              (storage.total_bytes - storage.free_bytes) / Math.max(1, storage.total_bytes) > 0.9
                ? 'bad'
                : 'warn'
            }
          />
          <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
            {t('admin.overview.free')}：
            {t('admin.overview.freeOfTotal', {
              free: formatBytes(storage.free_bytes),
              total: formatBytes(storage.total_bytes),
            })}
          </p>
        </Card>

        {session?.admin_id === 1 && <Card>
          <div className="card-head">
            <h3>{t('admin.overview.training')}</h3>
            <Link className="btn btn-ghost sm" to="/admin/training">
              {t('common.viewAll')}
            </Link>
          </div>
          {training.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>
              {t('admin.overview.noTraining')}
            </p>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              {training.slice(0, 3).map((run) => (
                <div key={run.id}>
                  <div className="row between">
                    <span className="small">{run.name}</span>
                    <Badge tone={statusTone(run.status)}>
                      {t(`training.status.${run.status}` as never)}
                    </Badge>
                  </div>
                  <ProgressBar value={run.progress} height={6} />
                  <span className="small muted">
                    {run.stage ? t(`training.stage.${run.stage}` as never) : ''}
                    {run.message ? ` · ${run.message}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>}
      </div>

      <Card>
        <div className="card-head">
          <h3>{t('admin.overview.checkpointProgress')}</h3>
          <Link className="btn btn-ghost sm" to="/admin/tasks">
            {t('admin.nav.tasks')}
          </Link>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            text={t('admin.tasks.empty')}
            action={
              <Link className="btn btn-primary" to="/admin/tasks" style={{ marginTop: 10 }}>
                {t('admin.tasks.new')}
              </Link>
            }
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('table.task')}</th>
                  <th>{t('table.accessCode')}</th>
                  <th style={{ minWidth: 200 }}>{t('table.progress')}</th>
                  <th>{t('table.photos')}</th>
                  <th>{t('table.contributors')}</th>
                  <th>{t('table.lastUpload')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tasks.map((item) => (
                  <tr key={item.task.id}>
                    <td>
                      <strong>{item.task.name}</strong>
                      <div className="small muted">
                        {item.task.kind === 'outdoor'
                          ? t('task.kind.outdoor')
                          : t('task.kind.indoor')}
                        {item.task.status === 'archived' && ` · ${t('task.archivedSuffix')}`}
                      </div>
                    </td>
                    <td>
                      <span className="tag-code">{item.task.access_code}</span>
                    </td>
                    <td>
                      <ProgressBar value={item.progress_percent} />
                      <span className="small muted">
                        {t('admin.overview.checkpointsSummary', {
                          done: item.checkpoint_done,
                          total: item.checkpoint_total,
                        })}{' '}
                        · {item.progress_percent}%
                      </span>
                    </td>
                    <td>
                      <span className="small">
                        {t('common.totalCount', { count: item.photo_total })}
                        <br />
                        {item.photo_checking > 0 && (
                          <>
                            <span className="muted">
                              {t('status.checking')} {item.photo_checking}
                            </span>
                            <br />
                          </>
                        )}
                        <span style={{ color: 'var(--bad)' }}>
                          {t('admin.overview.rejected')} {item.photo_rejected}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="small">
                        {t('common.peopleCount', { count: item.contributors.length })}
                      </span>
                      <div className="small muted">
                        正在进行：{item.active_volunteers.join(t('common.listSeparator')) || '暂无志愿者'}
                      </div>
                    </td>
                    <td className="small muted">{relativeTime(item.last_upload_at)}</td>
                    <td>
                      <Link className="btn btn-ghost sm" to={`/admin/tasks/${item.task.id}`}>
                        {t('admin.tasks.open')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}

function Metric({
  label,
  value,
  extra,
  tone,
}: {
  label: string
  value: number | string
  extra?: string
  tone?: 'bad'
}) {
  return (
    <div className="metric">
      <div className="num" style={tone === 'bad' ? { color: 'var(--bad)' } : undefined}>
        {value}
      </div>
      <div className="label">{label}</div>
      {extra && <div className="extra">{extra}</div>}
    </div>
  )
}
