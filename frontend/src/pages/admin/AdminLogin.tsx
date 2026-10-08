import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ErrorBox, LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'

// The three fixed administrators. Which one you are decides what you may do:
// 001 runs training and may judge every checkpoint, 002/003 only their own tasks.
const ADMIN_IDS = [1, 2, 3]

export default function AdminLogin() {
  const { t } = useI18n()
  const { adminLogin, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [adminId, setAdminId] = useState(ADMIN_IDS[0])
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
      await adminLogin(password, adminId)
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
        <p className="sub">{t('admin.login.pick')}</p>

        <form onSubmit={submit}>
          <label className="field">
            <span>{t('admin.login.adminId')}</span>
            <select
              value={adminId}
              onChange={(event) => setAdminId(Number(event.target.value))}
              autoFocus
            >
              {ADMIN_IDS.map((id) => (
                <option key={id} value={id}>
                  {`00${id}`}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('admin.login.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? <ErrorBox error={error} /> : null}

          <button type="submit" className="btn btn-primary btn-lg block" disabled={busy || !password}>
            {busy ? t('common.loading') : t('admin.login.submit')}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 12 }}>{t('admin.login.forgot')}</p>
      </div>
    </div>
  )
}
