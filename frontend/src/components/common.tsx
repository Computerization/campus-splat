import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ApiError } from '../api'
import { LANGUAGES, useI18n, type Lang } from '../i18n'
import type { CheckpointStatus, PhotoStatus } from '../types'

// ---------------------------------------------------------------- formatting

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`
}

/** The backend sends naive UTC strings; append Z so the browser converts to local time. */
export function parseServerDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const iso = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value: string | null | undefined): string {
  const date = parseServerDate(value)
  if (!date) return value ? String(value) : '—'
  return date.toLocaleString(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(value: string | null | undefined): string {
  const date = parseServerDate(value)
  if (!date) return value ? String(value) : '—'
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/** Relative time / duration — needs `t`, hence a hook. */
export function useTimeFormat() {
  const { t } = useI18n()

  const relativeTime = useCallback(
    (value: string | null | undefined) => {
      const date = parseServerDate(value)
      if (!date) return '—'
      const seconds = Math.round((Date.now() - date.getTime()) / 1000)
      if (seconds < 60) return t('time.justNow')
      if (seconds < 3600) return t('time.minutesAgo', { count: Math.floor(seconds / 60) })
      if (seconds < 86400) return t('time.hoursAgo', { count: Math.floor(seconds / 3600) })
      return t('time.daysAgo', { count: Math.floor(seconds / 86400) })
    },
    [t],
  )

  const formatDuration = useCallback(
    (seconds: number | null | undefined) => {
      if (seconds === null || seconds === undefined) return '—'
      if (seconds < 60) return t('time.seconds', { count: Math.round(seconds) })
      if (seconds < 3600) {
        return t('time.durationMinutes', {
          minutes: Math.floor(seconds / 60),
          seconds: Math.round(seconds % 60),
        })
      }
      return t('time.durationHours', {
        hours: Math.floor(seconds / 3600),
        minutes: Math.round((seconds % 3600) / 60),
      })
    },
    [t],
  )

  return { relativeTime, formatDuration }
}

// ---------------------------------------------------------------- language

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n()
  return (
    <select
      aria-label={t('common.language')}
      className={`lang-switch${compact ? ' lang-switch-compact' : ''}`}
      value={lang}
      onChange={(event) => setLang(event.target.value as Lang)}
    >
      {LANGUAGES.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}

/** Compact toggle for the phone header (tap to switch zh <-> en). */
export function LanguageToggle() {
  const { lang, setLang } = useI18n()
  const next: Lang = lang === 'zh' ? 'en' : 'zh'
  return (
    <button
      type="button"
      className="btn btn-ghost sm"
      onClick={() => setLang(next)}
      title={next === 'en' ? 'English' : '中文'}
    >
      {lang === 'zh' ? 'EN' : '中'}
    </button>
  )
}

// ---------------------------------------------------------------- primitives

export function ProgressBar({
  value,
  tone,
  height = 8,
}: {
  value: number
  tone?: 'ok' | 'warn' | 'bad'
  height?: number
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const resolved = tone ?? (clamped >= 100 ? 'ok' : clamped > 0 ? 'warn' : 'bad')
  return (
    <div className="progress" style={{ height }} role="progressbar" aria-valuenow={clamped}>
      <div className={`progress-fill tone-${resolved}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}

/** Ring gauge used for the live usage figures on the System page. */
export function Gauge({
  value,
  label,
  caption,
  unavailableText,
}: {
  value: number | null | undefined
  label: string
  caption?: string
  unavailableText?: string
}) {
  const available = value !== null && value !== undefined && !Number.isNaN(value)
  const clamped = available ? Math.max(0, Math.min(100, value)) : 0
  const tone = !available ? 'idle' : clamped >= 90 ? 'bad' : clamped >= 70 ? 'warn' : 'ok'

  return (
    <div className={`gauge-card tone-${tone}`}>
      <div className={`gauge${available ? '' : ' gauge-idle'}`}>
        <div className="gauge-ring" style={{ '--value': clamped } as CSSProperties} />
        <div className="gauge-center">
          <span className="gauge-value">{available ? `${Math.round(clamped)}%` : '—'}</span>
        </div>
      </div>
      <div className="gauge-label">{label}</div>
      <div className="gauge-caption">{available ? caption : (unavailableText ?? caption)}</div>
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'info'
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  )
}

export function Spinner({ label }: { label?: string }) {
  const { t } = useI18n()
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <span>{label ?? t('common.loading')}</span>
    </div>
  )
}

export function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p>{text}</p>
      {action}
    </div>
  )
}

export function ErrorBox({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useI18n()
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : String(error ?? '')
  return (
    <div className="error-box">
      <span>{message || t('common.error')}</span>
      {onRetry && (
        <button type="button" className="btn btn-ghost sm" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}

/**
 * Modal.
 *
 * Deliberately ignores clicks on the backdrop: losing a half-filled form to a
 * stray click costs far more than an extra click to close. The only ways out
 * are the ✕ button, the cancel button and Escape.
 */
export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className={`modal ${wide ? 'modal-wide' : ''}`}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="btn btn-ghost sm" onClick={onClose} aria-label="close">
            ✕
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>
  )
}

export function Toast({ text }: { text: string }) {
  return <div className="toast">{text}</div>
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-ghost sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {
          window.prompt(t('common.copyPrompt'), text)
        }
      }}
    >
      {copied ? t('common.copied') : (label ?? t('common.copy'))}
    </button>
  )
}

// ---------------------------------------------------------------- status

export function useStatusLabel() {
  const { t } = useI18n()
  return useCallback(
    (status: CheckpointStatus | PhotoStatus | string) => {
      const key = `status.${status}`
      const known = ['pending', 'in_progress', 'done', 'blocked', 'ok', 'warning', 'rejected']
      if (known.includes(status)) return t(key as never)
      return status
    },
    [t],
  )
}

export function statusTone(status: string): 'neutral' | 'ok' | 'warn' | 'bad' | 'info' {
  switch (status) {
    case 'done':
    case 'ok':
    case 'succeeded':
      return 'ok'
    case 'in_progress':
    case 'warning':
    case 'running':
      return 'warn'
    case 'rejected':
    case 'failed':
      return 'bad'
    case 'queued':
    case 'blocked':
      return 'info'
    default:
      return 'neutral'
  }
}

// ---------------------------------------------------------------- polling

/**
 * Refresh on a timer. Requests are skipped while the tab is hidden, so an
 * idle admin page doesn't hammer SQLite.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let timer: number | undefined

    const tick = async () => {
      if (document.visibilityState === 'visible') {
        try {
          await callback()
        } catch {
          /* A failed poll shouldn't raise an error; the next tick retries */
        }
      }
      if (!cancelled) timer = window.setTimeout(tick, intervalMs)
    }

    timer = window.setTimeout(tick, intervalMs)
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [callback, intervalMs, enabled])
}

/** Small data-loading helper, meant to be paired with usePolling. */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  // `loader` is a new function on every render, so keep it in a ref and depend
  // on a serialized key instead — otherwise usePolling's timer would be reset
  // on every render and never fire.
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const depsKey = JSON.stringify(deps)

  const run = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true)
      try {
        setData(await loaderRef.current())
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depsKey],
  )

  useEffect(() => {
    void run()
  }, [run])

  const silentRefresh = useCallback(() => run(true), [run])
  return { data, error, loading, reload: run, silentRefresh, setData }
}
