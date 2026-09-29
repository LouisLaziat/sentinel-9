import { useEffect } from 'react'

export function CursorGlow() {
  useEffect(() => {
    let animationFrame = 0

    function updatePointer(event: PointerEvent) {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
      })
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', updatePointer)
    }
  }, [])

  return <div className="cursor-glow" aria-hidden="true" />
}
