import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { Card, ErrorBox } from '../../components/common'
import { workflow } from '../../workflow'

export default function VolunteerMine() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function change(event: FormEvent) {
    event.preventDefault(); setError(null); setMessage('')
    if (password !== confirm) {setError(new Error('两次新密码不一致')); return}
    setBusy(true)
    try {await workflow.password(current, password); setMessage('密码已更新，其他设备需要重新登录。'); setCurrent(''); setPassword(''); setConfirm('')}
    catch (err) {setError(err)} finally {setBusy(false)}
  }
  async function archive() {
    if (!window.confirm('确认注销账号？旧 ID 和历史信息将永久封存，用户名释放；重新注册会获得新 ID。')) return
    setBusy(true); setError(null)
    try {await workflow.archiveSelf(); await logout(); navigate('/join')}
    catch (err) {setError(err)} finally {setBusy(false)}
  }
  return <div className="workflow-page narrow"><Link to="/v">← 返回任务大厅</Link><h1 style={{marginTop:20}}>账号设置</h1>
    <Card><h2>{session?.nickname}</h2><p>ID：<strong>{session?.volunteer_id}</strong></p><p className="small muted">用户名和 ID 由账号绑定，志愿者不能修改。</p></Card>
    <Card><h2>修改密码</h2><form onSubmit={change}>
      <label className="field"><span>当前密码</span><input type="password" required autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} /></label>
      <label className="field"><span>新密码</span><input type="password" required maxLength={128} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <label className="field"><span>确认新密码</span><input type="password" required autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
      <button className="btn btn-primary" disabled={busy}>保存密码</button>
    </form></Card>
    {error ? <ErrorBox error={error} /> : null}{message && <p role="status">{message}</p>}
    <Card><h2>注销志愿者账号</h2><p>注销后不能登录。ID 和历史信息保留，用户名可以重新注册；旧 ID 永不复用。</p><button className="btn btn-danger" disabled={busy} onClick={() => void archive()}>注销账号</button></Card>
  </div>
}
