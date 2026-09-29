import { useId, type ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  label: string
}

export function Tooltip({ children, label }: TooltipProps) {
  const id = useId()

  return (
    <span className="tooltip" tabIndex={0} aria-describedby={id}>
      {children}
      <span className="tooltip__bubble" id={id} role="tooltip">
        {label}
      </span>
    </span>
  )
}
