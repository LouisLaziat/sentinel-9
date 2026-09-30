import { createSimulationState, getResponseScore, getScenario, responseUnits, threatScenarios } from './simulation'
import type { SimulationState } from './simulation'

export type ScenarioConfiguration = Pick<SimulationState, 'scenarioId' | 'assignedUnitIds'>

function isConfiguration(value: unknown): value is ScenarioConfiguration {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ScenarioConfiguration>
  return threatScenarios.some((scenario) => scenario.id === candidate.scenarioId)
    && Array.isArray(candidate.assignedUnitIds)
    && candidate.assignedUnitIds.length <= responseUnits.length
    && candidate.assignedUnitIds.every((id) => typeof id === 'string' && responseUnits.some((unit) => unit.id === id))
}

export function configuredSimulation(configuration: ScenarioConfiguration): SimulationState {
  return {
    ...createSimulationState(configuration.scenarioId),
    assignedUnitIds: [...new Set(configuration.assignedUnitIds)],
  }
}

export function createScenarioLink(baseUrl: string, configuration: ScenarioConfiguration) {
  const url = new URL(baseUrl)
  url.search = new URLSearchParams({
    s9: '1',
    scenario: configuration.scenarioId,
    units: [...new Set(configuration.assignedUnitIds)].join(','),
  }).toString()
  url.hash = 'command'
  return url.toString()
}

export function parseScenarioLink(search: string): ScenarioConfiguration | null {
  if (search.length > 1_000) return null
  const params = new URLSearchParams(search)
  if (params.get('s9') !== '1' || !params.has('units')) return null
  if (['s9', 'scenario', 'units'].some((key) => params.getAll(key).length !== 1)) return null
  const configuration = {
    scenarioId: params.get('scenario'),
    assignedUnitIds: params.get('units') ? params.get('units')!.split(',') : [],
  }
  if (!isConfiguration(configuration)) return null
  return { scenarioId: configuration.scenarioId, assignedUnitIds: [...new Set(configuration.assignedUnitIds)] }
}

export function serializeSimulation(state: SimulationState) {
  return JSON.stringify({ version: 1, ...state })
}

export function restoreSimulation(serialized: string | null): SimulationState | null {
  if (!serialized || serialized.length > 4_096) return null
  try {
    const value: unknown = JSON.parse(serialized)
    if (!isConfiguration(value)) return null
    const saved = value as ScenarioConfiguration & { version?: unknown; phase?: unknown; elapsed?: unknown }
    const scenario = getScenario(saved.scenarioId)
    if (saved.version !== 1 || typeof saved.elapsed !== 'number' || !Number.isInteger(saved.elapsed)
      || saved.elapsed < 0 || saved.elapsed > scenario.deadline) return null
    const state = { ...configuredSimulation(saved), elapsed: saved.elapsed }
    if (saved.phase === 'briefing' && saved.elapsed === 0) return state
    if ((saved.phase === 'active' || saved.phase === 'paused') && saved.elapsed < scenario.deadline) {
      return { ...state, phase: 'paused' }
    }
    if ((saved.phase === 'resolved' || saved.phase === 'failed') && saved.elapsed === scenario.deadline) {
      return { ...state, phase: getResponseScore(state) >= scenario.threshold ? 'resolved' : 'failed' }
    }
    return null
  } catch {
    return null
  }
}
