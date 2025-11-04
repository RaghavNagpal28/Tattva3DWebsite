import gsap from 'gsap'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Minimal 3D Loader with Tattva Creative logo model
 * Features elegant 3D logo animation with particles
 * Clean black background with rotating GLB model
 * Reusable for page transitions and loading states
 */
export class Loader {
  private container: HTMLElement | null
  private canvas: HTMLCanvasElement | null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer | null = null
  private logoModel: THREE.Group | null = null
  private particleSystem: THREE.Points | null = null
  private animationFrameId: number | null = null
  private isVisible: boolean = false
  private onCompleteCallback: (() => void) | null = null
  private isTransitioning: boolean = false
  private baseLogoScale: number = 1

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
    
    // Loader starts hidden (opacity: 0 in CSS)
    this.isVisible = false
    
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

    // Load and create logo
    await this.loadLogo()

    // Start animation loop (will only animate when isVisible is true)
    this.animate()

    // Handle resize
    window.addEventListener('resize', () => this.handleResize())
  }

  /**
   * Load the Tattva Creative logo 3D model
   */
  private loadLogo(): Promise<void> {
    return new Promise((resolve) => {
      const loader = new GLTFLoader()
      
      loader.load(
        '/tattva logo.glb',
        (gltf) => {
          this.logoModel = gltf.scene
          
          // Center the model
          const box = new THREE.Box3().setFromObject(this.logoModel)
          const center = box.getCenter(new THREE.Vector3())
          this.logoModel.position.sub(center)
          
          // Scale the model to fit
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          this.baseLogoScale = 2 / maxDim
          this.logoModel.scale.setScalar(this.baseLogoScale)
          
          // Apply white material for loader (visible on black background)
          this.logoModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.0,
                roughness: 0.3,
                emissive: 0xffffff,
                emissiveIntensity: 0.2,
              })
            }
          })
          
          // Add lighting for the model
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
          this.scene.add(ambientLight)
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
          directionalLight.position.set(5, 5, 5)
          this.scene.add(directionalLight)
          
          this.scene.add(this.logoModel)
          resolve()
        },
        undefined,
        (error) => {
          console.error('Error loading logo model:', error)
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
   * Animate the 3D scene
   */
  private animate = (): void => {
    if (!this.renderer) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    const time = Date.now() * 0.001

    // Only animate when visible
    if (this.isVisible) {
      // Rotate logo slowly
      if (this.logoModel) {
        this.logoModel.rotation.y = time * 0.5
        this.logoModel.rotation.z = Math.sin(time * 0.5) * 0.1
      }

      // Rotate particles
      if (this.particleSystem) {
        this.particleSystem.rotation.y = time * 0.2
        this.particleSystem.rotation.x = time * 0.1
      }
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Show the loader - simple fade in
   */
  public show(duration: number = 0.5): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container || !this.logoModel || this.isTransitioning) {
        resolve()
        return
      }
      
      this.isTransitioning = true
      this.isVisible = true
      
      // Make container visible and interactive
      this.container.style.display = 'flex'
      this.container.style.pointerEvents = 'auto'

      // Ensure logo is centered and at proper scale
      this.logoModel.position.set(0, 0, 0)
      this.logoModel.scale.setScalar(this.baseLogoScale)
      
      // Set initial state: transparent
      this.container.style.opacity = '0'
      this.container.style.backgroundColor = 'rgba(0, 0, 0, 1)'
      
      // Set particles to visible
      if (this.particleSystem) {
        (this.particleSystem.material as THREE.PointsMaterial).opacity = 0.6
      }

      // Simple fade in
      gsap.to(this.container, {
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
        onComplete: () => {
          this.isTransitioning = false
          resolve()
        },
      })
    })
  }

  /**
   * Hide the loader - simple fade out
   */
  public hide(duration: number = 0.5): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container || !this.logoModel || this.isTransitioning) {
        resolve()
        return
      }

      this.isTransitioning = true

      // Simple fade out
      gsap.to(this.container, {
        opacity: 0,
        duration: duration,
        ease: 'power2.in',
        onComplete: () => {
          this.isVisible = false
          this.isTransitioning = false
          
          if (this.container) {
            this.container.style.display = 'none'
            this.container.style.pointerEvents = 'none'
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
    if (this.logoModel) {
      this.logoModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose())
            } else {
              child.material.dispose()
            }
          }
        }
      })
    }

    if (this.particleSystem) {
      this.particleSystem.geometry.dispose()
      if (this.particleSystem.material instanceof THREE.Material) {
        this.particleSystem.material.dispose()
      }
    }

    if (this.renderer) {
      this.renderer.dispose()
    }

    window.removeEventListener('resize', () => this.handleResize())
  }
}
