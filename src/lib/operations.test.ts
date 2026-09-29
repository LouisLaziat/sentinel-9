import { describe, expect, it } from 'vitest'
import { isUnitVisible, stepMapZoom } from './operations'

describe('stepMapZoom', () => {
  it('moves through the supported zoom levels', () => {
    expect(stepMapZoom(1, 'in')).toBe(1.2)
    expect(stepMapZoom(1.2, 'in')).toBe(1.45)
    expect(stepMapZoom(1.45, 'out')).toBe(1.2)
  })

  it('clamps zoom at both limits', () => {
    expect(stepMapZoom(1, 'out')).toBe(1)
    expect(stepMapZoom(1.45, 'in')).toBe(1.45)
  })
})

describe('isUnitVisible', () => {
  it('uses the matching fleet filter', () => {
    const filters = { drones: true, ground: false }
    expect(isUnitVisible('drone', filters)).toBe(true)
    expect(isUnitVisible('ground', filters)).toBe(false)
  })
})
