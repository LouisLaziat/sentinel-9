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

export function BellIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 10.2a5.5 5.5 0 0 1 11 0v3.1l1.8 2.7H4.7l1.8-2.7v-3.1Z" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.4" />
      <path d="M9.7 18.5a2.5 2.5 0 0 0 4.6 0" stroke="currentColor" strokeWidth="1.4" />
    </IconBase>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" stroke="currentColor" strokeWidth="1.4" />
    </IconBase>
  )
}

export function DroneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 8h4l2.2 2h5.6L17 8h4M5 8 3.7 5.8M19 8l1.3-2.2M8.5 13.5h7M10 10v6h4v-6" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.3" />
      <circle cx="3" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="21" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </IconBase>
  )
}

export function RobotIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 7.5h10v8H7v-8ZM9 15.5v3M15 15.5v3M12 7.5V4.8M10 4.8h4M4.5 10v3M19.5 10v3" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.3" />
      <path d="M9.5 10.5h.1M14.4 10.5h.1" stroke="currentColor" strokeLinecap="square" strokeWidth="2" />
    </IconBase>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3.5 6 5-2.5 7 2.5 5-2.5V18l-5 2.5-7-2.5-5 2.5V6Z" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.3" />
      <path d="M8.5 3.5V18M15.5 6v14.5" stroke="currentColor" strokeWidth="1.3" />
    </IconBase>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function MinusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function HangarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.5 20V8.5L12 3l8.5 5.5V20M7 20v-8h10v8M9.5 15h5" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.3" />
    </IconBase>
  )
}

export function WrenchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14.8 6.8a4.5 4.5 0 0 0-5.7 5.7L3.7 18l2.3 2.3 5.5-5.4a4.5 4.5 0 0 0 5.7-5.7l-2.6 2.6-2.4-.5-.5-2.4 3.1-2.1Z" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.3" />
    </IconBase>
  )
}

export function PulseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2.1-5.5 4.1 11L15.5 12H21" stroke="currentColor" strokeLinejoin="bevel" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeDasharray="2.5 3" strokeWidth="1.1" />
    </IconBase>
  )
}
