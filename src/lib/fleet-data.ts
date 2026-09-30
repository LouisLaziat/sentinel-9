import type { FleetLoadout, FleetStats } from './fleet'

export type FleetUnit = {
  id: string
  callsign: string
  kind: 'drone' | 'ground'
  role: string
  bay: string
  status: 'ready' | 'service' | 'calibrating'
  readiness: number
  battery: number
  flightHours: number
  mass: string
  accent: string
  baseStats: FleetStats
  loadout: FleetLoadout
}

export const fleetUnits: FleetUnit[] = [
  { id: 'DR-09', callsign: 'Kestrel', kind: 'drone', role: 'Recon / rapid response', bay: 'A-01', status: 'ready', readiness: 98, battery: 87, flightHours: 642, mass: '184 KG', accent: '#58e8ff', baseStats: { power: 68, mobility: 82, defense: 52, energy: 26 }, loadout: { sensor: 'sensor-lidar', core: 'core-vector', utility: 'utility-emp' } },
  { id: 'DR-41', callsign: 'Valkyrie', kind: 'drone', role: 'Interceptor / air control', bay: 'A-03', status: 'ready', readiness: 94, battery: 64, flightHours: 918, mass: '226 KG', accent: '#ffbd5a', baseStats: { power: 78, mobility: 76, defense: 61, energy: 29 }, loadout: { sensor: 'sensor-ghost', core: 'core-pulse', utility: 'utility-shield' } },
  { id: 'GR-07', callsign: 'Atlas', kind: 'ground', role: 'Infrastructure / security', bay: 'G-02', status: 'calibrating', readiness: 86, battery: 78, flightHours: 1204, mass: '2.8 T', accent: '#a3ff12', baseStats: { power: 74, mobility: 48, defense: 82, energy: 24 }, loadout: { sensor: 'sensor-aegis', core: 'core-bastion', utility: 'utility-repair' } },
  { id: 'GR-22', callsign: 'Aegis', kind: 'ground', role: 'Containment / civilian shield', bay: 'G-04', status: 'service', readiness: 72, battery: 96, flightHours: 1538, mass: '3.4 T', accent: '#9b7bff', baseStats: { power: 66, mobility: 42, defense: 88, energy: 21 }, loadout: { sensor: 'sensor-lidar', core: 'core-bastion', utility: 'utility-shield' } },
]
