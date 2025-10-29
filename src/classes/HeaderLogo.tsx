import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * HeaderLogo - Permanent 3D logo in header
 * 
 * Manages the 3D Tattva Creative logo in the top-left header position.
 * Features smooth rotation, hover effects, and responsive sizing.
 */
export class HeaderLogo {
  private canvas: HTMLCanvasElement | null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer | null = null
  private logoModel: THREE.Group | null = null
  private animationFrameId: number | null = null
  private isHovered: boolean = false
  private baseScale: number = 2.2
  private onClickCallback: (() => void) | null = null

  constructor() {
    this.canvas = document.querySelector('.header-logo-canvas') as HTMLCanvasElement
    
    // Initialize Three.js scene (must be done before early return)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      1, // Default aspect ratio
      0.1,
      1000
    )
    this.camera.position.z = 5
    
    if (!this.canvas) {
      console.warn('HeaderLogo: Canvas not found')
      return
    }
    
    // Update camera aspect ratio with actual canvas dimensions
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera.updateProjectionMatrix()

    this.init()
  }

  /**
   * Initialize the header logo
   */
  private async init(): Promise<void> {
    if (!this.canvas) return

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Load logo
    await this.loadLogo()

    // Start animation
    this.animate()

    // Handle resize
    window.addEventListener('resize', () => this.handleResize())

    // Setup hover interactions
    this.setupHoverInteractions()
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

          // Scale the model
          this.logoModel.scale.setScalar(this.baseScale)

          // Apply white material with emissive glow
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

          // Add lighting
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
          this.scene.add(ambientLight)

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
          directionalLight.position.set(3, 3, 5)
          this.scene.add(directionalLight)

          this.scene.add(this.logoModel)
          resolve()
        },
        undefined,
        (error) => {
          console.error('Error loading header logo model:', error)
          resolve()
        }
      )
    })
  }

  /**
   * Setup hover and click interactions
   */
  private setupHoverInteractions(): void {
    if (!this.canvas) return

    // Make canvas clickable
    this.canvas.style.cursor = 'pointer'

    this.canvas.addEventListener('mouseenter', () => {
      this.isHovered = true
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovered = false
    })

    // Add click handler
    this.canvas.addEventListener('click', () => {
      if (this.onClickCallback) {
        this.onClickCallback()
      }
    })
  }

  /**
   * Set callback for when logo is clicked
   */
  public onClick(callback: () => void): void {
    this.onClickCallback = callback
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.renderer) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    const time = Date.now() * 0.001

    // Rotate logo
    if (this.logoModel) {
      this.logoModel.rotation.y = time * 0.3

      // Enhanced rotation and scale on hover
      if (this.isHovered) {
        this.logoModel.rotation.z = Math.sin(time * 2) * 0.1
        const scale = this.baseScale * (1 + Math.sin(time * 3) * 0.05)
        this.logoModel.scale.setScalar(scale)
      } else {
        this.logoModel.rotation.z *= 0.95
        // Smoothly return to base scale
        const currentScale = this.logoModel.scale.x
        const targetScale = this.baseScale
        this.logoModel.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1)
      }
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (!this.renderer || !this.canvas) return

    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
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

    if (this.renderer) {
      this.renderer.dispose()
    }

    window.removeEventListener('resize', () => this.handleResize())
  }
}
