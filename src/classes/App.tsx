import * as THREE from 'three'
import { SceneManager } from './SceneManager.tsx'
import { ModelLoader } from './ModelLoader.tsx'
import { ParticleSystem } from './ParticleSystem.tsx'
import { MouseTracker } from './MouseTracker.tsx'
import { ModelAnimator } from './ModelAnimator.tsx'
import { MenuManager } from './MenuManager.tsx'
import { ScrollManager } from './ScrollManager.tsx'
import { Scene3DEffects } from './Scene3DEffects.tsx'
import { UIInteractions } from './UIInteractions.tsx'

/**
 * Main application class that orchestrates all components
 */
export class App {
  private sceneManager: SceneManager
  private modelLoader: ModelLoader
  private particleSystem: ParticleSystem
  private mouseTracker: MouseTracker
  private modelAnimator: ModelAnimator | null = null
  private menuManager: MenuManager
  private scrollManager: ScrollManager
  private scene3DEffects: Scene3DEffects
  private uiInteractions: UIInteractions
  private clock: THREE.Clock
  private animationFrameId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.sceneManager = new SceneManager(canvas)
    this.modelLoader = new ModelLoader()
    this.particleSystem = new ParticleSystem(1000)
    this.mouseTracker = new MouseTracker()
    this.menuManager = new MenuManager()
    this.clock = new THREE.Clock()

    // Initialize scroll manager with section change callback
    this.scrollManager = new ScrollManager(
      this.sceneManager.getCamera(),
      (section) => this.onSectionChange(section)
    )

    // Initialize 3D effects manager
    this.scene3DEffects = new Scene3DEffects(this.sceneManager.getScene())

    // Initialize UI interactions
    this.uiInteractions = new UIInteractions()

    this.initialize()
  }

  private async initialize(): Promise<void> {
    try {
      // Add particle system to scene
      const particleMesh = this.particleSystem.getMesh()
      this.sceneManager.getScene().add(particleMesh)

      // Load the 3D model
      const modelGroup = await this.modelLoader.loadModel('/ring.glb')
      this.sceneManager.getScene().add(modelGroup)

      // Initialize model animator
      this.modelAnimator = new ModelAnimator(
        modelGroup,
        this.modelLoader.getModel(),
        this.mouseTracker,
        this.sceneManager.getCamera()
      )

      // Set up 3D effects with model and particles
      this.scene3DEffects.setModelGroup(modelGroup)
      this.scene3DEffects.setParticleSystem(particleMesh)

      // Start animation loop
      this.animate()
    } catch (error) {
      console.error('Failed to initialize app:', error)
    }
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate)

    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = this.clock.getDelta()

    // Update particle system
    this.particleSystem.update(elapsedTime)

    // Update model animation
    if (this.modelAnimator) {
      this.modelAnimator.update(elapsedTime)
    }

    // Update scroll manager
    this.scrollManager.update()

    // Update 3D effects
    this.scene3DEffects.update(deltaTime)

    // Update scene controls
    this.sceneManager.update()

    // Render the scene
    this.sceneManager.render()
  }

  /**
   * Handle section change events from scroll manager
   * Controls which features are active per section
   */
  private onSectionChange(section: number): void {
    // Update 3D effects for this section
    this.scene3DEffects.onSectionChange(section)
    
    // Enable model animator only on Home screen (section 0)
    if (this.modelAnimator) {
      this.modelAnimator.setEnabled(section === 0)
    }
  }

  /**
   * Clean up all resources
   */
  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.particleSystem.dispose()
    this.mouseTracker.dispose()
    this.scrollManager.dispose()
    this.scene3DEffects.dispose()
  }
}
