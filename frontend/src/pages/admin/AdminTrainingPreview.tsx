import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as THREE from 'three'
import { SceneFormat, Viewer } from '@mkkellogg/gaussian-splats-3d'
import { api } from '../../api'
import { Badge, ErrorBox, Spinner, formatBytes, statusTone, useAsync } from '../../components/common'
import { useI18n } from '../../i18n'
import type { Placement, PlacementUpdate } from '../../types'

/**
 * 3D preview + manual placement editor.
 *
 * Why this editor exists: indoor and outdoor are two *independent* COLMAP
 * solves with no shared features, so nothing can align them automatically
 * (docs/training-pipeline.md §6.2). The admin loads both runs here, drags the
 * indoor clouds onto the outdoor model, and the placement is written back into
 * transforms.json as a similarity transform.
 *
 * Controls follow the Blender convention: plain mouse moves the camera,
 * Alt + mouse moves the selected cloud.
 */
export default function AdminTrainingPreview() {
  const { runId } = useParams<{ runId: string }>()
  const id = Number(runId)
  const { t } = useI18n()

  const [reference, setReference] = useState<number[]>([])
  const { data: runs } = useAsync(() => api.trainingRuns(40), [])
  const { data, error, reload } = useAsync(() => api.trainingPreview(id, reference), [id, reference])

  const [placements, setPlacements] = useState<Record<string, Placement>>({})
  const [savedPlacements, setSavedPlacements] = useState<Record<string, Placement>>({})
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)
  // Raw text of a half-typed number ("-" or "1." are not valid numbers yet);
  // without this a controlled number input eats the keystroke.
  const [editText, setEditText] = useState<Record<string, string>>({})
  // Visible feedback that a drag is actually being handled (vs. the camera
  // reacting instead) — the one thing that is hard to tell apart on screen
  const [dragging, setDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const indexByKey = useRef<Record<string, number>>({})
  const dataRef = useRef(data)
  dataRef.current = data
  const selectedRef = useRef<string | null>(null)
  selectedRef.current = selectedKey
  // Edit mode = drag the cloud without holding Alt (for touch screens and
  // desktops where Alt is grabbed by the window manager)
  const [editMode, setEditMode] = useState(false)
  const editModeRef = useRef(false)
  editModeRef.current = editMode

  // A new URL set or a new reference run means the point clouds change, which
  // means a rebuild of the splat mesh (the viewer has no incremental add).
  const sceneSignature = useMemo(
    () => (data ? data.scenes.map((scene) => `${scene.key}@${scene.url}`).join('|') : ''),
    [data],
  )

  const candidateRuns = useMemo(
    () =>
      (runs ?? []).filter(
        (run) =>
          run.id !== id &&
          run.status === 'succeeded' &&
          (run.artifacts ?? []).some((artifact) => artifact.kind === 'ply'),
      ),
    [runs, id],
  )

  // ---------------------------------------------------------------- loading

  useEffect(() => {
    const container = containerRef.current
    const current = dataRef.current
    if (!container || !current) return

    let disposed = false
    setLoading(true)
    setLoadError(null)
    setLoadedCount(0)
    indexByKey.current = {}

    const viewer = new Viewer({
      // The 3DGS convention is +Y up in world space, so the camera up vector is -Y
      cameraUp: [0, -1, 0],
      initialCameraPosition: [0, -3, 9],
      initialCameraLookAt: [0, 0, 0],
      rootElement: container,
      selfDrivenMode: true,
      useBuiltInControls: true,
      sharedMemoryForWorkers: false,
      // Required: with a static scene the library bakes each scene transform in
      // and moving a cloud at runtime would have no effect.
      dynamicScene: true,
      // Required for `scene.visible` (per-scene show / hide)
      enableOptionalEffects: true,
    })
    viewerRef.current = viewer
    viewer.start()

    void (async () => {
      try {
        for (const scene of current.scenes) {
          if (disposed) return
          await viewer.addSplatScene(scene.url, {
            // Don't let the loader guess the format from the URL — say it
            format: SceneFormat.Ply,
            showLoadingUI: false,
            splatAlphaRemovalThreshold: 2,
          })
          if (disposed) return
          // Scenes are appended in load order, so the last one is ours
          indexByKey.current[scene.key] = viewer.splatMesh.scenes.length - 1
          setLoadedCount((count) => count + 1)
        }
      } catch (err) {
        if (!disposed) setLoadError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!disposed) setLoading(false)
      }
    })()

    return () => {
      disposed = true
      try {
        viewer.dispose()
      } catch {
        /* already torn down */
      }
      viewerRef.current = null
      indexByKey.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneSignature])

  // Server state -> editor state (also resets the editor after a save)
  useEffect(() => {
    if (!data) return
    const initial: Record<string, Placement> = {}
    for (const scene of data.scenes) initial[scene.key] = clonePlacement(scene.placement)
    setPlacements(initial)
    setSavedPlacements(cloneAll(initial))

    // Visibility defaults, so it is obvious which cloud is being moved:
    //  * this run's merged cloud sits exactly on top of its own blocks — hide it
    //    (a drag of the merged cloud looks like "nothing moved")
    //  * a reference run that has a merged cloud starts collapsed to that cloud
    const hostHasBlocks = data.scenes.some(
      (scene) => !scene.merged && !scene.is_reference,
    )
    const mergedRuns = new Set(
      data.scenes
        .filter((scene) => scene.is_reference && scene.merged)
        .map((scene) => scene.run_id),
    )
    const hiddenInitial: Record<string, boolean> = {}
    for (const scene of data.scenes) {
      if (scene.is_reference) {
        if (!scene.merged && mergedRuns.has(scene.run_id)) hiddenInitial[scene.key] = true
      } else if (scene.merged && hostHasBlocks) {
        hiddenInitial[scene.key] = true
      }
    }
    setHidden(hiddenInitial)
    setEditText({})

    // Select a block by default, not the merged cloud that covers it
    const firstBlock = data.scenes.find((scene) => !scene.merged && !scene.is_reference)
    const fallback = firstBlock ?? data.scenes[0]
    setSelectedKey((key) => (key && initial[key] ? key : (fallback?.key ?? null)))
  }, [data])

  // Push placements / visibility into the viewer (no reload needed)
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    for (const [key, placement] of Object.entries(placements)) {
      const index = indexByKey.current[key]
      if (index === undefined) continue
      viewer.splatMesh.getScene(index).transform.copy(placementMatrix(placement))
    }
  }, [placements, loadedCount])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    for (const [key, index] of Object.entries(indexByKey.current)) {
      const scene = viewer.splatMesh.getScene(index)
      if (scene) scene.visible = !hidden[key]
    }
  }, [hidden, loadedCount])

  // Dim everything else in the same coordinate system, so the cloud that is
  // about to move is unmistakable (cross-run clouds stay fully opaque: they sit
  // in a different place and are the placement target)
  useEffect(() => {
    const viewer = viewerRef.current
    const scenes = dataRef.current?.scenes
    if (!viewer || !scenes) return
    const selectedScene = scenes.find((scene) => scene.key === selectedKey)
    for (const scene of scenes) {
      const index = indexByKey.current[scene.key]
      if (index === undefined) continue
      const target = viewer.splatMesh.getScene(index)
      if (!target) continue
      const sameGroup = scene.is_reference === (selectedScene?.is_reference ?? false)
      const isSelected = scene.key === selectedKey
      target.opacity = !selectedScene || isSelected || !sameGroup ? 1.0 : 0.45
    }
  }, [selectedKey, loadedCount])

  // ---------------------------------------------------------------- editing

  const worldPerPixel = useCallback((placement: Placement) => {
    const viewer = viewerRef.current
    const container = containerRef.current
    if (!viewer || !container) return 0.01
    const pivot = new THREE.Vector3(
      placement.pivot[0] + placement.offset[0],
      placement.pivot[1] + placement.offset[1],
      placement.pivot[2] + placement.offset[2],
    )
    const distance = viewer.camera.position.distanceTo(pivot)
    const height = container.clientHeight || 1
    const fov = ((viewer.camera.fov || 50) * Math.PI) / 180
    return (2 * Math.tan(fov / 2) * distance) / height
  }, [])

  const nudge = useCallback(
    (mutate: (placement: Placement) => Placement) => {
      const key = selectedRef.current
      if (!key) return
      setPlacements((current) => {
        const placement = current[key]
        if (!placement) return current
        return { ...current, [key]: mutate(placement) }
      })
    },
    [],
  )

  /** Buffer of a half-typed number for the currently selected cloud. */
  const setBuffer = useCallback((field: string, raw?: string) => {
    const key = selectedRef.current
    if (!key) return
    const id = `${key}:${field}`
    setEditText((current) => {
      const next = { ...current }
      if (raw === undefined) delete next[id]
      else next[id] = raw
      return next
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let mode: 'move' | 'rotate' | null = null
    let lastX = 0
    let lastY = 0

    const onPointerDown = (event: PointerEvent) => {
      // Alt always edits; in edit mode a plain drag edits (Shift gives the
      // camera back, so the view can still be moved without leaving the mode)
      const wantsEdit = event.altKey || (editModeRef.current && !event.shiftKey)
      if (!wantsEdit || !selectedRef.current) return
      if (event.button !== 0 && event.button !== 2) return
      mode = event.button === 2 ? 'rotate' : 'move'
      lastX = event.clientX
      lastY = event.clientY
      // OrbitControls listens on this very element, and stopPropagation() only
      // silences *other* nodes — its listener would still run and steal the
      // drag. stopImmediatePropagation() plus disabling the controls is what
      // actually holds the camera still.
      event.stopImmediatePropagation()
      event.preventDefault()
      const controls = viewerRef.current?.controls
      if (controls) controls.enabled = false
      setDragging(true)
      // A half-typed number must not keep hiding the live values
      setEditText({})
      window.addEventListener('pointermove', onPointerMove, true)
      window.addEventListener('pointerup', onPointerUp, true)
      window.addEventListener('pointercancel', onPointerUp, true)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!mode) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      event.stopPropagation()
      event.preventDefault()

      if (mode === 'rotate') {
        nudge((placement) => ({ ...placement, yaw: placement.yaw - dx * 0.006 }))
        return
      }

      const viewer = viewerRef.current
      const camera = viewer?.camera
      if (!camera) return
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
      nudge((placement) => {
        const perPixel = worldPerPixel(placement)
        const move = new THREE.Vector3()
          .addScaledVector(right, dx * perPixel)
          .addScaledVector(up, -dy * perPixel)
        return {
          ...placement,
          offset: [
            placement.offset[0] + move.x,
            placement.offset[1] + move.y,
            placement.offset[2] + move.z,
          ],
        }
      })
    }

    const onPointerUp = () => {
      mode = null
      setDragging(false)
      const controls = viewerRef.current?.controls
      if (controls) controls.enabled = true
      window.removeEventListener('pointermove', onPointerMove, true)
      window.removeEventListener('pointerup', onPointerUp, true)
      window.removeEventListener('pointercancel', onPointerUp, true)
    }

    const onWheel = (event: WheelEvent) => {
      const wantsEdit = event.altKey || (editModeRef.current && !event.shiftKey)
      if (!wantsEdit || !selectedRef.current) return
      event.preventDefault()
      // Same reason as pointerdown: the wheel handler of OrbitControls sits on
      // this element too, so the propagation stop has to be "immediate"
      event.stopImmediatePropagation()
      const factor = Math.exp(-event.deltaY * 0.0015)
      nudge((placement) => ({
        ...placement,
        scale: clamp(placement.scale * factor, 0.02, 50),
      }))
    }

    const onContextMenu = (event: MouseEvent) => {
      // Right-drag rotates the cloud; don't pop the browser menu on top of it
      if (event.altKey || (editModeRef.current && !event.shiftKey)) event.preventDefault()
    }

    container.addEventListener('pointerdown', onPointerDown, true)
    container.addEventListener('wheel', onWheel, { passive: false, capture: true })
    container.addEventListener('contextmenu', onContextMenu)
    return () => {
      container.removeEventListener('pointerdown', onPointerDown, true)
      container.removeEventListener('wheel', onWheel, true)
      container.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('pointermove', onPointerMove, true)
      window.removeEventListener('pointerup', onPointerUp, true)
      window.removeEventListener('pointercancel', onPointerUp, true)
      const controls = viewerRef.current?.controls
      if (controls) controls.enabled = true
    }
  }, [nudge, worldPerPixel])

  // ---------------------------------------------------------------- saving

  const dirtyKeys = useMemo(
    () =>
      Object.keys(placements).filter((key) => !placementsEqual(placements[key], savedPlacements[key])),
    [placements, savedPlacements],
  )

  async function save() {
    if (!data || dirtyKeys.length === 0) return
    setSaving(true)
    setNotice(null)
    setErrorNotice(null)
    try {
      const payload: PlacementUpdate[] = []
      for (const scene of data.scenes) {
        if (!dirtyKeys.includes(scene.key)) continue
        const placement = placements[scene.key]
        payload.push({
          key: scene.block_key ?? 'merged',
          run_id: scene.is_reference ? scene.run_id : null,
          offset: [...placement.offset],
          yaw: placement.yaw,
          pitch: placement.pitch,
          roll: placement.roll,
          scale: placement.scale,
        })
      }
      const result = await api.updateTrainingTransforms(id, payload)
      setSavedPlacements(cloneAll(placements))
      setNotice(t('admin.preview.saved', { count: result.saved }))
      await reload(true)
    } catch (err) {
      setErrorNotice(t('admin.preview.saveFailed', { error: String(err) }))
    } finally {
      setSaving(false)
    }
  }

  const selected = data?.scenes.find((scene) => scene.key === selectedKey) ?? null
  const selectedPlacement = selectedKey ? placements[selectedKey] : undefined

  // ---------------------------------------------------------------- render

  if (error) {
    return (
      <div className="page-head">
        <div>
          <h1>{t('admin.preview.title')}</h1>
          <ErrorBox error={error} />
          <Link className="btn btn-ghost" to="/admin/training">
            {t('admin.preview.back')}
          </Link>
        </div>
      </div>
    )
  }

  if (!data) return <Spinner />

  return (
    <div className="preview-shell">
      <div className="preview-bar">
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn btn-ghost sm" to="/admin/training">
            ← {t('admin.preview.back')}
          </Link>
          <strong>{data.name}</strong>
          <Badge tone={statusTone(data.status)}>{t(`training.status.${data.status}` as never)}</Badge>
          <span className="small muted">
            {t('admin.preview.coordinate')}:{' '}
            {['colmap_world', 'enu_metres'].includes(data.coordinate_system)
              ? t(`admin.preview.coordinate.${data.coordinate_system}` as never)
              : data.coordinate_system}
          </span>
          <button
            type="button"
            className={`btn sm ${editMode ? 'btn-primary' : 'btn-ghost'}`}
            disabled={!selected}
            title={t('admin.preview.editHint')}
            onClick={() => setEditMode((value) => !value)}
          >
            ✥ {editMode ? t('admin.preview.editExit') : t('admin.preview.editEnter')}
          </button>
        </div>
        <span className="small muted">
          {loading
            ? t('admin.preview.loadingScene', { done: loadedCount, total: data.scenes.length })
            : t('admin.preview.loaded', { count: loadedCount })}
        </span>
      </div>

      <div className="preview-body">
        <div className={`preview-canvas${editMode && selected ? ' edit-active' : ''}`} ref={containerRef}>
          {editMode && selected && selectedPlacement ? (
            <div className="preview-toast">
              <div>
                <strong>{t('admin.preview.moving', { name: selected.name })}</strong>
              </div>
              <div>
                {dragging ? (
                  <span className="ok-text">● {t('admin.preview.dragging')}</span>
                ) : (
                  t('admin.preview.editActive')
                )}
              </div>
              <div className="mono">
                {`Δ ${selectedPlacement.offset
                  .map((value) => round(value, 3))
                  .join(', ')}  ·  ${angleDegrees(selectedPlacement.yaw)}° / ${angleDegrees(
                  selectedPlacement.pitch,
                )}° / ${angleDegrees(selectedPlacement.roll)}°  ·  ×${round(
                  selectedPlacement.scale,
                  3,
                )}`}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="preview-panel">
          <h4>{t('admin.preview.referenceTitle')}</h4>
          <p className="small muted">{t('admin.preview.referenceHint')}</p>
          {candidateRuns.length === 0 ? (
            <p className="small muted">{t('admin.preview.referenceEmpty')}</p>
          ) : (
            <ul className="preview-scenes">
              {candidateRuns.map((run) => (
                <li
                  key={run.id}
                  className={reference.includes(run.id) ? 'active' : ''}
                  onClick={() =>
                    setReference((current) =>
                      current.includes(run.id)
                        ? current.filter((value) => value !== run.id)
                        : [...current, run.id],
                    )
                  }
                >
                  <input type="checkbox" checked={reference.includes(run.id)} readOnly />
                  <div className="preview-scene-text">
                    <div>
                      #{run.id} {run.name}
                    </div>
                    <div className="small muted">
                      {run.scope_kind === 'outdoor'
                        ? t('admin.preview.outdoor')
                        : t('admin.preview.indoor')}
                      {' · '}
                      {t('admin.preview.blocksCount', { count: run.block_total })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="divider" />

          <h4>{t('admin.preview.scenes')}</h4>
          {data.scenes.length === 0 ? (
            <p className="small muted">{t('admin.preview.empty')}</p>
          ) : (
            <ul className="preview-scenes">
              {data.scenes.map((scene) => (
                <li
                  key={scene.key}
                  className={selectedKey === scene.key ? 'active' : ''}
                  onClick={() => setSelectedKey(scene.key)}
                >
                  <input
                    type="checkbox"
                    checked={!hidden[scene.key]}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() =>
                      setHidden((current) => ({ ...current, [scene.key]: !current[scene.key] }))
                    }
                    title={t('admin.preview.visible')}
                  />
                  <span
                    className="preview-dot"
                    style={{
                      background: `rgb(${scene.color
                        .map((channel) => Math.round(channel * 255))
                        .join(',')})`,
                    }}
                  />
                  <div className="preview-scene-text">
                    <div>
                      {scene.merged
                        ? t('admin.preview.merged')
                        : `${t('admin.preview.block')}: ${scene.name}`}
                      {scene.is_reference ? ` · #${scene.run_id}` : ''}
                      {scene.transform_source === 'manual' ? (
                        <span className="ok-text" title={t('admin.preview.placed')}>
                          {' '}
                          ✓
                        </span>
                      ) : null}
                      {placementsEqual(placements[scene.key], savedPlacements[scene.key]) ? null : (
                        <span className="warn-text"> *</span>
                      )}
                    </div>
                    <div className="small muted">
                      {scene.gaussians > 0
                        ? `${scene.gaussians.toLocaleString()} ${t('admin.training.blockGaussians')}`
                        : ''}
                      {scene.size_bytes ? ` · ${formatBytes(scene.size_bytes)}` : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="divider" />

          <h4>{t('admin.preview.place')}</h4>
          {!selected || !selectedPlacement ? (
            <p className="small muted">{t('admin.preview.selectScene')}</p>
          ) : (
            <>
              <p className="small muted">{selected.name}</p>
              <div className="placement-grid">
                <span className="small muted">{t('admin.preview.position')}</span>
                {(['x', 'y', 'z'] as const).map((axis, index) => {
                  const field = `pos${index}`
                  const buffer = editText[`${selected.key}:${field}`]
                  const absolute =
                    selectedPlacement.pivot[index] + selectedPlacement.offset[index]
                  return (
                    <label key={axis} className="placement-input">
                      <span>{axis.toUpperCase()}</span>
                      <input
                        type="number"
                        step={0.1}
                        value={buffer ?? String(round(absolute, 3))}
                        onChange={(event) => {
                          const raw = event.target.value
                          setBuffer(field, raw)
                          if (raw.trim() === '') return
                          const parsed = Number(raw)
                          if (!Number.isFinite(parsed)) return
                          nudge((placement) => {
                            const offset = [...placement.offset]
                            offset[index] = parsed - placement.pivot[index]
                            return { ...placement, offset }
                          })
                        }}
                        onBlur={() => setBuffer(field)}
                      />
                    </label>
                  )
                })}
              </div>

              <div className="placement-grid">
                <span className="small muted">{t('admin.preview.rotation')}</span>
                {(
                  [
                    ['pitch', 'X'],
                    ['yaw', 'Y'],
                    ['roll', 'Z'],
                  ] as const
                ).map(([field, axis]) => (
                  <label key={field} className="placement-input">
                    <span>{axis}</span>
                    <input
                      type="number"
                      step={1}
                      value={
                        editText[`${selected.key}:${field}`] ??
                        String(angleDegrees(selectedPlacement[field]))
                      }
                      onChange={(event) => {
                        const raw = event.target.value
                        setBuffer(field, raw)
                        if (raw.trim() === '') return
                        const parsed = Number(raw)
                        if (!Number.isFinite(parsed)) return
                        nudge((placement) => ({
                          ...placement,
                          [field]: (parsed * Math.PI) / 180,
                        }))
                      }}
                      onBlur={() => setBuffer(field)}
                    />
                  </label>
                ))}
              </div>

              <div className="placement-grid">
                <span className="small muted">{t('admin.preview.scale')}</span>
                <input
                  type="range"
                  min={0.1}
                  max={4}
                  step={0.01}
                  value={round(selectedPlacement.scale, 3)}
                  onChange={(event) =>
                    nudge((placement) => ({ ...placement, scale: Number(event.target.value) }))
                  }
                />
                <input
                  type="number"
                  step={0.01}
                  value={
                    editText[`${selected.key}:scale`] ?? String(round(selectedPlacement.scale, 3))
                  }
                  onChange={(event) => {
                    const raw = event.target.value
                    setBuffer('scale', raw)
                    if (raw.trim() === '') return
                    const parsed = Number(raw)
                    if (!Number.isFinite(parsed) || parsed <= 0) return
                    nudge((placement) => ({ ...placement, scale: parsed }))
                  }}
                  onBlur={() => setBuffer('scale')}
                />
              </div>

              <p className="small muted">
                {t('admin.preview.pivotHint', {
                  x: round(selectedPlacement.pivot[0], 2),
                  y: round(selectedPlacement.pivot[1], 2),
                  z: round(selectedPlacement.pivot[2], 2),
                })}
              </p>

              <div className="row" style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-ghost sm"
                  onClick={() => {
                    const original = savedPlacements[selected.key]
                    if (!original) return
                    setEditText({})
                    setPlacements((current) => ({
                      ...current,
                      [selected.key]: {
                        pivot: [...original.pivot],
                        offset: [0, 0, 0],
                        yaw: 0,
                        pitch: 0,
                        roll: 0,
                        scale: 1,
                      },
                    }))
                  }}
                >
                  {t('admin.preview.reset')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost sm"
                  disabled={dirtyKeys.length === 0}
                  onClick={() => {
                    setEditText({})
                    setPlacements(cloneAll(savedPlacements))
                  }}
                >
                  {t('admin.preview.revert')}
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary sm"
                style={{ marginTop: 8 }}
                disabled={saving || dirtyKeys.length === 0 || loading}
                onClick={() => void save()}
              >
                {saving
                  ? t('admin.preview.saving')
                  : t('admin.preview.save', { count: dirtyKeys.length })}
              </button>

              {notice ? <p className="small ok-text">{notice}</p> : null}
              {errorNotice ? <p className="small warn-text">{errorNotice}</p> : null}
            </>
          )}

          {loadError ? (
            <p className="small warn-text">{t('admin.preview.failed', { error: loadError })}</p>
          ) : null}

          <div className="divider" />
          <p className="small muted">{t('admin.preview.gizmoHint')}</p>
          <p className="small muted">{t('admin.preview.cameraHint')}</p>
          <p className="small muted">{t('admin.preview.manualNote')}</p>
        </aside>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- helpers

function clonePlacement(placement: Placement): Placement {
  return {
    pivot: [...placement.pivot],
    offset: [...placement.offset],
    yaw: placement.yaw,
    pitch: placement.pitch,
    roll: placement.roll,
    scale: placement.scale,
  }
}

function cloneAll(source: Record<string, Placement>): Record<string, Placement> {
  const out: Record<string, Placement> = {}
  for (const [key, placement] of Object.entries(source)) out[key] = clonePlacement(placement)
  return out
}

/** Wrap an angle into (-180, 180] degrees so the inputs agree with the model. */
function angleDegrees(radians: number): number {
  const degrees = (radians * 180) / Math.PI
  const wrapped = (((degrees + 180) % 360) + 360) % 360 - 180
  return round(wrapped === -180 ? 180 : wrapped, 1)
}

function placementsEqual(a?: Placement, b?: Placement): boolean {
  if (!a || !b) return true
  return (
    Math.abs(a.yaw - b.yaw) < 1e-9 &&
    Math.abs(a.pitch - b.pitch) < 1e-9 &&
    Math.abs(a.roll - b.roll) < 1e-9 &&
    Math.abs(a.scale - b.scale) < 1e-9 &&
    a.offset.every((value, index) => Math.abs(value - b.offset[index]) < 1e-9)
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/**
 * Same formula as `splat.similarity_matrix` on the backend:
 * ``T(pivot + offset) · Rz(roll)·Ry(yaw)·Rx(pitch) · S(scale) · T(-pivot)`` —
 * rotating and scaling happen around the cloud's own pivot so it stays where it
 * was put. Angles are radians; the two implementations are compared by test.
 */
function placementMatrix(placement: Placement): THREE.Matrix4 {
  const [px, py, pz] = placement.pivot
  const [ox, oy, oz] = placement.offset
  const ca = Math.cos(placement.pitch)
  const sa = Math.sin(placement.pitch)
  const cb = Math.cos(placement.yaw)
  const sb = Math.sin(placement.yaw)
  const cg = Math.cos(placement.roll)
  const sg = Math.sin(placement.roll)

  const r00 = cb * cg
  const r01 = cg * sb * sa - ca * sg
  const r02 = ca * cg * sb + sa * sg
  const r10 = cb * sg
  const r11 = sa * sb * sg + ca * cg
  const r12 = ca * sb * sg - cg * sa
  const r20 = -sb
  const r21 = cb * sa
  const r22 = ca * cb

  const s = placement.scale
  const tx = px + ox - s * (r00 * px + r01 * py + r02 * pz)
  const ty = py + oy - s * (r10 * px + r11 * py + r12 * pz)
  const tz = pz + oz - s * (r20 * px + r21 * py + r22 * pz)

  const matrix = new THREE.Matrix4()
  matrix.set(
    s * r00, s * r01, s * r02, tx,
    s * r10, s * r11, s * r12, ty,
    s * r20, s * r21, s * r22, tz,
    0, 0, 0, 1,
  )
  return matrix
}
