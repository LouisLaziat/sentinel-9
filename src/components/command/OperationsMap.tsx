import { useMemo, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { isUnitVisible, stepMapZoom } from '../../lib/operations'
import { districts, operationsUnits as units } from '../../lib/operations-data'
import type { OperationsSelection, OperationsUnit } from '../../lib/operations-data'
import {
  CrosshairIcon,
  DroneIcon,
  GridIcon,
  MapIcon,
  MinusIcon,
  PlusIcon,
  RobotIcon,
  ShieldIcon,
} from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

type Threat = {
  id: string
  districtId: string
  x: number
  y: number
  severity: 'high' | 'medium'
  label: string
  vector: string
  confidence: number
}

const threats: Threat[] = [
  { id: 'TH-091', districtId: 'ashfall', x: 465, y: 128, severity: 'high', label: 'Unknown aerial', vector: 'SE / 184 KMH', confidence: 94 },
  { id: 'TH-204', districtId: 'meridian', x: 652, y: 252, severity: 'medium', label: 'Thermal anomaly', vector: 'STATIC / +18°C', confidence: 78 },
]

const activity = [
  { time: '01:14:08', code: 'DR-41', text: 'Intercept vector recalculated', tone: 'warning' },
  { time: '01:13:42', code: 'GRID', text: 'Civic Core topology synchronized', tone: 'online' },
  { time: '01:12:19', code: 'GR-07', text: 'Checkpoint S-04 cleared', tone: 'online' },
] as const

function handleActivation(event: ReactKeyboardEvent<SVGGElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

export function OperationsMap({ initialSelection }: { initialSelection?: OperationsSelection }) {
  const initialUnit = units.find((unit) => unit.id === (initialSelection?.kind === 'unit' ? initialSelection.id : 'DR-09'))
  const [selectedDistrictId, setSelectedDistrictId] = useState(initialSelection?.kind === 'district' ? initialSelection.id : initialUnit?.districtId ?? 'civic-core')
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialSelection?.kind === 'district' ? null : initialUnit?.id ?? null)
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null)
  const [trackedUnitId, setTrackedUnitId] = useState<string | null>('DR-09')
  const [zoom, setZoom] = useState(1)
  const [filters, setFilters] = useState({ drones: true, ground: true, threats: true })

  const selectedDistrict = districts.find((district) => district.id === selectedDistrictId) ?? districts[0]!
  const selectedUnit = selectedUnitId ? units.find((unit) => unit.id === selectedUnitId) : undefined
  const selectedThreat = selectedThreatId ? threats.find((threat) => threat.id === selectedThreatId) : undefined
  const visibleUnits = useMemo(() => units.filter((unit) => isUnitVisible(unit.kind, filters)), [filters])
  const districtUnits = visibleUnits.filter((unit) => unit.districtId === selectedDistrict.id)

  function selectDistrict(districtId: string) {
    setSelectedDistrictId(districtId)
    setSelectedUnitId(null)
    setSelectedThreatId(null)
  }

  function selectUnit(unit: OperationsUnit) {
    setSelectedDistrictId(unit.districtId)
    setSelectedUnitId(unit.id)
    setSelectedThreatId(null)
  }

  function selectThreat(threat: Threat) {
    setSelectedDistrictId(threat.districtId)
    setSelectedThreatId(threat.id)
    setSelectedUnitId(null)
  }

  function toggleFilter(filter: keyof typeof filters) {
    setFilters((current) => ({ ...current, [filter]: !current[filter] }))
    if (filter === 'threats' && filters.threats) setSelectedThreatId(null)
  }

  return (
    <div className="command-view operations-workspace">
      <div className="command-view__heading">
        <div><span>Live city operations</span><h3>Metropolitan grid</h3></div>
        <div className="command-view__heading-status"><StatusBadge tone="online" pulse>24 sectors connected</StatusBadge><span>MAP / NEO-TORONTO / 09</span></div>
      </div>

      <div className="operations-toolbar">
        <div className="operations-toolbar__mode"><MapIcon /><span>Operations layer</span><strong>LIVE</strong></div>
        <div className="operations-filters" aria-label="Map filters">
          <button aria-pressed={filters.drones} className={filters.drones ? 'is-active' : ''} onClick={() => toggleFilter('drones')} type="button"><DroneIcon />Drones <b>{units.filter((unit) => unit.kind === 'drone').length}</b></button>
          <button aria-pressed={filters.ground} className={filters.ground ? 'is-active' : ''} onClick={() => toggleFilter('ground')} type="button"><RobotIcon />Ground <b>{units.filter((unit) => unit.kind === 'ground').length}</b></button>
          <button aria-pressed={filters.threats} className={`is-threat${filters.threats ? ' is-active' : ''}`} onClick={() => toggleFilter('threats')} type="button"><CrosshairIcon />Threats <b>{threats.length}</b></button>
        </div>
        <div className="operations-zoom" aria-label="Map zoom controls">
          <button aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom((current) => stepMapZoom(current, 'out'))} type="button"><MinusIcon /></button>
          <span>{Math.round(zoom * 100)}%</span>
          <button aria-label="Zoom in" disabled={zoom === 1.45} onClick={() => setZoom((current) => stepMapZoom(current, 'in'))} type="button"><PlusIcon /></button>
        </div>
      </div>

      <div className="operations-layout">
        <article className="city-map-panel">
          <div className="city-map-panel__coordinates"><span>43.6532° N</span><span>79.3832° W</span><strong>GRID LOCK</strong></div>
          <svg className="city-map" viewBox="0 0 760 540" role="img" aria-labelledby="city-map-title city-map-description">
            <title id="city-map-title">Interactive SENTINEL city operations map</title>
            <desc id="city-map-description">Five selectable city districts with live drone, ground robot, and threat markers.</desc>
            <defs>
              <pattern id="operations-small-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#58e8ff" strokeOpacity=".07" strokeWidth=".7" /></pattern>
              <pattern id="operations-grid" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#operations-small-grid)" /><path d="M100 0H0V100" fill="none" stroke="#58e8ff" strokeOpacity=".12" /></pattern>
              <filter id="operations-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <radialGradient id="operations-map-vignette"><stop offset="0" stopColor="#0b1820" stopOpacity=".1" /><stop offset="1" stopColor="#020406" stopOpacity=".74" /></radialGradient>
            </defs>
            <rect width="760" height="540" fill="url(#operations-grid)" />
            <rect width="760" height="540" fill="url(#operations-map-vignette)" />

            <g className="city-map__zoom-layer" style={{ transform: `scale(${zoom})` } as CSSProperties}>
              <g className="city-map__perimeter" aria-hidden="true"><path d="M42 132 208 24h302l219 162-20 205-93 130H194L34 350Z" /><path d="M78 151 223 58h247l208 144-18 171-72 108H221L73 331Z" /></g>
              <g className="city-map__transit" aria-hidden="true"><path d="M91 294C201 214 289 206 371 278S552 397 686 279" /><path d="M183 76C270 177 300 278 275 480" /><path d="M554 82C490 186 477 292 518 481" /></g>

              <g className="city-map__districts">
                {districts.map((district) => (
                  <g
                    aria-label={`${district.name}, ${district.code}, integrity ${district.integrity} percent`}
                    aria-pressed={selectedDistrict.id === district.id}
                    className={`city-district${selectedDistrict.id === district.id ? ' is-selected' : ''}`}
                    key={district.id}
                    onClick={() => selectDistrict(district.id)}
                    onKeyDown={(event) => handleActivation(event, () => selectDistrict(district.id))}
                    role="button"
                    style={{ '--district-accent': district.accent } as CSSProperties}
                    tabIndex={0}
                  >
                    <path d={district.path} />
                    <text className="city-district__code" x={district.labelX} y={district.labelY - 8}>{district.code}</text>
                    <text className="city-district__name" x={district.labelX} y={district.labelY + 10}>{district.name}</text>
                    <circle cx={district.labelX - 35} cy={district.labelY - 4} r="2.5" />
                  </g>
                ))}
              </g>

              <g className="city-map__infrastructure" aria-hidden="true">
                <path d="M108 348 235 313 338 330 452 292 641 318" />
                <path d="M243 92 297 183 269 270 345 379 328 475" />
                <path d="M508 102 472 188 529 270 486 373 548 461" />
                {[128, 196, 260, 332, 402, 478, 546, 615].map((x) => <circle cx={x} cy={x % 2 ? 318 : 329} key={x} r="2" />)}
              </g>

              {selectedUnit && (
                <path className={`unit-route${trackedUnitId === selectedUnit.id ? ' is-tracked' : ''}`} d={`M${selectedUnit.x} ${selectedUnit.y} Q380 220 ${selectedUnit.targetX} ${selectedUnit.targetY}`} pathLength="1" />
              )}

              <g className="city-map__units">
                {visibleUnits.map((unit) => (
                  <g
                    aria-label={`${unit.kind === 'drone' ? 'Drone' : 'Ground robot'} ${unit.id}, ${unit.callsign}, ${unit.status}`}
                    aria-pressed={selectedUnit?.id === unit.id}
                    className={`city-unit city-unit--${unit.kind}${selectedUnit?.id === unit.id ? ' is-selected' : ''}${trackedUnitId === unit.id ? ' is-tracked' : ''}`}
                    key={unit.id}
                    onClick={() => selectUnit(unit)}
                    onKeyDown={(event) => handleActivation(event, () => selectUnit(unit))}
                    role="button"
                    tabIndex={0}
                    transform={`translate(${unit.x} ${unit.y})`}
                  >
                    <circle className="city-unit__range" r="17" />
                    <rect height="20" width="20" x="-10" y="-10" />
                    {unit.kind === 'drone' ? <path d="M-7-1h4l3-3 3 3h4L4 1H2L0 5-2 1h-2Z" /> : <path d="M-5-6H5V4H3v4H1V4h-2v4h-2V4h-2Z" />}
                    <text x="14" y="-5">{unit.id}</text>
                    <text className="city-unit__status" x="14" y="5">{unit.status}</text>
                  </g>
                ))}
              </g>

              {filters.threats && (
                <g className="city-map__threats">
                  {threats.map((threat) => (
                    <g
                      aria-label={`${threat.severity} threat ${threat.id}, ${threat.label}`}
                      aria-pressed={selectedThreat?.id === threat.id}
                      className={`city-threat city-threat--${threat.severity}${selectedThreat?.id === threat.id ? ' is-selected' : ''}`}
                      key={threat.id}
                      onClick={() => selectThreat(threat)}
                      onKeyDown={(event) => handleActivation(event, () => selectThreat(threat))}
                      role="button"
                      tabIndex={0}
                      transform={`translate(${threat.x} ${threat.y})`}
                    >
                      <circle r="21" /><path d="M0-10 9 7H-9Z" /><text x="15" y="-8">{threat.id}</text><text className="city-threat__level" x="15" y="3">{threat.severity}</text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          </svg>
          <div className="city-map-panel__legend"><span><i className="is-drone" />Drone</span><span><i className="is-ground" />Ground</span><span><i className="is-threat" />Threat</span><strong>{visibleUnits.length} UNITS VISIBLE</strong></div>
        </article>

        <aside className="operations-inspector" aria-live="polite">
          <div className="operations-inspector__header"><span>Selection inspector</span><strong>{selectedUnit ? 'UNIT' : selectedThreat ? 'THREAT' : 'DISTRICT'}</strong></div>

          {selectedUnit && (
            <div className="operations-selection">
              <div className={`operations-selection__icon operations-selection__icon--${selectedUnit.kind}`}>{selectedUnit.kind === 'drone' ? <DroneIcon /> : <RobotIcon />}</div>
              <span>{selectedUnit.id} / {selectedDistrict.code}</span>
              <h4>{selectedUnit.callsign}</h4>
              <StatusBadge tone={selectedUnit.status === 'intercept' ? 'warning' : 'online'} pulse={selectedUnit.status !== 'standby'}>{selectedUnit.status}</StatusBadge>
              <p>{selectedUnit.task}</p>
              <div className="operations-readings"><div><span>Battery</span><strong>{selectedUnit.battery}%</strong><i><b style={{ width: `${selectedUnit.battery}%` }} /></i></div><div><span>Signal</span><strong>{selectedUnit.signal}%</strong><i><b style={{ width: `${selectedUnit.signal}%` }} /></i></div></div>
              <dl><div><dt>Class</dt><dd>{selectedUnit.kind === 'drone' ? 'AERIAL / MK-IV' : 'GROUND / G-2'}</dd></div><div><dt>District</dt><dd>{selectedDistrict.name}</dd></div><div><dt>Vector</dt><dd>{selectedUnit.targetX} / {selectedUnit.targetY}</dd></div></dl>
              <button aria-pressed={trackedUnitId === selectedUnit.id} onClick={() => setTrackedUnitId((current) => current === selectedUnit.id ? null : selectedUnit.id)} type="button"><CrosshairIcon />{trackedUnitId === selectedUnit.id ? 'Tracking active' : 'Track unit'}</button>
            </div>
          )}

          {selectedThreat && (
            <div className="operations-selection operations-selection--threat">
              <div className="operations-selection__icon"><CrosshairIcon /></div>
              <span>{selectedThreat.id} / {selectedDistrict.code}</span>
              <h4>{selectedThreat.label}</h4>
              <StatusBadge tone={selectedThreat.severity === 'high' ? 'critical' : 'warning'} pulse>{selectedThreat.severity} priority</StatusBadge>
              <p>Predictive engine correlation requires operator review and continuous tracking.</p>
              <div className="threat-confidence"><span>Identification confidence</span><strong>{selectedThreat.confidence}%</strong><i><b style={{ width: `${selectedThreat.confidence}%` }} /></i></div>
              <dl><div><dt>Vector</dt><dd>{selectedThreat.vector}</dd></div><div><dt>District</dt><dd>{selectedDistrict.name}</dd></div><div><dt>Protocol</dt><dd>AUTO-TRACK</dd></div></dl>
            </div>
          )}

          {!selectedUnit && !selectedThreat && (
            <div className="operations-selection operations-selection--district">
              <div className="operations-selection__icon"><GridIcon /></div>
              <span>{selectedDistrict.code} / DISTRICT</span>
              <h4>{selectedDistrict.name}</h4>
              <StatusBadge tone={selectedDistrict.risk === 'elevated' ? 'warning' : 'online'}>{selectedDistrict.risk} risk</StatusBadge>
              <div className="district-vitals"><div><span>Integrity</span><strong>{selectedDistrict.integrity}%</strong></div><div><span>Coverage</span><strong>{selectedDistrict.coverage}%</strong></div><div><span>Population</span><strong>{selectedDistrict.population}</strong></div></div>
            </div>
          )}

          <div className="district-assets">
            <span>Assets in {selectedDistrict.code}</span>
            {districtUnits.length ? districtUnits.map((unit) => (
              <button key={unit.id} onClick={() => selectUnit(unit)} type="button"><i>{unit.kind === 'drone' ? <DroneIcon /> : <RobotIcon />}</i><span><strong>{unit.id}</strong><small>{unit.callsign}</small></span><b>{unit.battery}%</b></button>
            )) : <p>No visible assets in this district.</p>}
          </div>
        </aside>
      </div>

      <div className="operations-feed">
        <div className="operations-feed__title"><ShieldIcon /><span>Operations stream</span><strong>LIVE</strong></div>
        {activity.map((event) => <article key={event.time}><time>{event.time}</time><StatusBadge tone={event.tone}>{event.code}</StatusBadge><p>{event.text}</p></article>)}
      </div>
    </div>
  )
}
