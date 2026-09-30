import type { UnitKind } from './operations'

export type District = {
  id: string
  code: string
  name: string
  path: string
  labelX: number
  labelY: number
  integrity: number
  risk: 'low' | 'guarded' | 'elevated'
  population: string
  coverage: number
  accent: string
}

export type OperationsUnit = {
  id: string
  callsign: string
  kind: UnitKind
  districtId: string
  x: number
  y: number
  targetX: number
  targetY: number
  battery: number
  signal: number
  status: 'patrol' | 'intercept' | 'standby'
  task: string
}

export const districts: District[] = [
  { id: 'ashfall', code: 'N-07', name: 'Ashfall', path: 'M225 42 L487 42 L541 163 L398 210 L218 158 Z', labelX: 355, labelY: 111, integrity: 82, risk: 'elevated', population: '1.2M', coverage: 91, accent: '#ffbd5a' },
  { id: 'neon-ward', code: 'W-03', name: 'Neon Ward', path: 'M62 142 L218 158 L283 281 L188 389 L48 329 Z', labelX: 157, labelY: 253, integrity: 96, risk: 'guarded', population: '2.8M', coverage: 98, accent: '#9b7bff' },
  { id: 'civic-core', code: 'C-12', name: 'Civic Core', path: 'M218 158 L398 210 L421 361 L282 402 L188 389 L283 281 Z', labelX: 315, labelY: 297, integrity: 99, risk: 'low', population: '3.4M', coverage: 100, accent: '#58e8ff' },
  { id: 'meridian', code: 'E-09', name: 'Meridian', path: 'M398 210 L541 163 L707 202 L692 361 L421 361 Z', labelX: 551, labelY: 275, integrity: 94, risk: 'guarded', population: '2.1M', coverage: 96, accent: '#a3ff12' },
  { id: 'lower-arc', code: 'S-04', name: 'Lower Arc', path: 'M188 389 L282 402 L421 361 L692 361 L611 504 L207 504 Z', labelX: 426, labelY: 440, integrity: 92, risk: 'guarded', population: '1.7M', coverage: 94, accent: '#58e8ff' },
]

export const operationsUnits: OperationsUnit[] = [
  { id: 'DR-09', callsign: 'Kestrel', kind: 'drone', districtId: 'civic-core', x: 337, y: 278, targetX: 466, targetY: 224, battery: 87, signal: 98, status: 'patrol', task: 'High-altitude perimeter sweep' },
  { id: 'DR-41', callsign: 'Valkyrie', kind: 'drone', districtId: 'meridian', x: 566, y: 244, targetX: 640, targetY: 320, battery: 64, signal: 94, status: 'intercept', task: 'Tracking anomalous heat signature' },
  { id: 'DR-18', callsign: 'Ghost', kind: 'drone', districtId: 'neon-ward', x: 153, y: 251, targetX: 252, targetY: 322, battery: 92, signal: 88, status: 'patrol', task: 'Transit corridor observation' },
  { id: 'GR-07', callsign: 'Atlas', kind: 'ground', districtId: 'lower-arc', x: 365, y: 438, targetX: 486, targetY: 419, battery: 78, signal: 91, status: 'patrol', task: 'Infrastructure security route' },
  { id: 'GR-22', callsign: 'Aegis', kind: 'ground', districtId: 'ashfall', x: 386, y: 116, targetX: 302, targetY: 142, battery: 96, signal: 86, status: 'standby', task: 'Emergency response standby' },
  { id: 'GR-31', callsign: 'Titan', kind: 'ground', districtId: 'meridian', x: 624, y: 310, targetX: 520, targetY: 286, battery: 71, signal: 96, status: 'patrol', task: 'Energy-grid inspection' },
]

export type OperationsSelection = { kind: 'district' | 'unit'; id: string }
