import { describe, expect, it } from 'vitest'
import {
  advanceSimulation,
  createSimulationState,
  getResponseScore,
  getRouteProgress,
  interpolateRoute,
  launchSimulation,
  toggleResponseUnit,
} from './simulation'

describe('threat simulation engine', () => {
  it('launches and resolves a recommended deterministic response', () => {
    let state = createSimulationState('rogue-swarm')
    expect(getResponseScore(state)).toBe(84)

    state = launchSimulation(state)
    state = advanceSimulation(state, 40)

    expect(state.phase).toBe('resolved')
    expect(state.elapsed).toBe(40)
  })

  it('fails an underpowered response at the scenario deadline', () => {
    let state = createSimulationState('rogue-swarm')
    state = toggleResponseUnit(state, 'DR-41')
    state = toggleResponseUnit(state, 'GR-07')
    state = toggleResponseUnit(state, 'DR-09')
    expect(getResponseScore(state)).toBe(46)

    state = advanceSimulation(launchSimulation(state), 100)
    expect(state.phase).toBe('failed')
  })

  it('does not launch without an assigned response unit', () => {
    let state = createSimulationState('rogue-swarm')
    state = toggleResponseUnit(state, 'DR-41')
    state = toggleResponseUnit(state, 'GR-07')
    expect(launchSimulation(state).phase).toBe('briefing')
  })
})

describe('simulation route helpers', () => {
  it('clamps route progress and interpolates positions', () => {
    expect(getRouteProgress(6, 12)).toBe(50)
    expect(getRouteProgress(20, 12)).toBe(100)
    expect(interpolateRoute({ x: 0, y: 20 }, { x: 100, y: 60 }, 50)).toEqual({ x: 50, y: 40 })
  })
})
