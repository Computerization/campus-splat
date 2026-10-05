import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import {
  Badge,
  EmptyState,
  ErrorBox,
  LanguageToggle,
  ProgressBar,
  Spinner,
  useAsync,
} from '../../components/common'
import { useI18n } from '../../i18n'
import type { CheckpointProgress } from '../../types'

function checkpointPlace(cp: CheckpointProgress): string {
  return [cp.building, cp.floor, cp.room].filter(Boolean).join(' · ')
}

export default function VolunteerBoard() {
  const { t } = useI18n()
  const { logout } = useAuth()
  const { data, error, loading, reload } = useAsync(() => api.board(), [])

  if (loading) return <Spinner />
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const done = data.checkpoints.filter((cp) => cp.status === 'done').length
  const inProgress = data.checkpoints.filter((cp) => cp.status === 'in_progress').length
  const pending = data.checkpoints.length - done - inProgress
  const percent = data.checkpoints.length ? (done / data.checkpoints.length) * 100 : 0

  return (
    <div className="vol-shell">
      <header className="vol-top">
        <div className="title">
          <h1>{data.task.name}</h1>
          <div className="sub">
            {t('board.hello', { name: data.nickname ?? '' })} ·{' '}
            {t('board.usableTotal', {
              count: data.checkpoints.reduce((sum, cp) => sum + cp.uploaded_usable, 0),
            })}
          </div>
        </div>
        <Link className="btn btn-ghost sm" to="/v/mine">
          {t('board.mineLink')}
        </Link>
        <LanguageToggle />
        <button type="button" className="btn btn-ghost sm" onClick={() => void logout()}>
          {t('common.logout')}
        </button>
      </header>

      <div className="vol-body">
        <div className="card">
          <div className="row between" style={{ marginBottom: 10 }}>
            <strong>{t('board.progress')}</strong>
            <span className="muted small">
              {t('board.summary', { total: data.checkpoints.length, done })}
            </span>
          </div>
          <ProgressBar value={percent} height={10} />
          <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
            {t('board.mine', { total: data.my_photo_count, ok: data.my_ok_count })}
          </p>
        </div>

        <div className="stat-grid">
          <div className="stat">
            <span className="num" style={{ color: 'var(--ok)' }}>
              {done}
            </span>
            <span className="label">{t('status.done')}</span>
          </div>
          <div className="stat">
            <span className="num" style={{ color: 'var(--warn)' }}>
              {inProgress}
            </span>
            <span className="label">{t('status.in_progress')}</span>
          </div>
          <div className="stat">
            <span className="num">{pending}</span>
            <span className="label">{t('status.pending')}</span>
          </div>
        </div>

        {data.checkpoints.length === 0 ? (
          <EmptyState text={t('board.empty')} />
        ) : (
          <>
            {done === data.checkpoints.length && data.checkpoints.length > 0 && (
              <div className="card" style={{ background: 'var(--ok-soft)', borderColor: 'var(--ok)' }}>
                🎉 {t('board.allDone')}
              </div>
            )}
            <p className="small muted" style={{ margin: 0 }}>
              {t('board.directive')}
            </p>
            <div className="cp-list">
              {data.checkpoints.map((cp) => (
                <CheckpointRow key={cp.id} cp={cp} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CheckpointRow({ cp }: { cp: CheckpointProgress }) {
  const { t } = useI18n()
  const tone = cp.status === 'done' ? 'ok' : cp.status === 'in_progress' ? 'warn' : 'info'
  const percent = Math.min(100, (cp.uploaded_usable / Math.max(1, cp.shot_count)) * 100)
  const place = checkpointPlace(cp)

  return (
    <Link className={`cp-item is-${cp.status === 'in_progress' ? 'progress' : cp.status}`} to={`/v/cp/${cp.id}`}>
      <span className="index">{cp.order_index + 1}</span>
      <div className="main">
        <span className="name">{cp.name}</span>
        <span className="meta">
          {place && <>{place} · </>}
          {t('cp.uploaded', { usable: cp.uploaded_usable, count: cp.shot_count })}
          {cp.uploaded_rejected > 0 && (
            <>
              {' · '}
              <span style={{ color: 'var(--bad)' }}>
                {t('board.rejectedInline', { count: cp.uploaded_rejected })}
              </span>
            </>
          )}
        </span>
        <ProgressBar value={percent} tone={cp.status === 'done' ? 'ok' : 'warn'} height={6} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <Badge tone={tone}>{t(`status.${cp.status}` as never)}</Badge>
        <span className="small muted">
          {cp.status === 'done' ? t('board.done') : cp.uploaded_total > 0 ? t('board.redo') : t('board.goto')}
        </span>
      </div>
    </Link>
  )
}
