import { useState } from 'react'
import { api } from '../../api'
import {
  Badge,
  Card,
  ErrorBox,
  Gauge,
  Spinner,
  Toast,
  formatBytes,
  formatTime,
  useAsync,
  usePolling,
  useTimeFormat,
} from '../../components/common'
import { useI18n } from '../../i18n'
import type { Metrics } from '../../types'

export default function AdminSystem() {
  const { t } = useI18n()
  const { formatDuration } = useTimeFormat()

  const { data, error, loading, reload } = useAsync(() => api.systemInfo(), [])
  const { data: metrics, silentRefresh: refreshMetrics } = useAsync<Metrics>(
    () => api.metrics(),
    [],
  )
  // Live gauges refresh every 2s — frequent enough without loading the backend
  usePolling(refreshMetrics, 2_000, Boolean(data))

  const [toast, setToast] = useState<string | null>(null)

  if (loading && !data) return <Spinner />
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return null

  const hw = data.hardware
  const memoryTotal = metrics?.memory.total_bytes ?? hw.memory_total_bytes

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.system.title')}</h1>
          <div className="sub">{t('admin.system.subtitle')}</div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
          {t('common.refresh')}
        </button>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        <Card>
          <h3>{t('admin.system.hardware')}</h3>
          <div className="kv">
            <dt>{t('admin.system.hostname')}</dt>
            <dd>{hw.hostname || '—'}</dd>
            <dt>{t('admin.system.os')}</dt>
            <dd>{hw.os || '—'}</dd>
            <dt>{t('admin.system.cpu')}</dt>
            <dd>
              {hw.cpu.name}
              <div className="small muted">
                {t('admin.system.cpuCores', {
                  physical: hw.cpu.physical_cores ?? '—',
                  logical: hw.cpu.logical_cores ?? '—',
                })}
                {hw.cpu.max_freq_mhz
                  ? ` · ${t('admin.system.cpuFreq', { value: hw.cpu.max_freq_mhz })}`
                  : ''}
              </div>
            </dd>
            <dt>{t('admin.system.memory')}</dt>
            <dd>
              {formatBytes(memoryTotal)}
              {metrics && (
                <div className="small muted">
                  {t('admin.system.usedOfTotal', {
                    used: formatBytes(metrics.memory.used_bytes),
                    total: formatBytes(metrics.memory.total_bytes),
                  })}
                </div>
              )}
            </dd>
            <dt>{t('admin.system.gpu')}</dt>
            <dd>
              {hw.gpu.available ? (
                <>
                  {hw.gpu.name}
                  <div className="small muted">
                    {formatBytes(hw.gpu.memory_total_bytes)}
                    {hw.gpu.driver_version
                      ? ` · ${t('admin.system.gpuDriver', { version: hw.gpu.driver_version })}`
                      : ''}
                  </div>
                </>
              ) : (
                <span className="muted">{t('admin.system.noGpu')}</span>
              )}
            </dd>
            <dt>{t('admin.system.python')}</dt>
            <dd>{hw.python_version}</dd>
          </div>
        </Card>

        <Card>
          <h3>{t('admin.system.photoStorage')}</h3>
          <div className="kv">
            <dt>{t('admin.system.photos')}</dt>
            <dd>{formatBytes(data.storage.photos_bytes)}</dd>
            <dt>{t('admin.system.training')}</dt>
            <dd>{formatBytes(data.storage.training_bytes)}</dd>
            <dt>{t('admin.system.thumbnails')}</dt>
            <dd>{formatBytes(data.storage.thumbnails_bytes)}</dd>
            <dt>{t('admin.system.managed')}</dt>
            <dd>
              <strong>{formatBytes(data.storage.managed_bytes)}</strong>
            </dd>
            <dt>{t('admin.overview.free')}</dt>
            <dd>
              {formatBytes(data.storage.free_bytes)} / {formatBytes(data.storage.total_bytes)}
            </dd>
            <dt>{t('admin.system.heif')}</dt>
            <dd>
              {data.heif_supported ? (
                <Badge tone="ok">{t('admin.system.enabled')}</Badge>
              ) : (
                <Badge tone="warn">{t('admin.system.disabled')}</Badge>
              )}
            </dd>
            <dt>{t('admin.system.dataLocation')}</dt>
            <dd className="small mono">{data.data_dir}</dd>
          </div>

          <div className="divider" />

          <h4>{t('admin.system.photoStatus')}</h4>
          <div className="row">
            {Object.entries(data.photo_status_counts).length === 0 ? (
              <span className="small muted">{t('admin.system.noPhotos')}</span>
            ) : (
              Object.entries(data.photo_status_counts).map(([status, count]) => (
                <Badge
                  key={status}
                  tone={
                    status === 'ok'
                      ? 'ok'
                      : status === 'warning'
                        ? 'warn'
                        : status === 'checking'
                          ? 'neutral'
                          : 'bad'
                  }
                >
                  {t(`status.${status}` as never)} {count}
                </Badge>
              ))
            )}
          </div>

          <div className="divider" />

          <h4>{t('admin.system.maintenance')}</h4>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-ghost sm"
              onClick={async () => {
                try {
                  const result = await api.pruneSessions()
                  setToast(t('admin.system.cleaned', { count: result.removed ?? 0 }))
                } catch (err) {
                  setToast(String(err))
                }
                window.setTimeout(() => setToast(null), 3000)
              }}
            >
              {t('admin.system.cleanSessions')}
            </button>
          </div>
          <p className="small muted">管理员只能管理自己的任务。请在任务页面删除任务；全局清空已关闭，账号 ID 和历史信息永久保留。</p>
        </Card>
      </div>

      {/* Live usage */}
      <Card>
        <div className="card-head">
          <h3>{t('admin.system.realtime')}</h3>
          <span className="small muted">
            {metrics
              ? `${t('admin.system.updatedAt', { time: formatTime(new Date().toISOString()) })} · ${t(
                  'admin.system.uptime',
                )} ${formatDuration(metrics.uptime_seconds)}`
              : ''}
          </span>
        </div>

        {!metrics ? (
          <Spinner />
        ) : (
          <>
            <div className="gauge-row">
              <Gauge
                value={metrics.cpu.percent}
                label={t('admin.system.cpuUsage')}
                caption={
                  metrics.cpu.freq_mhz
                    ? `${metrics.cpu.per_core.length} · ${metrics.cpu.freq_mhz} MHz`
                    : `${metrics.cpu.per_core.length} cores`
                }
              />
              <Gauge
                value={metrics.memory.percent}
                label={t('admin.system.memoryUsage')}
                caption={t('admin.system.usedOfTotal', {
                  used: formatBytes(metrics.memory.used_bytes),
                  total: formatBytes(metrics.memory.total_bytes),
                })}
              />
              <Gauge
                value={metrics.gpu.available ? metrics.gpu.utilization ?? null : null}
                label={t('admin.system.gpuUsage')}
                caption={
                  metrics.gpu.temperature_c !== null && metrics.gpu.temperature_c !== undefined
                    ? `${t('admin.system.gpuTemp')} ${Math.round(metrics.gpu.temperature_c)}°C`
                    : ''
                }
                unavailableText={t('admin.system.gpuUnavailable')}
              />
              <Gauge
                value={metrics.gpu.available ? metrics.gpu.memory_percent ?? null : null}
                label={t('admin.system.vramUsage')}
                caption={
                  metrics.gpu.memory_total_bytes
                    ? t('admin.system.usedOfTotal', {
                        used: formatBytes(metrics.gpu.memory_used_bytes ?? 0),
                        total: formatBytes(metrics.gpu.memory_total_bytes),
                      })
                    : ''
                }
                unavailableText={t('admin.system.gpuUnavailable')}
              />
              <Gauge
                value={metrics.disk.percent}
                label={t('admin.system.diskUsage')}
                caption={
                  metrics.disk.total_bytes
                    ? t('admin.system.usedOfTotal', {
                        used: formatBytes(
                          (metrics.disk.total_bytes ?? 0) - (metrics.disk.free_bytes ?? 0),
                        ),
                        total: formatBytes(metrics.disk.total_bytes),
                      })
                    : ''
                }
              />
            </div>

            <div className="divider" />

            <h4>{t('admin.system.perCoreLoad')}</h4>
            <div className="core-bars">
              {metrics.cpu.per_core.map((value, index) => {
                const clamped = Math.max(0, Math.min(100, value))
                const tone = clamped >= 90 ? 'bad' : clamped >= 70 ? 'warn' : 'ok'
                return (
                  <div
                    key={index}
                    className="core-bar"
                    title={`core ${index}: ${Math.round(clamped)}%`}
                  >
                    <div
                      className={`core-bar-fill tone-${tone}`}
                      style={{ height: `${clamped}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </Card>

      {toast && <Toast text={toast} />}
    </>
  )
}
