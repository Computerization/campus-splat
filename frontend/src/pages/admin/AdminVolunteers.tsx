import { useState } from 'react'
import { Card, ErrorBox, Modal, Spinner, useAsync, usePolling } from '../../components/common'
import { workflow, type Account } from '../../workflow'

export default function AdminVolunteers() {
  const {data, error, loading, reload, silentRefresh} = useAsync(workflow.accounts, [])
  const [editing, setEditing] = useState<Account | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)
  usePolling(silentRefresh, 2000, !editing && !busy)
  async function save() {
    if (!editing) return
    setBusy(true); setActionError(null)
    try {await workflow.editAccount(editing.id, {username: editing.username, password: editing.password}); setEditing(null); await reload(true)}
    catch(err) {setActionError(err)} finally {setBusy(false)}
  }
  async function archive(account: Account) {
    if (!window.confirm(`注销 ${account.username}（ID ${account.id}）？ID 和信息永久保留，用户名释放。`)) return
    setBusy(true); setActionError(null)
    try {await workflow.archiveAccount(account.id); await reload(true)} catch(err) {setActionError(err)} finally {setBusy(false)}
  }
  if (loading && !data) return <Spinner />
  return <><div className="page-head"><div><h1>志愿者账号管理</h1><p className="sub">所有未注销账号 · 姓名、ID 与密码 · 五位管理员均可管理</p></div></div>
    {error || actionError ? <ErrorBox error={actionError || error} /> : null}
    <Card><div className="table-wrap"><table><thead><tr><th>永久 ID</th><th>真实姓名／用户名</th><th>密码</th><th>注册时间</th><th>操作</th></tr></thead>
      <tbody>{data?.map(account => <tr key={account.id}><td><span className="tag-code">{account.id}</span></td><td>{account.username}</td><td>{account.password}</td><td>{new Date(account.created_at + 'Z').toLocaleString()}</td><td><div className="row">
        <button className="btn btn-ghost sm" disabled={busy} onClick={() => {setEditing({...account}); setActionError(null)}}>修改姓名／密码</button><button className="btn btn-danger sm" disabled={busy} onClick={() => void archive(account)}>注销账号</button>
      </div></td></tr>)}</tbody></table></div>{data?.length === 0 && <p>暂无未注销的志愿者账号。</p>}</Card>
    <Modal open={Boolean(editing)} title={`修改志愿者 ID ${editing?.id ?? ''}`} onClose={() => {if(!busy) setEditing(null)}} footer={<button className="btn btn-primary" disabled={busy || !editing?.username.trim() || !editing?.password} onClick={() => void save()}>保存</button>}>
      {editing && <><p className="small muted">永久 ID 不可修改。修改密码后该账号需要重新登录。</p><label className="field"><span>真实姓名／用户名</span><input maxLength={64} value={editing.username} onChange={e => setEditing({...editing, username:e.target.value})} /></label>
        <label className="field"><span>密码</span><input maxLength={128} value={editing.password} onChange={e => setEditing({...editing,password:e.target.value})} /></label>{actionError ? <ErrorBox error={actionError} /> : null}</>}
    </Modal>
  </>
}
