import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import {
  Badge,
  Card,
  EmptyState,
  ErrorBox,
  Modal,
  ProgressBar,
  Spinner,
  formatBytes,
  formatDateTime,
  statusTone,
  useAsync,
  usePolling,
  useTimeFormat,
} from '../../components/common'
import { useI18n } from '../../i18n'
import type { TrainingBlock, TrainingParams, TrainingRun } from '../../types'

/**
 * The admin side of docs/training-pipeline.md: queue a run (one pose solve per
 * building, then one training block per room), watch the stages, inspect the
 * blocks and open the 3D preview of the produced point clouds.
 */

const DEFAULT_PARAMS: TrainingParams = {
  iterations: 30_000,
  image_resize: 2000,
  train_resize: 1600,
  toolchain: '3dgs',
  data_factor: 1,
  matcher: 'auto',
  block_max_photos: 600,
  merge_blocks: true,
  rtk_align: true,
}

/** The stages a run walks through, in order (used for the progress strip). */
const PIPELINE_STAGES = [
  'prepare',
  'sfm_features',
  'sfm_matching',
  'sfm_mapping',
  'sfm_align',
  'split',
  'train',
  'merge',
  'export',
] as const

function formatGaussians(value: number): string {
  if (!value) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

export default function AdminTraining() {
  const { t } = useI18n()
  const { formatDuration } = useTimeFormat()

  const [selectedTask, setSelectedTask] = useState('')
  const [runName, setRunName] = useState('')
  const [params, setParams] = useState<TrainingParams>(DEFAULT_PARAMS)
  const [advanced, setAdvanced] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [logRunId, setLogRunId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TrainingRun | null>(null)
  const [deleteFiles, setDeleteFiles] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { data: runs, loading, reload, silentRefresh } = useAsync(() => api.trainingRuns(30), [])
  const { data: tasks } = useAsync(() => api.listTasks(false), [])
  const { data: system, silentRefresh: refreshSystem } = useAsync(() => api.systemInfo(), [])
  const { data: preflight, loading: preflightLoading } = useAsync(
    () =>
      selectedTask
        ? api.trainingPreflight(Number(selectedTask), params)
        : Promise.resolve(null),
    // Every trainer parameter that changes the command template belongs here —
    // the preflight reports on the toolchain the run would actually use.
    [selectedTask, params.block_max_photos, params.toolchain, params.data_factor, params.iterations],
  )

  usePolling(
    async () => {
      await Promise.all([silentRefresh(), refreshSystem()])
    },
    5_000,
    Boolean(runs),
  )

  const eligible = (tasks ?? []).filter(
    (item) => item.photo_ok + item.photo_warning > 0 && item.task.status !== 'archived',
  )
  const queue = system?.training_queue
  // The command template the selected toolchain reads (docs/training-toolchain.md
  // §二): picking 「3dgs」 while only THREEDGS_GSPLAT_COMMAND is set is the
  // mistake this row makes visible.
  const command = queue?.toolchains?.[params.toolchain]

  function patch(next: Partial<TrainingParams>) {
    setParams((current) => ({ ...current, ...next }))
  }

  async function start() {
    if (!selectedTask) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const blocks = preflight?.blocks.length ?? 0
      if (
        !window.confirm(
          t('admin.training.startConfirm', {
            name: preflight?.task_name ?? t('admin.training.scope'),
            blocks,
          }),
        )
      ) {
        return
      }
      await api.createTrainingRun({
        task_id: Number(selectedTask),
        name: runName.trim() || undefined,
        params,
      })
      setRunName('')
      await Promise.all([reload(true), refreshSystem()])
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  async function cancel(run: TrainingRun) {
    if (!window.confirm(t('admin.training.cancelConfirm', { name: run.name }))) return
    await api.cancelTrainingRun(run.id)
    await reload(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const result = await api.deleteTrainingRun(deleteTarget.id, deleteFiles)
      const name = deleteTarget.name
      setDeleteTarget(null)
      setDeleteFiles(false)
      setNotice(
        result.files_deleted
          ? t('admin.training.deletedWithFiles', { name })
          : t('admin.training.deletedKeepingFiles', { name, path: result.kept_at ?? '' }),
      )
      await Promise.all([reload(true), refreshSystem()])
    } catch (err) {
      setError(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{t('admin.training.title')}</h1>
          <div className="sub">{t('admin.training.subtitle')}</div>
          <p className="small muted">
            {t('admin.training.adminOnly', {
              path: system?.data_dir
                ? `${system.data_dir}\\training`
                : t('admin.training.localPath'),
            })}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void reload()}>
          {t('common.refresh')}
        </button>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        <Card>
          <h3>{t('admin.training.newRun')}</h3>

          <label className="field">
            <span>{t('admin.training.scope')}</span>
            <select value={selectedTask} onChange={(event) => setSelectedTask(event.target.value)}>
              <option value="">{t('admin.training.selectTask')}…</option>
              {eligible.map((item) => (
                <option key={item.task.id} value={item.task.id}>
                  {t('admin.training.taskOption', {
                    name: item.task.name,
                    count: item.photo_ok + item.photo_warning,
                  })}
                </option>
              ))}
            </select>
            {eligible.length === 0 && <span className="hint">{t('admin.training.noEligible')}</span>}
          </label>

          <label className="field">
            <span>{t('admin.training.name')}</span>
            <input
              type="text"
              value={runName}
              placeholder={t('admin.training.namePlaceholder')}
              onChange={(event) => setRunName(event.target.value)}
            />
          </label>

          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <label className="field" style={{ flex: '1 1 140px' }}>
              <span>{t('admin.training.iterations')}</span>
              <input
                type="number"
                min={1000}
                max={200000}
                step={1000}
                value={params.iterations}
                onChange={(event) => patch({ iterations: Number(event.target.value) })}
              />
            </label>
            <label className="field" style={{ flex: '1 1 160px' }}>
              <span>{t('admin.training.toolchain')}</span>
              <select
                value={params.toolchain}
                onChange={(event) =>
                  patch({ toolchain: event.target.value as TrainingParams['toolchain'] })
                }
              >
                <option value="3dgs">{t('admin.training.toolchain3dgs')}</option>
                <option value="gsplat">{t('admin.training.toolchainGsplat')}</option>
              </select>
            </label>
            <label className="field" style={{ flex: '1 1 140px' }}>
              <span>{t('admin.training.blockMaxPhotos')}</span>
              <input
                type="number"
                min={20}
                max={5000}
                step={20}
                value={params.block_max_photos}
                onChange={(event) => patch({ block_max_photos: Number(event.target.value) })}
              />
            </label>
          </div>

          <div className="row" style={{ gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={params.merge_blocks}
                onChange={(event) => patch({ merge_blocks: event.target.checked })}
              />
              <span>{t('admin.training.mergeBlocks')}</span>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={params.rtk_align}
                onChange={(event) => patch({ rtk_align: event.target.checked })}
              />
              <span>{t('admin.training.rtkAlign')}</span>
            </label>
          </div>

          <button
            type="button"
            className="btn btn-ghost sm"
            style={{ marginTop: 8 }}
            onClick={() => setAdvanced(!advanced)}
          >
            {advanced ? t('admin.training.hideAdvanced') : t('admin.training.showAdvanced')}
          </button>

          {advanced && (
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              <label className="field" style={{ flex: '1 1 150px' }}>
                <span>{t('admin.training.matcher')}</span>
                <select
                  value={params.matcher}
                  onChange={(event) =>
                    patch({ matcher: event.target.value as TrainingParams['matcher'] })
                  }
                >
                  <option value="auto">{t('admin.training.matcherAuto')}</option>
                  <option value="vocab_tree">{t('admin.training.matcherVocab')}</option>
                  <option value="sequential">{t('admin.training.matcherSequential')}</option>
                  <option value="exhaustive">{t('admin.training.matcherExhaustive')}</option>
                </select>
              </label>
              <label className="field" style={{ flex: '1 1 130px' }}>
                <span>{t('admin.training.imageResize')}</span>
                <input
                  type="number"
                  min={800}
                  max={8000}
                  step={200}
                  value={params.image_resize}
                  onChange={(event) => patch({ image_resize: Number(event.target.value) })}
                />
              </label>
              <label className="field" style={{ flex: '1 1 130px' }}>
                <span>{t('admin.training.trainResize')}</span>
                <input
                  type="number"
                  min={400}
                  max={8000}
                  step={200}
                  value={params.train_resize}
                  onChange={(event) => patch({ train_resize: Number(event.target.value) })}
                />
              </label>
              {params.toolchain === 'gsplat' && (
                <label className="field" style={{ flex: '1 1 180px' }}>
                  <span>{t('admin.training.gsplatFactor')}</span>
                  <select
                    value={params.data_factor}
                    onChange={(event) =>
                      patch({ data_factor: Number(event.target.value) as TrainingParams['data_factor'] })
                    }
                  >
                    <option value={1}>{t('admin.training.gsplatFactor1')}</option>
                    <option value={2}>{t('admin.training.gsplatFactor2')}</option>
                    <option value={4}>{t('admin.training.gsplatFactor4')}</option>
                  </select>
                  <span className="hint">{t('admin.training.gsplatFactorHint')}</span>
                </label>
              )}
            </div>
          )}

          <div className="divider" />

          <h4 style={{ marginBottom: 6 }}>{t('admin.training.preflightTitle')}</h4>
          {!selectedTask ? (
            <p className="small muted">{t('admin.training.preflightIdle')}</p>
          ) : preflightLoading && !preflight ? (
            <Spinner />
          ) : preflight ? (
            <>
              <div className="kv">
                <dt>{t('admin.training.photos')}</dt>
                <dd>{t('admin.training.preflightPhotos', { count: preflight.photo_count })}</dd>
                <dt>GPS</dt>
                <dd>{t('admin.training.preflightGps', { count: preflight.gps_photos })}</dd>
                <dt>{t('admin.training.preflightBlockCount')}</dt>
                <dd>{t('admin.training.preflightBlocks', { count: preflight.blocks.length })}</dd>
                <dt>{t('admin.training.blockGaussians')}</dt>
                <dd>
                  {t('admin.training.preflightGaussians', {
                    value: formatGaussians(preflight.estimated_gaussians_per_block),
                    budget: formatGaussians(preflight.gaussian_budget),
                  })}
                </dd>
              </div>

              <details style={{ marginTop: 6 }}>
                <summary className="small muted">{t('admin.training.plan')}</summary>
                <ul className="plain-list small">
                  {preflight.blocks.slice(0, 12).map((block) => (
                    <li key={block.key}>
                      <span className="mono">{block.key.replace(/^b/, '#')}</span> {block.name} ·{' '}
                      {block.photo_count} {t('admin.training.blockPhotos')}
                    </li>
                  ))}
                  {preflight.blocks.length > 12 && (
                    <li className="muted">
                      {t('admin.training.planMore', { count: preflight.blocks.length - 12 })}
                    </li>
                  )}
                </ul>
              </details>

              {Array.from(new Set([...preflight.warnings, ...preflight.command_warnings])).map(
                (warning) => (
                  <p key={warning} className="small warn-text">
                    ⚠️ {warning}
                  </p>
                ),
              )}
            </>
          ) : null}

          {error ? <ErrorBox error={error} /> : null}
          {notice ? <p className="small ok-text">{notice}</p> : null}

          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 10 }}
            disabled={busy || !selectedTask || !preflight || preflight.blocks.length === 0}
            onClick={() => void start()}
          >
            🚀 {busy ? t('common.loading') : t('admin.training.start')}
          </button>
        </Card>

        <Card>
          <h3>{t('admin.training.env')}</h3>
          <div className="kv">
            <dt>{t('admin.training.mode')}</dt>
            <dd>
              {queue?.mode === 'real' ? (
                <Badge tone="ok">{t('admin.training.real')}</Badge>
              ) : (
                <Badge tone="warn">{t('admin.training.mock')}</Badge>
              )}
            </dd>
            <dt>COLMAP</dt>
            <dd>
              {queue?.colmap_configured ? (
                <Badge tone="ok">✓</Badge>
              ) : (
                <Badge tone="bad">{t('admin.training.colmapMissing')}</Badge>
              )}
            </dd>
            <dt>vocab_tree</dt>
            <dd>
              {queue?.vocab_tree_configured ? (
                <Badge tone="ok">✓</Badge>
              ) : (
                <Badge tone="warn">{t('admin.training.vocabMissing')}</Badge>
              )}
            </dd>
            <dt>{t('admin.training.trainerCommand')}</dt>
            <dd>
              {command?.configured ? (
                command.program_available === false ? (
                  <Badge tone="bad">{t('admin.training.commandProgramMissing')}</Badge>
                ) : (
                  <Badge tone="ok">✓</Badge>
                )
              ) : queue?.mode === 'real' ? (
                <Badge tone="bad">
                  {t('admin.training.commandMissing', { variable: command?.env_var ?? '—' })}
                </Badge>
              ) : (
                // mock mode never launches a trainer, so an unset template is
                // not a problem yet
                <Badge tone="warn">
                  {t('admin.training.commandMissingMock', { variable: command?.env_var ?? '—' })}
                </Badge>
              )}
              <div className="small muted mono">
                {command?.env_var ?? t('admin.training.commandNotSet')}
              </div>
            </dd>
            <dt>{t('admin.training.concurrency')}</dt>
            <dd>{queue?.max_concurrent ?? '—'}</dd>
            <dt>{t('admin.training.queuedRunning')}</dt>
            <dd>
              {queue?.queued ?? 0} / {queue?.running ?? 0}
            </dd>
            <dt>{t('admin.training.doneFailed')}</dt>
            <dd>
              {queue?.succeeded ?? 0} / {queue?.failed ?? 0}
            </dd>
          </div>
          <div className="divider" />
          <Link className="btn btn-ghost sm" to="/admin/system">
            {t('admin.nav.system')}
          </Link>
        </Card>
      </div>

      {loading && !runs ? (
        <Spinner />
      ) : (runs?.length ?? 0) === 0 ? (
        <EmptyState text={t('admin.training.empty')} />
      ) : (
        <div className="timeline">
          {runs?.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              open={expanded === run.id}
              onToggle={() => setExpanded(expanded === run.id ? null : run.id)}
              onCancel={() => void cancel(run)}
              onLog={() => setLogRunId(logRunId === run.id ? null : run.id)}
              showLog={logRunId === run.id}
              formatDuration={formatDuration}
              onDelete={() => {
                setDeleteFiles(false)
                setDeleteTarget(run)
              }}
              onRetried={async (message) => {
                setNotice(message)
                await Promise.all([reload(true), refreshSystem()])
              }}
            />
          ))}
        </div>
      )}

      <Modal
        open={deleteTarget !== null}
        title={t('admin.training.deleteTitle')}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? t('common.loading') : t('admin.training.deleteConfirmButton')}
            </button>
          </>
        }
      >
        <p>{t('admin.training.deleteBody', { name: deleteTarget?.name ?? '' })}</p>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={deleteFiles}
            onChange={(event) => setDeleteFiles(event.target.checked)}
          />
          <span>{t('admin.training.deleteFiles')}</span>
        </label>
        <p className="small muted">
          {deleteFiles
            ? t('admin.training.deleteFilesYes', { path: deleteTarget?.output_path ?? '' })
            : t('admin.training.deleteFilesNo', { path: deleteTarget?.output_path ?? '' })}
        </p>
      </Modal>
    </>
  )
}

function RunCard({
  run,
  open,
  onToggle,
  onCancel,
  onLog,
  showLog,
  formatDuration,
  onDelete,
  onRetried,
}: {
  run: TrainingRun
  open: boolean
  onToggle: () => void
  onCancel: () => void
  onLog: () => void
  showLog: boolean
  formatDuration: (seconds: number | null | undefined) => string
  onDelete: () => void
  onRetried: (message: string) => Promise<void> | void
}) {
  const { t } = useI18n()
  const stageIndex = PIPELINE_STAGES.indexOf((run.stage ?? '') as (typeof PIPELINE_STAGES)[number])
  const hasPly = (run.artifacts ?? []).some((artifact) => artifact.kind === 'ply')

  return (
    <div className="run-item">
      <div className="head">
        <div>
          <strong>{run.name}</strong>
          <div className="small muted">
            #{run.id} · {formatDateTime(run.created_at)} · {run.created_by ?? t('common.admin')}
            {run.reuse_run_id ? ` · ${t('admin.training.reusedFrom', { run: run.reuse_run_id })}` : ''}
          </div>
        </div>
        <div className="row">
          <Badge tone={statusTone(run.status)}>{t(`training.status.${run.status}` as never)}</Badge>
          <span className="small muted">
            {run.stage ? t(`training.stage.${run.stage}` as never) : ''}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <ProgressBar value={run.progress} height={8} />
      </div>

      <div className="stage-strip">
        {PIPELINE_STAGES.map((stage, index) => (
          <span
            key={stage}
            className={`stage-chip${stageIndex === index ? ' active' : ''}${
              stageIndex > index || run.status === 'succeeded' ? ' done' : ''
            }`}
          >
            {t(`training.stage.${stage}` as never)}
          </span>
        ))}
      </div>

      <div className="row between" style={{ marginTop: 8 }}>
        <span className="small muted">{run.message ?? ''}</span>
        <span className="small muted">
          {t('admin.training.photos')} {run.photo_count}
          {run.block_total
            ? ` · ${t('admin.training.blocks', { done: run.block_done, total: run.block_total })}`
            : ''}
          {' · '}
          {t('admin.training.duration')} {formatDuration(run.duration_seconds)}
        </span>
      </div>

      <div className="row" style={{ marginTop: 10, gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost sm" onClick={onToggle}>
          {open ? t('common.close') : t('admin.training.block')}
        </button>
        {hasPly && (
          <Link className="btn btn-ghost sm" to={`/admin/training/${run.id}/preview`}>
            🧊 {t('admin.training.openPreview')}
          </Link>
        )}
        <button type="button" className="btn btn-ghost sm" onClick={onLog}>
          {showLog ? t('admin.training.hideLog') : t('admin.training.log')}
        </button>
        {run.status === 'running' || run.status === 'queued' ? (
          <button type="button" className="btn btn-danger sm" onClick={onCancel}>
            {t('admin.training.cancel')}
          </button>
        ) : null}
        {run.status !== 'running' ? (
          <button type="button" className="btn btn-ghost sm" onClick={onDelete}>
            🗑 {t('common.delete')}
          </button>
        ) : null}
        {run.output_path && <span className="small muted mono">{run.output_path}</span>}
      </div>

      {open && <RunDetail runId={run.id} onRetried={onRetried} />}
      {showLog && <RunLog runId={run.id} />}
    </div>
  )
}

function RunDetail({
  runId,
  onRetried,
}: {
  runId: number
  onRetried: (message: string) => Promise<void> | void
}) {
  const { t } = useI18n()
  const [blockLogId, setBlockLogId] = useState<number | null>(null)
  const { data, error, loading, silentRefresh } = useAsync(
    () => api.trainingRun(runId),
    [runId],
  )

  usePolling(
    () => silentRefresh(),
    3_000,
    // Only worth polling while the run is actually moving
    Boolean(data) && (data?.status === 'running' || data?.status === 'queued'),
  )

  async function retry(block: TrainingBlock) {
    if (!window.confirm(t('admin.training.retryConfirm', { name: block.name }))) return
    const created = await api.retryTrainingBlock(block.id)
    await onRetried(t('admin.training.retryQueued', { name: created.name }))
  }

  if (error) return <ErrorBox error={error} />
  if (!data) return loading ? <Spinner /> : null

  return (
    <div className="run-detail">
      <table className="data-table compact">
        <thead>
          <tr>
            <th>{t('admin.training.block')}</th>
            <th>{t('admin.training.photos')}</th>
            <th>{t('admin.training.stage')}</th>
            <th>{t('table.progress')}</th>
            <th>{t('admin.training.blockGaussians')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.blocks.map((block) => (
            <tr key={block.id}>
              <td>
                <strong>{block.name}</strong>
                <div className="small muted mono">{block.key}</div>
              </td>
              <td>{block.photo_count}</td>
              <td>
                <Badge tone={statusTone(block.status)}>
                  {t(`training.status.${block.status}` as never)}
                </Badge>
                <div className="small muted">
                  {block.stage ? t(`training.stage.${block.stage}` as never) : ''}
                </div>
              </td>
              <td style={{ minWidth: 110 }}>
                <ProgressBar value={block.progress} height={6} />
                <span className="small muted">{Math.round(block.progress)}%</span>
              </td>
              <td className="small">
                {formatGaussians(block.metrics?.gaussians ?? 0)}
                <div className="small muted">{formatBytes(block.metrics?.size_bytes ?? 0)}</div>
              </td>
              <td>
                <div className="row" style={{ gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-ghost sm"
                    onClick={() => setBlockLogId(blockLogId === block.id ? null : block.id)}
                  >
                    {blockLogId === block.id
                      ? t('admin.training.hideBlockLog')
                      : t('admin.training.blockLog')}
                  </button>
                  {block.status === 'failed' || block.status === 'skipped' ? (
                    <button
                      type="button"
                      className="btn btn-ghost sm"
                      onClick={() => void retry(block)}
                    >
                      ♻ {t('admin.training.retryBlock')}
                    </button>
                  ) : null}
                </div>
                {block.message && <div className="small muted">{block.message}</div>}
                {blockLogId === block.id && <BlockLog blockId={block.id} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ margin: '12px 0 6px' }}>{t('admin.training.artifacts')}</h4>
      {(data.artifacts ?? []).length === 0 ? (
        <p className="small muted">{t('admin.training.noArtifacts')}</p>
      ) : (
        <ul className="plain-list small">
          {data.artifacts?.map((artifact) => (
            <li key={artifact.path} className="row between" style={{ gap: 8 }}>
              <span>
                {artifact.kind === 'ply' ? '🧊' : '📄'}{' '}
                {artifact.kind === 'transform'
                  ? t('admin.training.artifactTransform')
                  : artifact.kind === 'manifest'
                    ? t('admin.training.artifactManifest')
                    : artifact.merged
                      ? t('admin.training.artifactMerged')
                      : t('admin.training.artifactBlock')}
                {': '}
                <span className="mono">{artifact.name}</span>{' '}
                <span className="muted">
                  {formatBytes(artifact.size_bytes)}
                  {artifact.gaussians ? ` · ${formatGaussians(artifact.gaussians)}` : ''}
                </span>
              </span>
              {artifact.kind === 'ply' && (
                <Link className="btn btn-ghost sm" to={`/admin/training/${runId}/preview`}>
                  {t('admin.training.openPreview')}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RunLog({ runId }: { runId: number }) {
  const { t } = useI18n()
  const { data, error } = useAsync(() => api.trainingLog(runId, 400), [runId])
  if (error) return <ErrorBox error={error} />
  if (!data) return <Spinner />
  if (data.lines.length === 0) {
    return <p className="small muted">{t('admin.training.noLog')}</p>
  }
  return <pre className="log-view">{data.lines.join('\n')}</pre>
}

function BlockLog({ blockId }: { blockId: number }) {
  const { t } = useI18n()
  const { data, error, silentRefresh } = useAsync(() => api.trainingBlockLog(blockId, 300), [blockId])
  usePolling(() => silentRefresh(), 5_000, Boolean(data))
  if (error) return <ErrorBox error={error} />
  if (!data) return <Spinner />
  if (data.lines.length === 0) return <p className="small muted">{t('admin.training.noLog')}</p>
  return <pre className="log-view">{data.lines.join('\n')}</pre>
}
