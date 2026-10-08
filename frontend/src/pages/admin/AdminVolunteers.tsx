import { useState } from 'react'
import { Card, ErrorBox, Modal, Spinner, useAsync, usePolling } from '../../components/common'
import { workflow, type Account } from '../../workflow'
import { useI18n } from '../../i18n'

export default function AdminVolunteers() {
  const { t } = useI18n()
  const { data, error, loading, reload, silentRefresh } = useAsync(workflow.accounts, [])
  const [editing, setEditing] = useState<Account | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)
  usePolling(silentRefresh, 2000, !editing && !busy)

  async function save() {
    if (!editing) return
    setBusy(true)
    setActionError(null)
    try {
      await workflow.editAccount(editing.id, { username: editing.username, password: editing.password })
      setEditing(null)
      await reload(true)
    } catch (err) {
      setActionError(err)
    } finally {
      setBusy(false)
    }
  }

  async function archive(account: Account) {
    if (!window.confirm(t('admin.vol.archiveConfirm', { name: account.username }))) return
    setBusy(true)
    setActionError(null)
    try {
      await workflow.archiveAccount(account.id)
      await reload(true)
    } catch (err) {
      setActionError(err)
    } finally {
      setBusy(false)
    }
  }

  if (loading && !data) return <Spinner />

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.vol.title')}</h1>
          <p className="sub">{t('admin.vol.sub')}</p>
        </div>
      </div>
      {error || actionError ? <ErrorBox error={actionError || error} /> : null}
      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('admin.vol.col.id')}</th>
                <th>{t('admin.vol.col.username')}</th>
                <th>{t('admin.vol.col.password')}</th>
                <th>{t('admin.vol.col.created')}</th>
                <th>{t('admin.vol.col.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((account) => (
                <tr key={account.id}>
                  <td><span className="tag-code">{account.id}</span></td>
                  <td>{account.username}</td>
                  <td>{account.password}</td>
                  <td>{new Date(account.created_at + 'Z').toLocaleString()}</td>
                  <td>
                    <div className="row">
                      <button
                        className="btn btn-ghost sm"
                        disabled={busy}
                        onClick={() => { setEditing({ ...account }); setActionError(null) }}
                      >
                        {t('admin.vol.edit')}
                      </button>
                      <button className="btn btn-danger sm" disabled={busy} onClick={() => void archive(account)}>
                        {t('admin.vol.archive')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data?.length === 0 && <p>{t('admin.vol.empty')}</p>}
      </Card>

      <Modal
        open={Boolean(editing)}
        title={t('admin.vol.edit')}
        onClose={() => { if (!busy) setEditing(null) }}
        footer={
          <button
            className="btn btn-primary"
            disabled={busy || !editing?.username.trim() || !editing?.password}
            onClick={() => void save()}
          >
            {t('common.save')}
          </button>
        }
      >
        {editing && (
          <>
            <p className="small muted">{t('volunteer.mine.sub')}</p>
            <label className="field">
              <span>{t('admin.vol.col.username')}</span>
              <input maxLength={64} value={editing.username} onChange={(e) => setEditing({ ...editing, username: e.target.value })} />
            </label>
            <label className="field">
              <span>{t('admin.vol.col.password')}</span>
              <input maxLength={128} value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
            </label>
            {actionError ? <ErrorBox error={actionError} /> : null}
          </>
        )}
      </Modal>
    </>
  )
}
