import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Badge, ErrorBox, ProgressBar, Spinner, formatDateTime, useAsync } from '../../components/common'
import { ShootingTips } from '../../components/ShotGuide'
import { issueLabel, useI18n } from '../../i18n'
import type { CheckpointProgress, UploadBatch, UploadResult } from '../../types'

const MAX_FILES = 20

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
  const inputRef = useRef<HTMLInputElement>(null)

  if (loading) return <Spinner />
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const cp: CheckpointProgress = batch?.checkpoint ?? data.checkpoint
  const place = [cp.building, cp.floor, cp.room].filter(Boolean).join(' · ')
  const percentDone = Math.min(100, (cp.uploaded_usable / Math.max(1, cp.shot_count)) * 100)

  async function upload() {
    if (!files.length) return
    setUploading(true)
    setUploadError(null)
    setBatch(null)
    try {
      const result = await api.uploadPhotos(checkpointId, files, setPercent)
      setBatch(result)
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
        </div>

        {(cp.instructions || cp.find_hint || (cp.angles && cp.angles.length > 0)) && (
          <div className="shot-guide">
            <h3>📸 {t('cp.how')}</h3>
            {cp.instructions && (
              <p style={{ whiteSpace: 'pre-wrap' }}>{cp.instructions}</p>
            )}
            {cp.find_hint && (
              <>
                <h3 style={{ fontSize: '0.9rem' }}>🧭 {t('cp.findHint')}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{cp.find_hint}</p>
              </>
            )}
            {cp.angles && cp.angles.length > 0 && (
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
            )}
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
              setBatch(null)
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

        {batch && (
          <div className="card">
            <h3>{t('cp.result')}</h3>
            <div className="stack">
              {batch.results.map((result, index) => (
                <ResultItem key={`${result.original_filename}-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}

        {!batch && data.my_photos.length > 0 && (
          <div className="card">
            <h3>{t('cp.mine')}</h3>
            <div className="photo-grid">
              {data.my_photos.map((photo) => (
                <div key={photo.id} className={`photo-thumb ${photo.status}`}>
                  {photo.thumb_url && <img src={photo.thumb_url} alt={photo.original_filename} loading="lazy" />}
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
          {uploading
            ? percent > 0 && percent < 100
              ? t('cp.uploading', { percent })
              : t('cp.checking')
            : t('cp.upload')}
        </button>
      </div>
    </div>
  )
}

function ResultItem({ result }: { result: UploadResult }) {
  const { t } = useI18n()
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
