import { useState, type FormEvent } from 'react'
import { Card, ErrorBox } from '../../components/common'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { useI18n } from '../../i18n'

/**
 * 管理员改自己的密码。
 *
 * Each of the three fixed administrators changes their own password here; nobody
 * can change somebody else's. If it is forgotten, the way back is
 * `backend/scripts/reset_admin_password.py` on the server.
 */
export default function AdminPasswordCard() {
  const { t } = useI18n()
  const { session } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage('')
    if (next !== confirm) {
      setError(new Error(t('admin.system.pw.mismatch')))
      return
    }
    if (next.length < 8) {
      setError(new Error(t('admin.system.pw.tooShort')))
      return
    }
    setBusy(true)
    try {
      await api.changeAdminPassword(current, next)
      setMessage(t('admin.system.pw.saved'))
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <h3>{t('admin.system.pw.title')}</h3>
      <p className="small muted">{t('admin.system.pw.sub')}</p>
      <p className="small">
        {t('admin.system.pw.admin')}：{session?.nickname ?? '—'}
        {session?.admin_id ? `（${String(session.admin_id).padStart(3, '0')}）` : ''}
      </p>
      <form onSubmit={submit}>
        <label className="field">
          <span>{t('admin.system.pw.current')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </label>
        <label className="field">
          <span>{t('admin.system.pw.next')}</span>
          <input
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
          />
        </label>
        <label className="field">
          <span>{t('admin.system.pw.confirm')}</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </label>
        <button className="btn btn-primary" disabled={busy || !current || !next}>
          {t('common.save')}
        </button>
      </form>
      {error ? <ErrorBox error={error} /> : null}
      {message ? <p role="status">{message}</p> : null}
    </Card>
  )
}
