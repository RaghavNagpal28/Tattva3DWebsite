# Camera Movement Guide - Tattva Creative

## Overview
The 3D camera smoothly moves through 8 keyframes as users scroll through the 7 sections, creating a cinematic experience that complements each section's content.

---

## Camera Keyframes

### Keyframe 1: Hero Section (0%)
```
Position: x: 0, y: 0, z: 5
Rotation: 0
```
- **Centered view** of the 3D ring model
- Ring animation is **active** here
- User sees logo and "Essence in Motion" tagline

---

### Keyframe 2: Intro Statement (14%)
```
Position: x: 1, y: 0.3, z: 5.5
Rotation: 0.1 (slight right turn)
```
- Camera **moves right and slightly up**
- Pulls back slightly (z: 5.5)
- Creates dynamic transition to mission statement

---

### Keyframe 3: Work Preview (29%)
```
Position: x: -1, y: 0.5, z: 6
Rotation: -0.1 (slight left turn)
```
- Camera **swings to the left**
- Moves higher (y: 0.5)
- Further back (z: 6) for wider view
- Showcases the 3 project tiles

---

### Keyframe 4: Philosophy Section (43%)
```
Position: x: 1.5, y: 0, z: 5.8
Rotation: 0.15 (moderate right turn)
```
- Camera **moves far right**
- Returns to center height
- Emphasizes the elemental interactive motif

---

### Keyframe 5: Process Section (57%)
```
Position: x: -1.2, y: -0.3, z: 6.2
Rotation: -0.12 (moderate left turn)
```
- Camera **swings left and down**
- Furthest back position (z: 6.2)
- Creates dramatic view for the timeline

---

### Keyframe 6: Clients Section (71%)
```
Position: x: 0.8, y: 0.4, z: 5.6
Rotation: 0.08 (gentle right turn)
```
- Camera **moves right and up**
- Closer view (z: 5.6)
- Highlights client logos and testimonial

---

### Keyframe 7: Contact CTA (86%)
```
Position: x: -0.5, y: -0.2, z: 5.8
Rotation: -0.05 (subtle left turn)
```
- Camera **slightly left and down**
- Prepares for final position
- Focuses on "Ready to find your element?"

---

### Keyframe 8: Footer (100%)
```
Position: x: 0, y: 0, z: 5
Rotation: 0
```
- Camera **returns to center**
- Back to original position
- Creates a complete circular journey

---

## Movement Characteristics

### Interpolation
- **Easing**: Cubic easing (`easeInOutCubic`)
- **Smoothness**: Continuous interpolation between keyframes
- **No Jumps**: Seamless transitions

### Camera Behavior
- **X-axis**: Swings left and right (-1.5 to +1.5)
- **Y-axis**: Moves up and down (-0.3 to +0.5)
- **Z-axis**: Pulls in and out (5 to 6.2)
- **Rotation**: Subtle turns (-0.15 to +0.15 radians)

### Visual Effect
The camera creates a **figure-8 pattern** in 3D space:
```
    Hero (center)
       ↓
  Intro (right) → Work (left)
       ↓              ↓
Philosophy (far right) → Process (far left)
       ↓                    ↓
    Clients (right) → Contact (left)
              ↓
         Footer (center)
```

---

## Technical Details

### Progress Calculation
```typescript
const scrollProgress = this.scrollY / this.totalHeight
```
- `scrollProgress`: 0 to 1 (0% to 100%)
- Maps to 8 keyframes across 7 sections

### Keyframe Distribution
- **Hero to Intro**: 14% of scroll
- **Intro to Work**: 15% of scroll
- **Work to Philosophy**: 14% of scroll
- **Philosophy to Process**: 14% of scroll
- **Process to Clients**: 14% of scroll
- **Clients to Contact**: 15% of scroll
- **Contact to Footer**: 14% of scroll

### Ring Animation Control
```typescript
// Enable model animator only on Home screen (section 0)
if (this.modelAnimator) {
  this.modelAnimator.setEnabled(section === 0)
}
```
- Ring **only animates** in Hero section
- Stays static in other sections for performance

---

## Customization Tips

### To Make Camera More Dynamic
Increase position ranges:
```typescript
{ progress: 0.43, position: { x: 2.5, y: 1, z: 7 }, rotation: 0.25 }
```

### To Make Camera More Subtle
Decrease position ranges:
```typescript
{ progress: 0.43, position: { x: 0.5, y: 0.1, z: 5.3 }, rotation: 0.05 }
```

### To Add More Keyframes
Insert additional keyframes between sections:
```typescript
{ progress: 0.21, position: { x: 0, y: 0.7, z: 6.5 }, rotation: 0 }
```

### To Change Easing
Modify the `easeInOutCubic` function in ScrollManager:
```typescript
// Current: Smooth cubic
const eased = this.easeInOutCubic(localProgress)

// Alternative: Linear
const eased = localProgress

// Alternative: Ease-in-out-quart (more dramatic)
const eased = localProgress < 0.5
  ? 8 * localProgress * localProgress * localProgress * localProgress
  : 1 - 8 * (--localProgress) * localProgress * localProgress * localProgress
```

---

## Performance Notes

- Camera updates on every scroll event (passive listener)
- Interpolation is lightweight (simple math operations)
- No frame drops expected on modern devices
- 3D model animation disabled on non-hero sections for optimization

---

## Testing Checklist

- [ ] Smooth transitions between all sections
- [ ] No camera jumps or stutters
- [ ] Ring animation only on Hero section
- [ ] Camera returns to center at footer
- [ ] Responsive on mobile (camera movements scale appropriately)
- [ ] No performance issues during scroll

---

**Note**: The camera movements are designed to complement the content of each section, creating a cohesive narrative journey through the Tattva Creative brand story.
