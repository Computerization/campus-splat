import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { api } from '../../api'
import { Card, ErrorBox } from '../../components/common'
import { useI18n } from '../../i18n'

export default function VolunteerMine() {
  const { t } = useI18n()
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function change(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage('')
    if (password !== confirm) {
      setError(new Error(t('admin.system.pw.mismatch')))
      return
    }
    setBusy(true)
    try {
      await api.changeMyPassword(current, password)
      setMessage(t('admin.system.pw.saved'))
      setCurrent('')
      setPassword('')
      setConfirm('')
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  async function archive() {
    if (!window.confirm(t('volunteer.mine.archiveConfirm'))) return
    setBusy(true)
    setError(null)
    try {
      await api.closeMyAccount()
      await logout()
      navigate('/join')
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="workflow-page narrow">
      <Link to="/v">{t('volunteer.board.title')}</Link>
      <h1 style={{ marginTop: 20 }}>{t('volunteer.mine.title')}</h1>
      <p className="sub">{t('volunteer.mine.sub')}</p>

      <Card>
        <h2>{session?.nickname}</h2>
        <p>
          {t('volunteer.mine.id')}：<strong>{session?.volunteer_id}</strong>
        </p>
      </Card>

      <Card>
        <h2>{t('volunteer.mine.passwordTitle')}</h2>
        <form onSubmit={change}>
          <label className="field">
            <span>{t('admin.system.pw.current')}</span>
            <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </label>
          <label className="field">
            <span>{t('volunteer.join.password')}</span>
            <input type="password" required maxLength={128} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="field">
            <span>{t('volunteer.join.confirm')}</span>
            <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          <button className="btn btn-primary" disabled={busy}>{t('common.save')}</button>
        </form>
      </Card>

      {error ? <ErrorBox error={error} /> : null}
      {message && <p role="status">{message}</p>}

      <Card>
        <h2>{t('volunteer.mine.archive')}</h2>
        <p className="small muted">{t('volunteer.mine.archiveConfirm')}</p>
        <button className="btn btn-danger" disabled={busy} onClick={() => void archive()}>
          {t('volunteer.mine.archive')}
        </button>
      </Card>
    </div>
  )
}
