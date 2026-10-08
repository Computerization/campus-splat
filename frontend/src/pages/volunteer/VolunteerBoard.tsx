import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { api } from '../../api'
import { Badge, Card, ErrorBox, Spinner, useAsync, usePolling } from '../../components/common'
import { useI18n } from '../../i18n'
import type { CheckpointCard } from '../../types'

function Progress({ card }: { card: CheckpointCard }) {
  const { t } = useI18n()
  return (
    <p className="small muted">
      {t('volunteer.board.required', { count: card.checkpoint.shot_count })} ·{' '}
      {t('volunteer.board.minePhotos', { count: card.my_usable_count })}
    </p>
  )
}

export default function VolunteerBoard() {
  const { t } = useI18n()
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { data, error, loading, reload, silentRefresh } = useAsync(api.board, [])
  usePolling(silentRefresh, 3000, true)
  const [busy, setBusy] = useState<number | null>(null)
  const [actionError, setActionError] = useState<unknown>(null)
  const [message, setMessage] = useState('')

  async function run(id: number, action: () => Promise<unknown>, note?: string) {
    setBusy(id)
    setActionError(null)
    setMessage('')
    try {
      await action()
      if (note) setMessage(note)
      await reload(true)
    } catch (err) {
      setActionError(err)
    } finally {
      setBusy(null)
    }
  }

  async function claim(card: CheckpointCard) {
    await run(card.checkpoint.id, () => api.claimCheckpoint(card.checkpoint.id))
    if (!actionError) navigate(`/v/checkpoints/${card.checkpoint.id}`)
  }

  async function release(card: CheckpointCard) {
    if (!window.confirm(t('volunteer.board.releaseConfirm'))) return
    await run(card.checkpoint.id, () => api.releaseCheckpoint(card.checkpoint.id))
  }

  async function submit(card: CheckpointCard) {
    if (!window.confirm(t('volunteer.board.submitConfirm'))) return
    await run(card.checkpoint.id, () => api.submitCheckpoint(card.checkpoint.id), t('volunteer.board.submitted'))
  }

  if (loading && !data) return <Spinner />

  const held = data?.held ?? []
  const available = data?.available ?? []
  const reviewing = data?.reviewing ?? []
  const approved = data?.approved ?? []

  return (
    <div className="workflow-page">
      <header className="page-head">
        <div>
          <h1>{t('volunteer.board.title')}</h1>
          <div className="sub">{session?.nickname} · ID {session?.volunteer_id}</div>
        </div>
        <div className="row">
          <Link className="btn btn-ghost" to="/v/mine">{t('volunteer.mine.title')}</Link>
          <button className="btn btn-ghost" onClick={async () => { await logout(); navigate('/join') }}>
            {t('common.logout')}
          </button>
        </div>
      </header>

      <Card>
        <p className="small muted">{t('volunteer.board.sub')}</p>
        {data?.busy ? <p className="workflow-note">{t('volunteer.board.busyHint')}</p> : null}
      </Card>

      {error || actionError ? <ErrorBox error={actionError || error} /> : null}
      {message ? <p role="status">{message}</p> : null}

      {held.length ? (
        <>
          <h2>{t('volunteer.board.held')}</h2>
          <div className="workflow-grid">
            {held.map((card) => (
              <Card key={card.checkpoint.id}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="small muted">{card.task_name}</span>
                  {card.review_status === 'returned' ? (
                    <Badge tone="bad">{t('volunteer.board.returned')}</Badge>
                  ) : (
                    <Badge tone="warn">{t('volunteer.board.continue')}</Badge>
                  )}
                </div>
                <h2 style={{ marginTop: 10 }}>{card.checkpoint.name}</h2>
                <Progress card={card} />
                {card.review_note ? (
                  <p className="workflow-note">{t('admin.review.note')}：{card.review_note}</p>
                ) : null}
                <div className="row">
                  <Link className="btn btn-primary" to={`/v/checkpoints/${card.checkpoint.id}`}>
                    {t('volunteer.board.continue')}
                  </Link>
                  <button
                    className="btn btn-ghost"
                    disabled={busy !== null}
                    onClick={() => void submit(card)}
                  >
                    {t('volunteer.board.submit')}
                  </button>
                  <button
                    className="btn btn-ghost"
                    disabled={busy !== null}
                    onClick={() => void release(card)}
                  >
                    {t('volunteer.board.release')}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      <h2>{t('volunteer.board.available')}</h2>
      {available.length ? (
        <div className="workflow-grid">
          {available.map((card) => (
            <Card key={card.checkpoint.id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="small muted">{card.task_name}</span>
                {card.claimed_by_someone_else ? (
                  <Badge tone="neutral">{t('volunteer.board.byOther')}</Badge>
                ) : (
                  <Badge tone="ok">{card.checkpoint.name}</Badge>
                )}
              </div>
              <h2 style={{ marginTop: 10 }}>{card.checkpoint.name}</h2>
              <p className="small muted">
                {t('volunteer.board.required', { count: card.checkpoint.shot_count })}
              </p>
              <div className="row">
                <button
                  className="btn btn-primary"
                  disabled={busy !== null || card.claimed_by_someone_else || data?.busy}
                  onClick={() => void claim(card)}
                >
                  {t('volunteer.board.claim')}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p>{t('volunteer.board.empty')}</p>
        </Card>
      )}

      {reviewing.length ? (
        <>
          <h2>{t('volunteer.board.reviewing')}</h2>
          <div className="workflow-grid">
            {reviewing.map((card) => (
              <Card key={card.checkpoint.id}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="small muted">{card.task_name}</span>
                  <Badge tone="warn">{t('volunteer.board.submitted')}</Badge>
                </div>
                <h2 style={{ marginTop: 10 }}>{card.checkpoint.name}</h2>
                <Progress card={card} />
                {card.attempt > 1 ? (
                  <p className="small muted">{t('volunteer.board.attempt', { count: card.attempt })}</p>
                ) : null}
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {approved.length ? (
        <>
          <h2>{t('volunteer.board.approved')}</h2>
          <div className="workflow-grid">
            {approved.map((card) => (
              <Card key={card.checkpoint.id}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="small muted">{card.task_name}</span>
                  <Badge tone="ok">{t('admin.review.tab.approved')}</Badge>
                </div>
                <h2 style={{ marginTop: 10 }}>{card.checkpoint.name}</h2>
                <Progress card={card} />
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
