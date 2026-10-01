import { describe, expect, it } from 'vitest'
import { createSparkline } from './telemetry'

describe('resilient telemetry rendering', () => {
  it('maps a normal series into the graph bounds', () => {
    expect(createSparkline([0, 10, 20])).toBe('0,34 50,20 100,6')
  })
  it('handles empty, single, and flat series', () => {
    expect(createSparkline([])).toBe('')
    expect(createSparkline([7])).toBe('0,20 100,20')
    expect(createSparkline([7, 7, 7])).toBe('0,20 50,20 100,20')
  })
  it('excludes invalid numbers from SVG coordinates', () => {
    expect(createSparkline([NaN, Infinity, -Infinity])).toBe('')
    expect(createSparkline([NaN, -10, 10, Infinity])).toBe('0,34 100,6')
  })
})
