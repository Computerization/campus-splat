import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ErrorBox } from '../../components/common'

export default function VolunteerJoin() {
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
    if (register && password !== confirm) { setError(new Error('两次密码不一致')); return }
    setBusy(true); setError(null)
    try { await volunteerLogin(username.trim(), password, register); navigate(destination, {replace: true}) }
    catch (err) { setError(err) } finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-card">
    <Link to="/">← 返回首页</Link>
    <h1 style={{marginTop: 20}}>{register ? '注册志愿者账号' : '志愿者登录'}</h1>
    <p className="sub">{register ? '请使用真实姓名。注册后分配永久 ID，自己不能修改姓名或 ID。' : '使用真实姓名和密码登录，进入任务大厅。'}</p>
    <form onSubmit={submit}>
      <label className="field"><span>真实姓名／用户名</span><input required maxLength={64} autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label className="field"><span>密码</span><input required maxLength={128} type="password" autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>
      {register && <label className="field"><span>确认密码</span><input required type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>}
      {error ? <ErrorBox error={error} /> : null}
      <button className="btn btn-primary block" disabled={busy}>{busy ? '处理中…' : register ? '创建账号并进入' : '登录'}</button>
    </form>
    <button className="btn btn-ghost block" style={{marginTop: 12}} disabled={busy} onClick={() => {setRegister(!register); setError(null)}}>{register ? '已有账号，去登录' : '没有账号，注册志愿者'}</button>
  </div></div>
}
