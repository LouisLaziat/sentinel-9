export type PreferenceKey = 'environmentalMotion' | 'precisionTelemetry' | 'tacticalContrast'
export type Preferences = Record<PreferenceKey, boolean>

export const defaultPreferences: Readonly<Preferences> = Object.freeze({
  environmentalMotion: true,
  precisionTelemetry: true,
  tacticalContrast: false,
})

export function parsePreferences(serialized: string | null): Preferences {
  if (!serialized || serialized.length > 2_048) return { ...defaultPreferences }
  try {
    const value: unknown = JSON.parse(serialized)
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...defaultPreferences }
    const candidate = value as Partial<Preferences>
    return {
      environmentalMotion: typeof candidate.environmentalMotion === 'boolean' ? candidate.environmentalMotion : defaultPreferences.environmentalMotion,
      precisionTelemetry: typeof candidate.precisionTelemetry === 'boolean' ? candidate.precisionTelemetry : defaultPreferences.precisionTelemetry,
      tacticalContrast: typeof candidate.tacticalContrast === 'boolean' ? candidate.tacticalContrast : defaultPreferences.tacticalContrast,
    }
  } catch {
    return { ...defaultPreferences }
  }
}

export function loadPreferences(): Preferences {
  try {
    return parsePreferences(window.localStorage.getItem('sentinel-9-preferences'))
  } catch {
    return { ...defaultPreferences }
  }
}
