import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Handles loading and managing 3D models
 */
export class ModelLoader {
  private loader: GLTFLoader
  private modelGroup: THREE.Group
  private model: THREE.Group | null = null

  constructor() {
    this.loader = new GLTFLoader()
    this.modelGroup = new THREE.Group()
  }

  public async loadModel(path: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf: GLTF) => {
          this.model = gltf.scene
          this.processModel()
          this.modelGroup.add(this.model)
          console.log('Model loaded successfully!')
          resolve(this.modelGroup)
        },
        (progress: ProgressEvent) => {
          const percentage = (progress.loaded / progress.total * 100).toFixed(2)
          console.log(`Loading progress: ${percentage}%`)
        },
        (error: unknown) => {
          console.error('Error loading model:', error)
          reject(error)
        }
      )
    })
  }

  private processModel(): void {
    if (!this.model) return

    // Preserve original materials and colors
    this.model.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: THREE.Material) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.needsUpdate = true
                mat.metalness = mat.metalness ?? 0.5
                mat.roughness = mat.roughness ?? 0.5
              }
            })
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.needsUpdate = true
            child.material.metalness = child.material.metalness ?? 0.5
            child.material.roughness = child.material.roughness ?? 0.5
          }
        }
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Calculate bounding box and scale
    const box = new THREE.Box3().setFromObject(this.model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // Center the model
    this.model.position.sub(center)

    // Scale to fit in view
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim
    this.model.scale.setScalar(scale)

    console.log('Model size:', size)
    console.log('Model scale:', scale)
  }

  public getModelGroup(): THREE.Group {
    return this.modelGroup
  }

  public getModel(): THREE.Group | null {
    return this.model
  }
}
