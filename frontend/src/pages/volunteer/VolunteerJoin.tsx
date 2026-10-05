import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ErrorBox, LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'

export default function VolunteerJoin() {
  const { t } = useI18n()
  const { volunteerJoin, session, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [code, setCode] = useState((searchParams.get('code') ?? '').toUpperCase())
  const [nickname, setNickname] = useState(session?.nickname ?? '')
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)

  // Already joined with an access code — go straight to the board
  useEffect(() => {
    if (session?.task_id) navigate('/v', { replace: true })
  }, [session?.task_id, navigate])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!code.trim() || !nickname.trim()) return
    setBusy(true)
    setError(null)
    try {
      await volunteerJoin(code.trim(), nickname.trim())
      navigate('/v', { replace: true })
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 6 }}>
          <LanguageSwitcher compact />
        </div>

        <h1>{t('join.title')}</h1>
        <p className="sub">{t('join.subtitle')}</p>

        <form onSubmit={submit}>
          <label className="field">
            <span>{t('join.code')}</span>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="B3F7K2"
              autoCapitalize="characters"
              autoComplete="off"
              inputMode="text"
              style={{ fontSize: '1.3rem', letterSpacing: '0.14em', textAlign: 'center' }}
            />
            <span className="hint">{t('join.code.hint')}</span>
          </label>

          <label className="field">
            <span>{t('join.nickname')}</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder={t('join.nicknamePlaceholder')}
              maxLength={32}
            />
            <span className="hint">{t('join.nickname.hint')}</span>
          </label>

          {error ? <ErrorBox error={error} /> : null}

          <button
            type="submit"
            className="btn btn-primary btn-lg block"
            disabled={busy || !code.trim() || !nickname.trim()}
            style={{ marginTop: 8 }}
          >
            {busy ? t('common.loading') : t('join.submit')}
          </button>
        </form>

        {isAdmin && (
          <p className="small muted" style={{ marginTop: 16 }}>
            {t('join.adminNote')} <a href="/admin">{t('join.adminNoteLink')}</a>
            {t('join.adminNoteEnd')}
          </p>
        )}
      </div>
    </div>
  )
}
