import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'small' | 'medium'

interface ButtonProps {
  children: ReactNode
  className?: string
  href?: string
  icon?: ReactNode
  onClick?: () => void
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  children,
  className = '',
  href,
  icon,
  onClick,
  size = 'medium',
  variant = 'primary',
}: ButtonProps) {
  const classes = `s9-button s9-button--${variant} s9-button--${size} ${className}`.trim()
  const content = (
    <>
      <span>{children}</span>
      {icon ? <span className="s9-button__icon">{icon}</span> : null}
    </>
  )

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {content}
    </button>
  )
}
