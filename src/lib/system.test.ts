import { describe, expect, it } from 'vitest'
import { getNetworkStatus } from './system'

describe('getNetworkStatus', () => {
  it('reports an online network', () => {
    expect(getNetworkStatus(true)).toBe('Online')
  })

  it('reports an offline network', () => {
    expect(getNetworkStatus(false)).toBe('Offline')
  })
})
