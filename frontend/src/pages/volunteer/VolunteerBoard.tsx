import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { Card, ErrorBox, Spinner, useAsync, usePolling } from '../../components/common'
import { workflow, assignmentLabel } from '../../workflow'

export default function VolunteerBoard() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { data, error, loading, reload, silentRefresh } = useAsync(workflow.tasks, [])
  usePolling(silentRefresh, 2000, true)
  const [tab, setTab] = useState('all')
  const [busy, setBusy] = useState<number | null>(null)
  const [actionError, setActionError] = useState<unknown>(null)
  async function claim(id: number) {
    setBusy(id); setActionError(null)
    try { await workflow.claim(id); await reload(true); navigate(`/v/tasks/${id}`) }
    catch (err) { setActionError(err) } finally { setBusy(null) }
  }
  if (loading && !data) return <Spinner />
  return <div className="workflow-page">
    <header className="page-head"><div><h1>志愿者任务大厅</h1><div className="sub">{session?.nickname} · ID {session?.volunteer_id}</div></div>
      <div className="row"><Link className="btn btn-ghost" to="/v/mine">账号设置</Link><button className="btn btn-ghost" onClick={async () => {await logout(); navigate('/join')}}>退出登录</button></div>
    </header>
    <Card><strong>任务槽：{data?.slots_used ?? 0} / 10</strong><p className="small muted">进行中和待审核任务占用任务槽，成功提交或主动放弃后释放。参与者每 2 秒更新。</p>
      <div className="row">{[['all','全部任务'],['active','我的进行中'],['submitted','待审核'],['accepted','成功提交']].map(([key,label]) => <button key={key} className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(key)}>{label}</button>)}</div>
    </Card>
    {error || actionError ? <ErrorBox error={actionError || error} /> : null}
    <div className="workflow-grid">{data?.items.filter(item => tab === 'all' || (tab === 'active' ? item.assignment?.status === 'in_progress' : item.assignment?.status === tab)).map(item => {
      const state = item.assignment?.status
      const claimed = state === 'in_progress' || state === 'submitted' || state === 'accepted'
      return <Card key={item.task.id}>
        <div className="row" style={{justifyContent:'space-between'}}><span className="tag-code">{item.task.access_code}</span><span className="badge">{claimed ? assignmentLabel[state!] : '未接取'}</span></div>
        <h2 style={{marginTop: 14}}>{item.task.name}</h2><p>{item.task.description || '暂无任务描述'}</p>
        <p className="small muted">管理员 {String(item.task.owner_admin_id).padStart(3,'0')} · {item.checkpoint_count} 个拍摄点 · {item.task.location_hint || '地点未填写'}</p>
        <p className="small">正在进行：{item.active_volunteers.join('、') || '暂无志愿者'}</p>
        {item.assignment?.review_note && <p className="workflow-note">管理员反馈：{item.assignment.review_note}</p>}
        <div className="row"><Link className="btn btn-ghost" to={`/v/tasks/${item.task.id}`}>查看任务</Link>
          {!claimed && item.task.status === 'active' && <button className="btn btn-primary" disabled={busy !== null || (data?.slots_used ?? 0) >= 10} onClick={() => void claim(item.task.id)}>接取</button>}
          {state === 'in_progress' && <Link className="btn btn-primary" to={`/v/tasks/${item.task.id}`}>继续拍摄</Link>}
        </div>
      </Card>
    })}</div>
    {data && !data.items.length && <Card><p>管理员还没有发布任务。</p></Card>}
  </div>
}
