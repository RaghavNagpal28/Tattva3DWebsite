import './style.css'
import { App } from './classes/App.tsx'
import { PageTransition } from './classes/PageTransition.tsx'
import { HeaderLogo } from './classes/HeaderLogo.tsx'

// Initialize the application
const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement

if (canvas) {
  const app = new App(canvas)
  
  // Initialize page transitions
  const pageTransition = new PageTransition()
  
  // Initialize header logo
  const headerLogo = new HeaderLogo()
  
  // Connect header logo click to show loader
  headerLogo.onClick(async () => {
    const loader = pageTransition.getLoader()
    
    // Show loader animation (header logo will transition to center)
    await loader.show(0.8)
    
    // Keep it visible for a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Hide loader (logo transitions back to header)
    await loader.hide(0.8)
  })
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.dispose()
    pageTransition.dispose()
    headerLogo.dispose()
  })
} else {
  console.error('Canvas element not found!')
}
