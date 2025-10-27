import { Loader } from './Loader.tsx'

/**
 * Handles smooth page transitions with cinematic animations
 * Integrates with 3D Loader for premium experience
 */
export class PageTransition {
  private loader: Loader
  private isTransitioning: boolean = false

  constructor() {
    this.loader = new Loader()
    this.setupTransition()
  }

  private setupTransition(): void {
    // Show loader on initial page load, then hide
    this.animateIn()

    // Intercept navigation clicks
    this.setupNavigationInterception()
  }

  /**
   * Animate page entrance - show loader then hide
   */
  private async animateIn(): Promise<void> {
    // Show loader
    await this.loader.show(0.4)
    
    // Simulate loading time for smooth experience
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Hide loader
    await this.loader.hide(0.6)
  }

  /**
   * Animate page exit with loader
   */
  private async animateOut(callback: () => void): Promise<void> {
    // Show loader
    await this.loader.show(0.5)
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Execute callback (navigation)
    callback()
  }

  /**
   * Setup navigation interception for smooth transitions
   */
  private setupNavigationInterception(): void {
    // Intercept all internal navigation links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Check if it's an internal page navigation (not hash links)
      if (
        href.startsWith('/') ||
        href.includes('.html') ||
        href === '' ||
        href === '.'
      ) {
        // Skip if it's a hash link on the same page
        if (href.startsWith('#')) return

        // Skip if it's an external link
        if (link.hostname && link.hostname !== window.location.hostname) return

        // Prevent default navigation
        e.preventDefault()

        // Don't transition if already transitioning
        if (this.isTransitioning) return

        this.isTransitioning = true

        // Animate out and navigate
        this.animateOut(() => {
          // Handle different href formats
          let targetUrl = href

          // Convert relative paths to absolute
          if (href === '/' || href === '' || href === '.') {
            targetUrl = '/index.html'
          } else if (!href.includes('.html')) {
            targetUrl = href + '.html'
          }

          // Navigate to the new page
          window.location.href = targetUrl
        })
      }
    })

    // Handle back/forward button navigation
    window.addEventListener('popstate', () => {
      if (!this.isTransitioning) {
        this.isTransitioning = true
        this.animateOut(() => {
          window.location.reload()
        })
      }
    })
  }

  /**
   * Programmatically navigate to a page with transition
   */
  public navigateTo(url: string): void {
    if (this.isTransitioning) return

    this.isTransitioning = true

    this.animateOut(() => {
      window.location.href = url
    })
  }

  /**
   * Get loader instance for manual control
   */
  public getLoader(): Loader {
    return this.loader
  }

  /**
   * Clean up
   */
  public dispose(): void {
    this.loader.dispose()
  }
}
