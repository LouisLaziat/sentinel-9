import { useEffect } from 'react'
import { useMediaQuery } from '../../hooks/useBrowserSignals'

export function CursorGlow({ enabled = true }: { enabled?: boolean }) {
  const finePointer = useMediaQuery('(min-width: 761px) and (pointer: fine)')
  useEffect(() => {
    if (!enabled || !finePointer) return
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
  }, [enabled, finePointer])

  return enabled && finePointer ? <div className="cursor-glow" aria-hidden="true" /> : null
}
