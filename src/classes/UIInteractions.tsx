/**
 * Manages UI interactions and form handling
 * Handles button clicks, form submissions, and other UI events
 */
export class UIInteractions {
  constructor() {
    this.setupCTAButtons()
    this.setupContactForm()
  }

  /**
   * Set up CTA button interactions
   */
  private setupCTAButtons(): void {
    // "Explore Our Work" button - scroll to projects
    const exploreButton = document.querySelector('.cta-button.primary')
    if (exploreButton) {
      exploreButton.addEventListener('click', () => {
        const projectsNav = document.querySelector('.nav-item[href="#projects"]') as HTMLElement
        if (projectsNav) {
          projectsNav.click()
        }
      })
    }

    // "Get in Touch" button - scroll to contact
    const contactButton = document.querySelector('.cta-button.secondary')
    if (contactButton) {
      contactButton.addEventListener('click', () => {
        const contactNav = document.querySelector('.nav-item[href="#contact"]') as HTMLElement
        if (contactNav) {
          contactNav.click()
        }
      })
    }
  }

  /**
   * Set up contact form submission
   */
  private setupContactForm(): void {
    const form = document.querySelector('.contact-form') as HTMLFormElement
    if (!form) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      const nameInput = document.getElementById('name') as HTMLInputElement
      const emailInput = document.getElementById('email') as HTMLInputElement
      const messageInput = document.getElementById('message') as HTMLTextAreaElement
      const submitButton = form.querySelector('.form-submit') as HTMLButtonElement

      // Get form values
      const name = nameInput?.value
      const email = emailInput?.value
      const message = messageInput?.value

      // Basic validation
      if (!name || !email || !message) {
        this.showNotification('Please fill in all fields', 'error')
        return
      }

      // Simulate form submission
      submitButton.textContent = 'Sending...'
      submitButton.disabled = true

      // Simulate API call
      setTimeout(() => {
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success')
        form.reset()
        submitButton.textContent = 'Send Message'
        submitButton.disabled = false
      }, 1500)
    })
  }

  /**
   * Show notification message
   */
  private showNotification(message: string, type: 'success' | 'error'): void {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      padding: 1rem 2rem;
      background: ${type === 'success' ? 'rgba(20, 184, 166, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
      color: white;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      z-index: 1000;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    `

    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}
