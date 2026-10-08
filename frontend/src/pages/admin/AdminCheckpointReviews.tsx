import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, ErrorBox, Spinner, useAsync, usePolling } from '../../components/common'
import { api } from '../../api'
import { useI18n } from '../../i18n'
import type {
  CheckpointReviewDetail,
  CheckpointReviewItem,
  CheckpointReviewStatus,
  SolveLevel,
  SolveReport,
  SolveSummary,
} from '../../types'

const TABS: CheckpointReviewStatus[] = ['submitted', 'approved', 'returned']

const LEVEL_TONE: Record<SolveLevel, 'ok' | 'warn' | 'bad'> = {
  good: 'ok',
  warn: 'warn',
  bad: 'bad',
}

const VERDICT_TONE: Record<string, 'ok' | 'warn' | 'bad'> = {
  ok: 'ok',
  risky: 'warn',
  failed: 'bad',
}

function statusTone(status: CheckpointReviewStatus): 'ok' | 'warn' | 'bad' | 'neutral' {
  if (status === 'approved') return 'ok'
  if (status === 'returned') return 'bad'
  if (status === 'submitted') return 'warn'
  return 'neutral'
}

function percent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `${Math.round(value * 1000) / 10}%`
}

/** 试解算面板：能不能重建、能打几分、哪里要补拍。 */
function SolvePanel({
  detail,
  summary,
  report,
  onStarted,
}: {
  detail: CheckpointReviewDetail
  summary: SolveSummary | null
  report: SolveReport | null
  onStarted: () => void
}) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAdvice, setShowAdvice] = useState(false)

  const status = summary?.status ?? 'none'
  const running = status === 'queued' || status === 'running'
  const tooFewPhotos = detail.usable_photos < 12

  async function start() {
    if (!window.confirm(t('admin.solve.confirm'))) return
    setBusy(true)
    setError(null)
    try {
      await api.solveCheckpoint(detail.checkpoint_id)
      setShowAdvice(true)
      onStarted()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>{t('admin.solve.title')}</h3>
          <p className="sub" style={{ marginTop: 0 }}>{t('admin.solve.sub')}</p>
        </div>
        <div className="row">
          {running ? (
            <Badge tone="warn">
              {status === 'queued' ? t('admin.solve.status.queued') : t('admin.solve.status.running')}
            </Badge>
          ) : null}
          <button
            className="btn btn-primary"
            disabled={busy || running || tooFewPhotos || !detail.can_operate}
            onClick={() => void start()}
          >
            {summary && status === 'done' ? t('admin.solve.rerun') : t('admin.solve.run')}
          </button>
        </div>
      </div>

      {error ? <ErrorBox error={error} /> : null}
      {tooFewPhotos ? (
        <p className="hint">{t('admin.solve.needPhotos', { count: 12 })}</p>
      ) : null}

      {!summary ? (
        <p className="hint">{t('admin.solve.status.none')}</p>
      ) : (
        <>
          {summary.status === 'failed' ? (
            <p className="workflow-note">
              <strong>{t('admin.solve.status.failed')}</strong>
              {summary.error ? `：${summary.error}` : ''}
            </p>
          ) : null}

          {report ? (
            <>
              {report.mock ? (
                <p className="workflow-note">
                  <Badge tone="warn">{t('admin.review.mockBadge')}</Badge> {t('admin.solve.mock')}
                </p>
              ) : null}

              <div className="row" style={{ alignItems: 'center', gap: 16, marginTop: 12 }}>
                <div>
                  <div className="small muted">{t('admin.solve.score')}</div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>
                    {report.score}
                    <span className="small muted"> / 100</span>
                  </div>
                </div>
                <Badge tone={VERDICT_TONE[report.verdict] ?? 'neutral'}>
                  {t(`admin.solve.verdict.${report.verdict}` as never)}
                </Badge>
                <span className="small muted">{t('admin.solve.elapsed', { value: report.elapsed_s })}</span>
              </div>

              {/* 每项指标 + 好坏程度 */}
              <div className="table-wrap" style={{ marginTop: 12 }}>
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.solve.checks.registered')}</th>
                      <th>{t('admin.solve.checks.connectivity')}</th>
                      <th>{t('admin.solve.checks.reprojection')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {t('admin.solve.registered', {
                          registered: report.registered,
                          images: report.images,
                          ratio: percent(report.registered_ratio),
                        })}
                      </td>
                      <td>{t('admin.solve.components', { count: report.components.length })}</td>
                      <td>{t('admin.solve.meanError', { value: report.mean_error_px })}</td>
                    </tr>
                    <tr>
                      {report.checks.map((check) => (
                        <td key={check.key}>
                          <Badge tone={LEVEL_TONE[check.level]}>
                            {t(`admin.solve.level.${check.level}` as never)}
                          </Badge>{' '}
                          <span className="small muted">
                            {t('admin.solve.checksPoints', {
                              points: check.points,
                              max: check.max_points,
                            })}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn-ghost" onClick={() => setShowAdvice((value) => !value)}>
                  {t('admin.solve.suggestions')}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowDetails((value) => !value)}>
                  {showDetails ? t('admin.solve.hideDetails') : t('admin.solve.details')}
                </button>
              </div>

              {showAdvice ? (
                <div style={{ marginTop: 10 }}>
                  {report.suggestions.length === 0 ? (
                    <p className="small muted">{t('admin.solve.noSuggestions')}</p>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {report.suggestions.map((item, index) => (
                        <li key={index} style={{ marginBottom: 6 }}>
                          <Badge tone={LEVEL_TONE[item.level]}>
                            {t(`admin.solve.level.${item.level}` as never)}
                          </Badge>{' '}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}

              {showDetails ? (
                <div style={{ marginTop: 10 }}>
                  <p className="small muted">{t('admin.solve.points', { count: report.points3d })}</p>
                  {report.components.length > 1 ? (
                    <ul className="small">
                      {report.components.map((component) => (
                        <li key={component.model}>
                          {t('admin.solve.component', {
                            model: component.model,
                            images: component.images,
                            points: component.points3d,
                            error: component.mean_error_px,
                          })}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {report.worst_images.length ? (
                    <>
                      <div className="small muted">{t('admin.solve.worst')}</div>
                      <ul className="small">
                        {report.worst_images.slice(0, 5).map((item) => (
                          <li key={item.name}>
                            {item.name} · {item.error} px
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {report.unregistered_images.length ? (
                    <>
                      <div className="small muted">
                        {t('admin.solve.unregistered', { count: report.unregistered_images.length })}
                      </div>
                      <p className="small">{report.unregistered_images.join('、')}</p>
                    </>
                  ) : null}
                  {report.skipped_images.length ? (
                    <p className="small muted">
                      {t('admin.solve.skipped', { count: report.skipped_images.length })}:{' '}
                      {report.skipped_images.join('、')}
                    </p>
                  ) : null}
                  <details>
                    <summary className="small muted">{t('admin.solve.log')}</summary>
                    <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>
                      {report.log_tail.join('\n')}
                    </pre>
                  </details>
                </div>
              ) : null}
            </>
          ) : null}
        </>
      )}
    </Card>
  )
}

export default function AdminCheckpointReviews() {
  const { t } = useI18n()
  const [tab, setTab] = useState<CheckpointReviewStatus>('submitted')
  const { data, error, loading, reload, silentRefresh } = useAsync(
    () => api.checkpointReviews(tab),
    [tab],
  )
  const [detail, setDetail] = useState<CheckpointReviewDetail | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)

  usePolling(silentRefresh, 5000)

  const refreshDetail = useCallback(
    async (id: number) => {
      try {
        setDetail(await api.checkpointReview(id))
      } catch (err) {
        setActionError(err)
      }
    },
    [],
  )

  // 试解算进行中时盯紧一点，跑完就能看到结果
  const solving = detail?.solve?.status === 'queued' || detail?.solve?.status === 'running'
  usePolling(
    () => {
      if (detail) void refreshDetail(detail.checkpoint_id)
    },
    3000,
    Boolean(detail) && solving,
  )

  async function open(item: CheckpointReviewItem) {
    setBusy(true)
    setActionError(null)
    try {
      setDetail(await api.checkpointReview(item.checkpoint_id))
      setNote(item.review_note ?? '')
    } catch (err) {
      setActionError(err)
    } finally {
      setBusy(false)
    }
  }

  async function decide(decision: 'approve' | 'return') {
    if (!detail) return
    if (decision === 'return' && !note.trim()) {
      setActionError(new Error(t('admin.review.returnNeedsNote')))
      return
    }
    const question = decision === 'approve' ? t('admin.review.approveConfirm') : t('admin.review.returnConfirm')
    if (!window.confirm(question)) return
    setBusy(true)
    setActionError(null)
    try {
      await api.reviewCheckpoint(detail.checkpoint_id, decision, note.trim())
      // 直接跳到下一个待审的点位，省得来回点
      const next = detail.pending_siblings[0]
      if (next) await open({ checkpoint_id: next } as CheckpointReviewItem)
      else setDetail(null)
      await reload(true)
    } catch (err) {
      setActionError(err)
      await refreshDetail(detail.checkpoint_id)
    } finally {
      setBusy(false)
    }
  }

  if (loading && !data) return <Spinner />

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.review.title')}</h1>
          <p className="sub">{t('admin.review.sub')}</p>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 20 }}>
        {TABS.map((key) => (
          <button
            key={key}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab(key)}
          >
            {t(`admin.review.tab.${key}` as never)}（{data?.counts?.[key] ?? 0}）
          </button>
        ))}
      </div>

      {error || actionError ? <ErrorBox error={actionError || error} /> : null}

      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('admin.review.col.task')}</th>
                <th>{t('admin.review.col.checkpoint')}</th>
                <th>{t('admin.review.col.volunteer')}</th>
                <th>{t('admin.review.col.photos')}</th>
                <th>{t('admin.review.col.solve')}</th>
                <th>{t('admin.review.col.submitted')}</th>
                <th>{t('admin.review.col.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((item) => (
                <tr key={item.checkpoint_id}>
                  <td>
                    <Link to={`/admin/tasks/${item.task_id}`}>{item.task_name}</Link>
                  </td>
                  <td>
                    {item.name}
                    {item.room ? <span className="small muted"> · {item.room}</span> : null}
                  </td>
                  <td>{item.volunteer ?? '-'}</td>
                  <td>
                    {t('admin.review.photos', {
                      usable: item.usable_photos,
                      required: item.required,
                    })}
                  </td>
                  <td>
                    {item.solve ? (
                      <Badge tone={VERDICT_TONE[item.solve.verdict ?? ''] ?? 'neutral'}>
                        {item.solve.status === 'done'
                          ? t('admin.solve.scoreShort', { score: item.solve.score ?? '-' })
                          : t(`admin.solve.status.${item.solve.status}` as never)}
                      </Badge>
                    ) : (
                      <span className="small muted">{t('admin.solve.status.none')}</span>
                    )}
                  </td>
                  <td className="small">
                    {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : '-'}
                  </td>
                  <td>
                    <button className="btn btn-ghost sm" disabled={busy} onClick={() => void open(item)}>
                      {t('admin.review.open')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data?.items?.length ? <p>{t('admin.review.empty')}</p> : null}
      </Card>

      {detail ? (
        <>
          <Card>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2>
                {detail.name}
                {detail.room ? <span className="small muted"> · {detail.room}</span> : null}
              </h2>
              <div className="row">
                <Badge tone={statusTone(detail.review_status)}>
                  {t(`admin.review.tab.${detail.review_status === 'pending' ? 'submitted' : detail.review_status}` as never)}
                </Badge>
                <button className="btn btn-ghost" onClick={() => setDetail(null)}>
                  {t('common.close')}
                </button>
              </div>
            </div>
            <p className="sub">
              <Link to={`/admin/tasks/${detail.task_id}`}>{detail.task_name}</Link>
              {' · '}
              {detail.volunteer ?? '-'}
              {' · '}
              {t('admin.review.photos', { usable: detail.usable_photos, required: detail.required })}
              {detail.attempt > 1 ? ` · ${t('volunteer.board.attempt', { count: detail.attempt })}` : ''}
            </p>
            {!detail.can_operate ? (
              <p className="workflow-note">{t('admin.review.readonly')}</p>
            ) : null}
            {detail.review_note ? (
              <p className="workflow-note">{t('admin.review.note')}：{detail.review_note}</p>
            ) : null}

            {detail.shots_note ? (
              <p className="small muted">{detail.shots_note}</p>
            ) : null}
            {detail.find_hint ? <p className="small muted">{detail.find_hint}</p> : null}

            <div className="workflow-photos">
              {detail.photos.map((photo) => (
                <div className="workflow-photo" key={photo.id}>
                  <a href={photo.preview_url || '#'} target="_blank" rel="noreferrer">
                    <img src={photo.thumb_url || ''} alt={photo.original_filename} />
                  </a>
                  <span className="small">{photo.original_filename}</span>
                  <Badge tone={statusTone('submitted')}>{t(`status.${photo.status}` as never)}</Badge>
                  <span className="small muted">
                    {t('admin.review.photoScore', { score: photo.quality?.score ?? '-' })}
                  </span>
                  <span className="small muted">{photo.quality?.advice}</span>
                  <a className="small" href={photo.file_url || '#'} target="_blank" rel="noreferrer">
                    {t('admin.review.download')}
                  </a>
                </div>
              ))}
            </div>
          </Card>

          <SolvePanel
            detail={detail}
            summary={detail.solve}
            report={detail.report}
            onStarted={() => void refreshDetail(detail.checkpoint_id)}
          />

          {detail.review_status === 'submitted' ? (
            <Card>
              <label className="field">
                <span>{t('admin.review.note')}</span>
                <textarea
                  maxLength={2000}
                  placeholder={t('admin.review.notePlaceholder')}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  disabled={!detail.can_operate}
                />
              </label>
              <div className="row">
                <button
                  className="btn btn-primary"
                  disabled={busy || !detail.can_operate}
                  onClick={() => void decide('approve')}
                >
                  {t('admin.review.approve')}
                </button>
                <button
                  className="btn btn-danger"
                  disabled={busy || !detail.can_operate}
                  onClick={() => void decide('return')}
                >
                  {t('admin.review.return')}
                </button>
                {detail.pending_siblings.length ? (
                  <span className="small muted">
                    {t('admin.review.nextPending', { count: detail.pending_siblings.length })}
                  </span>
                ) : null}
              </div>
            </Card>
          ) : null}
        </>
      ) : null}
    </>
  )
}
