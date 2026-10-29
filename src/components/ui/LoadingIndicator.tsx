import { Localize } from '../i18n/Localize'
interface LoadingIndicatorProps {
  label?: string
}

export function LoadingIndicator({ label = 'Synchronizing' }: LoadingIndicatorProps) {
  return (
    <Localize><div className="loading-indicator" role="status">
      <span className="loading-indicator__glyph" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{label}</span>
    </div></Localize>
  )
}
