import { useEffect, useState } from 'react'
import { usePageVisibility } from '../../hooks/useBrowserSignals'

export function CommandClock({ enabled }: { enabled: boolean }) {
  const [clock, setClock] = useState(() => new Date())
  const visible = usePageVisibility()

  useEffect(() => {
    if (!enabled || !visible) return
    const timer = window.setInterval(() => setClock(new Date()), 1_000)
    return () => window.clearInterval(timer)
  }, [enabled, visible])

  return (
    <time className="command-topbar__clock" dateTime={clock.toISOString()} aria-label={`Local time ${clock.toLocaleTimeString('en-CA', { hour12: false })}`}>
      {clock.toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}<small>LOCAL</small>
    </time>
  )
}
