import * as THREE from 'three'

/**
 * Manages smooth continuous scroll with 3D camera effects
 * Natural scrolling behavior - no page snapping
 */
export class ScrollManager {
  private scrollY: number = 0
  private currentSection: number = 0
  private camera: THREE.PerspectiveCamera
  private onSectionChange?: (section: number) => void
  private pageContainer: HTMLElement
  private totalHeight: number = 0
  private progressBar: HTMLElement | null
  private scrollIndicator: HTMLElement | null

  constructor(camera: THREE.PerspectiveCamera, onSectionChange?: (section: number) => void) {
    this.camera = camera
    this.onSectionChange = onSectionChange
    
    // Get the page container
    this.pageContainer = document.querySelector('.page-container') as HTMLElement
    
    // Get progress bar
    this.progressBar = document.querySelector('.scroll-progress-bar')
    
    // Get scroll indicator
    this.scrollIndicator = document.querySelector('.scroll-indicator')
    
    // Enable smooth scrolling
    this.setupSmoothScroll()
    this.setupScrollListeners()
    this.setupNavigationListeners()
    this.calculateTotalHeight()
  }

  /**
   * Enable smooth continuous scrolling
   */
  private setupSmoothScroll(): void {
    // Allow body to scroll
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    
    // Make page container flow naturally
    if (this.pageContainer) {
      this.pageContainer.style.position = 'relative'
      this.pageContainer.style.height = 'auto'
    }

    // Update all sections to flow naturally
    const sections = document.querySelectorAll('.page-section')
    sections.forEach((section: Element) => {
      const el = section as HTMLElement
      el.style.position = 'relative'
      el.style.minHeight = '100vh'
      el.style.display = 'flex'
      el.style.opacity = '1'
    })
  }

  /**
   * Calculate total scrollable height
   */
  private calculateTotalHeight(): void {
    this.totalHeight = document.documentElement.scrollHeight - window.innerHeight
  }

  /**
   * Set up scroll event listeners
   */
  private setupScrollListeners(): void {
    // Natural scroll tracking
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
      this.updateCameraPosition()
      this.updateCurrentSection()
      this.updateProgressBar()
      this.updateScrollIndicator()
    }, { passive: true })

    // Recalculate on resize
    window.addEventListener('resize', () => {
      this.calculateTotalHeight()
    })
  }

  /**
   * Set up navigation click listeners
   */
  private setupNavigationListeners(): void {
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        this.scrollToSection(index)
      })
    })
  }

  /**
   * Smooth scroll to a specific section
   */
  public scrollToSection(sectionIndex: number): void {
    const sections = document.querySelectorAll('.page-section')
    if (sectionIndex < 0 || sectionIndex >= sections.length) return

    const targetSection = sections[sectionIndex] as HTMLElement
    const targetY = targetSection.offsetTop

    // Smooth scroll to section
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }

  /**
   * Update camera position based on scroll
   */
  private updateCameraPosition(): void {
    // Calculate scroll progress (0 to 1)
    const scrollProgress = this.totalHeight > 0 ? this.scrollY / this.totalHeight : 0
    
    // Define camera positions for each section (7 sections total)
    const cameraKeyframes = [
      { progress: 0, position: { x: 0, y: 0, z: 5 }, rotation: 0 },           // Hero
      { progress: 0.14, position: { x: 1, y: 0.3, z: 5.5 }, rotation: 0.1 },  // Intro
      { progress: 0.29, position: { x: -1, y: 0.5, z: 6 }, rotation: -0.1 },  // Work Preview
      { progress: 0.43, position: { x: 1.5, y: 0, z: 5.8 }, rotation: 0.15 }, // Philosophy
      { progress: 0.57, position: { x: -1.2, y: -0.3, z: 6.2 }, rotation: -0.12 }, // Process
      { progress: 0.71, position: { x: 0.8, y: 0.4, z: 5.6 }, rotation: 0.08 }, // Clients
      { progress: 0.86, position: { x: -0.5, y: -0.2, z: 5.8 }, rotation: -0.05 }, // Contact CTA
      { progress: 1, position: { x: 0, y: 0, z: 5 }, rotation: 0 }            // Footer
    ]

    // Find the two keyframes to interpolate between
    let startKeyframe = cameraKeyframes[0]
    let endKeyframe = cameraKeyframes[1]

    for (let i = 0; i < cameraKeyframes.length - 1; i++) {
      if (scrollProgress >= cameraKeyframes[i].progress && scrollProgress <= cameraKeyframes[i + 1].progress) {
        startKeyframe = cameraKeyframes[i]
        endKeyframe = cameraKeyframes[i + 1]
        break
      }
    }

    // Calculate local progress between keyframes
    const keyframeRange = endKeyframe.progress - startKeyframe.progress
    const localProgress = keyframeRange > 0 
      ? (scrollProgress - startKeyframe.progress) / keyframeRange 
      : 0

    // Smooth easing function
    const eased = this.easeInOutCubic(localProgress)

    // Interpolate camera position
    this.camera.position.x = this.lerp(startKeyframe.position.x, endKeyframe.position.x, eased)
    this.camera.position.y = this.lerp(startKeyframe.position.y, endKeyframe.position.y, eased)
    this.camera.position.z = this.lerp(startKeyframe.position.z, endKeyframe.position.z, eased)
    
    // Interpolate camera rotation
    this.camera.rotation.y = this.lerp(startKeyframe.rotation, endKeyframe.rotation, eased)
  }

  /**
   * Update current section based on scroll position
   */
  private updateCurrentSection(): void {
    const sections = document.querySelectorAll('.page-section')
    const scrollPosition = this.scrollY + window.innerHeight / 2

    let newSection = 0
    sections.forEach((section, index) => {
      const el = section as HTMLElement
      const sectionTop = el.offsetTop
      const sectionBottom = sectionTop + el.offsetHeight

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        newSection = index
      }
    })

    // Trigger section change callback if section changed
    if (newSection !== this.currentSection) {
      this.currentSection = newSection
      this.updateActiveNav(newSection)
      
      if (this.onSectionChange) {
        this.onSectionChange(newSection)
      }
    }
  }

  /**
   * Update active state of navigation items
   */
  private updateActiveNav(sectionIndex: number): void {
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach((item, index) => {
      if (index === sectionIndex) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  /**
   * Linear interpolation
   */
  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Smooth easing function
   */
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  /**
   * Update scroll progress bar
   */
  private updateProgressBar(): void {
    if (!this.progressBar) return
    
    const progress = this.getScrollProgress()
    this.progressBar.style.width = `${progress * 100}%`
  }

  /**
   * Update scroll indicator visibility - fade out when scrolling
   */
  private updateScrollIndicator(): void {
    if (!this.scrollIndicator) return
    
    // Fade out after scrolling 100px
    const fadeThreshold = 100
    const opacity = Math.max(0, 1 - (this.scrollY / fadeThreshold))
    
    this.scrollIndicator.style.opacity = opacity.toString()
    
    // Hide completely when fully faded
    if (opacity === 0) {
      this.scrollIndicator.style.pointerEvents = 'none'
    } else {
      this.scrollIndicator.style.pointerEvents = 'auto'
    }
  }

  /**
   * Get current scroll progress (0-1)
   */
  public getScrollProgress(): number {
    return this.totalHeight > 0 ? this.scrollY / this.totalHeight : 0
  }

  /**
   * Get current section index
   */
  public getCurrentSection(): number {
    return this.currentSection
  }

  /**
   * Update method called from animation loop
   */
  public update(): void {
    // Smooth camera updates happen in updateCameraPosition
    // This method can be used for additional smooth interpolation if needed
  }

  /**
   * Clean up event listeners
   */
  public dispose(): void {
    // Event listeners are passive and will be cleaned up automatically
  }
}
