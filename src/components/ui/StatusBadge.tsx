import type { ReactNode } from 'react'

type StatusTone = 'online' | 'warning' | 'critical' | 'neutral'

interface StatusBadgeProps {
  children: ReactNode
  pulse?: boolean
  tone?: StatusTone
}

export function StatusBadge({
  children,
  pulse = false,
  tone = 'neutral',
}: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span
        className={`status-badge__signal${pulse ? ' status-badge__signal--pulse' : ''}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
