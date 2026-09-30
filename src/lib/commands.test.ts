import { describe, expect, it } from 'vitest'
import { createCommands, searchCommands } from './commands'
import { createSimulationState, launchSimulation } from './simulation'

const preferences = { environmentalMotion: true, precisionTelemetry: true, tacticalContrast: false }
const briefing = createSimulationState()

describe('command search', () => {
  it('finds a unit by identifier, callsign, or multiple contextual terms', () => {
    const commands = createCommands(preferences, briefing)
    expect(searchCommands(commands, 'dr-41').map((entry) => entry.id)).toEqual(['unit-DR-41', 'fleet-DR-41'])
    expect(searchCommands(commands, 'valkyrie')[0]?.id).toBe('unit-DR-41')
    expect(searchCommands(commands, 'neon   w-03')[0]?.id).toBe('district-neon-ward')
    expect(searchCommands(commands, 'unmatched-sector')).toEqual([])
  })

  it('filters categories and offers actions appropriate to the current response', () => {
    const commands = createCommands(preferences, launchSimulation(briefing))
    expect(searchCommands(commands, '', 'Scenarios').every((entry) => entry.disabled)).toBe(true)
    expect(searchCommands(commands, 'pause')[0]?.action).toEqual({ type: 'simulation', control: 'pause' })
    expect(searchCommands(commands, 'launch')[0]?.disabled).toBe(true)
    expect(searchCommands(commands, 'motion')[0]?.title).toBe('Disable environmental motion')
  })
})
