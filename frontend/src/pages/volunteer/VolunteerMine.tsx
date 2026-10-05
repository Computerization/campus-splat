import { Link } from 'react-router-dom'
import { api } from '../../api'
import { EmptyState, ErrorBox, LanguageToggle, Spinner, formatDateTime, useAsync } from '../../components/common'
import { issueLabel, useI18n } from '../../i18n'

export default function VolunteerMine() {
  const { t } = useI18n()
  const { data, error, loading, reload } = useAsync(() => api.myPhotos(), [])

  if (loading) return <Spinner />
  if (error) return <ErrorBox error={error} onRetry={reload} />

  const photos = data ?? []
  const usable = photos.filter((photo) => photo.status !== 'rejected').length
  const rejected = photos.length - usable

  return (
    <div className="vol-shell">
      <header className="vol-top">
        <div className="title">
          <h1>{t('board.mineLink')}</h1>
          <div className="sub">
            {t('board.mine', { total: photos.length, ok: usable })}
            {rejected > 0 && ` · ${t('mine.needRetake', { count: rejected })}`}
          </div>
        </div>
        <LanguageToggle />
        <Link className="btn btn-ghost sm" to="/v">
          {t('common.back')}
        </Link>
      </header>

      <div className="vol-body">
        {photos.length === 0 ? (
          <EmptyState text={t('cp.noPhotos')} />
        ) : (
          <div className="card">
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.id} className={`photo-thumb ${photo.status}`}>
                  {photo.thumb_url && <img src={photo.thumb_url} alt={photo.original_filename} loading="lazy" />}
                  <span className="tag">
                    {photo.quality ? photo.quality.score : t(`status.${photo.status}` as never)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rejected > 0 && (
          <div className="card">
            <h3>{t('mine.retakeReasons')}</h3>
            <div className="stack" style={{ gap: 8 }}>
              {photos
                .filter((photo) => photo.status === 'rejected')
                .slice(0, 10)
                .map((photo) => (
                  <div key={photo.id} className="issue-row error" style={{ flexDirection: 'column', gap: 2 }}>
                    <span className="code">{photo.original_filename}</span>
                    <span>
                      {(photo.quality?.issues ?? [])
                        .filter((issue) => issue.level !== 'info')
                        .map((issue) => issueLabel(issue.code, issue.message, t))
                        .join(t('common.listSeparator'))}
                    </span>
                    <span className="small muted">{formatDateTime(photo.uploaded_at)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
