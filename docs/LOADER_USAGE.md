# Loader Usage Guide

## Overview
The `Loader` class provides a beautiful, 3D-animated loading experience that matches Tattva Creative's premium aesthetic. It features animated wireframe geometry, smooth transitions, and a progress bar.

## Features
- **3D Animated Geometry**: Multiple rotating rings, sphere, and octahedron
- **Smooth Animations**: GSAP-powered fade in/out with customizable durations
- **Progress Tracking**: Visual progress bar that can be updated programmatically
- **Monochrome Design**: Matches the silver/black/white color palette
- **Fully Responsive**: Adapts to all screen sizes
- **Object-Oriented**: Clean, reusable class architecture

## Basic Usage

### 1. Automatic Page Load (Already Integrated)
The loader is automatically shown on page load through the `PageTransition` class:

```typescript
import { PageTransition } from './classes/PageTransition.tsx'

const pageTransition = new PageTransition()
// Loader shows automatically, then hides after content loads
```

### 2. Manual Control
Access the loader instance for manual control:

```typescript
import { PageTransition } from './classes/PageTransition.tsx'

const pageTransition = new PageTransition()
const loader = pageTransition.getLoader()

// Show loader
await loader.show()

// Hide loader
await loader.hide()
```

### 3. Standalone Loader
Create a standalone loader instance:

```typescript
import { Loader } from './classes/Loader.tsx'

const loader = new Loader()

// Show for minimum duration (useful for quick operations)
await loader.showForMinimum(1500) // Shows for at least 1.5 seconds

// Or control manually
await loader.show()
// ... do some work ...
await loader.hide()
```

### 4. Progress Updates
Update the progress bar during long operations:

```typescript
const loader = new Loader()
await loader.show()

// Update progress (0 to 1)
loader.updateProgress(0.25)  // 25%
loader.updateProgress(0.50)  // 50%
loader.updateProgress(0.75)  // 75%
loader.updateProgress(1.0)   // 100%

await loader.hide()
```

### 5. API Loading Example
Perfect for API calls:

```typescript
const loader = new Loader()

async function fetchData() {
  await loader.show()
  
  try {
    const response = await fetch('/api/data')
    loader.updateProgress(0.5)
    
    const data = await response.json()
    loader.updateProgress(1.0)
    
    return data
  } finally {
    await loader.hide()
  }
}
```

### 6. Multi-step Process
Track progress through multiple steps:

```typescript
const loader = new Loader()
await loader.show()

// Step 1
await performTask1()
loader.updateProgress(0.33)

// Step 2
await performTask2()
loader.updateProgress(0.66)

// Step 3
await performTask3()
loader.updateProgress(1.0)

await loader.hide()
```

## Methods

### `show(duration?: number): Promise<void>`
Shows the loader with animation.
- **duration**: Animation duration in seconds (default: 0.6)
- Returns a Promise that resolves when animation completes

### `hide(duration?: number): Promise<void>`
Hides the loader with animation.
- **duration**: Animation duration in seconds (default: 0.8)
- Returns a Promise that resolves when animation completes

### `showForMinimum(minimumMs?: number): Promise<void>`
Shows loader for a minimum duration, useful for quick operations.
- **minimumMs**: Minimum display time in milliseconds (default: 1500)
- Returns a Promise that resolves after hiding

### `updateProgress(progress: number): void`
Updates the progress bar.
- **progress**: Value between 0 and 1 (0% to 100%)

### `isShowing(): boolean`
Returns whether the loader is currently visible.

### `onComplete(callback: () => void): void`
Sets a callback to execute when loader finishes hiding.

### `dispose(): void`
Cleans up all resources (Three.js objects, event listeners, etc.)

## Customization

### Adjust Animation Timings
```typescript
// Slower entrance
await loader.show(1.2)

// Faster exit
await loader.hide(0.4)
```

### Custom Minimum Display Time
```typescript
// Show for at least 2 seconds
await loader.showForMinimum(2000)
```

### Completion Callback
```typescript
loader.onComplete(() => {
  console.log('Loader finished!')
  // Perform post-load actions
})
```

## HTML Structure
The loader requires this HTML structure (already added to all pages):

```html
<div class="loader-container">
  <canvas class="loader-canvas"></canvas>
  <div class="loader-content">
    <h2 class="loader-text">Tattva Creative</h2>
    <p class="loader-subtext">Essence in Motion</p>
    <div class="loader-progress">
      <div class="loader-progress-fill"></div>
    </div>
  </div>
</div>
```

## CSS Classes
All styling is in `style.css` under the "LOADER STYLES" section:
- `.loader-container`: Main container
- `.loader-canvas`: 3D canvas
- `.loader-content`: Text and progress container
- `.loader-text`: Main title
- `.loader-subtext`: Tagline
- `.loader-progress`: Progress bar container
- `.loader-progress-fill`: Progress bar fill

## Best Practices

1. **Always await**: Use `await` with show/hide methods for proper sequencing
2. **Cleanup**: Call `dispose()` when done to free resources
3. **Progress updates**: Keep progress updates smooth (don't jump too quickly)
4. **Minimum duration**: Use `showForMinimum()` for operations that might complete too quickly
5. **Error handling**: Always hide loader in finally blocks

## Example: Complete Workflow

```typescript
import { Loader } from './classes/Loader.tsx'

async function loadApplication() {
  const loader = new Loader()
  
  try {
    await loader.show()
    
    // Load assets
    await loadAssets()
    loader.updateProgress(0.33)
    
    // Initialize app
    await initializeApp()
    loader.updateProgress(0.66)
    
    // Final setup
    await finalSetup()
    loader.updateProgress(1.0)
    
    // Small delay to show 100%
    await new Promise(resolve => setTimeout(resolve, 300))
    
  } catch (error) {
    console.error('Loading failed:', error)
  } finally {
    await loader.hide()
    loader.dispose()
  }
}
```

## Notes
- The loader uses Three.js for 3D rendering
- Animations are powered by GSAP
- Z-index is set to 11000 (above page transition overlay at 10000)
- The 3D geometry includes rings, sphere, and octahedron for visual interest
- All animations respect the monochrome + silver accent color scheme
