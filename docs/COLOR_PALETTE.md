# 🎨 Tattva Creative - Monochromatic Color Palette

## Color System Documentation

This document defines the complete monochromatic gray color palette used throughout the Tattva Creative website.

---

## 🎨 Primary Color Palette

### **Grayscale Spectrum** (Light to Dark)

| Color Code | Hex Value | RGB | Usage | Description |
|------------|-----------|-----|-------|-------------|
| **Gray 100** | `#F8F9FA` | `rgb(248, 249, 250)` | Lightest backgrounds, subtle highlights | Almost white, very light gray |
| **Gray 200** | `#E9ECEF` | `rgb(233, 236, 239)` | Light backgrounds, hover states | Light gray, soft background |
| **Gray 300** | `#DEE2E6` | `rgb(222, 226, 230)` | Borders, dividers, subtle elements | Medium-light gray |
| **Gray 400** | `#CED4DA` | `rgb(206, 212, 218)` | Disabled states, placeholders | Medium gray |
| **Gray 500** | `#ADB5BD` | `rgb(173, 181, 189)` | Secondary text, icons | Neutral gray |
| **Gray 600** | `#6C757D` | `rgb(108, 117, 125)` | Body text, primary content | Medium-dark gray |
| **Gray 700** | `#495057` | `rgb(73, 80, 87)` | Headings, important text | Dark gray |
| **Gray 800** | `#343A40` | `rgb(52, 58, 64)` | Primary text, strong emphasis | Very dark gray |
| **Gray 900** | `#212529` | `rgb(33, 37, 41)` | Darkest backgrounds, maximum contrast | Almost black |

---

## 🎯 Color Usage Guidelines

### **Backgrounds**
- **Primary Background**: Gray 900 (`#212529`)
- **Card Background**: Gray 800 with transparency (`rgba(52, 58, 64, 0.8)`)
- **Hover Background**: Gray 700 (`#495057`)
- **Light Accents**: Gray 100 (`#F8F9FA`)

### **Text**
- **Primary Text**: Gray 100 (`#F8F9FA`)
- **Secondary Text**: Gray 400 (`#CED4DA`)
- **Muted Text**: Gray 500 (`#ADB5BD`)
- **Headings**: Gray 100 (`#F8F9FA`)

### **Borders & Dividers**
- **Subtle Borders**: Gray 800 with transparency (`rgba(52, 58, 64, 0.3)`)
- **Visible Borders**: Gray 700 (`#495057`)
- **Accent Borders**: Gray 600 (`#6C757D`)

### **Interactive Elements**
- **Buttons Primary**: Gray 700 (`#495057`)
- **Buttons Hover**: Gray 600 (`#6C757D`)
- **Links**: Gray 400 (`#CED4DA`)
- **Links Hover**: Gray 100 (`#F8F9FA`)

### **Shadows**
- **Subtle Shadow**: `rgba(33, 37, 41, 0.1)`
- **Medium Shadow**: `rgba(33, 37, 41, 0.3)`
- **Strong Shadow**: `rgba(33, 37, 41, 0.5)`

---

## 🎨 CSS Variables

```css
:root {
  /* Monochromatic Gray Palette */
  --gray-100: #F8F9FA;
  --gray-200: #E9ECEF;
  --gray-300: #DEE2E6;
  --gray-400: #CED4DA;
  --gray-500: #ADB5BD;
  --gray-600: #6C757D;
  --gray-700: #495057;
  --gray-800: #343A40;
  --gray-900: #212529;
  
  /* Semantic Color Assignments */
  --primary-color: var(--gray-600);
  --secondary-color: var(--gray-700);
  --accent-color: var(--gray-500);
  
  --dark-bg: var(--gray-900);
  --darker-bg: var(--gray-800);
  
  --light-text: var(--gray-100);
  --body-text: var(--gray-400);
  --muted-text: var(--gray-500);
  
  --card-bg: rgba(52, 58, 64, 0.8);
  --card-hover: rgba(73, 80, 87, 0.9);
  
  --border-color: rgba(108, 117, 125, 0.3);
  --border-hover: var(--gray-600);
}
```

---

## 🎨 Design Principles

### **Monochromatic Aesthetic**
1. **Subtle Contrast**: Use adjacent shades for subtle differentiation
2. **Clear Hierarchy**: Use lighter shades for emphasis, darker for backgrounds
3. **Smooth Transitions**: Gradual color changes between states
4. **Depth through Opacity**: Layer grays with transparency for depth

### **Visual Hierarchy**
```
Lightest (Gray 100) → Most Important
    ↓
Gray 200-300 → Secondary Elements
    ↓
Gray 400-500 → Body Content
    ↓
Gray 600-700 → Backgrounds & Containers
    ↓
Darkest (Gray 900) → Base Background
```

### **Accessibility**
- **Minimum Contrast**: 4.5:1 for body text
- **Heading Contrast**: 7:1 for headings
- **Interactive Elements**: Clear visual feedback on hover/focus

---

## 🎨 Color Combinations

### **High Contrast Pairs** (for text on background)
- Gray 100 on Gray 900 ✅ (Excellent contrast)
- Gray 200 on Gray 800 ✅ (Very good contrast)
- Gray 300 on Gray 700 ✅ (Good contrast)

### **Subtle Pairs** (for borders, dividers)
- Gray 600 on Gray 800 (Subtle but visible)
- Gray 700 on Gray 900 (Very subtle)

### **Hover States**
- Gray 700 → Gray 600 (Lighten on hover)
- Gray 800 → Gray 700 (Lighten on hover)
- Add opacity: `rgba(108, 117, 125, 0.1)` overlay

---

## 🎨 Gradient Examples

### **Background Gradients**
```css
/* Subtle depth gradient */
background: linear-gradient(180deg, #212529 0%, #343A40 50%, #212529 100%);

/* Card gradient */
background: linear-gradient(135deg, #343A40, #495057);

/* Hover glow */
box-shadow: 0 0 40px rgba(173, 181, 189, 0.2);
```

---

## 🎨 Animation & Effects

### **Glow Effects**
```css
/* Subtle glow */
box-shadow: 0 0 20px rgba(206, 212, 218, 0.1);

/* Medium glow */
box-shadow: 0 0 40px rgba(173, 181, 189, 0.2);

/* Strong glow */
box-shadow: 0 0 60px rgba(173, 181, 189, 0.3);
```

### **Glassmorphism**
```css
background: rgba(52, 58, 64, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(108, 117, 125, 0.2);
```

---

## 🎨 Component-Specific Colors

### **Header**
- Background: `rgba(33, 37, 41, 0.9)`
- Border: `rgba(108, 117, 125, 0.2)`
- Text: Gray 100

### **Cards**
- Background: `rgba(52, 58, 64, 0.8)`
- Border: `rgba(108, 117, 125, 0.1)`
- Hover Border: Gray 600
- Shadow: `0 4px 24px rgba(33, 37, 41, 0.4)`

### **Buttons**
- Primary: Gray 700 background, Gray 100 text
- Hover: Gray 600 background
- Secondary: Transparent background, Gray 400 border
- Secondary Hover: Gray 800 background

### **Forms**
- Input Background: `rgba(52, 58, 64, 0.6)`
- Input Border: `rgba(108, 117, 125, 0.3)`
- Focus Border: Gray 600
- Placeholder: Gray 500

---

## 🎨 Particle System Colors

### **Section-Based Colors** (subtle variations)
- **Home**: Gray 500 (`#ADB5BD`)
- **Projects**: Gray 600 (`#6C757D`)
- **About**: Gray 400 (`#CED4DA`)
- **Contact**: Gray 500 (`#ADB5BD`)

---

## 🎨 Accessibility Notes

### **WCAG Compliance**
- ✅ All text combinations meet WCAG AA standards
- ✅ Interactive elements have clear focus states
- ✅ Sufficient contrast for all UI elements

### **Color Blindness Friendly**
- ✅ Monochromatic scheme works for all types of color blindness
- ✅ Relies on lightness contrast, not hue
- ✅ Clear visual hierarchy without color dependency

---

## 🎨 Usage Examples

### **Example 1: Card Component**
```css
.card {
  background: rgba(52, 58, 64, 0.8);  /* Gray 800 with transparency */
  border: 1px solid rgba(108, 117, 125, 0.2);  /* Gray 600 subtle */
  color: #F8F9FA;  /* Gray 100 */
}

.card:hover {
  background: rgba(73, 80, 87, 0.9);  /* Gray 700 */
  border-color: #6C757D;  /* Gray 600 */
  box-shadow: 0 12px 36px rgba(33, 37, 41, 0.5);  /* Gray 900 shadow */
}
```

### **Example 2: Typography**
```css
h1 {
  color: #F8F9FA;  /* Gray 100 - highest contrast */
}

p {
  color: #CED4DA;  /* Gray 400 - comfortable reading */
}

.muted {
  color: #ADB5BD;  /* Gray 500 - de-emphasized */
}
```

---

## 🎨 Design Philosophy

### **Why Monochromatic?**
1. **Timeless**: Never goes out of style
2. **Professional**: Sophisticated and elegant
3. **Versatile**: Works in any context
4. **Focused**: Draws attention to content, not colors
5. **Accessible**: High contrast, color-blind friendly

### **Visual Impact**
- **Depth through shadows**: Multiple layers of gray create depth
- **Contrast for emphasis**: Lightest grays draw the eye
- **Subtle transitions**: Smooth color changes feel premium
- **Clean aesthetic**: Minimalist and modern

---

**🎨 This monochromatic palette creates a sophisticated, professional, and timeless aesthetic perfect for a high-end 3D art studio.**
