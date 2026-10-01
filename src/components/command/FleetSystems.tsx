import { useId, useMemo } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { calculateFleetStats, fleetModules, getModule } from '../../lib/fleet'
import type { FleetLoadout } from '../../lib/fleet'
import { fleetUnits } from '../../lib/fleet-data'
import type { FleetUnit } from '../../lib/fleet-data'
import { equipFleetModule, toggleStagedUnit } from '../../lib/fleet-session'
import type { FleetSession } from '../../lib/fleet-session'
import { nextTabIndex } from '../../lib/accessibility'
import { BoltIcon, CrosshairIcon, DroneIcon, GridIcon, HangarIcon, RobotIcon, ShieldIcon, WrenchIcon } from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

const slotLabels = { sensor: 'Sensor array', core: 'Power core', utility: 'Utility system' } as const

function UnitSilhouette({ kind }: { kind: FleetUnit['kind'] }) {
  return (
    <svg className={`fleet-silhouette fleet-silhouette--${kind}`} viewBox="0 0 540 320" aria-hidden="true">
      <defs>
        <linearGradient id="fleet-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="currentColor" stopOpacity=".23" /><stop offset="1" stopColor="currentColor" stopOpacity=".03" /></linearGradient>
        <filter id="fleet-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {kind === 'drone' ? (
        <g>
          <path className="fleet-silhouette__shell" d="M86 132 194 111l31-37h90l31 37 108 21-75 34-52-9-22 58h-70l-22-58-52 9Z" />
          <path d="m86 132 108-21 31-37h90l31 37 108 21M161 166l52-9 22 58h70l22-58 52 9M226 108h88l-12 49h-64Z" />
          <path className="fleet-silhouette__detail" d="M109 133h72M359 133h72M254 94h32M258 177h24M270 215v28" />
          <circle cx="270" cy="145" r="12" /><circle cx="270" cy="145" r="4" />
          <path className="fleet-silhouette__rotor" d="M80 112h90M370 112h90" />
        </g>
      ) : (
        <g>
          <path className="fleet-silhouette__shell" d="M173 71h194l27 75-37 47-19 62h-50l-8-70h-20l-8 70h-50l-19-62-37-47Z" />
          <path d="M173 71h194l27 75-37 47-19 62h-50l-8-70h-20l-8 70h-50l-19-62-37-47ZM209 98h122l19 57-31 28h-98l-31-28Z" />
          <path className="fleet-silhouette__detail" d="M151 149H88v28h82M389 149h63v28h-82M219 124h102M236 151h68M270 71V40" />
          <circle cx="270" cy="137" r="14" /><circle cx="270" cy="137" r="5" />
        </g>
      )}
    </svg>
  )
}

export function FleetSystems({ session, onChange }: { session: FleetSession; onChange: Dispatch<SetStateAction<FleetSession>> }) {
  const { selectedUnitId, activeSlot, loadouts, stagedUnits, blueprintMode } = session
  const tabsId = useId()
  const slots = Object.keys(slotLabels) as Array<keyof FleetLoadout>

  const selectedUnit = fleetUnits.find((unit) => unit.id === selectedUnitId) ?? fleetUnits[0]!
  const selectedLoadout = loadouts[selectedUnit.id] ?? selectedUnit.loadout
  const derivedStats = useMemo(() => calculateFleetStats(selectedUnit.baseStats, selectedLoadout), [selectedLoadout, selectedUnit])
  const modulesForSlot = fleetModules.filter((module) => module.slot === activeSlot)
  const isStaged = stagedUnits.includes(selectedUnit.id)

  function equipModule(moduleId: string) {
    onChange((current) => equipFleetModule(current, moduleId))
  }

  function toggleStaged() {
    onChange(toggleStagedUnit)
  }

  return (
    <div className="command-view fleet-workspace">
      <div className="command-view__heading">
        <div><span>Autonomous fleet systems</span><h3>Hangar control</h3></div>
        <div className="command-view__heading-status"><StatusBadge tone="online" pulse>128 units linked</StatusBadge><span>HANGAR / DECK 09</span></div>
      </div>

      <div className="fleet-summary" aria-label="Fleet readiness summary">
        <article><span>Mission ready</span><strong>124<small>/132</small></strong></article>
        <article><span>In service</span><strong>04<small>UNITS</small></strong></article>
        <article><span>Staged</span><strong>{String(stagedUnits.length).padStart(2, '0')}<small>LOCAL</small></strong></article>
        <article><span>Fleet energy</span><strong>92<small>%</small></strong></article>
      </div>

      <div className="fleet-layout">
        <aside className="fleet-roster">
          <div className="fleet-panel-heading"><span>Active manifest</span><strong>{fleetUnits.length} / 132</strong></div>
          <div className="fleet-roster__list">
            {fleetUnits.map((unit) => (
              <button aria-pressed={selectedUnit.id === unit.id} className={selectedUnit.id === unit.id ? 'is-selected' : ''} key={unit.id} onClick={() => onChange((current) => ({ ...current, selectedUnitId: unit.id }))} type="button">
                <i style={{ '--unit-accent': unit.accent } as CSSProperties}>{unit.kind === 'drone' ? <DroneIcon /> : <RobotIcon />}</i>
                <span><strong>{unit.callsign}</strong><small>{unit.id} / {unit.bay}</small></span>
                <b className={`is-${unit.status}`}>{unit.readiness}%</b>
              </button>
            ))}
          </div>
          <div className="fleet-roster__footer"><i /><span>Manifest synchronized</span><strong>00:02</strong></div>
        </aside>

        <section className={`hangar-bay${blueprintMode ? ' is-blueprint' : ''}`} style={{ '--unit-accent': selectedUnit.accent } as CSSProperties}>
          <div className="hangar-bay__header">
            <div><HangarIcon /><span>Bay {selectedUnit.bay}</span><strong>{selectedUnit.kind === 'drone' ? 'AERIAL FRAME' : 'GROUND FRAME'}</strong></div>
            <button aria-pressed={blueprintMode} onClick={() => onChange((current) => ({ ...current, blueprintMode: !current.blueprintMode }))} type="button"><GridIcon />Blueprint</button>
          </div>
          <div className="hangar-bay__stage">
            <div className="hangar-bay__grid" />
            <div className="hangar-bay__scan" />
            <div className="hangar-bay__orbit"><i /><i /><i /></div>
            <span className="hangar-bay__datum hangar-bay__datum--one">FRAME LOCK / {selectedUnit.id}</span>
            <span className="hangar-bay__datum hangar-bay__datum--two">MASS / {selectedUnit.mass}</span>
            <span className="hangar-bay__datum hangar-bay__datum--three">LINK / 99.84%</span>
            <UnitSilhouette kind={selectedUnit.kind} />
            <div className="hangar-bay__platform"><i /><span /></div>
          </div>
          <div className="hangar-unit">
            <div><span>{selectedUnit.id} / {selectedUnit.role}</span><h4>{selectedUnit.callsign}</h4></div>
            <StatusBadge tone={selectedUnit.status === 'service' ? 'warning' : 'online'} pulse={selectedUnit.status === 'ready'}>{selectedUnit.status}</StatusBadge>
            <dl><div><dt>Battery</dt><dd>{selectedUnit.battery}%</dd></div><div><dt>Runtime</dt><dd>{selectedUnit.flightHours} H</dd></div><div><dt>Readiness</dt><dd>{selectedUnit.readiness}%</dd></div></dl>
          </div>
          <div className="fleet-performance">
            {(['power', 'mobility', 'defense'] as const).map((metric) => (
              <div key={metric}><span>{metric}</span><strong>{derivedStats[metric]}</strong><i><b style={{ width: `${derivedStats[metric]}%` }} /></i></div>
            ))}
          </div>
        </section>

        <aside className="loadout-console">
          <div className="fleet-panel-heading"><span>Equipment loadout</span><strong>ENERGY {derivedStats.energy}%</strong></div>
          <div className="loadout-slots" role="tablist" aria-label="Equipment slots" aria-orientation="vertical">
            {slots.map((slot, index) => (
              <button aria-controls={`${tabsId}-modules`} aria-selected={activeSlot === slot} className={activeSlot === slot ? 'is-active' : ''} id={`${tabsId}-${slot}`} key={slot} onClick={() => onChange((current) => ({ ...current, activeSlot: slot }))} onKeyDown={(event) => {
                const next = nextTabIndex(event.key, index, slots.length, 'vertical')
                if (next === null) return
                event.preventDefault()
                const nextSlot = slots[next]!
                onChange((current) => ({ ...current, activeSlot: nextSlot }))
                document.getElementById(`${tabsId}-${nextSlot}`)?.focus()
              }} role="tab" tabIndex={activeSlot === slot ? 0 : -1} type="button">
                {slot === 'sensor' ? <CrosshairIcon /> : slot === 'core' ? <BoltIcon /> : <ShieldIcon />}
                <span>{slotLabels[slot]}<small>{getModule(selectedLoadout[slot])?.label}</small></span>
              </button>
            ))}
          </div>

          <div aria-labelledby={`${tabsId}-${activeSlot}`} className="module-selector" id={`${tabsId}-modules`} role="tabpanel" tabIndex={0}>
            <span>Compatible modules / {activeSlot}</span>
            {modulesForSlot.map((module) => {
              const isEquipped = selectedLoadout[activeSlot] === module.id
              return (
                <button aria-pressed={isEquipped} className={isEquipped ? 'is-equipped' : ''} key={module.id} onClick={() => equipModule(module.id)} type="button">
                  <i><WrenchIcon /></i>
                  <span><strong>{module.label}</strong><small>{module.designation} / {module.description}</small></span>
                  <b>{isEquipped ? 'EQUIPPED' : 'INSTALL'}</b>
                </button>
              )
            })}
          </div>

          <div className="loadout-energy"><span><BoltIcon />Projected power draw</span><strong>{derivedStats.energy}%</strong><i><b style={{ width: `${derivedStats.energy}%` }} /></i></div>
          <button aria-pressed={isStaged} className={`stage-control${isStaged ? ' is-staged' : ''}`} disabled={selectedUnit.status === 'service'} onClick={toggleStaged} type="button">
            <HangarIcon /><span>{selectedUnit.status === 'service' ? 'Service lock active' : isStaged ? 'Remove from staging' : 'Stage for deployment'}</span>
          </button>
        </aside>
      </div>
    </div>
  )
}
