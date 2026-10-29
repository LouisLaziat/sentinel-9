import { Localize } from '../i18n/Localize'
import { useLocale } from '../../hooks/useLocale'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery, usePageVisibility } from '../../hooks/useBrowserSignals'
import { advanceDefense, canAnimateDefense, createDefenseWorld, defenseSnapshot, DEFENSE_SIZE, DEFENSE_UNITS, DEFENSE_WAVES, placeDefenseDrone, placeDefenseTurret, pulseDefense } from '../../lib/defense'
import type { DefenseUnitKind, DefenseWorld } from '../../lib/defense'
import { DRONE_ZONES, ROOF_SITES } from '../../lib/defense-city'
import type { MouseEvent } from 'react'
import { drawDefense, drawDefenseBackdrop } from '../../lib/defense-renderer'
import { BoltIcon, DroneIcon, ShieldIcon, TowerIcon } from '../ui/Icons'

export function DefenseTheater({ enabled, motion }: { enabled: boolean; motion: boolean }) {
  const { locale } = useLocale()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const mapScrollRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Partial<Record<DefenseUnitKind, HTMLButtonElement | null>>>({})
  const placementRef = useRef<DefenseUnitKind | null>(null)
  const focusCardRef = useRef<DefenseUnitKind | null>(null)
  const playbackButtonRef = useRef<HTMLButtonElement>(null)
  const stepButtonRef = useRef<HTMLButtonElement>(null)
  const worldRef = useRef(createDefenseWorld())
  const renderRef = useRef<(() => void) | null>(null)
  const [snapshot, setSnapshot] = useState(() => defenseSnapshot(createDefenseWorld()))
  const [paused, setPaused] = useState(false)
  const [selectedKind, setSelectedKind] = useState<DefenseUnitKind | null>(null)
  const [deploymentMessage, setDeploymentMessage] = useState('Choose a defender. Then click its glowing places on the map.')
  const [inView, setInView] = useState(false)
  const visible = usePageVisibility()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const allowMotion = motion && !reducedMotion
  const finished = snapshot.phase !== 'active'
  const activeKind = finished ? null : selectedKind
  const running = canAnimateDefense(enabled, visible, inView, allowMotion, paused || Boolean(activeKind), snapshot.phase)
  const allAdded = Object.values(snapshot.available).every((count) => count === 0)
  const { drone: availableDrones, tower: availableTowers } = snapshot.available
  const status = snapshot.phase === 'secured' ? 'City protected' : snapshot.phase === 'lost' ? 'Tower lost' : activeKind ? 'Choosing a place / battle paused' : !allowMotion ? 'Animations off / use Next second' : paused ? 'Paused' : running ? 'Battle in progress' : 'Scroll to the battlefield to watch'

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.1)), { threshold: 0.1 })
    observer.observe(arena)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const backdrop = document.createElement('canvas')
    backdrop.width = DEFENSE_SIZE.width
    backdrop.height = DEFENSE_SIZE.height
    const backgroundContext = backdrop.getContext('2d')
    if (!backgroundContext) return
    drawDefenseBackdrop(backgroundContext, locale)
    const render = () => drawDefense(ctx, worldRef.current, backdrop, !allowMotion, placementRef.current, locale)
    renderRef.current = render
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(bounds.width * ratio))
      canvas.height = Math.max(1, Math.round(bounds.height * ratio))
      ctx.setTransform(canvas.width / DEFENSE_SIZE.width, 0, 0, canvas.height / DEFENSE_SIZE.height, 0, 0)
      render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    return () => { observer.disconnect(); renderRef.current = null }
  }, [allowMotion, locale])

  useEffect(() => {
    placementRef.current = activeKind
    renderRef.current?.()
    const map = mapScrollRef.current
    if (map) {
      map.scrollLeft = activeKind ? (map.scrollWidth - map.clientWidth) / 2 : 0
      if (activeKind) map.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
    if (!activeKind && focusCardRef.current) {
      const preferred = focusCardRef.current
      const preferredAvailable = preferred === 'drone' ? availableDrones : availableTowers
      const target = preferredAvailable > 0 ? preferred : availableDrones > 0 ? 'drone' : availableTowers > 0 ? 'tower' : null
      if (target) cardsRef.current[target]?.focus({ preventScroll: true })
      else (playbackButtonRef.current?.disabled ? stepButtonRef.current : playbackButtonRef.current)?.focus({ preventScroll: true })
      focusCardRef.current = null
    }
  }, [activeKind, availableDrones, availableTowers])

  useEffect(() => {
    if (!running) return
    let frame = 0
    let previous = 0
    let lastSummary = 0
    const animate = (now: number) => {
      // Fresh timestamps on every resume prevent hidden-time catch-up.
      if (!previous) previous = now
      if (now - previous >= 1000 / 30) {
        worldRef.current = advanceDefense(worldRef.current, Math.min((now - previous) / 1000, 0.1))
        previous = now
        renderRef.current?.()
        if (now - lastSummary >= 250 || worldRef.current.phase !== 'active') {
          setSnapshot(defenseSnapshot(worldRef.current))
          lastSummary = now
        }
      }
      if (worldRef.current.phase === 'active') frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [running])

  function step() {
    worldRef.current = advanceDefense(worldRef.current, 1)
    setSnapshot(defenseSnapshot(worldRef.current))
    renderRef.current?.()
  }

  function pulse() {
    worldRef.current = pulseDefense(worldRef.current)
    setSnapshot(defenseSnapshot(worldRef.current))
    renderRef.current?.()
  }

  function reset() {
    worldRef.current = createDefenseWorld()
    setSnapshot(defenseSnapshot(worldRef.current))
    setPaused(false)
    setSelectedKind(null)
    setDeploymentMessage('Fresh battlefield! Pick a defender, then click a glowing place. All defenders are available again.')
    renderRef.current?.()
  }

  function chooseUnit(kind: DefenseUnitKind) {
    if (finished || snapshot.available[kind] === 0) return
    setSelectedKind(selectedKind === kind ? null : kind)
    setDeploymentMessage(selectedKind === kind ? 'Placement cancelled. Pick a defender when you are ready.' : kind === 'drone' ? 'Drone selected. Click anywhere inside a glowing circle. The battle is paused while you choose.' : 'Automatic tower selected. Click any glowing building. The battle is paused while you choose.')
  }

  function cancelPlacement() {
    focusCardRef.current = selectedKind
    setSelectedKind(null)
    setDeploymentMessage('Placement cancelled. Pick a defender when you are ready.')
  }

  function completePlacement(next: DefenseWorld, kind: DefenseUnitKind, message: string) {
    if (next === worldRef.current) {
      setDeploymentMessage(kind === 'drone' ? 'Choose an empty spot inside the glowing circle. Leave a little space between drones.' : 'This building already has a tower. Choose a glowing building instead.')
      return
    }
    worldRef.current = next
    const summary = defenseSnapshot(next)
    setSnapshot(summary)
    focusCardRef.current = kind
    setSelectedKind(null)
    const tip = Object.values(summary.available).every((count) => count === 0) ? 'All defenders placed. Watch them protect the city!' : 'Pick another defender to place more.'
    setDeploymentMessage(`${message} It aims and fires automatically. ${tip}`)
    renderRef.current?.()
  }

  function placeDrone(zone: typeof DRONE_ZONES[number], event: MouseEvent<HTMLButtonElement>) {
    const bounds = stageRef.current?.getBoundingClientRect()
    const point = event.detail > 0 && bounds ? { x: (event.clientX - bounds.left) / bounds.width * DEFENSE_SIZE.width, y: (event.clientY - bounds.top) / bounds.height * DEFENSE_SIZE.height } : { x: zone.x, y: zone.y }
    completePlacement(placeDefenseDrone(worldRef.current, zone.id, point), 'drone', `Drone placed in the ${zone.name.toLowerCase()}!`)
  }

  function placeTower(site: typeof ROOF_SITES[number]) {
    completePlacement(placeDefenseTurret(worldRef.current, site.id), 'tower', `Automatic tower placed on ${site.name}!`)
  }

  return (
    <Localize><section className={`defense-theater${activeKind ? ' is-placing' : ''}${!allowMotion ? ' is-calm' : ''}`} aria-labelledby="defense-title" onKeyDown={(event) => { if (event.key === 'Escape' && activeKind) { event.preventDefault(); event.stopPropagation(); cancelPlacement() } }}>
      <div className="defense-briefing">
        <div><span>Interactive city defense / try it yourself</span><h4 id="defense-title">Hold the line<span>.</span></h4></div>
        <p>Help protect the city.<br />{' '}Pick a defender. Click a glowing place.</p>
      </div>
      <div className="defense-metrics" aria-label="Tower defense telemetry">
        <div><span>Wave</span><strong>{String(snapshot.wave).padStart(2, '0')}<small> / 0{DEFENSE_WAVES}</small></strong></div>
        <div><span>Enemies</span><strong className="is-coral">{String(snapshot.threats).padStart(2, '0')}</strong></div>
        <div><span>Enemies stopped</span><strong className="is-cyan">{String(snapshot.intercepted).padStart(2, '0')}</strong></div>
        <div><span>Score</span><strong>{snapshot.score.toLocaleString('en-US')}</strong></div>
      </div>
      <aside className="defense-command" aria-label="Citadel defense controls">
        <div className="defense-command__title"><ShieldIcon /><span>Your city</span><b>AUTO DEFENSE</b></div>
        <div className="defense-health"><div><span>Tower health</span><strong>{snapshot.integrity}%</strong></div><meter aria-label="Tower health" min={0} max={100} value={snapshot.integrity} /><div><span>Shield</span><strong className="is-cyan">{snapshot.shield}%</strong></div><meter aria-label="Shield" className="is-shield" min={0} max={100} value={snapshot.shield} /></div>
        <div className="defense-squad"><span>Your defenders</span><div><DroneIcon /><strong>Drones</strong><small>{snapshot.drones}</small></div><div className="is-tower"><TowerIcon /><strong>Towers</strong><small>{snapshot.turretSites.length}</small></div><p>You choose the place. They aim and fire on their own.</p></div>
        <div className="defense-ability"><span>Need a helping hand?</span><button disabled={finished || snapshot.pulseCooldown > 0} onClick={pulse} type="button"><BoltIcon /><span>Emergency pulse<strong>{finished ? 'BATTLE FINISHED' : snapshot.pulseCooldown ? `READY IN ${snapshot.pulseCooldown}s` : 'CLEAR NEARBY ENEMIES'}</strong></span><b>{snapshot.pulseCooldown ? `${snapshot.pulseCooldown}s` : '↗'}</b></button><p>A shockwave stops nearby enemies. Wait 12 seconds before using it again.</p></div>
      </aside>
      <div className="defense-layout">
        <aside className="defense-deployment" aria-label="Place a defender">
          <div className="defense-deployment__title"><span>1</span><strong>Choose your defender</strong><small>Click a card below, then a glowing spot on the map</small></div>
          <div className="defense-unit-cards" role="group" aria-label="Choose a defender">{DEFENSE_UNITS.map((unit) => {
            const Icon = unit.id === 'drone' ? DroneIcon : TowerIcon
            return <button aria-label={unit.id === 'drone' ? 'Choose a drone' : 'Choose an automatic tower'} aria-pressed={activeKind === unit.id} className={`defense-unit-card is-${unit.id}`} disabled={finished || snapshot.available[unit.id] === 0} key={unit.id} onClick={() => chooseUnit(unit.id)} ref={(button) => { cardsRef.current[unit.id] = button }} type="button"><span className="defense-unit-card__visual"><Icon /></span><span className="defense-unit-card__copy"><strong><span className="defense-unit-card__name-full">{unit.name}</span><span className="defense-unit-card__name-short">{unit.id === 'tower' ? 'Auto tower' : unit.name}</span></strong><span>{unit.description}</span><small>{snapshot.available[unit.id] === 0 ? 'All placed' : `${snapshot.available[unit.id]} available`}</small></span><span className="defense-unit-card__select" aria-hidden="true">{finished ? 'Finished' : snapshot.available[unit.id] === 0 ? '✓ Placed' : activeKind === unit.id ? '✓ Selected' : 'Click to choose →'}</span></button>
          })}</div>
          <div className={`defense-placement-hint${activeKind ? ` is-${activeKind}` : ''}`}><span>2</span><strong>{finished ? 'Battle finished — play again to place defenders' : allAdded ? 'All defenders placed — enjoy the battle!' : activeKind === 'drone' ? 'Click anywhere inside a glowing circle on the map' : activeKind === 'tower' ? 'Click a glowing building on the map' : 'Pick a card above to reveal its glowing places'}</strong>{activeKind && <button onClick={cancelPlacement} type="button">Cancel</button>}</div>
          <p className="defense-deployment__message" role="status">{deploymentMessage}</p>
        </aside>
        <div className={`defense-arena${finished ? ' is-finished' : ''}`} ref={arenaRef}>
          <div className="defense-arena__header"><span><i />CITADEL / C-12</span><time>{String(Math.floor(snapshot.time / 60)).padStart(2, '0')}:{String(snapshot.time % 60).padStart(2, '0')}</time></div>
          {activeKind && <div className={`defense-map-instruction is-${activeKind}`}><p>{activeKind === 'drone' ? 'Click a blue circle to place your drone' : 'Click a green building to place your tower'}<span>On phones, swipe the map to explore.</span></p><button aria-label="Cancel placement" onClick={cancelPlacement} type="button">Cancel</button></div>}
          <div className="defense-map-scroll" ref={mapScrollRef} role={activeKind ? 'region' : undefined} tabIndex={activeKind ? 0 : undefined} aria-label={activeKind ? 'Placement map. Use arrow keys or swipe to explore.' : undefined}>
            <div className="defense-stage" ref={stageRef} onClick={(event) => { if (activeKind && !(event.target as HTMLElement).closest('button')) setDeploymentMessage(activeKind === 'drone' ? 'Click inside one of the glowing blue circles to place a drone.' : 'Click one of the glowing green buildings to place a tower.') }}>
              <canvas aria-label={`City defense battlefield: ${snapshot.drones} drones and ${snapshot.turretSites.length} automatic towers. Choose a defender card to reveal its placement zones.`} className="defense-canvas" height={DEFENSE_SIZE.height} ref={canvasRef} role="img" width={DEFENSE_SIZE.width}>
                City defense illustration. Select Drone for glowing air zones or Automatic tower for glowing buildings. Then click a place, or use Tab and Enter on a placement target.
              </canvas>
              {activeKind && <div className="defense-placement-targets" role="group" aria-label={activeKind === 'drone' ? 'Glowing drone air zones' : 'Glowing tower buildings'}>
                {activeKind === 'drone' ? DRONE_ZONES.map((zone) => <button aria-label={`Place drone in ${zone.name}`} className="defense-drone-zone" key={zone.id} onClick={(event) => placeDrone(zone, event)} style={{ left: `${(zone.x - zone.radius) / DEFENSE_SIZE.width * 100}%`, top: `${(zone.y - zone.radius) / DEFENSE_SIZE.height * 100}%`, width: `${zone.radius * 2 / DEFENSE_SIZE.width * 100}%`, height: `${zone.radius * 2 / DEFENSE_SIZE.height * 100}%` }} type="button"><span aria-hidden="true">+</span><small aria-hidden="true">{zone.id}</small></button>) : ROOF_SITES.map((site) => { const occupied = snapshot.turretSites.includes(site.id); return <button aria-label={`Place automatic tower on ${site.name}`} className="defense-roof-target" disabled={occupied} key={site.id} onClick={() => placeTower(site)} style={{ left: `${site.x / DEFENSE_SIZE.width * 100}%`, top: `${(site.y - site.width * 0.42) / DEFENSE_SIZE.height * 100}%`, width: `${site.width * 2 / DEFENSE_SIZE.width * 100}%`, height: `${(site.height + site.width * 0.84) / DEFENSE_SIZE.height * 100}%` }} title={occupied ? `${site.name} — tower placed` : `Place on ${site.name}`} type="button"><span style={{ top: `${site.width * 0.42 / (site.height + site.width * 0.84) * 100}%` }} aria-hidden="true">{occupied ? '✓' : '+'}</span></button> })}
              </div>}
            </div>
          </div>
          <div className="defense-arena__legend"><span><i />Your drones</span><span><i className="is-lime" />Towers</span><span><i className="is-coral" />Enemies</span><strong>Fictional / local demo</strong></div>
          {finished && <div className={`defense-result${snapshot.phase === 'lost' ? ' is-lost' : ''}`}><ShieldIcon /><span>{snapshot.phase === 'secured' ? 'YOU PROTECTED THE CITY' : 'TRY A DIFFERENT TEAM'}</span><strong>{snapshot.phase === 'secured' ? 'City protected!' : 'Tower lost.'}</strong><p>{snapshot.intercepted} enemies stopped / {snapshot.score.toLocaleString('en-US')} points</p><button onClick={reset} type="button">Play again</button></div>}
        </div>
      </div>
      <div className="defense-playback"><span className={running ? 'is-live' : ''} role="status"><i />{status}</span><div><button aria-pressed={paused} disabled={finished || !allowMotion || Boolean(activeKind)} onClick={() => setPaused((current) => !current)} ref={playbackButtonRef} type="button">{paused ? 'Resume' : 'Pause'}</button><button disabled={finished || running || Boolean(activeKind)} onClick={step} ref={stepButtonRef} type="button">Next second</button><button onClick={reset} type="button">Start over</button></div></div>
      {!allowMotion && <p className="defense-motion-note">Animations are off. You can still add defenders and use Next second to watch the battle one step at a time.</p>}
      <div className="defense-stream"><div><span>Defense uplink</span><strong>WAVE {String(snapshot.wave).padStart(2, '0')}</strong></div><ol aria-label="Recent defense events">{snapshot.events.slice(0, 3).map((event) => <li className={`is-${event.tone}`} key={event.id}><time>+{String(Math.floor(event.time)).padStart(2, '0')}s</time><i /><span>{event.text}</span></li>)}</ol></div>
    </section></Localize>
  )
}
