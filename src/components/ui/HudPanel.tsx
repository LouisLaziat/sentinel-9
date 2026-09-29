import type { ReactNode } from 'react'

type PanelTone = 'default' | 'cyan' | 'warning' | 'critical'

interface HudPanelProps {
  children: ReactNode
  className?: string
  eyebrow?: string
  meta?: string
  title?: string
  tone?: PanelTone
}

export function HudPanel({
  children,
  className = '',
  eyebrow,
  meta,
  title,
  tone = 'default',
}: HudPanelProps) {
  return (
    <article className={`hud-panel hud-panel--${tone} ${className}`.trim()}>
      <span className="hud-panel__notch" aria-hidden="true" />
      {eyebrow || title || meta ? (
        <header className="hud-panel__header">
          <div>
            {eyebrow ? <span className="hud-panel__eyebrow">{eyebrow}</span> : null}
            {title ? <h3>{title}</h3> : null}
          </div>
          {meta ? <span className="hud-panel__meta">{meta}</span> : null}
        </header>
      ) : null}
      <div className="hud-panel__content">{children}</div>
    </article>
  )
}
