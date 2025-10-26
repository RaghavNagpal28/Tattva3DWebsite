import './style.css'
import { App } from './classes/App.tsx'

// Initialize the application
const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement

if (canvas) {
  new App(canvas)
} else {
  console.error('Canvas element not found!')
}
