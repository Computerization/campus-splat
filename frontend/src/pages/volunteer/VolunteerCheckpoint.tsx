import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Badge, ErrorBox, ProgressBar, Spinner, formatDateTime, useAsync } from '../../components/common'
import { ShootingTips } from '../../components/ShotGuide'
import { issueLabel, useI18n } from '../../i18n'
import type { CheckpointProgress, UploadBatch, UploadResult } from '../../types'

const MAX_FILES = 20
/** How often the page asks for verdicts while a batch waits in the quality queue. */
const POLL_MS = 1500

export default function VolunteerCheckpoint() {
  const { t } = useI18n()
  const { id } = useParams()
  const checkpointId = Number(id)
  const navigate = useNavigate()

  const { data, error, loading, reload, silentRefresh } = useAsync(
    () => api.checkpointDetail(checkpointId),
    [checkpointId],
  )

  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [percent, setPercent] = useState(0)
  const [batch, setBatch] = useState<UploadBatch | null>(null)
  const [uploadError, setUploadError] = useState<unknown>(null)
  // The photos of this session's batches, keyed by id. Uploaded photos appear
  // here as "checking" and flip to their verdict while the background worker
  // (backend services/quality_jobs.py) runs.
  const [results, setResults] = useState<Record<number, UploadResult>>({})
  const [trackedIds, setTrackedIds] = useState<number[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const pendingIds = trackedIds.filter((photoId) => results[photoId]?.status === 'checking')
  const pendingKey = pendingIds.join(',')

  // Poll until every photo of the batch has a verdict. Keyed on the *set* of
  // pending ids so the timer is not rebuilt on every render.
  useEffect(() => {
    if (!pendingKey) return
    const ids = pendingKey.split(',').map(Number)
    let cancelled = false

    const timer = window.setInterval(() => {
      void (async () => {
        try {
          const fresh = await api.photoResults(ids)
          if (cancelled || fresh.length === 0) return
          setResults((current) => {
            const next = { ...current }
            for (const item of fresh) {
              if (item.photo_id !== null) next[item.photo_id] = item
            }
            return next
          })
          // The checkpoint counter moves as verdicts arrive
          await silentRefresh()
        } catch {
          /* keep polling — a dropped request is not worth an error banner */
        }
      })()
    }, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [pendingKey, silentRefresh])

  if (loading) return <Spinner />
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const cp: CheckpointProgress = batch?.checkpoint ?? data.checkpoint
  // "房间/走廊/…" is the only free-text place hint left (the old 楼栋/楼层 fields
  // are gone from the UI)
  const place = cp.room ?? ''
  const percentDone = Math.min(100, (cp.uploaded_usable / Math.max(1, cp.shot_count)) * 100)
  const trackedResults = trackedIds.map((photoId) => results[photoId]).filter(Boolean)
  const checkedCount = trackedIds.length - pendingIds.length

  async function upload() {
    if (!files.length) return
    setUploading(true)
    setUploadError(null)
    try {
      // Returns as soon as the files are on disk: the check itself runs in the
      // background, so the next batch can be picked right away
      const result = await api.uploadPhotos(checkpointId, files, setPercent)
      setBatch(result)
      setResults((current) => {
        const next = { ...current }
        for (const item of result.results) {
          if (item.photo_id !== null) next[item.photo_id] = item
        }
        return next
      })
      setTrackedIds((current) => [
        ...current,
        ...result.results
          .map((item) => item.photo_id)
          .filter((value): value is number => value !== null),
      ])
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      await silentRefresh()
    } catch (err) {
      setUploadError(err)
    } finally {
      setUploading(false)
      setPercent(0)
    }
  }

  return (
    <div className="vol-shell">
      <header className="vol-top">
        <button
          type="button"
          className="btn btn-ghost sm"
          onClick={() => navigate('/v')}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="title">
          <h1>{cp.name}</h1>
          <div className="sub">
            {place ? `${place} · ` : ''}
            {t('cp.shots', { count: cp.shot_count })}
          </div>
        </div>
        <Badge tone={cp.status === 'done' ? 'ok' : cp.status === 'in_progress' ? 'warn' : 'neutral'}>
          {t(`status.${cp.status}` as never)}
        </Badge>
      </header>

      <div className="vol-body">
        <div className="card">
          <div className="row between" style={{ marginBottom: 8 }}>
            <strong>{t('cp.uploaded', { usable: cp.uploaded_usable, count: cp.shot_count })}</strong>
            <span className={cp.remaining > 0 ? 'badge badge-warn' : 'badge badge-ok'}>
              {cp.remaining > 0 ? t('cp.remaining', { count: cp.remaining }) : t('cp.enough')}
            </span>
          </div>
          <ProgressBar value={percentDone} height={10} />
          {pendingIds.length > 0 && (
            <p className="small muted" style={{ marginBottom: 0, marginTop: 8 }}>
              ⏳ {t('cp.checkingCount', { count: pendingIds.length })}
            </p>
          )}
        </div>

        {cp.angles && cp.angles.length > 0 && (
          <div className="shot-guide">
            <h3>📸 {t('cp.how')}</h3>
            <ul className="angle-list">
              {cp.angles.map((angle, index) => (
                <li key={`${angle.label}-${index}`}>
                  <strong>{angle.label || t('cp.angle', { index: index + 1 })}</strong>
                  <span className="muted small">
                    {angle.pitch !== null && angle.pitch !== undefined && (
                      <> · {t('cp.pitch', { value: angle.pitch })}</>
                    )}
                    {angle.yaw !== null && angle.yaw !== undefined && (
                      <> · {t('cp.yaw', { value: angle.yaw })}</>
                    )}
                  </span>
                  {angle.tip && <div className="small muted">{angle.tip}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ShootingTips />

        {data.reference_url && (
          <div className="card">
            <h3>{t('cp.reference')}</h3>
            <img className="reference-img" src={data.reference_url} alt={t('cp.reference')} />
          </div>
        )}

        <div className="card">
          <h3>{t('cp.choose')}</h3>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const picked = Array.from(event.target.files ?? []).slice(0, MAX_FILES)
              setFiles(picked)
              setUploadError(null)
            }}
          />
          <p className="hint">{t('cp.maxFiles')}</p>
          {files.length > 0 && (
            <p className="small" style={{ marginBottom: 0 }}>
              {t('cp.chosen', { count: files.length })}：
              <span className="muted">
                {' '}
                {files.map((file) => file.name).join('、').slice(0, 120)}
              </span>
            </p>
          )}
          {uploadError ? <ErrorBox error={uploadError} /> : null}
        </div>

        {trackedResults.length > 0 && (
          <div className="card">
            <div className="row between" style={{ marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>{t('cp.result')}</h3>
              {pendingIds.length > 0 && (
                <span className="small muted">
                  {t('cp.qualityProgress', { done: checkedCount, total: trackedIds.length })}
                </span>
              )}
            </div>
            {pendingIds.length > 0 && (
              <ProgressBar value={(checkedCount / Math.max(1, trackedIds.length)) * 100} height={6} />
            )}
            <div className="stack" style={{ marginTop: 10 }}>
              {trackedResults.map((result, index) => (
                <ResultItem
                  key={`${result.photo_id ?? result.original_filename}-${index}`}
                  result={result}
                />
              ))}
            </div>
          </div>
        )}

        {pendingIds.length === 0 && data.my_photos.length > 0 && (
          <div className="card">
            <h3>{t('cp.mine')}</h3>
            <div className="photo-grid">
              {data.my_photos.map((photo) => (
                <div key={photo.id} className={`photo-thumb ${photo.status}`}>
                  {photo.thumb_url && (
                    <img src={photo.thumb_url} alt={photo.original_filename} loading="lazy" />
                  )}
                  <span className="tag">{t(`status.${photo.status}` as never)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="vol-bar">
        <Link className="btn btn-ghost" to="/v">
          {t('common.back')}
        </Link>
        <button
          type="button"
          className="btn btn-primary grow"
          disabled={uploading || files.length === 0}
          onClick={() => void upload()}
        >
          {uploading ? t('cp.uploading', { percent }) : t('cp.upload')}
        </button>
      </div>
    </div>
  )
}

function ResultItem({ result }: { result: UploadResult }) {
  const { t } = useI18n()

  // Uploaded, not judged yet — the background worker is on it
  if (result.status === 'checking') {
    return (
      <div className="result-item checking">
        <div className="head">
          <span className="filename">{result.original_filename}</span>
          <Badge tone="neutral">⏳ {t('status.checking')}</Badge>
        </div>
        {result.error && <div className="issue-row error">{result.error}</div>}
      </div>
    )
  }

  const tone = result.ok ? (result.status === 'warning' ? 'warn' : 'ok') : 'bad'
  const label = result.ok
    ? result.status === 'warning'
      ? t('status.warning')
      : t('status.ok')
    : t('status.rejected')

  return (
    <div className="result-item">
      <div className="head">
        <span className="filename">{result.original_filename}</span>
        <span className="row" style={{ gap: 6 }}>
          {result.score !== null && (
            <span className="muted small">{t('cp.score', { score: result.score })}</span>
          )}
          <Badge tone={tone}>{label}</Badge>
        </span>
      </div>

      {result.captured_at && (
        <span className="small muted">
          {t('cp.capturedAt', { time: formatDateTime(result.captured_at) })}
        </span>
      )}

      {result.issues.length > 0 && (
        <div className="stack" style={{ gap: 6 }}>
          {result.issues.map((issue, index) => (
            <div key={`${issue.code}-${index}`} className={`issue-row ${issue.level}`}>
              <span className="code">{issueLabel(issue.code, issue.message, t)}</span>
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {result.error && <div className="issue-row error">{result.error}</div>}

      {result.advice && (
        <div className="small" style={{ whiteSpace: 'pre-wrap', color: 'var(--muted)' }}>
          {result.advice}
        </div>
      )}
    </div>
  )
}
