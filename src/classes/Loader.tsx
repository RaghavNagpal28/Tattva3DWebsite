import gsap from 'gsap'
import * as THREE from 'three'

/**
 * Premium Image-based Loader with Chi Rho symbol
 * Features elegant 3D animations matching Tattva Creative's aesthetic
 * Reusable for page transitions and API loading states
 */
export class Loader {
  private container: HTMLElement | null
  private canvas: HTMLCanvasElement | null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer | null = null
  private logoPlane: THREE.Mesh | null = null
  private particleSystem: THREE.Points | null = null
  private glowRing: THREE.Mesh | null = null
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
    
    this.init()
  }

  /**
   * Initialize the loader
   */
  private async init(): Promise<void> {
    if (!this.canvas) return

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create particle system
    this.createParticles()

    // Create glow ring
    this.createGlowRing()

    // Load and create logo
    await this.loadLogo()

    // Handle resize
    window.addEventListener('resize', () => this.handleResize())
  }

  /**
   * Load the Chi Rho logo image
   */
  private loadLogo(): Promise<void> {
    return new Promise((resolve) => {
      const textureLoader = new THREE.TextureLoader()
      
      textureLoader.load(
        '/536978335_17857922397480421_2375388129638713398_n.jpg',
        (texture) => {
          // Create plane geometry for the logo
          const geometry = new THREE.PlaneGeometry(2, 2)
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
          })

          this.logoPlane = new THREE.Mesh(geometry, material)
          this.scene.add(this.logoPlane)
          resolve()
        },
        undefined,
        (error) => {
          console.error('Error loading logo:', error)
          resolve()
        }
      )
    })
  }

  /**
   * Create particle system around the logo
   */
  private createParticles(): void {
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 3 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xC0C0C0,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    this.particleSystem = new THREE.Points(geometry, material)
    this.scene.add(this.particleSystem)
  }

  /**
   * Create glow ring effect
   */
  private createGlowRing(): void {
    const geometry = new THREE.RingGeometry(2.2, 2.4, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0xC0C0C0,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })

    this.glowRing = new THREE.Mesh(geometry, material)
    this.scene.add(this.glowRing)
  }

  /**
   * Animate the 3D scene
   */
  private animate = (): void => {
    if (!this.isVisible || !this.renderer) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    const time = Date.now() * 0.001

    // Rotate logo slowly
    if (this.logoPlane) {
      this.logoPlane.rotation.z = Math.sin(time * 0.5) * 0.1
      
      // Subtle scale pulse
      const scale = 1 + Math.sin(time * 2) * 0.05
      this.logoPlane.scale.set(scale, scale, 1)
    }

    // Rotate particles
    if (this.particleSystem) {
      this.particleSystem.rotation.y = time * 0.2
      this.particleSystem.rotation.x = time * 0.1
    }

    // Pulse glow ring
    if (this.glowRing) {
      this.glowRing.rotation.z = time * 0.3
      const opacity = 0.2 + Math.sin(time * 3) * 0.15
      ;(this.glowRing.material as THREE.MeshBasicMaterial).opacity = opacity
    }

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
   * Show loader for a minimum duration
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
    if (this.logoPlane) {
      this.logoPlane.geometry.dispose()
      if (this.logoPlane.material instanceof THREE.Material) {
        this.logoPlane.material.dispose()
      }
    }

    if (this.particleSystem) {
      this.particleSystem.geometry.dispose()
      if (this.particleSystem.material instanceof THREE.Material) {
        this.particleSystem.material.dispose()
      }
    }

    if (this.glowRing) {
      this.glowRing.geometry.dispose()
      if (this.glowRing.material instanceof THREE.Material) {
        this.glowRing.material.dispose()
      }
    }

    if (this.renderer) {
      this.renderer.dispose()
    }

    window.removeEventListener('resize', () => this.handleResize())
  }
}
