import './style.css'
import { App } from './classes/App.tsx'
import { PageTransition } from './classes/PageTransition.tsx'

/**
 * Services page entry point
 * Simplified version with basic 3D background
 */

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement

if (canvas) {
  // Initialize the app with 3D background
  const app = new App(canvas)

  // Initialize page transitions
  const pageTransition = new PageTransition()

  // Services page specific interactions
  const setupServicesPageInteractions = () => {
    // Add hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card')

    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered')
      })

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered')
      })
    })
  }

  setupServicesPageInteractions()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.dispose()
    pageTransition.dispose()
  })
}
