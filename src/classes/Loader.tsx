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
    
    // Loader is visible by default, so start as visible
    this.isVisible = true
    
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

    // Start animation immediately since loader is visible by default
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
   * Always runs to keep logo visible in header
   */
  private animate = (): void => {
    if (!this.renderer) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    const time = Date.now() * 0.001

    // Only animate when visible (loader state)
    if (this.isVisible) {
      // Rotate logo slowly
      if (this.logoModel) {
        this.logoModel.rotation.y = time * 0.5
        this.logoModel.rotation.z = Math.sin(time * 0.5) * 0.1
        
        // Subtle scale pulse
        const scale = 1 + Math.sin(time * 2) * 0.05
        this.logoModel.scale.setScalar(scale)
      }

      // Rotate particles
      if (this.particleSystem) {
        this.particleSystem.rotation.y = time * 0.2
        this.particleSystem.rotation.x = time * 0.1
      }
    }

    // Always render to keep logo visible
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Show the loader with animation (Menu → Loader transition)
   */
  public show(duration: number = 0.8): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container || !this.logoModel || this.isTransitioning) {
        resolve()
        return
      }

      console.log('Loader.show() called - starting animation from header to center')
      
      this.isTransitioning = true
      this.isVisible = true
      
      // Make container visible and interactive
      this.container.style.display = 'flex'
      this.container.style.pointerEvents = 'auto'

      // Calculate scales
      const headerScale = this.baseLogoScale * 0.4 // Header size (40% of base)
      const loaderScale = this.baseLogoScale // Full loader size
      
      console.log('Scales:', { headerScale, loaderScale, baseLogoScale: this.baseLogoScale })
      
      // Calculate header position
      const headerLogoContainer = document.querySelector('.header-logo-container') as HTMLElement
      let startX = 0
      let startY = 0
      
      if (headerLogoContainer) {
        const headerRect = headerLogoContainer.getBoundingClientRect()
        const loaderRect = this.container!.getBoundingClientRect()
        
        // Calculate offset from center to header position (in 3D space)
        const offsetX = (headerRect.left + headerRect.width / 2 - loaderRect.width / 2) / 100
        const offsetY = -(headerRect.top + headerRect.height / 2 - loaderRect.height / 2) / 100
        
        startX = offsetX
        startY = offsetY
        console.log('Header position calculated:', { startX, startY })
      } else {
        console.warn('Header logo container not found!')
      }
      
      // Set initial state: small scale at header position
      this.logoModel.position.set(startX, startY, 0)
      this.logoModel.scale.setScalar(headerScale)
      console.log('Logo initial state set:', { position: this.logoModel.position, scale: headerScale })
      
      // Set initial container state: start transparent, fade to black
      this.container.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      this.container.style.opacity = '1'
      
      // Set particles to invisible initially
      if (this.particleSystem) {
        (this.particleSystem.material as THREE.PointsMaterial).opacity = 0
      }

      // Create master timeline for animation
      const masterTimeline = gsap.timeline({
        onComplete: () => {
          this.isTransitioning = false
          resolve()
        },
      })

      // Phase 0: Fade in background (0-0.4s)
      masterTimeline.to(this.container, {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        duration: 0.4,
        ease: 'power2.out',
      }, 0)

      // Phase 1: Move logo to center and scale up (0-0.8s)
      masterTimeline.to(this.logoModel.position, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0)
      
      masterTimeline.to(this.logoModel.scale, {
        x: loaderScale,
        y: loaderScale,
        z: loaderScale,
        duration: 0.8,
        ease: 'power2.out',
      }, 0)

      // Phase 2: Fade in particles (0.4-0.8s)
      if (this.particleSystem) {
        masterTimeline.to(this.particleSystem.material, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.4)
      }
    })
  }

  /**
   * Hide the loader with animation (Loader → Menu transition)
   */
  public hide(duration: number = 0.8): Promise<void> {
    return new Promise((resolve) => {
      if (!this.container || !this.logoModel || this.isTransitioning) {
        resolve()
        return
      }

      this.isTransitioning = true

      // Calculate scales and positions
      const headerScale = this.baseLogoScale * 0.4 // Header size (40% of base)
      
      // Calculate header position
      const headerLogoContainer = document.querySelector('.header-logo-container') as HTMLElement
      let targetX = 0
      let targetY = 0
      
      if (headerLogoContainer) {
        const headerRect = headerLogoContainer.getBoundingClientRect()
        const loaderRect = this.container!.getBoundingClientRect()
        
        // Calculate offset from center to header position (in 3D space)
        const offsetX = (headerRect.left + headerRect.width / 2 - loaderRect.width / 2) / 100
        const offsetY = -(headerRect.top + headerRect.height / 2 - loaderRect.height / 2) / 100
        
        targetX = offsetX
        targetY = offsetY
      }

      // Create a master timeline for coordinated animations
      const masterTimeline = gsap.timeline({
        onComplete: () => {
          this.isVisible = false
          this.isTransitioning = false
          
          // Keep container visible but make it non-interactive
          // This prevents blank screens during transitions
          if (this.container) {
            this.container.style.pointerEvents = 'none'
            // Don't set display: none - keep it visible for smooth transitions
          }
          
          // Keep animation running for header logo visibility
          // Don't stop the animation loop
          
          resolve()
          if (this.onCompleteCallback) {
            this.onCompleteCallback()
          }
        },
      })

      // Phase 1: Fade out particles first (0-0.4s)
      if (this.particleSystem) {
        masterTimeline.to(this.particleSystem.material, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, 0)
      }

      // Phase 2: Move logo to header position and scale down (0.2-1.0s)
      masterTimeline.to(this.logoModel.position, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0.2)
      
      masterTimeline.to(this.logoModel.scale, {
        x: headerScale,
        y: headerScale,
        z: headerScale,
        duration: 0.8,
        ease: 'power2.in',
      }, 0.2)

      // Phase 3: Fade out the loader background (0.6-1.0s)
      // Keep opacity slightly visible to prevent blank screens
      masterTimeline.to(this.container, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: 0.4,
        ease: 'power2.in',
      }, 0.6)
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
