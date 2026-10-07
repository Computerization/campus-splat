/**
 * Minimal type declarations for @mkkellogg/gaussian-splats-3d.
 *
 * The package ships plain JavaScript (no .d.ts), so we declare the small slice
 * the admin preview uses. Keeping it here means the viewer stays a normal npm
 * dependency and the build type-checks.
 */
declare module '@mkkellogg/gaussian-splats-3d' {
  import type { Matrix4, PerspectiveCamera, Scene, Vector3 } from 'three'

  export interface ViewerOptions {
    cameraUp?: number[]
    initialCameraPosition?: number[]
    initialCameraLookAt?: number[]
    rootElement?: HTMLElement
    selfDrivenMode?: boolean
    useBuiltInControls?: boolean
    sharedMemoryForWorkers?: boolean
    ignoreDevicePixelRatio?: boolean
    gpuAcceleratedSort?: boolean
    halfPrecisionCovariancesOnGPU?: boolean
    /** Required for moving scenes at runtime (see the placement editor) */
    dynamicScene?: boolean
    /** Required for per-scene visibility (`scene.visible`) */
    enableOptionalEffects?: boolean
    antialiased?: boolean
    focalAdjustment?: number
    logLevel?: number
  }

  export interface SplatSceneOptions {
    splatAlphaRemovalThreshold?: number
    showLoadingUI?: boolean
    progressiveLoad?: boolean
    position?: number[]
    rotation?: number[]
    scale?: number[]
    format?: number
    onProgress?: (percent: number) => void
  }

  /** A single scene inside a SplatMesh: transform, visibility, opacity. */
  export interface SplatScene {
    transform: Matrix4
    visible: boolean
    opacity: number
  }

  export class SplatMesh {
    scenes: SplatScene[]
    dynamicMode: boolean
    splatRenderMode: number
    getScene(index: number): SplatScene
    getSceneTransform(index: number, matrix: Matrix4): void
    getSplatCount(): number
    updateTransforms(): void
  }

  export class Viewer {
    constructor(options?: ViewerOptions)
    splatMesh: SplatMesh
    camera: PerspectiveCamera
    threeScene: Scene
    cameraUp: Vector3
    splatRenderMode: number
    /** Built-in OrbitControls; turned off while dragging a cloud */
    controls: { enabled: boolean; update?: () => void } | null
    addSplatScene(path: string, options?: SplatSceneOptions): Promise<void>
    addSplatScenes(
      scenes: Array<{ path: string } & SplatSceneOptions>,
      showLoadingUI?: boolean,
      onProgress?: (percent: number) => void,
    ): Promise<void>
    removeSplatScene(index: number, showLoadingUI?: boolean): Promise<void>
    removeSplatScenes(indexes?: number[], showLoadingUI?: boolean): Promise<void>
    start(): void
    dispose(): void
  }

  export class DropInViewer extends Viewer {}

  export const SceneFormat: { Ply: number; Splat: number; KSplat: number; Spz: number }
  export const SceneRevealMode: { Default: number; Gradual: number; Instant: number }
  export const RenderMode: { Always: number; OnChange: number; Never: number }
  export const WebXRMode: { None: number; VR: number; AR: number }
  export const LogLevel: {
    None: number
    Error: number
    Warning: number
    Info: number
    Debug: number
    Time: number
  }
}
