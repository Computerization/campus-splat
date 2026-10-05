import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { LanguageSwitcher } from '../components/common'
import { useI18n } from '../i18n'

export default function Landing() {
  const { t } = useI18n()
  const { session, isAdmin } = useAuth()

  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
          <LanguageSwitcher />
        </div>

        <h1>{t('landing.title')}</h1>
        <p className="lead">{t('landing.subtitle')}</p>

        <div className="entry-grid">
          <Link className="entry" to={session?.task_id || isAdmin ? '/v' : '/join'}>
            <span className="icon">📱</span>
            <strong>{t('landing.volunteer')}</strong>
            <span className="desc">{t('landing.volunteer.desc')}</span>
          </Link>
          <Link className="entry" to={isAdmin ? '/admin' : '/admin/login'}>
            <span className="icon">🖥️</span>
            <strong>{t('landing.admin')}</strong>
            <span className="desc">{t('landing.admin.desc')}</span>
          </Link>
        </div>

        {session && (
          <p className="landing-foot">
            {t('landing.signedIn', {
              name: session.nickname ?? (session.role === 'admin' ? t('common.admin') : '').trim(),
            })}
            {session.task_name ? ` · ${session.task_name}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
