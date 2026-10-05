import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ErrorBox, LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'

export default function AdminLogin() {
  const { t } = useI18n()
  const { adminLogin, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await adminLogin(password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 6 }}>
          <LanguageSwitcher compact />
        </div>

        <h1>{t('admin.login.title')}</h1>
        <p className="sub">{t('admin.login.subtitle')}</p>

        <form onSubmit={submit}>
          <label className="field">
            <span>{t('admin.login.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </label>

          {error ? <ErrorBox error={error} /> : null}

          <button type="submit" className="btn btn-primary btn-lg block" disabled={busy || !password}>
            {busy ? t('common.loading') : t('admin.login.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
