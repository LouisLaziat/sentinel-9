import { createSparkline } from '../../lib/telemetry'

type TelemetryTone = 'lime' | 'cyan' | 'violet' | 'warning'

interface TelemetryCardProps {
  change: string
  label: string
  points: number[]
  tone?: TelemetryTone
  unit?: string
  value: string
}

export function TelemetryCard({
  change,
  label,
  points,
  tone = 'lime',
  unit,
  value,
}: TelemetryCardProps) {
  return (
    <article className={`telemetry-card telemetry-card--${tone}`}>
      <div className="telemetry-card__topline">
        <span>{label}</span>
        <span className="telemetry-card__change">{change}</span>
      </div>
      <div className="telemetry-card__reading">
        <strong>{value}</strong>
        {unit ? <span>{unit}</span> : null}
      </div>
      <svg
        aria-hidden="true"
        className="telemetry-card__graph"
        preserveAspectRatio="none"
        viewBox="0 0 100 38"
      >
        <polyline points={createSparkline(points)} vectorEffect="non-scaling-stroke" />
      </svg>
    </article>
  )
}
