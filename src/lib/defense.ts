import { DRONE_ZONES, ROOF_SITES } from './defense-city'

export const DEFENSE_SIZE = { width: 960, height: 600 } as const
export const DEFENSE_CORE = { x: 480, y: 310 } as const
export const DEFENSE_WAVES = 5
export const DEFENSE_STEP = 1 / 30
export const PULSE_COOLDOWN = 12
export const BASE_DRONES = 3
export const MAX_EXTRA_DRONES = 3
export const MAX_TURRETS = 4
export const DRONE_CLEARANCE = 28
export const DEFENSE_UNITS = [
  { id: 'drone', name: 'Drone', description: 'Place anywhere inside a glowing circle.' },
  { id: 'tower', name: 'Automatic tower', description: 'Place on any glowing building.' },
] as const
export type DefenseUnitKind = typeof DEFENSE_UNITS[number]['id']

export type Point = { x: number; y: number }
export type Raider = Point & { id: number; hp: number; speed: number; angle: number; armored: boolean }
export type Interceptor = Point & { id: number; angle: number; cooldown: number; placement?: { zone: string; point: Point; time: number } }
export type DefenseTurret = Point & { site: string; angle: number; cooldown: number; flash: number }
export type DefenseEffect = Point & { id: number; age: number; life: number; kind: 'hit' | 'breach' | 'pulse'; seed: number }
export type DefenseShot = Point & { id: number; target: number; origin: Point; age: number; kind: 'drone' | 'turret' }
export type DefenseEvent = { id: number; time: number; text: string; tone: 'cyan' | 'lime' | 'coral' }
export type DefenseWorld = {
  time: number; remainder: number; wave: number; waveStarted: number
  phase: 'active' | 'secured' | 'lost'; shield: number; integrity: number
  intercepted: number; breaches: number; score: number; pulseCooldown: number; nextId: number
  raiders: Raider[]; interceptors: Interceptor[]; turrets: DefenseTurret[]; shots: DefenseShot[]; effects: DefenseEffect[]; events: DefenseEvent[]
}

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

function record(world: DefenseWorld, text: string, tone: DefenseEvent['tone']) {
  world.events = [{ id: world.nextId++, time: world.time, text, tone }, ...world.events].slice(0, 4)
}

function effect(world: DefenseWorld, point: Point, kind: DefenseEffect['kind']) {
  world.effects.push({ ...point, id: world.nextId++, age: 0, life: kind === 'pulse' ? 1.2 : 0.7, kind, seed: world.nextId })
}

function spawnWave(world: DefenseWorld) {
  const count = 5 + world.wave
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + world.wave * 0.67
    const armored = world.wave >= 3 && i % 3 === 0
    world.raiders.push({
      id: world.nextId++, x: DEFENSE_CORE.x + Math.cos(angle) * (385 + i % 2 * 30),
      y: DEFENSE_CORE.y + Math.sin(angle) * (228 + i % 2 * 20),
      hp: armored ? 3 : 2, speed: 26 + world.wave * 4 + i % 3 * 3, angle: angle + Math.PI, armored,
    })
  }
  world.waveStarted = world.time
  record(world, `Wave ${String(world.wave).padStart(2, '0')} / ${count} hostile signatures inbound`, 'coral')
}

export function createDefenseWorld(): DefenseWorld {
  const world: DefenseWorld = {
    time: 0, remainder: 0, wave: 1, waveStarted: 0, phase: 'active', shield: 100, integrity: 100,
    intercepted: 0, breaches: 0, score: 0, pulseCooldown: 0, nextId: 1,
    raiders: [], turrets: [], shots: [], effects: [], events: [],
    interceptors: Array.from({ length: BASE_DRONES }, (_, id) => ({ id, x: 0, y: 0, angle: id * Math.PI * 2 / BASE_DRONES, cooldown: id * 0.3 })),
  }
  positionInterceptors(world)
  spawnWave(world)
  return world
}

function cloneWorld(world: DefenseWorld): DefenseWorld {
  return {
    ...world, raiders: world.raiders.map((item) => ({ ...item })),
    interceptors: world.interceptors.map((item) => ({ ...item, ...(item.placement ? { placement: { ...item.placement, point: { ...item.placement.point } } } : {}) })),
    turrets: world.turrets.map((item) => ({ ...item })),
    shots: world.shots.map((item) => ({ ...item, origin: { ...item.origin } })),
    effects: world.effects.map((item) => ({ ...item })), events: [...world.events],
  }
}

function positionInterceptors(world: DefenseWorld) {
  for (const unit of world.interceptors) {
    if (unit.placement) {
      const zone = DRONE_ZONES.find((item) => item.id === unit.placement!.zone)!
      const phase = (world.time - unit.placement.time) * 0.8
      const amplitude = Math.min(12, Math.max(0, zone.radius - distance(unit.placement.point, zone)) / 2)
      unit.x = unit.placement.point.x + Math.sin(phase) * amplitude
      unit.y = unit.placement.point.y + (Math.cos(phase) - 1) * amplitude * 0.4
      unit.angle = phase + Math.PI / 2
      continue
    }
    const orbit = world.time * 0.38 + unit.id * Math.PI * 2 / BASE_DRONES
    unit.x = DEFENSE_CORE.x + Math.cos(orbit) * 160
    unit.y = DEFENSE_CORE.y + Math.sin(orbit) * 90
    unit.angle = orbit + Math.PI / 2
  }
}

/** Deployments are immediate even while paused; combat still uses simulated time. */
export function placeDefenseDrone(world: DefenseWorld, zoneId: string, point?: Point): DefenseWorld {
  const zone = DRONE_ZONES.find((item) => item.id === zoneId)
  const position = point ?? zone
  if (world.phase !== 'active' || world.interceptors.length >= BASE_DRONES + MAX_EXTRA_DRONES || !zone || !position || !Number.isFinite(position.x) || !Number.isFinite(position.y) || distance(position, zone) > zone.radius + 1e-7) return world
  if (world.interceptors.some((unit) => unit.placement && distance(unit.placement.point, position) < DRONE_CLEARANCE)) return world
  const next = cloneWorld(world)
  const id = next.interceptors.length
  next.interceptors.push({ id, x: position.x, y: position.y, angle: 0, cooldown: 0.2, placement: { zone: zone.id, point: { x: position.x, y: position.y }, time: next.time } })
  record(next, `Drone placed / ${zone.name}`, 'cyan')
  return next
}

export function placeDefenseTurret(world: DefenseWorld, siteId: string): DefenseWorld {
  const site = ROOF_SITES.find((item) => item.id === siteId)
  if (world.phase !== 'active' || !site || world.turrets.length >= MAX_TURRETS || world.turrets.some((item) => item.site === siteId)) return world
  const next = cloneWorld(world)
  next.turrets.push({ site: siteId, x: site.x, y: site.y, angle: Math.atan2(DEFENSE_CORE.y - site.y, DEFENSE_CORE.x - site.x), cooldown: 0, flash: 0 })
  record(next, `${site.code} / ${site.name} auto-gun online`, 'lime')
  return next
}

function destroyRaider(world: DefenseWorld, raider: Raider) {
  world.intercepted += 1
  world.score += raider.armored ? 180 : 100
  effect(world, raider, 'hit')
  record(world, `${raider.armored ? 'Armored' : 'Raider'} drone neutralized / +${raider.armored ? 180 : 100}`, 'cyan')
}

function tick(world: DefenseWorld) {
  world.time += DEFENSE_STEP
  const remainingCooldown = world.pulseCooldown - DEFENSE_STEP
  world.pulseCooldown = remainingCooldown <= 1e-7 ? 0 : remainingCooldown
  world.shield = Math.min(100, world.shield + DEFENSE_STEP * 1.5)
  world.effects = world.effects.filter((item) => (item.age += DEFENSE_STEP) < item.life)
  positionInterceptors(world)

  for (const raider of world.raiders) {
    const d = distance(raider, DEFENSE_CORE)
    raider.angle = Math.atan2(DEFENSE_CORE.y - raider.y, DEFENSE_CORE.x - raider.x)
    const movement = Math.min(d, raider.speed * DEFENSE_STEP)
    raider.x += Math.cos(raider.angle) * movement
    raider.y += Math.sin(raider.angle) * movement
    if (distance(raider, DEFENSE_CORE) < 65) {
      const damage = raider.armored ? 34 : 22
      const coreDamage = Math.max(0, damage - world.shield)
      world.integrity = Math.max(0, world.integrity - coreDamage)
      world.shield = Math.max(0, world.shield - damage)
      world.breaches += 1
      raider.hp = 0
      effect(world, raider, 'breach')
      record(world, coreDamage > 0 ? 'Citadel hit / tower integrity reduced' : 'Perimeter breach / shield absorbed impact', 'coral')
    }
  }
  world.raiders = world.raiders.filter((item) => item.hp > 0)

  for (const unit of world.interceptors) {
    unit.cooldown = Math.max(0, unit.cooldown - DEFENSE_STEP)
    const target = [...world.raiders].sort((a, b) => distance(a, DEFENSE_CORE) - distance(b, DEFENSE_CORE))
      .find((item) => distance(unit, item) < 275)
    if (target) unit.angle = Math.atan2(target.y - unit.y, target.x - unit.x)
    if (target && unit.cooldown <= 0) {
      unit.cooldown = 0.94
      world.shots.push({ id: world.nextId++, x: unit.x, y: unit.y, origin: { x: unit.x, y: unit.y }, target: target.id, age: 0, kind: 'drone' })
    }
  }

  for (const gun of world.turrets) {
    gun.cooldown = Math.max(0, gun.cooldown - DEFENSE_STEP)
    gun.flash = Math.max(0, gun.flash - DEFENSE_STEP)
    const target = [...world.raiders].sort((a, b) => distance(a, DEFENSE_CORE) - distance(b, DEFENSE_CORE))
      .find((item) => distance(gun, item) < 290)
    if (target) gun.angle = Math.atan2(target.y - gun.y, target.x - gun.x)
    if (target && gun.cooldown <= 0) {
      gun.cooldown = 0.38
      gun.flash = 0.12
      const muzzle = { x: gun.x + Math.cos(gun.angle) * 20, y: gun.y - 8 + Math.sin(gun.angle) * 20 }
      world.shots.push({ id: world.nextId++, ...muzzle, origin: { ...muzzle }, target: target.id, age: 0, kind: 'turret' })
    }
  }

  for (const shot of world.shots) {
    shot.age += DEFENSE_STEP
    const target = world.raiders.find((item) => item.id === shot.target && item.hp > 0)
    if (!target) { shot.age = 3; continue }
    const d = distance(shot, target)
    const movement = Math.min(d, (shot.kind === 'turret' ? 620 : 440) * DEFENSE_STEP)
    shot.x += (target.x - shot.x) / Math.max(d, 0.001) * movement
    shot.y += (target.y - shot.y) / Math.max(d, 0.001) * movement
    if (distance(shot, target) < 9) {
      target.hp -= 1
      shot.age = 3
      if (target.hp <= 0) destroyRaider(world, target)
      else effect(world, target, 'hit')
    }
  }
  world.shots = world.shots.filter((item) => item.age < 2)
  world.raiders = world.raiders.filter((item) => item.hp > 0)

  if (world.integrity <= 0) {
    world.phase = 'lost'
    record(world, 'Core offline / restart the defense drill', 'coral')
  } else if (world.time - world.waveStarted >= 11 && world.wave < DEFENSE_WAVES) {
    world.wave += 1
    spawnWave(world)
  } else if (world.wave === DEFENSE_WAVES && world.raiders.length === 0) {
    world.phase = 'secured'
    world.shots = []
    record(world, 'All five waves repelled / Civic Core secured', 'lime')
  }
}

/** Fixed 30Hz model, independent of rendering; large gaps never trigger a catch-up storm. */
export function advanceDefense(world: DefenseWorld, seconds: number): DefenseWorld {
  if (world.phase !== 'active' || !Number.isFinite(seconds) || seconds <= 0) return world
  const next = cloneWorld(world)
  next.remainder += Math.min(seconds, 5)
  while (next.remainder + 1e-9 >= DEFENSE_STEP && next.phase === 'active') {
    next.remainder -= DEFENSE_STEP
    tick(next)
  }
  return next
}

export function pulseDefense(world: DefenseWorld): DefenseWorld {
  if (world.phase !== 'active' || world.pulseCooldown > 0) return world
  const next = cloneWorld(world)
  next.pulseCooldown = PULSE_COOLDOWN
  effect(next, DEFENSE_CORE, 'pulse')
  for (const raider of next.raiders) {
    if (distance(raider, DEFENSE_CORE) <= 260) {
      raider.hp = 0
      destroyRaider(next, raider)
    }
  }
  next.raiders = next.raiders.filter((item) => item.hp > 0)
  const cleared = next.intercepted - world.intercepted
  record(next, cleared ? `EMP pulse / ${cleared} drones neutralized` : 'EMP pulse / no targets in range', 'lime')
  return next
}

export function canAnimateDefense(enabled: boolean, visible: boolean, inView: boolean, motion: boolean, paused: boolean, phase: DefenseWorld['phase']) {
  return enabled && visible && inView && motion && !paused && phase === 'active'
}

export function defenseSnapshot(world: DefenseWorld) {
  return {
    time: Math.floor(world.time + 1e-7), wave: world.wave, phase: world.phase, shield: Math.round(world.shield),
    integrity: Math.round(world.integrity), intercepted: world.intercepted, breaches: world.breaches,
    score: world.score, threats: world.raiders.length, pulseCooldown: Math.max(0, Math.ceil(world.pulseCooldown - 1e-7)), events: world.events,
    drones: world.interceptors.length, extraDrones: world.interceptors.length - BASE_DRONES, turretSites: world.turrets.map((item) => item.site),
    available: { drone: Math.max(0, MAX_EXTRA_DRONES - (world.interceptors.length - BASE_DRONES)), tower: Math.max(0, MAX_TURRETS - world.turrets.length) },
  }
}
