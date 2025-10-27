import './style.css'
import { App } from './classes/App.tsx'
import { PageTransition } from './classes/PageTransition.tsx'

/**
 * Work page entry point
 * Simplified version with basic 3D background
 */

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement

if (canvas) {
  // Initialize the app with 3D background
  const app = new App(canvas)

  // Initialize page transitions
  const pageTransition = new PageTransition()

  // Work page specific interactions
  const setupWorkPageInteractions = () => {
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn')
    const workItems = document.querySelectorAll('.work-grid-item')

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter')

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        // Filter work items
        workItems.forEach(item => {
          const categories = item.getAttribute('data-category') || ''

          if (filter === 'all' || categories.includes(filter || '')) {
            item.classList.remove('hidden')
            item.classList.add('visible')
          } else {
            item.classList.remove('visible')
            item.classList.add('hidden')
          }
        })
      })
    })

    // Initialize all items as visible
    workItems.forEach(item => item.classList.add('visible'))
  }

  setupWorkPageInteractions()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.dispose()
    pageTransition.dispose()
  })
}
