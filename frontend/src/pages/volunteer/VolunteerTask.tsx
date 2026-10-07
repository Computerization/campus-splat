import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { Card, ErrorBox, Spinner, useAsync, usePolling } from '../../components/common'
import { workflow, assignmentLabel, draftRead, draftWrite, type DraftPhoto } from '../../workflow'

function LocalPhoto({ photo }: {photo: DraftPhoto}) {
  const [url, setUrl] = useState('')
  useEffect(() => { const value = URL.createObjectURL(photo.file); setUrl(value); return () => URL.revokeObjectURL(value) }, [photo.file])
  return <><img src={url} alt={photo.file.name} /><span className="small">{photo.file.name}</span></>
}

export default function VolunteerTask() {
  const taskId = Number(useParams().id)
  const { session } = useAuth()
  const navigate = useNavigate()
  const { data, error, loading, reload, silentRefresh } = useAsync(() => workflow.task(taskId), [taskId])
  const [drafts, setDrafts] = useState<DraftPhoto[]>([])
  const [removed, setRemoved] = useState<number[]>([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const assignment = data?.assignment
  const draftKey = `${session?.volunteer_id}:${assignment?.id}:${assignment?.attempt}`
  usePolling(silentRefresh, 2000, !busy)
  useEffect(() => {
    if (!assignment) return
    let cancelled = false
    setReady(false)
    draftRead(draftKey).then(values => {
      if (cancelled) return
      setDrafts(values)
      try {setRemoved(JSON.parse(localStorage.getItem(`${draftKey}:removed`) || '[]'))} catch {setRemoved([])}
      setReady(true)
    }).catch(err => {if (!cancelled) setActionError(err)})
    return () => {cancelled = true}
  }, [draftKey, Boolean(assignment)])
  if (loading && !data) return <Spinner />
  if (!data) return <div className="workflow-page"><Link to="/v">← 返回任务大厅</Link><ErrorBox error={error} /></div>
  const editable = assignment?.status === 'in_progress'
  const remote = data.photos.filter(p => !removed.includes(p.id))
  const relevantDrafts = drafts.filter(p => data.checkpoints.some(cp => cp.id === p.checkpointId))
  const count = (cpId: number) => remote.filter(p => p.checkpoint_id === cpId).length + relevantDrafts.filter(p => p.checkpointId === cpId).length
  const complete = data.checkpoints.length > 0 && data.checkpoints.every(cp => count(cp.id) >= cp.shot_count)
  async function saveDraft(next: DraftPhoto[]) {
    setBusy(true); setActionError(null)
    try {await draftWrite(draftKey, next); setDrafts(next)} catch (err) {setActionError(err)} finally {setBusy(false)}
  }
  function removeRemote(id: number) {
    const next = [...removed, id]
    try {localStorage.setItem(`${draftKey}:removed`, JSON.stringify(next)); setRemoved(next)} catch (err) {setActionError(err)}
  }
  async function submit() {
    if (!complete || !editable || busy) return
    setBusy(true); setActionError(null); setMessage('正在统一上传全部数据，请保持页面打开…')
    const form = new FormData()
    const entries: {checkpoint_id: number; photo_id?: number}[] = []
    for (const photo of remote) {
      if (!data!.checkpoints.some(cp => cp.id === photo.checkpoint_id)) continue
      entries.push({checkpoint_id: photo.checkpoint_id!, photo_id: photo.id})
      form.append('files', new File([], `retained-${photo.id}.jpg`))
    }
    for (const photo of relevantDrafts) {
      entries.push({checkpoint_id: photo.checkpointId}); form.append('files', photo.file)
    }
    form.append('manifest', JSON.stringify(entries))
    try {
      await workflow.submit(taskId, form)
      await draftWrite(draftKey, []); setDrafts([]); setRemoved([]); localStorage.removeItem(`${draftKey}:removed`)
      setMessage('数据已提交，等待管理员裁断。审核期间不能修改或放弃。')
      await reload(true)
    } catch (err) {setActionError(err); setMessage(''); await reload(true)} finally {setBusy(false)}
  }
  async function abandon() {
    if (!window.confirm('放弃任务会清除本次全部拍摄进度，确认放弃？')) return
    setBusy(true); setActionError(null)
    try {await workflow.abandon(taskId); await draftWrite(draftKey, []); localStorage.removeItem(`${draftKey}:removed`); navigate('/v')}
    catch (err) {setActionError(err); await reload(true)} finally {setBusy(false)}
  }
  return <div className="workflow-page">
    <Link to="/v">← 返回任务大厅</Link>
    <header className="page-head" style={{marginTop: 20}}><div><h1>{data.task.name}</h1><div className="sub">任务码 {data.task.access_code} · {assignment ? assignmentLabel[assignment.status] : '未接取'}</div></div>
      {editable && <button className="btn btn-danger" disabled={busy} onClick={() => void abandon()}>放弃任务</button>}
    </header>
    <Card><p>{data.task.description || '暂无任务描述'}</p><p className="small muted">地点：{data.task.location_hint || '未填写'}</p><p>正在进行：{data.active_volunteers.join('、') || '暂无志愿者'}</p>
      {!assignment || !['in_progress','submitted','accepted'].includes(assignment.status) ? <button className="btn btn-primary" disabled={busy || data.task.status !== 'active'} onClick={async () => {
        setBusy(true); setActionError(null); try {await workflow.claim(taskId); await reload(true)} catch(err) {setActionError(err)} finally {setBusy(false)}
      }}>接取任务</button> : null}
      {assignment?.review_note && <p className="workflow-note">管理员反馈：{assignment.review_note}</p>}
      {assignment?.status === 'submitted' && <p className="workflow-note">内容已锁定，等待管理员接受或打回。本任务仍占用一个任务槽。</p>}
      {assignment?.status === 'accepted' && <p className="workflow-note">成果已接受，已进入成功提交分类，不再占用任务槽。</p>}
    </Card>
    {error || actionError ? <ErrorBox error={actionError || error} /> : null}{message && <p role="status">{message}</p>}
    {data.checkpoints.map(cp => <Card key={cp.id}>
      <div className="row" style={{justifyContent:'space-between'}}><h2>{cp.name}</h2><strong>{count(cp.id)} / {cp.shot_count} 张</strong></div>
      <p>{cp.instructions || '请围绕拍摄点，从不同角度拍摄。'}</p>{cp.find_hint && <p className="small muted">位置提示：{cp.find_hint}</p>}
      <p className="small muted">{[cp.building,cp.floor,cp.room].filter(Boolean).join(' · ')}</p>
      {cp.angles?.map((angle, i) => <p className="small" key={i}>{angle.label}：{angle.tip} {angle.pitch != null ? `俯仰 ${angle.pitch}°` : ''} {angle.yaw != null ? `方位 ${angle.yaw}°` : ''}</p>)}
      {cp.reference_image && <img className="workflow-reference" src={`/api/media/checkpoint-reference/${cp.id}?token=${session?.token}`} alt={`${cp.name}参考照片`} />}
      {editable && <label className="field"><span>选择照片（保存到当前浏览器草稿，统一提交时上传）</span><input type="file" multiple accept=".jpg,.jpeg,.png,.heic,.heif,.webp,.tif,.tiff,.bmp" disabled={busy || !ready} onChange={e => {
        const selected = Array.from(e.target.files ?? [])
        if (selected.some(file => file.size > 60 * 1024 * 1024)) {setActionError(new Error('单张照片不能超过 60 MB')); e.target.value = ''; return}
        const next = [...drafts, ...selected.map(file => ({key: crypto.randomUUID(), checkpointId: cp.id, file}))]
        e.target.value = ''; void saveDraft(next)
      }} /></label>}
      <div className="workflow-photos">{remote.filter(p => p.checkpoint_id === cp.id).map(photo => <div key={photo.id} className="workflow-photo">
        <a href={photo.file_url || '#'} target="_blank" rel="noreferrer"><img src={photo.thumb_url || ''} alt={photo.original_filename} /></a><span className="small">{photo.original_filename}</span>
        <span className="small muted">质检：{photo.status === 'ok' ? '合格' : photo.status === 'warning' ? '可用但有瑕疵' : '建议重拍'}</span>{photo.quality?.advice && <span className="small">{photo.quality.advice}</span>}
        {editable && <button className="btn btn-ghost sm" disabled={busy} onClick={() => removeRemote(photo.id)}>移除／替换</button>}
      </div>)}{relevantDrafts.filter(p => p.checkpointId === cp.id).map(photo => <div key={photo.key} className="workflow-photo"><LocalPhoto photo={photo} />
        {editable && <button className="btn btn-ghost sm" disabled={busy} onClick={() => void saveDraft(drafts.filter(p => p.key !== photo.key))}>移除</button>}
      </div>)}</div>
    </Card>)}
    {editable && <Card><h2>统一提交成果</h2><p className="small muted">草稿仅保存在当前设备和浏览器。完成所有拍摄点后统一上传，审核期间不可更改。</p>
      {!data.checkpoints.length && <p>管理员还未设置拍摄点，请等待任务完善。</p>}
      <button className="btn btn-primary" disabled={!complete || busy || !ready} onClick={() => void submit()}>{busy ? '处理中…' : '全部完成，统一提交'}</button>
      {!complete && data.checkpoints.length > 0 && <p className="small muted" style={{marginTop: 8}}>还有拍摄点没有达到要求数量。</p>}
    </Card>}
  </div>
}
