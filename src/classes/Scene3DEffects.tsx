import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Manages 3D visual effects that respond to scrolling
 * Creates dynamic animations for 3D objects based on page section
 */
export class Scene3DEffects {
  private scene: THREE.Scene
  private modelGroup: THREE.Group | null = null
  private particleSystem: THREE.Points | null = null
  private floatingObjects: THREE.Mesh[] = []

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.createFloatingObjects()
  }

  /**
   * Create floating geometric objects for visual interest
   */
  private createFloatingObjects(): void {
    const geometries = [
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.25),
      new THREE.IcosahedronGeometry(0.2),
      new THREE.TorusGeometry(0.2, 0.08, 16, 32)
    ]

    const material = new THREE.MeshStandardMaterial({
      color: 0xADB5BD,  // Gray 500
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.5,
      emissive: 0x6C757D,  // Gray 600
      emissiveIntensity: 0.2
    })

    const positions = [
      { x: -4, y: 3, z: -2 },
      { x: 4, y: -2, z: -3 },
      { x: -3, y: -3, z: -1 },
      { x: 3, y: 2, z: -2.5 }
    ]

    geometries.forEach((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, material.clone())
      const pos = positions[index]
      mesh.position.set(pos.x, pos.y, pos.z)
      mesh.userData.initialPosition = { ...pos }
      mesh.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
      }
      this.floatingObjects.push(mesh)
      this.scene.add(mesh)
    })
  }

  /**
   * Set the main model group for animations
   */
  public setModelGroup(group: THREE.Group): void {
    this.modelGroup = group
  }

  /**
   * Set the particle system for animations
   */
  public setParticleSystem(particles: THREE.Points): void {
    this.particleSystem = particles
  }

  /**
   * Animate effects based on current section
   */
  public onSectionChange(sectionIndex: number): void {
    // Animate model based on section
    this.animateModelForSection(sectionIndex)
    
    // Animate floating objects
    this.animateFloatingObjects(sectionIndex)
    
    // Animate particles
    this.animateParticles(sectionIndex)
  }

  /**
   * Animate the main 3D model based on section
   */
  private animateModelForSection(sectionIndex: number): void {
    if (!this.modelGroup) return

    const animations = [
      // Home: Gentle rotation
      {
        rotation: { x: 0, y: Math.PI * 2, z: 0 },
        scale: 1,
        position: { x: 0, y: 0, z: 0 }
      },
      // Projects: Tilt and zoom
      {
        rotation: { x: 0.3, y: Math.PI * 2.5, z: 0.1 },
        scale: 1.2,
        position: { x: -1, y: 0.5, z: 0 }
      },
      // About: Side view
      {
        rotation: { x: -0.2, y: Math.PI * 3, z: -0.1 },
        scale: 1.1,
        position: { x: 1, y: -0.3, z: 0 }
      },
      // Contact: Front facing
      {
        rotation: { x: 0, y: Math.PI * 3.5, z: 0 },
        scale: 0.9,
        position: { x: 0, y: 0.2, z: 0.5 }
      }
    ]

    const anim = animations[sectionIndex] || animations[0]

    gsap.to(this.modelGroup.rotation, {
      x: anim.rotation.x,
      y: anim.rotation.y,
      z: anim.rotation.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })

    gsap.to(this.modelGroup.scale, {
      x: anim.scale,
      y: anim.scale,
      z: anim.scale,
      duration: 1.5,
      ease: 'power2.inOut'
    })

    gsap.to(this.modelGroup.position, {
      x: anim.position.x,
      y: anim.position.y,
      z: anim.position.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  /**
   * Animate floating objects based on section
   */
  private animateFloatingObjects(sectionIndex: number): void {
    this.floatingObjects.forEach((obj, index) => {
      const delay = index * 0.1
      const initialPos = obj.userData.initialPosition

      // Different positions for each section
      const sectionOffsets = [
        { x: 0, y: 0, z: 0 },           // Home
        { x: 2, y: 1, z: -1 },          // Projects
        { x: -2, y: -1, z: -0.5 },      // About
        { x: 0, y: 2, z: -1.5 }         // Contact
      ]

      const offset = sectionOffsets[sectionIndex] || sectionOffsets[0]

      gsap.to(obj.position, {
        x: initialPos.x + offset.x,
        y: initialPos.y + offset.y,
        z: initialPos.z + offset.z,
        duration: 1.5,
        delay: delay,
        ease: 'power2.inOut'
      })

      // Change opacity
      gsap.to(obj.material, {
        opacity: 0.3 + (sectionIndex * 0.15),
        duration: 1,
        delay: delay
      })
    })
  }

  /**
   * Animate particle system based on section
   * Using monochromatic gray palette
   */
  private animateParticles(sectionIndex: number): void {
    if (!this.particleSystem) return

    const material = this.particleSystem.material as THREE.PointsMaterial

    // Different particle colors for each section - monochromatic grays
    const colors = [
      0xADB5BD,  // Home: Gray 500
      0x6C757D,  // Projects: Gray 600
      0xCED4DA,  // About: Gray 400
      0xADB5BD   // Contact: Gray 500
    ]

    gsap.to(material.color, {
      r: new THREE.Color(colors[sectionIndex]).r,
      g: new THREE.Color(colors[sectionIndex]).g,
      b: new THREE.Color(colors[sectionIndex]).b,
      duration: 1.5,
      ease: 'power2.inOut'
    })

    // Adjust particle size
    gsap.to(material, {
      size: 0.02 + (sectionIndex * 0.005),
      duration: 1,
      ease: 'power2.inOut'
    })
  }

  /**
   * Update animations in the render loop
   */
  public update(_deltaTime: number): void {
    // Rotate floating objects
    this.floatingObjects.forEach(obj => {
      obj.rotation.x += obj.userData.rotationSpeed.x
      obj.rotation.y += obj.userData.rotationSpeed.y
      obj.rotation.z += obj.userData.rotationSpeed.z

      // Add floating motion
      obj.position.y += Math.sin(Date.now() * 0.001 + obj.userData.initialPosition.x) * 0.001
    })

    // Pulse model slightly
    if (this.modelGroup) {
      const pulse = Math.sin(Date.now() * 0.001) * 0.02
      this.modelGroup.position.y += pulse * 0.1
    }
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.floatingObjects.forEach(obj => {
      obj.geometry.dispose()
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => mat.dispose())
      } else {
        obj.material.dispose()
      }
      this.scene.remove(obj)
    })
    this.floatingObjects = []
  }
}
