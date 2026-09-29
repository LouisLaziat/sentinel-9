export type FleetStats = {
  power: number
  mobility: number
  defense: number
  energy: number
}

export type FleetModule = {
  id: string
  slot: 'sensor' | 'core' | 'utility'
  label: string
  designation: string
  description: string
  effects: Partial<FleetStats>
}

export type FleetLoadout = Record<FleetModule['slot'], string>

export const fleetModules: FleetModule[] = [
  { id: 'sensor-lidar', slot: 'sensor', label: 'LIDAR X9', designation: 'LR-09', description: 'Long-range urban topology and target acquisition.', effects: { mobility: 2, energy: 5 } },
  { id: 'sensor-ghost', slot: 'sensor', label: 'Ghost optics', designation: 'GS-41', description: 'Multispectral tracking through smoke and signal noise.', effects: { power: 5, energy: 8 } },
  { id: 'sensor-aegis', slot: 'sensor', label: 'Aegis radar', designation: 'AR-12', description: 'Wide-area predictive threat correlation.', effects: { defense: 4, energy: 6 } },
  { id: 'core-vector', slot: 'core', label: 'Vector drive', designation: 'VD-4', description: 'High-response propulsion and rapid direction changes.', effects: { mobility: 11, defense: -2, energy: 10 } },
  { id: 'core-bastion', slot: 'core', label: 'Bastion cell', designation: 'BC-7', description: 'Reinforced power routing for sustained protection.', effects: { defense: 12, mobility: -4, energy: 7 } },
  { id: 'core-pulse', slot: 'core', label: 'Pulse reactor', designation: 'PR-9', description: 'Balanced output for continuous autonomous patrol.', effects: { power: 8, mobility: 4, energy: 8 } },
  { id: 'utility-emp', slot: 'utility', label: 'EMP net', designation: 'EN-3', description: 'Localized non-lethal electronic interdiction field.', effects: { power: 12, energy: 12 } },
  { id: 'utility-shield', slot: 'utility', label: 'Ion shield', designation: 'IS-8', description: 'Directional protection against impact and energy bursts.', effects: { defense: 14, energy: 14 } },
  { id: 'utility-repair', slot: 'utility', label: 'Repair swarm', designation: 'RS-2', description: 'Autonomous micro-units for field stabilization.', effects: { defense: 7, power: 3, energy: 9 } },
]

const clamp = (value: number) => Math.min(100, Math.max(0, value))

export function calculateFleetStats(base: FleetStats, loadout: FleetLoadout): FleetStats {
  const equipped = Object.values(loadout)
    .map((id) => fleetModules.find((module) => module.id === id))
    .filter((module): module is FleetModule => Boolean(module))

  return equipped.reduce<FleetStats>((stats, module) => ({
    power: clamp(stats.power + (module.effects.power ?? 0)),
    mobility: clamp(stats.mobility + (module.effects.mobility ?? 0)),
    defense: clamp(stats.defense + (module.effects.defense ?? 0)),
    energy: clamp(stats.energy + (module.effects.energy ?? 0)),
  }), { ...base })
}

export function getModule(moduleId: string) {
  return fleetModules.find((module) => module.id === moduleId)
}
