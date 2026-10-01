import { describe, expect, it } from 'vitest'
import { fleetUnits } from './fleet-data'
import { createFleetSession, equipFleetModule, toggleStagedUnit } from './fleet-session'

describe('fleet session continuity', () => {
  it('creates independent loadouts without mutating the unit fixtures', () => {
    const session = createFleetSession()
    session.loadouts['DR-09']!.sensor = 'sensor-ghost'
    expect(createFleetSession().loadouts['DR-09']!.sensor).toBe('sensor-lidar')
    expect(fleetUnits[0]!.loadout.sensor).toBe('sensor-lidar')
  })

  it('updates equipment immutably and retains other units and session preferences', () => {
    const session = { ...createFleetSession(), blueprintMode: true, stagedUnits: ['DR-41'] }
    const updated = equipFleetModule(session, 'sensor-ghost')
    expect(updated.loadouts['DR-09']!.sensor).toBe('sensor-ghost')
    expect(session.loadouts['DR-09']!.sensor).toBe('sensor-lidar')
    expect(updated.loadouts['DR-41']).toBe(session.loadouts['DR-41'])
    expect(updated.blueprintMode).toBe(true)
    expect(updated.stagedUnits).toEqual(['DR-41'])
  })

  it('rejects unknown modules, incompatible slots, and unknown units', () => {
    const session = createFleetSession()
    expect(equipFleetModule(session, 'UNKNOWN')).toBe(session)
    expect(equipFleetModule(session, 'core-vector')).toBe(session)
    const missing = { ...session, selectedUnitId: 'UNKNOWN' }
    expect(equipFleetModule(missing, 'sensor-ghost')).toBe(missing)
  })

  it('stages and unstages once, retaining the rest of the session', () => {
    const original = createFleetSession()
    const staged = toggleStagedUnit(original)
    expect(staged.stagedUnits).toEqual(['DR-09'])
    expect(original.stagedUnits).toEqual([])
    expect(toggleStagedUnit(staged).stagedUnits).toEqual([])
  })

  it('enforces the service lock and rejects unknown units', () => {
    for (const selectedUnitId of ['GR-22', 'UNKNOWN']) {
      const session = { ...createFleetSession(), selectedUnitId }
      expect(toggleStagedUnit(session)).toBe(session)
    }
  })
})
