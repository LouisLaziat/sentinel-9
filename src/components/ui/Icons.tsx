import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="m13.4 2-8 11.2h6.2L10.6 22l8-11.2h-6.2L13.4 2Z"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth="1.4"
      />
    </IconBase>
  )
}

export function CrosshairIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" fill="currentColor" r="1.5" />
    </IconBase>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h6v6H4V4ZM14 4h6v6h-6V4ZM4 14h6v6H4v-6ZM14 14h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.25" />
    </IconBase>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function RadarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 12 18.5 7" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" fill="currentColor" r="1.3" />
    </IconBase>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2.8 19 5.5v5.2c0 4.7-2.8 8.4-7 10.5-4.2-2.1-7-5.8-7-10.5V5.5L12 2.8Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="m8.8 12 2.1 2.1 4.5-4.6" stroke="currentColor" strokeWidth="1.4" />
    </IconBase>
  )
}

export function ReplayIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 8.5V4m0 0h-4.5M19 4l-3.2 3.2a6.7 6.7 0 1 0 1.1 8" stroke="currentColor" strokeLinecap="square" strokeWidth="1.4" />
    </IconBase>
  )
}
