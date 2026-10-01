import { fleetUnits } from './fleet-data'
import { getModule } from './fleet'
import type { FleetLoadout } from './fleet'

export type FleetSession = {
  selectedUnitId: string
  activeSlot: keyof FleetLoadout
  loadouts: Record<string, FleetLoadout>
  stagedUnits: string[]
  blueprintMode: boolean
}

export function createFleetSession(): FleetSession {
  return {
    selectedUnitId: 'DR-09', activeSlot: 'sensor', blueprintMode: false, stagedUnits: [],
    loadouts: Object.fromEntries(fleetUnits.map((unit) => [unit.id, { ...unit.loadout }])),
  }
}

export function equipFleetModule(session: FleetSession, moduleId: string): FleetSession {
  const module = getModule(moduleId)
  const loadout = session.loadouts[session.selectedUnitId]
  if (!module || module.slot !== session.activeSlot || !loadout) return session
  return { ...session, loadouts: { ...session.loadouts, [session.selectedUnitId]: { ...loadout, [session.activeSlot]: moduleId } } }
}

export function toggleStagedUnit(session: FleetSession): FleetSession {
  const unit = fleetUnits.find((candidate) => candidate.id === session.selectedUnitId)
  if (!unit || unit.status === 'service') return session
  return { ...session, stagedUnits: session.stagedUnits.includes(unit.id)
    ? session.stagedUnits.filter((id) => id !== unit.id) : [...session.stagedUnits, unit.id] }
}
