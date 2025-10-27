# 🎨 Tattva Creative - 3D Art Studio Website

A stunning, fully scrollable multi-page 3D website featuring immersive scroll-based animations, interactive 3D elements, and a modern aesthetic design. Built with Three.js, TypeScript, and GSAP.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.180.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)

## ✨ Features

### 🎯 Multi-Page Experience
- **Home**: Hero section with animated statistics and CTAs
- **Projects**: Portfolio showcase with interactive project cards
- **About**: Company information with skills grid
- **Contact**: Functional contact form with info cards

### 🎬 Advanced 3D Animations
- **Scroll-Based Transitions**: Smooth camera movements between sections
- **Dynamic 3D Effects**: Objects transform and animate based on current page
- **Particle System**: Color-changing particles that respond to navigation
- **Floating Geometry**: Animated geometric shapes that enhance the 3D scene
- **Model Animations**: Main 3D model rotates and scales per section

### 🎨 Modern Design
- **Glassmorphism**: Frosted glass effect on cards and navigation
- **Gradient Backgrounds**: Animated multi-color gradients
- **Smooth Transitions**: GSAP-powered animations throughout
- **Responsive Design**: Fully responsive from mobile to desktop
- **Accessibility**: Keyboard navigation and ARIA labels

### 🚀 Performance Optimized
- **Object-Oriented Architecture**: Clean, maintainable code structure
- **Efficient Rendering**: Optimized Three.js rendering pipeline
- **Lazy Loading**: Components initialize only when needed
- **Smooth 60fps**: Optimized animation loop

## 🏗️ Architecture

### Object-Oriented Design
The application follows SOLID principles with clear separation of concerns:

```
src/
├── classes/
│   ├── App.ts                # Main application orchestrator
│   ├── SceneManager.ts       # Three.js scene, camera, renderer
│   ├── ScrollManager.ts      # Scroll-based navigation & animations
│   ├── Scene3DEffects.ts     # 3D visual effects manager
│   ├── ModelLoader.ts        # 3D model loading
│   ├── ModelAnimator.ts      # Model animation logic
│   ├── ParticleSystem.ts     # Particle effects
│   ├── MouseTracker.ts       # Mouse/touch input
│   ├── MenuManager.ts        # Navigation menu interactions
│   └── UIInteractions.ts     # Form & button interactions
├── main.tsx                  # Application entry point
└── style.css                 # Modern CSS with variables
```

## 🎯 Class Responsibilities

### **App.ts**
Main application orchestrator that:
- Initializes all components
- Manages the animation loop
- Coordinates between 3D and UI systems
- Handles component lifecycle

### **ScrollManager.ts**
Manages scroll-based navigation:
- Smooth section transitions
- Wheel, touch, and keyboard navigation
- Camera animation per section
- Active navigation state management
- Debounced scroll events

### **Scene3DEffects.ts**
Controls 3D visual effects:
- Creates floating geometric objects
- Animates model transformations per section
- Changes particle colors dynamically
- Manages 3D object lifecycle

### **SceneManager.ts**
Three.js environment setup:
- Scene with transparent background
- Perspective camera configuration
- WebGL renderer with proper color space
- Orbit controls
- Multi-light setup (ambient, directional, point, hemisphere)
- Responsive resize handling

### **ModelLoader.ts**
3D model operations:
- Asynchronous GLB model loading
- Material optimization
- Model traversal and setup
- Error handling

### **ModelAnimator.ts**
Model animation logic:
- Mouse-based rotation
- Smooth interpolation
- Camera-relative positioning
- Performance-optimized updates

### **ParticleSystem.ts**
Particle effects:
- GPU-accelerated particle rendering
- Dynamic color changes
- Wave-based motion
- Efficient buffer geometry

### **MouseTracker.ts**
Input tracking:
- Normalized mouse coordinates
- Touch event support
- Event listener management
- Cross-platform compatibility

### **MenuManager.ts**
Navigation interactions:
- Hamburger menu toggle
- Mobile menu handling
- Click-outside-to-close
- Smooth menu animations

### **UIInteractions.ts**
UI event handling:
- CTA button navigation
- Contact form submission
- Form validation
- Success/error notifications

## 🎨 Design System

### Color Palette
```css
--primary-color: #6366f1    /* Indigo */
--secondary-color: #ec4899  /* Pink */
--accent-color: #14b8a6     /* Teal */
--dark-bg: #0f172a          /* Slate 900 */
--light-text: #f8fafc       /* Slate 50 */
--gray-text: #cbd5e1        /* Slate 300 */
```

### Typography
- **Primary Font**: Poppins (Sans-serif)
- **Display Font**: Playfair Display (Serif)

### Spacing System
- XS: 0.5rem (8px)
- SM: 1rem (16px)
- MD: 2rem (32px)
- LG: 4rem (64px)
- XL: 6rem (96px)

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd "3d web"

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Navigation
- **Mouse Wheel**: Scroll between sections
- **Arrow Keys**: ↑ ↓ Navigate up/down
- **Touch**: Swipe up/down on mobile
- **Navigation Menu**: Click to jump to any section

### Interactive Elements
- **CTA Buttons**: Navigate to Projects or Contact
- **Project Cards**: Hover for effects
- **Contact Form**: Submit messages (demo mode)
- **3D Model**: Auto-rotates and responds to scrolling

## 🛠️ Technologies

### Core
- **Three.js** (0.180.0) - 3D graphics library
- **TypeScript** (5.3.3) - Type-safe JavaScript
- **Vite** (7.1.14) - Fast build tool
- **GSAP** (3.x) - Animation library

### Features
- WebGL rendering
- GLB model loading
- Particle systems
- Responsive design
- Touch support

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- **60 FPS** smooth animations
- **Optimized rendering** with requestAnimationFrame
- **Efficient particle system** using BufferGeometry
- **Debounced scroll events** to prevent jank
- **Lazy component initialization**

## 🔧 Customization

### Change 3D Model
Replace `/ring.glb` in the public folder with your own GLB model.

### Modify Colors
Edit CSS variables in `src/style.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### Add New Sections
1. Add HTML section in `index.html`
2. Update `ScrollManager.ts` camera positions
3. Add section-specific animations in `Scene3DEffects.ts`

### Customize Animations
Modify GSAP timings and easings in:
- `ScrollManager.ts` - Section transitions
- `Scene3DEffects.ts` - 3D object animations

## 📝 Code Quality

### Best Practices
- ✅ Object-oriented design
- ✅ TypeScript for type safety
- ✅ Comprehensive comments
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Error handling
- ✅ Memory management (dispose methods)

### Code Style
- Clean, readable code
- Descriptive variable names
- JSDoc comments on classes and methods
- Consistent formatting

## 🐛 Troubleshooting

### Model Not Loading
- Ensure `ring.glb` is in the public folder
- Check browser console for errors
- Verify model is a valid GLB file

### Scroll Not Working
- Check that sections have `page-section` class
- Verify ScrollManager is initialized
- Ensure no CSS `overflow: hidden` conflicts

### Performance Issues
- Reduce particle count in `ParticleSystem.ts`
- Lower model complexity
- Disable some floating objects

## 📄 License

This project is created for Tattva Creative. All rights reserved.

## 🤝 Contributing

This is a custom project for Tattva Creative. For modifications or enhancements, please contact the development team.

## 📧 Contact

For questions or support:
- Email: hello@tattvacreative.com
- Website: [Tattva Creative](http://localhost:5175)

---

**Built with ❤️ using Three.js, TypeScript, and modern web technologies**
