import { useMemo } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import {
  advanceSimulation,
  getResponseScore,
  getRouteProgress,
  getScenario,
  getThreatLevel,
  interpolateRoute,
  launchSimulation,
  responseUnits,
  selectSimulationScenario,
  threatScenarios,
  toggleResponseUnit,
  toggleSimulationPause,
} from '../../lib/simulation'
import type { SimulationPhase, SimulationState } from '../../lib/simulation'
import { configuredSimulation } from '../../lib/scenario-sharing'
import { BoltIcon, CrosshairIcon, DroneIcon, LinkIcon, PulseIcon, ReplayIcon, RobotIcon, ShieldIcon } from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

const simulationEvents = [
  { at: 0, code: 'SYS', text: 'Threat model synchronized' },
  { at: 4, code: 'GRID', text: 'Civilian corridors isolated' },
  { at: 9, code: 'FLEET', text: 'Response vectors committed' },
  { at: 16, code: 'AI-9', text: 'Predictive containment recalculated' },
  { at: 26, code: 'NET', text: 'District defense lattice engaged' },
] as const

const phaseLabels: Record<SimulationPhase, string> = {
  briefing: 'Awaiting dispatch', active: 'Simulation live', paused: 'Simulation paused', resolved: 'Threat contained', failed: 'Containment failed',
}

function formatClock(seconds: number) {
  return `00:${String(seconds).padStart(2, '0')}`
}

type ThreatSimulationProps = {
  simulation: SimulationState
  setSimulation: Dispatch<SetStateAction<SimulationState>>
  onShare: () => void
}

export function ThreatSimulation({ simulation, setSimulation, onShare }: ThreatSimulationProps) {
  const scenario = getScenario(simulation.scenarioId)
  const score = getResponseScore(simulation)
  const threatLevel = getThreatLevel(simulation)
  const assignedUnits = useMemo(() => responseUnits.filter((unit) => simulation.assignedUnitIds.includes(unit.id)), [simulation.assignedUnitIds])
  const isRunning = simulation.phase === 'active'
  const canConfigure = simulation.phase === 'briefing'

  function resetSimulation() {
    setSimulation(configuredSimulation(simulation))
  }

  return (
    <div className="command-view simulation-workspace">
      <div className="command-view__heading">
        <div><span>Deterministic response engine</span><h3>Threat simulation</h3></div>
        <div className="command-view__heading-status">
          <StatusBadge tone={simulation.phase === 'failed' ? 'critical' : simulation.phase === 'resolved' ? 'online' : 'warning'} pulse={isRunning}>{phaseLabels[simulation.phase]}</StatusBadge>
          <button className="simulation-share-button" onClick={onShare} type="button"><LinkIcon />Share scenario</button>
        </div>
      </div>

      <div className="simulation-summary" aria-label="Simulation telemetry">
        <article><span>Simulation clock</span><strong>{formatClock(simulation.elapsed)}<small>/ {formatClock(scenario.deadline)}</small></strong></article>
        <article><span>Threat level</span><strong className={threatLevel > 55 ? 'is-critical' : ''}>{threatLevel}<small>%</small></strong><i><b style={{ width: `${threatLevel}%` }} /></i></article>
        <article><span>Response score</span><strong>{score}<small>/ {scenario.threshold} REQ</small></strong><i><b className={score >= scenario.threshold ? 'is-ready' : ''} style={{ width: `${score}%` }} /></i></article>
        <article><span>Units committed</span><strong>{String(assignedUnits.length).padStart(2, '0')}<small>/ 04</small></strong></article>
      </div>

      <div className="simulation-layout">
        <section className="simulation-theater" style={{ '--threat-x': `${scenario.target.x}`, '--threat-y': `${scenario.target.y}` } as CSSProperties}>
          <div className="simulation-theater__header">
            <div><PulseIcon /><span>Live response theater</span><strong>{scenario.code}</strong></div>
            <div><span>{scenario.districtCode} / {scenario.district}</span><strong>{simulation.phase.toUpperCase()}</strong></div>
          </div>

          <div className="simulation-map">
            <svg viewBox="0 0 760 520" role="img" aria-labelledby="simulation-map-title simulation-map-desc">
              <title id="simulation-map-title">Threat response simulation map</title>
              <desc id="simulation-map-desc">Assigned aerial and ground units travel toward the active threat as simulation time advances.</desc>
              <defs>
                <pattern id="simulation-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#58e8ff" strokeOpacity=".07" /></pattern>
                <filter id="simulation-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <rect width="760" height="520" fill="url(#simulation-grid)" />
              <g className="simulation-map__districts" aria-hidden="true">
                <path d="M65 94 275 42l143 79-45 154-245 13Z" /><path d="m418 121 275 47-30 201-211-14-79-80Z" /><path d="m128 288 245-13 79 80-58 129-271-40Z" />
                <path className="is-transit" d="M46 370c128-122 250-153 369-92s202 103 301 4M214 59c28 108 55 225 16 407M545 145c-46 102-45 213 17 316" />
                {[105, 178, 244, 318, 392, 468, 541, 618, 681].map((x, index) => <circle cx={x} cy={index % 2 ? 244 : 333} key={x} r="2" />)}
              </g>

              <g className="simulation-target" transform={`translate(${scenario.target.x} ${scenario.target.y})`}>
                <circle className="simulation-target__outer" r="42" /><circle className="simulation-target__inner" r="26" />
                <path d="M0-15 14 11h-28Z" /><text x="21" y="-13">{scenario.code}</text><text className="simulation-target__level" x="21" y="0">LVL {threatLevel}</text>
              </g>

              {assignedUnits.map((unit) => {
                const progress = getRouteProgress(simulation.elapsed, unit.eta)
                const position = interpolateRoute(unit.start, scenario.target, progress)
                return (
                  <g className={`simulation-response simulation-response--${unit.kind}`} key={unit.id}>
                    <path className="simulation-route" d={`M${unit.start.x} ${unit.start.y} L${scenario.target.x} ${scenario.target.y}`} pathLength="100" style={{ strokeDashoffset: 100 - progress }} />
                    <g className="simulation-response__unit" transform={`translate(${position.x} ${position.y})`}>
                      <circle r="17" /><rect x="-9" y="-9" width="18" height="18" />
                      {unit.kind === 'aerial' ? <path d="M-6-1h4l2-3 2 3h4L3 1H1L0 5-1 1h-2Z" /> : <path d="M-5-6H5V4H3v4H1V4h-2v4h-2V4h-2Z" />}
                      <text x="14" y="-5">{unit.id}</text><text className="simulation-response__eta" x="14" y="6">{progress < 100 ? `ETA ${Math.max(0, unit.eta - simulation.elapsed)}S` : 'ON SITE'}</text>
                    </g>
                  </g>
                )
              })}
            </svg>

            <div className="simulation-map__coordinates"><span>43.6532° N</span><span>79.3832° W</span><strong>SIM GRID LOCK</strong></div>
            <div className="simulation-map__legend"><span><i className="is-aerial" />Aerial</span><span><i className="is-ground" />Ground</span><span><i className="is-threat" />Threat</span><strong>TIME SCALE / 1.5×</strong></div>

            {(simulation.phase === 'resolved' || simulation.phase === 'failed') && (
              <div className={`simulation-outcome simulation-outcome--${simulation.phase}`}>
                {simulation.phase === 'resolved' ? <ShieldIcon /> : <CrosshairIcon />}
                <span>Simulation complete</span><strong>{simulation.phase === 'resolved' ? 'THREAT CONTAINED' : 'CONTAINMENT FAILED'}</strong>
                <small>Response score {score} / threshold {scenario.threshold}</small>
              </div>
            )}
          </div>
        </section>

        <aside className="simulation-console">
          <div className="simulation-console__section simulation-scenarios">
            <div className="simulation-console__heading"><span>Scenario selection</span><strong>03 MODELS</strong></div>
            {threatScenarios.map((item) => (
              <button aria-pressed={scenario.id === item.id} className={scenario.id === item.id ? 'is-selected' : ''} disabled={!canConfigure} key={item.id} onClick={() => setSimulation((current) => selectSimulationScenario(current, item.id))} type="button">
                <i>{item.code}</i><span><strong>{item.title}</strong><small>{item.districtCode} / {item.classification}</small></span><b>{item.deadline}S</b>
              </button>
            ))}
          </div>

          <div className="simulation-brief">
            <span>{scenario.classification}</span><h4>{scenario.title}</h4><p>{scenario.description}</p>
            <dl><div><dt>District</dt><dd>{scenario.district}</dd></div><div><dt>Requirement</dt><dd>{scenario.requirement}</dd></div><div><dt>Threshold</dt><dd>{scenario.threshold}</dd></div></dl>
          </div>

          <div className="simulation-console__section simulation-units">
            <div className="simulation-console__heading"><span>Response units</span><strong>{assignedUnits.length} ASSIGNED</strong></div>
            <div>
              {responseUnits.map((unit) => {
                const isAssigned = simulation.assignedUnitIds.includes(unit.id)
                return (
                  <button aria-pressed={isAssigned} className={isAssigned ? 'is-assigned' : ''} disabled={!canConfigure} key={unit.id} onClick={() => setSimulation((current) => toggleResponseUnit(current, unit.id))} type="button">
                    <i>{unit.kind === 'aerial' ? <DroneIcon /> : <RobotIcon />}</i><span><strong>{unit.callsign}</strong><small>{unit.id} / ETA {unit.eta}S</small></span><b>+{unit.response}</b>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="simulation-controls">
            {simulation.phase === 'briefing' && <button className="simulation-controls__primary" disabled={!assignedUnits.length} onClick={() => setSimulation((current) => launchSimulation(current))} type="button"><BoltIcon />Launch response</button>}
            {(simulation.phase === 'active' || simulation.phase === 'paused') && (
              <>
                <button className="simulation-controls__primary" onClick={() => setSimulation((current) => toggleSimulationPause(current))} type="button"><PulseIcon />{simulation.phase === 'paused' ? 'Resume simulation' : 'Pause simulation'}</button>
                <button disabled={simulation.phase !== 'paused'} onClick={() => setSimulation((current) => advanceSimulation(current, 5, true))} type="button">Advance +05s</button>
              </>
            )}
            {(simulation.phase === 'resolved' || simulation.phase === 'failed') && <button className="simulation-controls__primary" onClick={resetSimulation} type="button"><ReplayIcon />Run again</button>}
            {simulation.phase !== 'briefing' && <button onClick={resetSimulation} type="button"><ReplayIcon />Reset</button>}
          </div>
        </aside>
      </div>

      <div className="simulation-timeline">
        <div className="simulation-timeline__heading"><PulseIcon /><span>Response event stream</span><strong>{isRunning ? 'LIVE' : simulation.phase.toUpperCase()}</strong></div>
        {simulationEvents.map((event) => {
          const isActive = simulation.elapsed >= event.at
          return <article className={isActive ? 'is-active' : ''} key={event.at}><time>{formatClock(event.at)}</time><i /><span>{event.code}</span><p>{event.text}</p></article>
        })}
      </div>
    </div>
  )
}
