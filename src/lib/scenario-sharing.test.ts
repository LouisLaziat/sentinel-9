import { describe, expect, it } from 'vitest'
import { configuredSimulation, createScenarioLink, parseScenarioLink, restoreSimulation, serializeSimulation } from './scenario-sharing'
import { advanceSimulation, createSimulationState, launchSimulation } from './simulation'

describe('scenario sharing', () => {
  it('round-trips a custom response and preserves the GitHub Pages base', () => {
    const configuration = { scenarioId: 'transit-breach', assignedUnitIds: ['DR-09', 'GR-07'] }
    const url = new URL(createScenarioLink('https://example.github.io/sentinel-9/?old=value#overview', configuration))
    expect(url.pathname).toBe('/sentinel-9/')
    expect(url.hash).toBe('#command')
    expect(parseScenarioLink(url.search)).toEqual(configuration)
    expect(configuredSimulation(configuration).phase).toBe('briefing')
  })

  it('preserves empty teams and normalizes duplicate units', () => {
    expect(parseScenarioLink('?s9=1&scenario=rogue-swarm&units=')).toEqual({ scenarioId: 'rogue-swarm', assignedUnitIds: [] })
    expect(parseScenarioLink('?s9=1&scenario=rogue-swarm&units=DR-41,DR-41')?.assignedUnitIds).toEqual(['DR-41'])
  })

  it('rejects malformed or unsupported links', () => {
    for (const search of [
      '?s9=2&scenario=rogue-swarm&units=DR-41', '?s9=1&scenario=unknown&units=DR-41',
      '?s9=1&scenario=rogue-swarm&units=UNKNOWN', '?s9=1&scenario=rogue-swarm',
      '?s9=1&scenario=rogue-swarm&scenario=transit-breach&units=DR-41',
    ]) expect(parseScenarioLink(search)).toBeNull()
  })

  it('rejects oversized and ambiguous sharing parameters', () => {
    expect(parseScenarioLink('?s9=1&scenario=rogue-swarm&units=DR-41&extra=' + 'x'.repeat(1_000))).toBeNull()
    expect(parseScenarioLink('?s9=1&s9=1&scenario=rogue-swarm&units=DR-41')).toBeNull()
    expect(parseScenarioLink('?s9=1&scenario=rogue-swarm&units=DR-41&units=DR-09')).toBeNull()
  })
})

describe('saved simulation recovery', () => {
  it('restores an interrupted response paused with the same time and team', () => {
    const state = advanceSimulation(launchSimulation(createSimulationState('reactor-cascade')), 12)
    expect(restoreSimulation(serializeSimulation(state))).toEqual({ ...state, phase: 'paused' })
  })

  it('retains outcomes and rejects corrupt or impossible saved data', () => {
    const state = advanceSimulation(launchSimulation(createSimulationState()), 40)
    expect(restoreSimulation(serializeSimulation(state))).toEqual(state)
    expect(restoreSimulation('{bad')).toBeNull()
    expect(restoreSimulation(JSON.stringify({ version: 1, ...state, elapsed: -1 }))).toBeNull()
    expect(restoreSimulation(JSON.stringify({ version: 1, ...state, assignedUnitIds: ['UNKNOWN'] }))).toBeNull()
    expect(restoreSimulation(JSON.stringify({ version: 1, ...state, phase: 'briefing' }))).toBeNull()
  })

  it('rejects excessive and non-integer snapshots and normalizes final outcomes', () => {
    expect(restoreSimulation('x'.repeat(4_097))).toBeNull()
    const state = createSimulationState()
    expect(restoreSimulation(JSON.stringify({ version: 1, ...state, phase: 'active', elapsed: 0.5 }))).toBeNull()
    expect(restoreSimulation(JSON.stringify({ version: 2, ...state }))).toBeNull()
    const completed = advanceSimulation(launchSimulation(state), 40)
    expect(restoreSimulation(JSON.stringify({ version: 1, ...completed, phase: completed.phase === 'resolved' ? 'failed' : 'resolved' }))).toEqual(completed)
  })
})
