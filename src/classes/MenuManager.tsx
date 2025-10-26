/**
 * Manages menu interactions and animations
 * Handles hamburger menu toggle and navigation
 */
export class MenuManager {
  private hamburger: HTMLButtonElement | null
  private navMenu: HTMLElement | null

  constructor() {
    this.hamburger = document.getElementById('hamburger') as HTMLButtonElement
    this.navMenu = document.getElementById('navMenu') as HTMLElement

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => {
        this.toggleHamburgerMenu()
      })
    }

    // Close mobile menu when clicking nav items
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        this.closeHamburgerMenu()
      })
    })

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (this.navMenu?.classList.contains('active') && 
          !this.navMenu.contains(target) && 
          !this.hamburger?.contains(target)) {
        this.closeHamburgerMenu()
      }
    })
  }

  private toggleHamburgerMenu(): void {
    if (this.hamburger && this.navMenu) {
      this.hamburger.classList.toggle('active')
      this.navMenu.classList.toggle('active')
    }
  }

  private closeHamburgerMenu(): void {
    if (this.hamburger && this.navMenu) {
      this.hamburger.classList.remove('active')
      this.navMenu.classList.remove('active')
    }
  }

  /**
   * Update active navigation item based on current section
   */
  public updateActiveNav(sectionId: string): void {
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
      const href = item.getAttribute('href')
      if (href === `#${sectionId}`) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }
}
