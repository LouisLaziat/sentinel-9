import { describe, expect, it } from 'vitest'
import { advanceDefense, canAnimateDefense, createDefenseWorld, defenseSnapshot, placeDefenseDrone, DEFENSE_CORE, DEFENSE_UNITS, DEFENSE_WAVES, MAX_EXTRA_DRONES, MAX_TURRETS, placeDefenseTurret, pulseDefense, PULSE_COOLDOWN } from './defense'
import { DEFENSE_BUILDINGS, DRONE_ZONES, ROOF_SITES } from './defense-city'

describe('Citadel defense model', () => {
  it('starts with a tower, three interceptors, and an incoming first wave', () => {
    const world = createDefenseWorld()
    expect(world.phase).toBe('active')
    expect(world.shield).toBe(100)
    expect(world.integrity).toBe(100)
    expect(world.interceptors).toHaveLength(3)
    expect(world.raiders).toHaveLength(6)
    expect(world.events[0]?.text).toContain('Wave 01')
  })

  it('moves raiders toward the tower and interceptors around it', () => {
    const initial = createDefenseWorld()
    const next = advanceDefense(initial, 0.5)
    const before = initial.raiders[0]!
    const after = next.raiders.find((item) => item.id === before.id)!
    expect(Math.hypot(after.x - DEFENSE_CORE.x, after.y - DEFENSE_CORE.y)).toBeLessThan(Math.hypot(before.x - DEFENSE_CORE.x, before.y - DEFENSE_CORE.y))
    expect(next.interceptors[0]?.x).not.toBe(initial.interceptors[0]?.x)
  })

  it('does not mutate an earlier model or its entity arrays', () => {
    const initial = createDefenseWorld()
    const serialized = JSON.stringify(initial)
    advanceDefense(initial, 3)
    pulseDefense(initial)
    expect(JSON.stringify(initial)).toBe(serialized)
  })

  it('produces the same fixed-step result across differently grouped frames', () => {
    let frames = createDefenseWorld()
    for (let i = 0; i < 50; i++) frames = advanceDefense(frames, 0.1)
    const batch = advanceDefense(createDefenseWorld(), 5)
    expect(defenseSnapshot(frames)).toEqual(defenseSnapshot(batch))
    expect(frames.raiders).toEqual(batch.raiders)
    expect(frames.shots).toEqual(batch.shots)
  })

  it('automatically fires homing shots and neutralizes hostile drones', () => {
    let world = createDefenseWorld()
    let hasShots = false
    for (let i = 0; i < 100; i++) {
      world = advanceDefense(world, 0.1)
      hasShots ||= world.shots.length > 0
    }
    expect(hasShots).toBe(true)
    expect(world.intercepted).toBeGreaterThan(0)
    expect(world.score).toBeGreaterThan(0)
  })

  it('absorbs a perimeter impact with shields before damaging the tower', () => {
    const world = createDefenseWorld()
    world.raiders = [{ ...world.raiders[0]!, ...DEFENSE_CORE }]
    const next = advanceDefense(world, 1 / 30)
    expect(next.breaches).toBe(1)
    expect(next.intercepted).toBe(0)
    expect(next.shield).toBe(78)
    expect(next.integrity).toBe(100)
    expect(next.raiders).toHaveLength(0)
  })

  it('applies remaining impact damage when the shield is depleted', () => {
    const world = createDefenseWorld()
    world.shield = 5
    world.raiders = [{ ...world.raiders[0]!, ...DEFENSE_CORE }]
    const next = advanceDefense(world, 1 / 30)
    expect(next.shield).toBe(0)
    expect(next.integrity).toBeCloseTo(83.05)
  })

  it('ends a destroyed tower run and stops advancing it', () => {
    const world = createDefenseWorld()
    world.shield = 0
    world.integrity = 1
    world.raiders = [{ ...world.raiders[0]!, ...DEFENSE_CORE }]
    const lost = advanceDefense(world, 1)
    expect(lost.phase).toBe('lost')
    expect(lost.integrity).toBe(0)
    expect(advanceDefense(lost, 5)).toBe(lost)
    expect(pulseDefense(lost)).toBe(lost)
  })

  it('finishes five waves with a bounded entity count and outcome', () => {
    let world = createDefenseWorld()
    for (let i = 0; i < 900 && world.phase === 'active'; i++) {
      world = advanceDefense(world, 0.1)
      expect(world.raiders.length).toBeLessThanOrEqual(30)
      expect(world.effects.length).toBeLessThanOrEqual(40)
      expect(world.events.length).toBeLessThanOrEqual(4)
    }
    expect(world.wave).toBe(DEFENSE_WAVES)
    expect(world.phase).toBe('secured')
    expect(world.raiders).toHaveLength(0)
    expect(advanceDefense(world, 1)).toBe(world)
  })

  it('clears only inner-perimeter threats with an EMP pulse', () => {
    const world = createDefenseWorld()
    world.raiders[0] = { ...world.raiders[0]!, x: DEFENSE_CORE.x + 150, y: DEFENSE_CORE.y }
    const innerId = world.raiders[0].id
    world.raiders[1] = { ...world.raiders[1]!, x: DEFENSE_CORE.x + 400, y: DEFENSE_CORE.y }
    const outer = world.raiders[1]
    const pulsed = pulseDefense(world)
    expect(pulsed.raiders.some((item) => item.id === innerId)).toBe(false)
    expect(pulsed.raiders.some((item) => item.id === outer.id)).toBe(true)
    expect(pulsed.intercepted).toBeGreaterThan(0)
    expect(pulsed.effects.some((item) => item.kind === 'pulse')).toBe(true)
    expect(pulsed.pulseCooldown).toBe(PULSE_COOLDOWN)
    expect(pulsed.events[0]?.text).toContain('drones neutralized')
    const noTargets = createDefenseWorld()
    noTargets.raiders = noTargets.raiders.map((item) => ({ ...item, x: DEFENSE_CORE.x + 400, y: DEFENSE_CORE.y }))
    expect(pulseDefense(noTargets).events[0]?.text).toContain('no targets in range')
  })

  it('blocks repeated pulses until simulated cooldown elapses', () => {
    let world = pulseDefense(createDefenseWorld())
    expect(pulseDefense(world)).toBe(world)
    expect(defenseSnapshot(advanceDefense(world, 1)).pulseCooldown).toBe(11)
    world = advanceDefense(advanceDefense(advanceDefense(world, 5), 5), 2)
    expect(world.pulseCooldown).toBe(0)
    expect(pulseDefense(world)).not.toBe(world)
  })

  it('ignores invalid time and caps long gaps without catch-up storms', () => {
    const initial = createDefenseWorld()
    for (const gap of [0, -1, Number.NaN, Infinity]) expect(advanceDefense(initial, gap)).toBe(initial)
    expect(defenseSnapshot(advanceDefense(initial, 1000)).time).toBe(5)
  })

  it('does not advance the clock until a full fixed timestep accumulates', () => {
    const partial = advanceDefense(createDefenseWorld(), 0.01)
    expect(partial.time).toBe(0)
    expect(advanceDefense(partial, 0.024).time).toBeCloseTo(1 / 30)
  })
})

describe('visitor-deployed defenses', () => {
  it('adds three reserve drones without advancing time or mutating the original', () => {
    const initial = createDefenseWorld()
    const serialized = JSON.stringify(initial)
    let world = initial
    for (let i = 0; i < MAX_EXTRA_DRONES; i++) world = placeDefenseDrone(world, DRONE_ZONES[i]!.id)
    expect(world.interceptors).toHaveLength(6)
    expect(defenseSnapshot(world).extraDrones).toBe(3)
    expect(world.time).toBe(0)
    expect(world.events[0]?.text).toContain('Drone placed')
    expect(JSON.stringify(initial)).toBe(serialized)
    expect(placeDefenseDrone(world, DRONE_ZONES[3]!.id)).toBe(world)
  })

  it('keeps initial orbits and placed patrols moving without overlapping starts', () => {
    let world = createDefenseWorld()
    for (let i = 0; i < MAX_EXTRA_DRONES; i++) world = placeDefenseDrone(world, DRONE_ZONES[i]!.id)
    expect(new Set(world.interceptors.map((unit) => unit.id)).size).toBe(6)
    for (const unit of world.interceptors) {
      expect(world.interceptors.filter((other) => Math.hypot(other.x - unit.x, other.y - unit.y) < 1)).toHaveLength(1)
    }
    const next = advanceDefense(world, 0.5)
    expect(next.interceptors.every((unit, index) => unit.x !== world.interceptors[index]?.x || unit.y !== world.interceptors[index]?.y)).toBe(true)
  })

  it('mounts one gun per valid rooftop using the rendered building geometry', () => {
    const initial = createDefenseWorld()
    let world = initial
    for (const site of ROOF_SITES.slice(0, MAX_TURRETS)) {
      const [x, y, , height] = DEFENSE_BUILDINGS[site.building]!
      world = placeDefenseTurret(world, site.id)
      expect(world.turrets.at(-1)).toMatchObject({ site: site.id, x, y: y - height })
    }
    expect(world.turrets).toHaveLength(MAX_TURRETS)
    expect(defenseSnapshot(world).turretSites).toEqual(ROOF_SITES.slice(0, MAX_TURRETS).map((site) => site.id))
    expect(world.time).toBe(0)
    expect(initial.turrets).toHaveLength(0)
  })

  it('rejects unknown and duplicate rooftop placements without spending a mount', () => {
    const initial = createDefenseWorld()
    expect(placeDefenseTurret(initial, 'unknown')).toBe(initial)
    const mounted = placeDefenseTurret(initial, ROOF_SITES[0]!.id)
    expect(placeDefenseTurret(mounted, ROOF_SITES[0]!.id)).toBe(mounted)
    expect(mounted.turrets).toHaveLength(1)
  })

  it('automatically aims and fires a mounted gun, including during manual stepping', () => {
    const site = ROOF_SITES[0]!
    let world = placeDefenseTurret(createDefenseWorld(), site.id)
    world.interceptors = []
    world.raiders = [{ ...world.raiders[0]!, x: site.x + 100, y: site.y, speed: 0 }]
    const original = JSON.stringify(world)
    const firing = advanceDefense(world, 1 / 30)
    expect(firing.shots.some((shot) => shot.kind === 'turret')).toBe(true)
    expect(firing.turrets[0]?.angle).toBe(0)
    expect(firing.turrets[0]?.flash).toBeGreaterThan(0)
    expect(JSON.stringify(world)).toBe(original)
    world = advanceDefense(firing, 1)
    expect(world.intercepted).toBe(1)
    expect(world.score).toBe(100)
    expect(world.raiders).toHaveLength(0)
  })

  it('does not fire a rooftop gun when a raider is outside its range', () => {
    const site = ROOF_SITES[0]!
    const world = placeDefenseTurret(createDefenseWorld(), site.id)
    world.interceptors = []
    world.raiders = [{ ...world.raiders[0]!, x: site.x + 350, y: site.y, speed: 0 }]
    expect(advanceDefense(world, 1).shots).toHaveLength(0)
  })

  it('blocks both deployment actions after a drill has ended', () => {
    for (const phase of ['secured', 'lost'] as const) {
      const world = { ...createDefenseWorld(), phase }
      expect(placeDefenseDrone(world, DRONE_ZONES[0]!.id)).toBe(world)
      expect(placeDefenseTurret(world, ROOF_SITES[0]!.id)).toBe(world)
    }
  })

  it('keeps reinforced combat deterministic and bounded through all five waves', () => {
    let initial = createDefenseWorld()
    for (let i = 0; i < MAX_EXTRA_DRONES; i++) initial = placeDefenseDrone(initial, DRONE_ZONES[i]!.id)
    for (const site of ROOF_SITES) initial = placeDefenseTurret(initial, site.id)
    let frames = initial
    for (let i = 0; i < 50; i++) frames = advanceDefense(frames, 0.1)
    expect(defenseSnapshot(frames)).toEqual(defenseSnapshot(advanceDefense(initial, 5)))
    for (let i = 0; i < 900 && frames.phase === 'active'; i++) {
      frames = advanceDefense(frames, 0.1)
      expect(frames.shots.length).toBeLessThanOrEqual(60)
      expect(frames.effects.length).toBeLessThanOrEqual(80)
      expect(frames.events.length).toBeLessThanOrEqual(4)
    }
    expect(frames.phase).toBe('secured')
    expect(frames.turrets).toHaveLength(4)
    expect(frames.interceptors).toHaveLength(6)
  })

  it('restores the initial wing and all deployment reserves in a fresh drill', () => {
    const fresh = defenseSnapshot(createDefenseWorld())
    expect(fresh.drones).toBe(3)
    expect(fresh.extraDrones).toBe(0)
    expect(fresh.turretSites).toEqual([])
  })
})

describe('defense animation lifecycle', () => {
  it('runs only when enabled, visible, in view, motion-enabled, unpaused, and active', () => {
    expect(canAnimateDefense(true, true, true, true, false, 'active')).toBe(true)
    expect(canAnimateDefense(false, true, true, true, false, 'active')).toBe(false)
    expect(canAnimateDefense(true, false, true, true, false, 'active')).toBe(false)
    expect(canAnimateDefense(true, true, false, true, false, 'active')).toBe(false)
    expect(canAnimateDefense(true, true, true, false, false, 'active')).toBe(false)
    expect(canAnimateDefense(true, true, true, true, true, 'active')).toBe(false)
    expect(canAnimateDefense(true, true, true, true, false, 'secured')).toBe(false)
    expect(canAnimateDefense(true, true, true, true, false, 'lost')).toBe(false)
  })
})

describe('visual placement zones', () => {
  it('offers only Drone and Automatic tower cards, without guard robots', () => {
    expect(DEFENSE_UNITS.map((unit) => unit.id)).toEqual(['drone', 'tower'])
    expect(DEFENSE_UNITS.every((unit) => unit.name && unit.description)).toBe(true)
    expect(defenseSnapshot(createDefenseWorld()).available).toEqual({ drone: 3, tower: 4 })
  })

  it('places a drone exactly at a visitor point without moving existing drones or time', () => {
    const initial = createDefenseWorld()
    const zone = DRONE_ZONES[0]!
    const point = { x: zone.x + 25, y: zone.y - 15 }
    const world = placeDefenseDrone(initial, zone.id, point)
    expect(world.interceptors.at(-1)).toMatchObject({ ...point, placement: { zone: zone.id, point, time: 0 } })
    expect(world.interceptors.slice(0, 3)).toEqual(initial.interceptors)
    expect(world.time).toBe(0)
    point.x = 0
    expect(world.interceptors.at(-1)?.placement?.point.x).toBe(zone.x + 25)
  })

  it('provides valid center placements in all four air zones', () => {
    for (const zone of DRONE_ZONES) {
      const next = placeDefenseDrone(createDefenseWorld(), zone.id)
      expect(next.interceptors.at(-1)).toMatchObject({ x: zone.x, y: zone.y })
    }
  })

  it('rejects unknown zones, nonfinite points, and locations outside a circle', () => {
    const initial = createDefenseWorld()
    const zone = DRONE_ZONES[0]!
    expect(placeDefenseDrone(initial, 'unknown')).toBe(initial)
    for (const point of [{ x: NaN, y: zone.y }, { x: zone.x, y: Infinity }, { x: zone.x + zone.radius + 1, y: zone.y }, { x: zone.x + zone.radius, y: zone.y + zone.radius }]) {
      expect(placeDefenseDrone(initial, zone.id, point)).toBe(initial)
    }
  })

  it('accepts circle-edge points and keeps patrols inside their selected zone', () => {
    const zone = DRONE_ZONES[0]!
    for (const offset of [0, 25, zone.radius - 1, zone.radius]) {
      let world = placeDefenseDrone(createDefenseWorld(), zone.id, { x: zone.x + offset, y: zone.y })
      for (let i = 0; i < 100; i++) {
        world = advanceDefense(world, 0.1)
        const drone = world.interceptors.at(-1)!
        expect(Math.hypot(drone.x - zone.x, drone.y - zone.y)).toBeLessThanOrEqual(zone.radius + 1e-7)
      }
    }
  })

  it('allows different points in one circle but rejects overlapping placements', () => {
    const zone = DRONE_ZONES[0]!
    const initial = placeDefenseDrone(createDefenseWorld(), zone.id)
    expect(placeDefenseDrone(initial, zone.id)).toBe(initial)
    expect(placeDefenseDrone(initial, zone.id, { x: zone.x + 5, y: zone.y })).toBe(initial)
    expect(placeDefenseDrone(initial, zone.id, { x: zone.x + 40, y: zone.y }).interceptors).toHaveLength(5)
  })

  it('does not mutate nested placement points when advancing or adding units', () => {
    const initial = placeDefenseDrone(createDefenseWorld(), DRONE_ZONES[0]!.id)
    const original = JSON.stringify(initial)
    const advanced = advanceDefense(initial, 1)
    advanced.interceptors.at(-1)!.placement!.point.x = 0
    const added = placeDefenseDrone(initial, DRONE_ZONES[1]!.id)
    added.interceptors[3]!.placement!.point.x = 0
    expect(JSON.stringify(initial)).toBe(original)
  })

  it('allows a tower on every surrounding building, not just the original four', () => {
    expect(ROOF_SITES).toHaveLength(DEFENSE_BUILDINGS.length)
    expect(new Set(ROOF_SITES.map((site) => site.building)).size).toBe(DEFENSE_BUILDINGS.length)
    for (const site of ROOF_SITES) {
      const next = placeDefenseTurret(createDefenseWorld(), site.id)
      expect(next.turrets[0]).toMatchObject({ site: site.id, x: site.x, y: site.y })
    }
  })

  it('keeps the four-tower budget independent of the nineteen possible buildings', () => {
    let world = createDefenseWorld()
    for (const site of ROOF_SITES.slice(-4)) world = placeDefenseTurret(world, site.id)
    expect(world.turrets).toHaveLength(4)
    expect(defenseSnapshot(world).available).toEqual({ drone: 3, tower: 0 })
    expect(placeDefenseTurret(world, ROOF_SITES[0]!.id)).toBe(world)
  })

  it('begins a local drone patrol at the current battle time, without jumping', () => {
    const initial = advanceDefense(createDefenseWorld(), 4)
    const zone = DRONE_ZONES[0]!
    const placed = placeDefenseDrone(initial, zone.id)
    expect(placed.interceptors.at(-1)).toMatchObject({ x: zone.x, y: zone.y, placement: { time: initial.time } })
    const advanced = advanceDefense(placed, 1 / 30)
    expect(Math.hypot(advanced.interceptors.at(-1)!.x - zone.x, advanced.interceptors.at(-1)!.y - zone.y)).toBeLessThan(1)
  })

  it('automatically fires a placed drone without requiring player aim', () => {
    const zone = DRONE_ZONES[0]!
    let world = placeDefenseDrone(createDefenseWorld(), zone.id)
    world.interceptors = [world.interceptors.at(-1)!]
    world.raiders = [{ ...world.raiders[0]!, x: zone.x + 100, y: zone.y, speed: 0 }]
    world = advanceDefense(world, 3)
    expect(world.intercepted).toBe(1)
  })

  it('restores all defender reserves and removes placement anchors in a fresh battle', () => {
    const fresh = defenseSnapshot(createDefenseWorld())
    expect(fresh.available).toEqual({ drone: 3, tower: 4 })
    expect(createDefenseWorld().interceptors.every((unit) => !unit.placement)).toBe(true)
  })
})
