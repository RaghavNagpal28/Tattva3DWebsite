import * as THREE from 'three'

/**
 * Manages the particle system for visual effects
 */
export class ParticleSystem {
  private particlesMesh: THREE.Points
  private particlesGeometry: THREE.BufferGeometry
  private particlesMaterial: THREE.PointsMaterial

  constructor(particlesCount: number = 1000) {
    this.particlesGeometry = this.createGeometry(particlesCount)
    this.particlesMaterial = this.createMaterial()
    this.particlesMesh = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
  }

  private createGeometry(count: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry()
    const posArray = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    return geometry
  }

  private createMaterial(): THREE.PointsMaterial {
    return new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
  }

  public getMesh(): THREE.Points {
    return this.particlesMesh
  }

  public update(elapsedTime: number): void {
    this.particlesMesh.rotation.y = elapsedTime * 0.05
  }

  public dispose(): void {
    this.particlesGeometry.dispose()
    this.particlesMaterial.dispose()
  }
}
