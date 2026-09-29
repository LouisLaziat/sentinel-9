import { describe, expect, it } from 'vitest'
import { calculateFleetStats, getModule } from './fleet'

describe('calculateFleetStats', () => {
  it('combines the selected module effects with base performance', () => {
    const result = calculateFleetStats(
      { power: 60, mobility: 70, defense: 50, energy: 20 },
      { sensor: 'sensor-ghost', core: 'core-vector', utility: 'utility-shield' },
    )

    expect(result).toEqual({ power: 65, mobility: 81, defense: 62, energy: 52 })
  })

  it('clamps derived performance to the supported range', () => {
    const result = calculateFleetStats(
      { power: 96, mobility: 98, defense: 97, energy: 92 },
      { sensor: 'sensor-aegis', core: 'core-pulse', utility: 'utility-shield' },
    )

    expect(result).toEqual({ power: 100, mobility: 100, defense: 100, energy: 100 })
  })
})

describe('getModule', () => {
  it('returns module metadata by identifier', () => {
    expect(getModule('utility-emp')?.label).toBe('EMP net')
    expect(getModule('missing-module')).toBeUndefined()
  })
})
