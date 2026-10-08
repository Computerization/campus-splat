import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ErrorBox, LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'

export default function VolunteerJoin() {
  const { t } = useI18n()
  const { volunteerLogin, isVolunteer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = typeof location.state?.from === 'string' && location.state.from.startsWith('/v/') ? location.state.from : '/v'
  const [register, setRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (isVolunteer) navigate(destination, {replace: true}) }, [isVolunteer, navigate, destination])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (register && password !== confirm) { setError(new Error(t('volunteer.join.mismatch'))); return }
    setBusy(true); setError(null)
    try { await volunteerLogin(username.trim(), password, register); navigate(destination, {replace: true}) }
    catch (err) { setError(err) } finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-card">
    <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
      <Link to="/">{t('common.backHome')}</Link>
      <LanguageSwitcher compact />
    </div>
    <h1 style={{marginTop: 20}}>{register ? t('volunteer.join.registerTitle') : t('volunteer.join.loginTitle')}</h1>
    <p className="sub">{register ? t('volunteer.join.registerSub') : t('volunteer.join.loginSub')}</p>
    <form onSubmit={submit}>
      <label className="field"><span>{t('volunteer.join.username')}</span><input required type="text" maxLength={64} autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label className="field"><span>{t('volunteer.join.password')}</span><input required type="password" maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>
      {register && <label className="field"><span>{t('volunteer.join.confirm')}</span><input required type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>}
      {error ? <ErrorBox error={error} /> : null}
      <button className="btn btn-primary block" disabled={busy}>{busy ? t('common.processing') : register ? t('volunteer.join.registerSubmit') : t('volunteer.join.loginSubmit')}</button>
    </form>
    <button className="btn btn-ghost block" style={{marginTop: 12}} disabled={busy} onClick={() => {setRegister(!register); setError(null)}}>{register ? t('volunteer.join.toLogin') : t('volunteer.join.toRegister')}</button>
  </div></div>
}
