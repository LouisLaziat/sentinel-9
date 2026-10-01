import { useId, useState, type ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  label: string
}

export function Tooltip({ children, label }: TooltipProps) {
  const id = useId()
  const [dismissed, setDismissed] = useState(false)

  return (
    <span className="tooltip" tabIndex={0} aria-describedby={dismissed ? undefined : id} onBlur={() => setDismissed(false)} onPointerLeave={() => setDismissed(false)} onKeyDown={(event) => {
      if (event.key === 'Escape') { event.stopPropagation(); setDismissed(true) }
    }}>
      {children}
      <span className="tooltip__bubble" hidden={dismissed} id={id} role="tooltip">
        {label}
      </span>
    </span>
  )
}
