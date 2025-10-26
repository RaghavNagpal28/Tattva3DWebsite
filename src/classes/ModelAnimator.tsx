import * as THREE from 'three'
import { MouseTracker } from './MouseTracker.tsx'

/**
 * Handles model animation and movement based on mouse interaction
 */
export class ModelAnimator {
  private modelGroup: THREE.Group
  private model: THREE.Group | null
  private mouseTracker: MouseTracker
  private camera: THREE.PerspectiveCamera
  private isEnabled: boolean = true

  constructor(
    modelGroup: THREE.Group,
    model: THREE.Group | null,
    mouseTracker: MouseTracker,
    camera: THREE.PerspectiveCamera
  ) {
    this.modelGroup = modelGroup
    this.model = model
    this.mouseTracker = mouseTracker
    this.camera = camera
  }

  /**
   * Update model animation - only runs if enabled (Home screen)
   */
  public update(elapsedTime: number): void {
    // Only animate if enabled (Home screen)
    if (!this.isEnabled) return

    const boundaries = this.getBoundaries()

    if (this.mouseTracker.getIsActive()) {
      this.updateActiveMovement(boundaries)
    } else {
      this.updateIdleMovement(elapsedTime, boundaries)
    }
  }

  /**
   * Enable or disable animation (for section-specific control)
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  private updateActiveMovement(boundaries: Boundaries): void {
    const mouseX = this.mouseTracker.getX()
    const mouseY = this.mouseTracker.getY()

    let targetX = mouseX * 5
    let targetY = mouseY * 5

    // Clamp within boundaries
    targetX = this.clamp(targetX, boundaries.minX, boundaries.maxX)
    targetY = this.clamp(targetY, boundaries.minY, boundaries.maxY)

    // Smooth lerp movement
    this.modelGroup.position.x += (targetX - this.modelGroup.position.x) * 0.1
    this.modelGroup.position.y += (targetY - this.modelGroup.position.y) * 0.1

    // Dynamic rotation based on mouse position
    if (this.model) {
      this.model.rotation.y += (mouseX * 0.5 - this.model.rotation.y) * 0.05
      this.model.rotation.x += (mouseY * 0.3 - this.model.rotation.x) * 0.05
    }
  }

  private updateIdleMovement(elapsedTime: number, boundaries: Boundaries): void {
    const floatSpeed = 0.3
    let targetX = Math.sin(elapsedTime * floatSpeed) * 3
    let targetY = Math.sin(elapsedTime * floatSpeed * 0.5) * 0.5

    // Clamp within boundaries
    targetX = this.clamp(targetX, boundaries.minX, boundaries.maxX)
    targetY = this.clamp(targetY, boundaries.minY, boundaries.maxY)

    // Slower lerp for idle floating
    this.modelGroup.position.x += (targetX - this.modelGroup.position.x) * 0.02
    this.modelGroup.position.y += (targetY - this.modelGroup.position.y) * 0.02

    // Gentle rotation while floating
    if (this.model) {
      this.model.rotation.y = elapsedTime * 0.2
      this.model.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1
    }
  }

  private getBoundaries(): Boundaries {
    const aspect = window.innerWidth / window.innerHeight
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov)
    const distance = this.camera.position.z

    // Calculate visible dimensions
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distance
    const visibleWidth = visibleHeight * aspect

    // Border pixels
    const borderSidePx = 20
    const borderTopPx = 150

    // Convert to 3D space units
    const borderX = (borderSidePx / window.innerWidth) * visibleWidth
    const borderBottom = (borderSidePx / window.innerHeight) * visibleHeight
    const borderTop = (borderTopPx / window.innerHeight) * visibleHeight

    return {
      minX: -visibleWidth / 2 + borderX,
      maxX: visibleWidth / 2 - borderX,
      minY: -visibleHeight / 2 + borderBottom,
      maxY: visibleHeight / 2 - borderTop
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
}

interface Boundaries {
  minX: number
  maxX: number
  minY: number
  maxY: number
}
