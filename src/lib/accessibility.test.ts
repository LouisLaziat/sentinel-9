import { describe, expect, it } from 'vitest'
import { canRunSimulation, nextTabIndex } from './accessibility'

describe('roving fleet tab focus', () => {
  it.each([
    ['ArrowUp', 0, 'vertical', 2], ['ArrowDown', 2, 'vertical', 0],
    ['ArrowLeft', 0, 'horizontal', 2], ['ArrowRight', 2, 'horizontal', 0],
    ['Home', 2, 'vertical', 0], ['End', 0, 'vertical', 2],
    ['ArrowDown', 0, 'horizontal', null], ['ArrowRight', 0, 'vertical', null],
    ['Tab', 1, 'vertical', null], ['Escape', 1, 'vertical', null],
  ] as const)('%s from tab %s (%s)', (key, index, orientation, expected) => {
    expect(nextTabIndex(key, index, 3, orientation)).toBe(expected)
  })

  it('does not target a missing tab', () => {
    expect(nextTabIndex('Home', 0, 0, 'vertical')).toBeNull()
  })
})

describe('background simulation suspension', () => {
  it.each(['briefing', 'paused', 'resolved', 'failed'])('does not advance a %s response', (phase) => {
    expect(canRunSimulation(true, true, phase)).toBe(false)
  })

  it('only advances while the interface and document are active', () => {
    expect(canRunSimulation(true, true, 'active')).toBe(true)
    expect(canRunSimulation(false, true, 'active')).toBe(false)
    expect(canRunSimulation(true, false, 'active')).toBe(false)
  })
})
