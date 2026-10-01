import { describe, expect, it } from 'vitest'
import { defaultPreferences, loadPreferences, parsePreferences } from './preferences'

describe('operator preference recovery', () => {
  it('restores valid settings and ignores unrecognized fields', () => {
    expect(parsePreferences(JSON.stringify({ environmentalMotion: false, precisionTelemetry: false, tacticalContrast: true, unknown: true })))
      .toEqual({ environmentalMotion: false, precisionTelemetry: false, tacticalContrast: true })
  })

  it('repairs missing and incorrectly typed fields independently', () => {
    expect(parsePreferences('{"environmentalMotion":false,"precisionTelemetry":"false"}'))
      .toEqual({ ...defaultPreferences, environmentalMotion: false })
  })

  it.each([null, '', '{bad', 'null', 'false', '123', '[]', '"settings"', ' '.repeat(2_049)])('handles corrupt or oversized storage: %s', (value) => {
    expect(parsePreferences(value)).toEqual(defaultPreferences)
  })

  it('returns independent defaults and works without browser storage', () => {
    const first = parsePreferences(null)
    first.environmentalMotion = false
    expect(parsePreferences(null).environmentalMotion).toBe(true)
    expect(loadPreferences()).toEqual(defaultPreferences)
  })
})
