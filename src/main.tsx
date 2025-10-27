import './style.css'
import { App } from './classes/App.tsx'
import { PageTransition } from './classes/PageTransition.tsx'

// Initialize the application
const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement

if (canvas) {
  const app = new App(canvas)
  
  // Initialize page transitions
  const pageTransition = new PageTransition()
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.dispose()
    pageTransition.dispose()
  })
} else {
  console.error('Canvas element not found!')
}
