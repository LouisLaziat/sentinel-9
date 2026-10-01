import { fleetUnits } from './fleet-data'
import { districts, operationsUnits } from './operations-data'
import { threatScenarios } from './simulation'
import type { SimulationState } from './simulation'
import type { PreferenceKey, Preferences } from './preferences'

export const workspaceDefinitions = [
  { id: 'operations', label: 'Operations', detail: 'City grid, districts, and live assets', keywords: 'map city drone robot patrol' },
  { id: 'fleet', label: 'Fleet', detail: 'Hangar inspection and equipment loadouts', keywords: 'hangar equipment configure units' },
  { id: 'simulation', label: 'Simulation', detail: 'Threat scenarios and response dispatch', keywords: 'threat incident dispatch response' },
  { id: 'situation', label: 'Situation', detail: 'Metropolitan integrity and network topology', keywords: 'overview status topology health' },
  { id: 'signals', label: 'Signals', detail: 'Event intelligence and acknowledgement', keywords: 'alert warning notification event' },
  { id: 'systems', label: 'Systems', detail: 'Operator preferences and visual controls', keywords: 'settings preferences motion contrast' },
] as const

export type Workspace = typeof workspaceDefinitions[number]['id']
export type { PreferenceKey, Preferences } from './preferences'
export type CommandCategory = 'Navigate' | 'Districts' | 'Units' | 'Scenarios' | 'Actions'
export type CommandAction =
  | { type: 'workspace'; workspace: Workspace }
  | { type: 'district' | 'unit' | 'fleet-unit' | 'scenario'; id: string }
  | { type: 'preference'; key: PreferenceKey }
  | { type: 'simulation'; control: 'launch' | 'pause' | 'resume' | 'reset' | 'advance' }
  | { type: 'share' }

export type CommandEntry = {
  id: string
  title: string
  detail: string
  category: CommandCategory
  keywords: string
  shortcut?: string
  disabled?: boolean
  action: CommandAction
}

export function createCommands(preferences: Preferences, simulation: SimulationState): CommandEntry[] {
  const canChangeScenario = simulation.phase !== 'active' && simulation.phase !== 'paused'
  return [
    ...workspaceDefinitions.map((workspace, index): CommandEntry => ({
      id: `workspace-${workspace.id}`, title: `Open ${workspace.label}`, detail: workspace.detail,
      category: 'Navigate', keywords: workspace.keywords, shortcut: `Alt ${index + 1}`,
      action: { type: 'workspace', workspace: workspace.id },
    })),
    ...districts.map((district): CommandEntry => ({
      id: `district-${district.id}`, title: district.name, detail: `${district.code} / District inspector`,
      category: 'Districts', keywords: `city sector map ${district.code}`, action: { type: 'district', id: district.id },
    })),
    ...operationsUnits.map((unit): CommandEntry => ({
      id: `unit-${unit.id}`, title: `${unit.callsign} / ${unit.id}`, detail: `Locate on grid / ${districts.find((district) => district.id === unit.districtId)?.name}`,
      category: 'Units', keywords: `${unit.kind} ${unit.kind === 'drone' ? 'aerial' : 'robot'} map ${unit.task}`,
      action: { type: 'unit', id: unit.id },
    })),
    ...fleetUnits.map((unit): CommandEntry => ({
      id: `fleet-${unit.id}`, title: `Inspect ${unit.callsign}`, detail: `${unit.id} / Bay ${unit.bay} / ${unit.role}`,
      category: 'Units', keywords: `fleet hangar equipment ${unit.kind} ${unit.id}`, action: { type: 'fleet-unit', id: unit.id },
    })),
    ...threatScenarios.map((scenario): CommandEntry => ({
      id: `scenario-${scenario.id}`, title: scenario.title,
      detail: canChangeScenario ? `${scenario.code} / ${scenario.district} / ${scenario.deadline}s response window` : 'Reset the current response to change scenarios',
      category: 'Scenarios', keywords: `${scenario.classification} ${scenario.code} ${scenario.district} threat simulation incident`,
      disabled: !canChangeScenario, action: { type: 'scenario', id: scenario.id },
    })),
    ...([
      { key: 'environmentalMotion', title: 'environmental motion', keywords: 'animation calm radar' },
      { key: 'precisionTelemetry', title: 'precision telemetry', keywords: 'coordinates diagnostics readings' },
      { key: 'tacticalContrast', title: 'tactical contrast', keywords: 'visibility brightness accessibility' },
    ] as const).map((preference): CommandEntry => ({
      id: `preference-${preference.key}`, title: `${preferences[preference.key] ? 'Disable' : 'Enable'} ${preference.title}`,
      detail: 'Operator preference / Saved on this device', category: 'Actions', keywords: `settings ${preference.keywords}`,
      action: { type: 'preference', key: preference.key },
    })),
    {
      id: 'simulation-launch', title: 'Launch response', category: 'Actions', keywords: 'start dispatch run simulation',
      detail: simulation.phase !== 'briefing' ? 'Reset the response before launching' : simulation.assignedUnitIds.length ? 'Dispatch the current response team' : 'Assign at least one response unit',
      disabled: simulation.phase !== 'briefing' || simulation.assignedUnitIds.length === 0,
      action: { type: 'simulation', control: 'launch' },
    },
    {
      id: 'simulation-pause', title: simulation.phase === 'paused' ? 'Resume simulation' : 'Pause simulation',
      detail: 'Control the current response clock', category: 'Actions', keywords: 'pause resume stop continue simulation',
      disabled: simulation.phase !== 'active' && simulation.phase !== 'paused',
      action: { type: 'simulation', control: simulation.phase === 'paused' ? 'resume' : 'pause' },
    },
    {
      id: 'simulation-advance', title: 'Advance simulation +05s', detail: 'Step the clock while the response is paused',
      category: 'Actions', keywords: 'time manual step simulation', disabled: simulation.phase !== 'paused',
      action: { type: 'simulation', control: 'advance' },
    },
    {
      id: 'simulation-reset', title: 'Reset response', detail: 'Return to briefing with the same response team',
      category: 'Actions', keywords: 'reset replay restart simulation', action: { type: 'simulation', control: 'reset' },
    },
    {
      id: 'simulation-share', title: 'Share scenario', detail: 'Create a link to this incident and response team',
      category: 'Actions', keywords: 'copy link url share scenario briefing', action: { type: 'share' },
    },
  ]
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function searchCommands(entries: CommandEntry[], query: string, category?: CommandCategory) {
  const terms = normalize(query).split(' ').filter(Boolean)
  return entries
    .filter((entry) => !category || entry.category === category)
    .map((entry) => {
      const title = normalize(entry.title)
      const searchable = normalize(`${entry.title} ${entry.detail} ${entry.keywords} ${entry.category}`)
      if (!terms.every((term) => searchable.includes(term))) return null
      const score = terms.reduce((total, term) => total + (title === term ? 30 : title.startsWith(term) ? 20 : title.includes(term) ? 10 : 1), 0)
      return { entry, score }
    })
    .filter((result): result is { entry: CommandEntry; score: number } => result !== null)
    .sort((a, b) => Number(Boolean(a.entry.disabled)) - Number(Boolean(b.entry.disabled)) || b.score - a.score)
    .map(({ entry }) => entry)
}
