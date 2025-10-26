/**
 * Tracks mouse/touch position and activity state
 */
export class MouseTracker {
  private x: number = 0
  private y: number = 0
  private isActive: boolean = false
  private lastMoveTime: number = 0
  private idleTimeout: number = 2000 // 2 seconds
  private idleCheckInterval: number = 0

  constructor() {
    this.setupEventListeners()
    this.startIdleCheck()
  }

  private setupEventListeners(): void {
    window.addEventListener('mousemove', (event: MouseEvent) => {
      this.updatePosition(event.clientX, event.clientY)
    })

    window.addEventListener('touchmove', (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        this.updatePosition(touch.clientX, touch.clientY)
      }
    })
  }

  private updatePosition(clientX: number, clientY: number): void {
    // Normalize to -1 to 1 range
    this.x = (clientX / window.innerWidth) * 2 - 1
    this.y = -(clientY / window.innerHeight) * 2 + 1
    this.isActive = true
    this.lastMoveTime = Date.now()
  }

  private startIdleCheck(): void {
    this.idleCheckInterval = window.setInterval(() => {
      if (Date.now() - this.lastMoveTime > this.idleTimeout) {
        this.isActive = false
      }
    }, 100)
  }

  public getX(): number {
    return this.x
  }

  public getY(): number {
    return this.y
  }

  public getIsActive(): boolean {
    return this.isActive
  }

  public dispose(): void {
    clearInterval(this.idleCheckInterval)
  }
}
