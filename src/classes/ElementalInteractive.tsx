/**
 * ElementalInteractive - Handles the interactive elemental motif
 * Allows users to switch between Earth, Fire, Water, Air, and Space elements
 */
export class ElementalInteractive {
  private container: HTMLElement | null
  private display: HTMLElement | null
  private buttons: NodeListOf<HTMLButtonElement>
  private currentElement: string = 'earth'

  private elements = {
    earth: { icon: '🌍', name: 'Earth', color: '#8B4513' },
    fire: { icon: '🔥', name: 'Fire', color: '#FF4500' },
    water: { icon: '💧', name: 'Water', color: '#1E90FF' },
    air: { icon: '💨', name: 'Air', color: '#87CEEB' },
    space: { icon: '✨', name: 'Space', color: '#4B0082' }
  }

  constructor() {
    this.container = document.getElementById('elementalInteractive')
    this.display = this.container?.querySelector('.element-display') || null
    this.buttons = document.querySelectorAll('.element-btn')

    this.initialize()
  }

  private initialize(): void {
    // Set up button click handlers
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const element = button.getAttribute('data-element')
        if (element) {
          this.switchElement(element)
        }
      })
    })

    // Set initial active state
    this.updateActiveButton(this.currentElement)
  }

  private switchElement(element: string): void {
    if (element === this.currentElement) return

    const elementData = this.elements[element as keyof typeof this.elements]
    if (!elementData || !this.display) return

    // Fade out
    this.display.style.opacity = '0'
    this.display.style.transform = 'scale(0.9)'

    setTimeout(() => {
      // Update content
      this.currentElement = element
      this.display!.setAttribute('data-element', element)
      
      const iconEl = this.display!.querySelector('.element-icon')
      const nameEl = this.display!.querySelector('.element-name')
      
      if (iconEl) iconEl.textContent = elementData.icon
      if (nameEl) nameEl.textContent = elementData.name

      // Fade in
      this.display!.style.opacity = '1'
      this.display!.style.transform = 'scale(1)'

      // Update active button
      this.updateActiveButton(element)
    }, 300)
  }

  private updateActiveButton(element: string): void {
    this.buttons.forEach(button => {
      if (button.getAttribute('data-element') === element) {
        button.classList.add('active')
      } else {
        button.classList.remove('active')
      }
    })
  }

  public dispose(): void {
    // Clean up event listeners if needed
  }
}
