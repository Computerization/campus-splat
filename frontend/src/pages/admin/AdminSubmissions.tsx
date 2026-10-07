import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, ErrorBox, Spinner, useAsync, usePolling } from '../../components/common'
import { workflow, assignmentLabel } from '../../workflow'
import type { Photo } from '../../types'
import type { Assignment } from '../../workflow'

export default function AdminSubmissions() {
  const {data, error, loading, reload, silentRefresh} = useAsync(workflow.submissions, [])
  const [detail, setDetail] = useState<{assignment: Assignment; photos: Photo[]} | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)
  const [tab, setTab] = useState('submitted')
  usePolling(silentRefresh, 2000, !busy)
  async function inspect(id: number) {
    setBusy(true); setActionError(null)
    try {setDetail(await workflow.submission(id)); setNote('')} catch(err) {setActionError(err)} finally {setBusy(false)}
  }
  async function review(decision: 'accept' | 'return') {
    if (!detail) return
    if (!window.confirm(decision === 'accept' ? '确认接受该志愿者的全部成果？接受后完成任务并释放任务槽。' : '确认打回？志愿者将可以继续修改、重新提交或放弃。')) return
    setBusy(true); setActionError(null)
    try {await workflow.review(detail.assignment.id,decision,note); setDetail(null); await reload(true)} catch(err) {setActionError(err); await inspect(detail.assignment.id)} finally {setBusy(false)}
  }
  if(loading && !data) return <Spinner />
  return <><div className="page-head"><div><h1>任务成果审核</h1><p className="sub">仅显示自己发布的任务 · 对整份成果接受或打回</p></div></div>
    <div className="row" style={{marginBottom:20}}>{[['submitted','待审核'],['accepted','已接受'],['in_progress','已打回']].map(([key,label]) => <button key={key} className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(key)}>{label}（{data?.filter(s => s.status === key).length ?? 0}）</button>)}</div>
    {error || actionError ? <ErrorBox error={actionError || error} /> : null}
    <Card><div className="table-wrap"><table><thead><tr><th>任务</th><th>志愿者</th><th>状态</th><th>提交时间</th><th>操作</th></tr></thead><tbody>
      {data?.filter(s => s.status === tab).map(s => <tr key={s.id}><td><Link to={`/admin/tasks/${s.task_id}`}>{s.task_name}</Link></td><td>{s.username} · {s.volunteer_id}{!s.account_active && '（已注销）'}</td><td>{assignmentLabel[s.status]}</td><td>{s.submitted_at && new Date(s.submitted_at+'Z').toLocaleString()}</td><td><button className="btn btn-ghost sm" disabled={busy} onClick={() => void inspect(s.id)}>查看成果</button></td></tr>)}
    </tbody></table></div>{!data?.some(s => s.status === tab) && <p>该分类暂无提交。</p>}</Card>
    {detail && <Card><div className="row" style={{justifyContent:'space-between'}}><h2>{detail.assignment.username} · ID {detail.assignment.volunteer_id}</h2><button className="btn btn-ghost" onClick={() => setDetail(null)}>关闭</button></div>
      <p>{assignmentLabel[detail.assignment.status]} · 共 {detail.photos.length} 张照片</p>
      {detail.assignment.manifest?.map(cp => <p key={cp.checkpoint_id}>{cp.name}：提交 {cp.submitted} 张／要求 {cp.required} 张</p>)}
      {detail.assignment.review_note && <p className="workflow-note">审核反馈：{detail.assignment.review_note}</p>}
      <div className="workflow-photos">{detail.photos.map(photo => <div className="workflow-photo" key={photo.id}><a href={photo.preview_url || '#'} target="_blank" rel="noreferrer"><img src={photo.thumb_url || ''} alt={photo.original_filename} /></a><span className="small">{photo.original_filename}</span><span className="small">质检：{photo.status} · {photo.quality?.score ?? '-'} 分</span><span className="small muted">{photo.quality?.advice}</span><a className="small" href={photo.file_url || '#'} target="_blank" rel="noreferrer">下载原图</a></div>)}</div>
      {detail.assignment.status === 'submitted' && <><label className="field" style={{marginTop:20}}><span>审核反馈（可选）</span><textarea maxLength={2000} value={note} onChange={e => setNote(e.target.value)} /></label><div className="row"><button className="btn btn-primary" disabled={busy} onClick={() => void review('accept')}>接受全部成果</button><button className="btn btn-danger" disabled={busy} onClick={() => void review('return')}>打回修改</button></div></>}
    </Card>}
  </>
}
