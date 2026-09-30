export type ResponseKind = 'aerial' | 'ground'
export type ScenarioRequirement = ResponseKind | 'mixed'
export type SimulationPhase = 'briefing' | 'active' | 'paused' | 'resolved' | 'failed'

export type ResponseUnit = {
  id: string
  callsign: string
  kind: ResponseKind
  eta: number
  response: number
  start: { x: number; y: number }
}

export type ThreatScenario = {
  id: string
  code: string
  title: string
  district: string
  districtCode: string
  classification: string
  description: string
  requirement: ScenarioRequirement
  deadline: number
  threshold: number
  target: { x: number; y: number }
  recommendedUnits: string[]
}

export type SimulationState = {
  scenarioId: string
  phase: SimulationPhase
  elapsed: number
  assignedUnitIds: string[]
}

export const responseUnits: ResponseUnit[] = [
  { id: 'DR-41', callsign: 'Valkyrie', kind: 'aerial', eta: 12, response: 34, start: { x: 648, y: 92 } },
  { id: 'DR-09', callsign: 'Kestrel', kind: 'aerial', eta: 16, response: 28, start: { x: 112, y: 108 } },
  { id: 'GR-07', callsign: 'Atlas', kind: 'ground', eta: 18, response: 32, start: { x: 145, y: 430 } },
  { id: 'GR-22', callsign: 'Aegis', kind: 'ground', eta: 22, response: 38, start: { x: 620, y: 438 } },
]

export const threatScenarios: ThreatScenario[] = [
  {
    id: 'rogue-swarm', code: 'TH-091', title: 'Rogue swarm', district: 'Ashfall', districtCode: 'N-07',
    classification: 'Autonomous aerial incursion', description: 'Unregistered micro-drones are converging on the district power lattice.',
    requirement: 'aerial', deadline: 40, threshold: 60, target: { x: 442, y: 184 }, recommendedUnits: ['DR-41', 'GR-07'],
  },
  {
    id: 'reactor-cascade', code: 'TH-204', title: 'Reactor cascade', district: 'Neon Ward', districtCode: 'W-03',
    classification: 'Infrastructure failure', description: 'A thermal cascade is propagating through three municipal reactor nodes.',
    requirement: 'ground', deadline: 52, threshold: 68, target: { x: 282, y: 302 }, recommendedUnits: ['GR-22', 'DR-09'],
  },
  {
    id: 'transit-breach', code: 'TH-337', title: 'Transit breach', district: 'Lower Arc', districtCode: 'S-04',
    classification: 'Coordinated systems attack', description: 'Transit control and physical checkpoints are failing in sequence.',
    requirement: 'mixed', deadline: 46, threshold: 72, target: { x: 486, y: 372 }, recommendedUnits: ['DR-41', 'GR-22'],
  },
]

export function getScenario(scenarioId: string) {
  return threatScenarios.find((scenario) => scenario.id === scenarioId) ?? threatScenarios[0]!
}

export function createSimulationState(scenarioId = threatScenarios[0]!.id): SimulationState {
  const scenario = getScenario(scenarioId)
  return { scenarioId: scenario.id, phase: 'briefing', elapsed: 0, assignedUnitIds: [...scenario.recommendedUnits] }
}

export function selectSimulationScenario(state: SimulationState, scenarioId: string): SimulationState {
  if (state.phase === 'active' || state.phase === 'paused') return state
  return createSimulationState(scenarioId)
}

export function toggleResponseUnit(state: SimulationState, unitId: string): SimulationState {
  if (state.phase !== 'briefing') return state
  const assignedUnitIds = state.assignedUnitIds.includes(unitId)
    ? state.assignedUnitIds.filter((id) => id !== unitId)
    : [...state.assignedUnitIds, unitId]
  return { ...state, assignedUnitIds }
}

export function getResponseScore(state: SimulationState) {
  const scenario = getScenario(state.scenarioId)
  const assigned = responseUnits.filter((unit) => state.assignedUnitIds.includes(unit.id))
  const baseScore = assigned.reduce((score, unit) => score + unit.response, 0)
  const kinds = new Set(assigned.map((unit) => unit.kind))
  const requirementBonus = scenario.requirement === 'mixed'
    ? kinds.size === 2 ? 20 : 0
    : kinds.has(scenario.requirement) ? 18 : 0
  return Math.min(100, baseScore + requirementBonus)
}

export function launchSimulation(state: SimulationState): SimulationState {
  if (state.phase !== 'briefing' || state.assignedUnitIds.length === 0) return state
  return { ...state, phase: 'active' }
}

export function toggleSimulationPause(state: SimulationState): SimulationState {
  if (state.phase === 'active') return { ...state, phase: 'paused' }
  if (state.phase === 'paused') return { ...state, phase: 'active' }
  return state
}

export function advanceSimulation(state: SimulationState, seconds = 1, allowPaused = false): SimulationState {
  if (state.phase !== 'active' && !(allowPaused && state.phase === 'paused')) return state
  const scenario = getScenario(state.scenarioId)
  const elapsed = Math.min(scenario.deadline, state.elapsed + Math.max(0, seconds))
  if (elapsed < scenario.deadline) return { ...state, elapsed }
  return { ...state, elapsed, phase: getResponseScore(state) >= scenario.threshold ? 'resolved' : 'failed' }
}

export function getRouteProgress(elapsed: number, eta: number) {
  if (eta <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((elapsed / eta) * 100)))
}

export function interpolateRoute(start: { x: number; y: number }, target: { x: number; y: number }, progress: number) {
  const ratio = Math.min(100, Math.max(0, progress)) / 100
  return {
    x: start.x + (target.x - start.x) * ratio,
    y: start.y + (target.y - start.y) * ratio,
  }
}

export function getThreatLevel(state: SimulationState) {
  if (state.phase === 'resolved') return 0
  const scenario = getScenario(state.scenarioId)
  const score = getResponseScore(state)
  const mitigation = (state.elapsed / scenario.deadline) * score
  return Math.max(0, Math.round(100 - mitigation))
}
