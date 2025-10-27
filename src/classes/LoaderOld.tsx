import gsap from 'gsap'
import * as THREE from 'three'

/**
 * Premium 3D Loader with animated geometry
 * Matches Tattva Creative's monochrome aesthetic
 * Reusable for page transitions and API loading states
 */
export class Loader {
  private container: HTMLElement | null
  private canvas: HTMLCanvasElement | null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer | null = null
  private geometry: THREE.Group
  private animationFrameId: number | null = null
  private isVisible: boolean = false
  private onCompleteCallback: (() => void) | null = null

  constructor() {
    this.container = document.querySelector('.loader-container')
    this.canvas = document.querySelector('.loader-canvas') as HTMLCanvasElement
    
    // Initialize Three.js scene
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 5

    // Create geometry group
    this.geometry = new THREE.Group()
    
    this.init()
  }

  /**
   * Initialize the loader
   */
  private init(): void {
    if (!this.canvas) return

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create 3D geometry
    this.createGeometry()

    // Handle resize
    window.addEventListener('resize', () => this.handleResize())
  }

  /**
   * Create the 3D loader geometry - Tattva symbol inspired
   */
  private createGeometry(): void {
    // Create multiple rings forming a complex pattern
    const ringCount = 3
    const material = new THREE.MeshBasicMaterial({
      color: 0xC0C0C0, // Silver
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })

    for (let i = 0; i < ringCount; i++) {
      const radius = 0.5 + i * 0.3
      const torusGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100)
      const torus = new THREE.Mesh(torusGeometry, material)
      
      // Position rings at different angles
      torus.rotation.x = (Math.PI / 3) * i
      torus.rotation.y = (Math.PI / 4) * i
      
      this.geometry.add(torus)
    }

    // Add central sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    this.geometry.add(sphere)

    // Add octahedron for complexity
    const octaGeometry = new THREE.OctahedronGeometry(0.8)
    const octaMaterial = new THREE.MeshBasicMaterial({
      color: 0xC0C0C0,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial)
    this.geometry.add(octahedron)

    this.scene.add(this.geometry)
  }

  /**
   * Animate the 3D geometry
   */
  private animate = (): void => {
    if (!this.isVisible || !this.renderer) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    // Rotate geometry
    this.geometry.rotation.x += 0.005
    this.geometry.rotation.y += 0.008
    this.geometry.rotation.z += 0.003

    // Pulse effect
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1
    this.geometry.scale.set(scale, scale, scale)

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Show the loader with animation
   */
  public show(duration: number = 0.6): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container) {
        resolve()
        return
      }

      this.isVisible = true
      this.container.style.display = 'flex'

      // Animate in
      gsap.to(this.container, {
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
        onComplete: () => {
          this.animate()
          resolve()
        },
      })

      // Animate text
      const loaderText = this.container.querySelector('.loader-text')
      const loaderSubtext = this.container.querySelector('.loader-subtext')
      
      if (loaderText) {
        gsap.fromTo(
          loaderText,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
        )
      }

      if (loaderSubtext) {
        gsap.fromTo(
          loaderSubtext,
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
        )
      }

      // Animate progress bar
      const progressBar = this.container.querySelector('.loader-progress-fill')
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          duration: 2,
          ease: 'power1.inOut',
        })
      }
    })
  }

  /**
   * Hide the loader with animation
   */
  public hide(duration: number = 0.8): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container) {
        resolve()
        return
      }

      // Stop animation
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }

      // Animate out
      gsap.to(this.container, {
        opacity: 0,
        duration: duration,
        ease: 'power2.in',
        onComplete: () => {
          this.isVisible = false
          if (this.container) {
            this.container.style.display = 'none'
          }
          resolve()
          if (this.onCompleteCallback) {
            this.onCompleteCallback()
          }
        },
      })
    })
  }

  /**
   * Show loader for a minimum duration (useful for quick operations)
   */
  public async showForMinimum(minimumMs: number = 1500): Promise<void> {
    const startTime = Date.now()
    await this.show()
    
    const elapsed = Date.now() - startTime
    const remaining = minimumMs - elapsed
    
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining))
    }
    
    await this.hide()
  }

  /**
   * Update progress (0 to 1)
   */
  public updateProgress(progress: number): void {
    const progressBar = this.container?.querySelector('.loader-progress-fill') as HTMLElement
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: Math.max(0, Math.min(1, progress)),
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  /**
   * Set completion callback
   */
  public onComplete(callback: () => void): void {
    this.onCompleteCallback = callback
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (!this.renderer || !this.canvas) return

    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }

  /**
   * Check if loader is currently visible
   */
  public isShowing(): boolean {
    return this.isVisible
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    // Dispose Three.js resources
    this.geometry.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })

    if (this.renderer) {
      this.renderer.dispose()
    }

    window.removeEventListener('resize', () => this.handleResize())
  }
}
