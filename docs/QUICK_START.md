# Tattva Creative - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 20.15.0 or higher
- npm or yarn package manager
- Modern web browser with WebGL support

### Installation
```bash
# Navigate to project directory
cd "3d web"

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173` (or next available port).

---

## 📁 Project Structure

```
3d web/
├── src/
│   ├── classes/              # TypeScript classes (OOP architecture)
│   │   ├── App.tsx           # Main orchestrator
│   │   ├── SceneManager.tsx  # Three.js scene setup
│   │   ├── ModelLoader.tsx   # 3D model loading
│   │   ├── ParticleSystem.tsx # Particle effects
│   │   ├── MouseTracker.tsx  # Mouse interaction
│   │   ├── ModelAnimator.tsx # 3D model animation
│   │   ├── MenuManager.tsx   # Navigation handling
│   │   ├── ScrollManager.tsx # Scroll & camera control
│   │   ├── Scene3DEffects.tsx # 3D effects per section
│   │   ├── UIInteractions.tsx # UI event handling
│   │   └── ElementalInteractive.tsx # Element switcher
│   ├── main.tsx              # Entry point
│   ├── style.css             # All styles (~900 lines)
│   └── ring.glb              # 3D model file
├── public/                   # Static assets
├── index.html                # Main HTML file
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── vite.config.js            # Vite config (if exists)
```

---

## 🎨 Customization Guide

### Changing Colors

Edit `src/style.css` (lines 16-60):
```css
:root {
  --black: #000000;          /* Main background */
  --white: #FFFFFF;          /* Main text */
  --silver: #C0C0C0;         /* Accent color */
  --silver-light: #E8E8E8;   /* Hover accent */
  --silver-dark: #A0A0A0;    /* Progress bar */
}
```

### Updating Content

#### Hero Section
Edit `index.html` (lines 50-63):
- Change logo SVG
- Update brand name
- Modify tagline

#### Intro Statement
Edit `index.html` (lines 64-76):
- Update headline
- Change subline services

#### Work Tiles
Edit `index.html` (lines 77-111):
- Replace project titles
- Update categories
- Add background images (CSS)

#### Philosophy Text
Edit `index.html` (lines 112-142):
- Modify headline
- Update philosophy text

#### Process Steps
Edit `index.html` (lines 143-190):
- Change step titles
- Update descriptions
- Modify icons (SVG)

#### Client Logos
Edit `index.html` (lines 191-213):
- Replace placeholder text with `<img>` tags
- Update testimonial quote

#### Contact CTA
Edit `index.html` (lines 214-221):
- Change headline
- Update email address

### Adding New Elements

To add a new element (e.g., "Metal"):

1. Edit `src/classes/ElementalInteractive.tsx`:
```typescript
private elements = {
  earth: { icon: '🌍', name: 'Earth', color: '#8B4513' },
  fire: { icon: '🔥', name: 'Fire', color: '#FF4500' },
  water: { icon: '💧', name: 'Water', color: '#1E90FF' },
  air: { icon: '💨', name: 'Air', color: '#87CEEB' },
  space: { icon: '✨', name: 'Space', color: '#4B0082' },
  metal: { icon: '⚙️', name: 'Metal', color: '#708090' }  // NEW
}
```

2. Add button in `index.html`:
```html
<button class="element-btn" data-element="metal">Metal</button>
```

### Adjusting Camera Movement

Edit `src/classes/ScrollManager.tsx` (lines 125-135):
```typescript
const cameraKeyframes = [
  { progress: 0, position: { x: 0, y: 0, z: 5 }, rotation: 0 },
  // Adjust x, y, z, and rotation values
  // x: left/right, y: up/down, z: near/far
]
```

**Tips:**
- Increase `z` to move camera away (wider view)
- Decrease `z` to move camera closer (tighter view)
- Adjust `x` for left/right movement (-2 to +2)
- Adjust `y` for up/down movement (-1 to +1)
- Rotation is in radians (-0.3 to +0.3)

---

## 🔧 Common Tasks

### Adding a New Section

1. **Add HTML** in `index.html`:
```html
<section class="page-section new-section" id="new">
  <div class="section-content">
    <h2 class="section-title">New Section</h2>
    <p>Content here...</p>
  </div>
</section>
```

2. **Add CSS** in `src/style.css`:
```css
.new-section {
  background: var(--gray-900);
  padding: var(--spacing-3xl) var(--spacing-lg);
}
```

3. **Update Camera Keyframes** in `ScrollManager.tsx`:
```typescript
// Add new keyframe for the section
{ progress: 0.XX, position: { x: X, y: Y, z: Z }, rotation: R }
```

4. **Update Navigation** in `index.html`:
```html
<a href="#new" class="nav-item">New</a>
```

### Changing the 3D Model

1. Replace `src/ring.glb` with your model
2. Update path in `ModelLoader.tsx` if needed
3. Adjust camera position in `SceneManager.tsx` if model size differs

### Modifying Animations

#### Scroll Speed
Edit `ScrollManager.tsx`:
```typescript
// Adjust easing function for faster/slower transitions
private easeInOutCubic(t: number): number {
  // Modify this function
}
```

#### Hover Transitions
Edit `src/style.css`:
```css
.work-tile {
  transition: all 0.8s ease; /* Change duration */
}
```

#### Element Switching
Edit `ElementalInteractive.tsx`:
```typescript
setTimeout(() => {
  // Change 300 to adjust fade speed
}, 300)
```

---

## 🐛 Troubleshooting

### 3D Model Not Loading
- Check file path: `/ring.glb` (must be in `src/` or `public/`)
- Verify GLB file is valid (test in online viewer)
- Check browser console for errors

### Camera Not Moving
- Verify ScrollManager is initialized in App.tsx
- Check keyframe progress values (0 to 1)
- Ensure sections have proper IDs

### Elements Not Switching
- Check if ElementalInteractive is instantiated in App.tsx
- Verify button `data-element` attributes match element keys
- Check browser console for errors

### Styles Not Applying
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
- Check CSS selector specificity
- Verify class names match HTML

### Performance Issues
- Reduce particle count in ParticleSystem.tsx
- Simplify camera keyframes
- Optimize 3D model (reduce polygons)
- Disable ring animation on mobile

---

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` directory.

### Optimization Tips
1. Compress 3D model (use gltf-pipeline)
2. Optimize images (use WebP format)
3. Enable gzip compression on server
4. Use CDN for static assets
5. Implement lazy loading for images

---

## 🔗 Useful Resources

### Three.js
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

### GSAP
- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Vite
- [Vite Documentation](https://vitejs.dev/)

---

## 💡 Tips & Best Practices

### Performance
- Keep 3D model under 5MB
- Limit particle count to 1000-2000
- Use `requestAnimationFrame` for animations
- Disable heavy effects on mobile

### Code Organization
- Keep classes focused (single responsibility)
- Use TypeScript types for safety
- Comment complex logic
- Follow existing naming conventions

### Design
- Maintain monochrome palette
- Use generous whitespace
- Keep typography hierarchy clear
- Test on multiple devices

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-section

# Commit changes
git add .
git commit -m "Add new section"

# Push to remote
git push origin feature/new-section
```

---

## 📞 Support

For questions or issues:
1. Check documentation files (TATTVA_CREATIVE_V3.md, CAMERA_MOVEMENTS.md)
2. Review TESTING_CHECKLIST.md
3. Check browser console for errors
4. Verify all dependencies are installed

---

## 🎯 Next Steps

1. ✅ Review the design in browser
2. ✅ Test all interactions
3. ⬜ Add real project images
4. ⬜ Replace client logo placeholders
5. ⬜ Implement contact form backend
6. ⬜ Create project detail pages
7. ⬜ Add loading screen
8. ⬜ Optimize for SEO
9. ⬜ Deploy to production

---

**Happy Coding! 🚀**

*Tattva Creative - Essence in Motion*
