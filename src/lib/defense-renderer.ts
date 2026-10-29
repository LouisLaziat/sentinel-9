import { DEFENSE_CORE, DEFENSE_SIZE, MAX_TURRETS } from './defense'
import type { DefenseTurret, DefenseUnitKind, DefenseWorld, Point } from './defense'
import { DEFENSE_BUILDINGS, ROOF_SITES } from './defense-city'
import { translateText } from './i18n'
import type { Locale } from './i18n'

const cyan = '#58e8ff'
const coral = '#ff5e6c'
const lime = '#a3ff12'

function polygon(ctx: CanvasRenderingContext2D, points: number[][], fill: string, stroke?: string) {
  ctx.beginPath()
  points.forEach(([x, y], i) => i ? ctx.lineTo(x!, y!) : ctx.moveTo(x!, y!))
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke() }
}

function block(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, accent = cyan) {
  const depth = width * 0.42
  polygon(ctx, [[x - width, y], [x, y + depth], [x, y + depth - height], [x - width, y - height]], '#0b1b29', '#23445b')
  polygon(ctx, [[x, y + depth], [x + width, y], [x + width, y - height], [x, y + depth - height]], '#070e1b', '#1d3447')
  polygon(ctx, [[x - width, y - height], [x, y - depth - height], [x + width, y - height], [x, y + depth - height]], '#142b40', '#34546b')
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.55
  for (let row = 13; row < height - 4; row += 13) {
    ctx.beginPath()
    ctx.moveTo(x - width + 7, y - row)
    ctx.lineTo(x - 7, y + depth - row - 3)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

export function drawDefenseBackdrop(ctx: CanvasRenderingContext2D, locale: Locale = 'en') {
  const { width, height } = DEFENSE_SIZE
  ctx.fillStyle = '#050b14'
  ctx.fillRect(0, 0, width, height)
  const atmosphere = ctx.createRadialGradient(480, 295, 20, 480, 300, 500)
  atmosphere.addColorStop(0, '#133b4b')
  atmosphere.addColorStop(0.5, '#091728')
  atmosphere.addColorStop(1, '#040810')
  ctx.fillStyle = atmosphere
  ctx.fillRect(0, 0, width, height)
  ctx.lineWidth = 0.6
  ctx.strokeStyle = '#58e8ff17'
  for (let i = -600; i < 1300; i += 44) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 1100, height); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(i, height); ctx.lineTo(i + 1100, 0); ctx.stroke()
  }
  // Raised city blocks and lit transit corridors form a code-native isometric scene.
  ctx.lineWidth = 1
  for (const [x, y, w, h] of DEFENSE_BUILDINGS) block(ctx, x, y, w, h, x > 600 ? '#9b7bff' : cyan)

  for (const site of ROOF_SITES) {
    polygon(ctx, [[site.x - 13, site.y], [site.x, site.y - 6], [site.x + 13, site.y], [site.x, site.y + 6]], '#162d22', '#a3ff1255')
  }

  ctx.strokeStyle = '#58e8ff32'
  ctx.lineWidth = 2
  for (const points of [[[200, 280], [305, 325], [305, 430]], [[735, 310], [650, 350], [650, 470]], [[350, 95], [350, 160], [420, 195]]]) {
    ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x!, y!) : ctx.moveTo(x!, y!)); ctx.stroke()
  }
  ctx.strokeStyle = '#58e8ff23'
  ctx.setLineDash([3, 9])
  for (const radius of [120, 230, 340]) {
    ctx.beginPath(); ctx.ellipse(480, 338, radius, radius * 0.58, 0, 0, Math.PI * 2); ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillStyle = '#80a3b4'
  ctx.fillText(translateText('NEON WARD / W-03', locale), 59, 80)
  ctx.fillText('ASHFALL / N-07', 733, 75)
  ctx.fillText(translateText('LOWER ARC / S-04', locale), 62, 531)
  ctx.fillText(translateText('MERIDIAN / E-09', locale), 754, 539)
}

function drone(ctx: CanvasRenderingContext2D, point: Point, angle: number, hostile: boolean, armored = false) {
  const color = hostile ? coral : cyan
  ctx.save()
  ctx.translate(point.x, point.y)
  ctx.rotate(angle)
  ctx.shadowBlur = hostile ? 12 : 16
  ctx.shadowColor = color
  ctx.lineWidth = 1.2
  polygon(ctx, [[17, 0], [1, -5], [-11, -14], [-7, -3], [-13, 0], [-7, 3], [-11, 14], [1, 5]], hostile ? '#331523' : '#133747', color)
  ctx.fillStyle = armored ? '#ffbd5a' : color
  ctx.fillRect(0, -1.5, 8, 3)
  ctx.shadowBlur = 0
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.4
  ctx.beginPath(); ctx.moveTo(-16, -6); ctx.lineTo(-30, -6); ctx.moveTo(-16, 6); ctx.lineTo(-30, 6); ctx.stroke()
  ctx.restore()
}

function turret(ctx: CanvasRenderingContext2D, gun: DefenseTurret, calm: boolean) {
  ctx.save()
  ctx.lineWidth = 1.5
  polygon(ctx, [[gun.x - 17, gun.y], [gun.x, gun.y - 9], [gun.x + 17, gun.y], [gun.x, gun.y + 9]], '#183728', lime)
  ctx.translate(gun.x, gun.y - 8)
  ctx.rotate(gun.angle)
  ctx.shadowColor = lime
  ctx.shadowBlur = 9
  ctx.fillStyle = '#254434'
  ctx.strokeStyle = lime
  ctx.fillRect(-9, -7, 16, 14)
  ctx.strokeRect(-9, -7, 16, 14)
  ctx.fillStyle = '#b3dc9a'
  ctx.fillRect(6, -5, 17, 3)
  ctx.fillRect(6, 2, 17, 3)
  ctx.fillStyle = lime
  ctx.fillRect(-5, -2, 7, 4)
  if (gun.flash > 0 && !calm) {
    polygon(ctx, [[23, -7], [31, -3], [27, 0], [34, 3], [23, 7], [25, 0]], '#e4ffa9')
  }
  ctx.restore()
  ctx.fillStyle = '#a3ff1299'
  ctx.font = '9px ui-monospace, monospace'
  ctx.fillText(ROOF_SITES.find((site) => site.id === gun.site)?.code ?? '', gun.x - 14, gun.y + 23)
}

function highlightBuildings(ctx: CanvasRenderingContext2D, world: DefenseWorld) {
  ctx.save()
  ctx.lineWidth = 2
  ctx.shadowColor = lime
  ctx.shadowBlur = 16
  for (const site of ROOF_SITES) {
    if (world.turrets.some((gun) => gun.site === site.id)) continue
    const [x, y, width, height] = DEFENSE_BUILDINGS[site.building]!
    const depth = width * 0.42
    polygon(ctx, [[x - width, y], [x, y + depth], [x + width, y], [x + width, y - height], [x, y - depth - height], [x - width, y - height]], '#a3ff121c', lime)
    polygon(ctx, [[x - width, y - height], [x, y - depth - height], [x + width, y - height], [x, y + depth - height]], '#a3ff1238', lime)
  }
  ctx.restore()
}
function tower(ctx: CanvasRenderingContext2D, world: DefenseWorld, calm: boolean, locale: Locale) {
  const { x, y } = DEFENSE_CORE
  ctx.save()
  const color = world.phase === 'lost' ? coral : cyan
  ctx.lineWidth = 1.2
  const ground = ctx.createRadialGradient(x, y + 36, 12, x, y + 36, 120)
  ground.addColorStop(0, '#58e8ff38'); ground.addColorStop(1, '#58e8ff00')
  ctx.fillStyle = ground
  ctx.beginPath(); ctx.ellipse(x, y + 38, 128, 66, 0, 0, Math.PI * 2); ctx.fill()
  block(ctx, x, y + 60, 75, 19, color)
  block(ctx, x, y + 40, 48, 68, color)
  block(ctx, x, y + 15, 28, 150, color)
  ctx.shadowColor = color
  ctx.shadowBlur = 20
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(x, y - 151); ctx.lineTo(x, y - 193); ctx.stroke()
  polygon(ctx, [[x, y - 174], [x + 13, y - 161], [x, y - 148], [x - 13, y - 161]], '#114756', color)
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
  ctx.fillStyle = '#c8f9ff'
  ctx.font = 'bold 11px ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.fillText(translateText('S9 / CITADEL', locale), x, y + 103)

  if (world.shield > 0 && world.phase !== 'lost') {
    const breath = calm ? 0.3 : 0.27 + Math.sin(world.time * 1.7) * 0.04
    ctx.globalAlpha = breath * Math.max(0.25, world.shield / 100)
    const shield = ctx.createRadialGradient(x, y - 30, 20, x, y - 30, 133)
    shield.addColorStop(0, '#58e8ff00'); shield.addColorStop(0.8, '#58e8ff12'); shield.addColorStop(1, '#58e8ffb0')
    ctx.fillStyle = shield
    ctx.beginPath(); ctx.ellipse(x, y - 10, 122, 149, 0, Math.PI, Math.PI * 2); ctx.lineTo(x + 122, y + 40); ctx.ellipse(x, y + 40, 122, 54, 0, 0, Math.PI); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 0.6
    ctx.strokeStyle = color
    ctx.beginPath(); ctx.ellipse(x, y + 40, 122, 54, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([6, 8])
    ctx.lineDashOffset = calm ? 0 : -world.time * 12
    ctx.beginPath(); ctx.ellipse(x, y + 40, 138, 61, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])
  }
  ctx.restore()
}

export function drawDefense(ctx: CanvasRenderingContext2D, world: DefenseWorld, backdrop: HTMLCanvasElement, calm: boolean, placement: DefenseUnitKind | null = null, locale: Locale = 'en') {
  ctx.clearRect(0, 0, DEFENSE_SIZE.width, DEFENSE_SIZE.height)
  ctx.drawImage(backdrop, 0, 0, DEFENSE_SIZE.width, DEFENSE_SIZE.height)
  ctx.save()
  ctx.lineWidth = 0.6
  ctx.setLineDash([3, 8])
  ctx.strokeStyle = '#ff5e6c25'
  for (const raider of world.raiders) {
    ctx.beginPath(); ctx.moveTo(raider.x, raider.y); ctx.lineTo(DEFENSE_CORE.x, DEFENSE_CORE.y); ctx.stroke()
  }
  ctx.restore()
  if (placement === 'tower' && world.phase === 'active' && world.turrets.length < MAX_TURRETS) highlightBuildings(ctx, world)
  tower(ctx, world, calm, locale)
  for (const gun of world.turrets) turret(ctx, gun, calm)

  for (const shot of world.shots) {
    const angle = Math.atan2(shot.y - shot.origin.y, shot.x - shot.origin.x)
    const color = shot.kind === 'turret' ? lime : cyan
    const length = shot.kind === 'turret' ? 10 : 17
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = shot.kind === 'turret' ? 2 : 2.5; ctx.shadowColor = color; ctx.shadowBlur = 13
    ctx.beginPath(); ctx.moveTo(shot.x - Math.cos(angle) * length, shot.y - Math.sin(angle) * length); ctx.lineTo(shot.x, shot.y); ctx.stroke(); ctx.restore()
  }
  for (const unit of world.interceptors) {
    drone(ctx, unit, unit.angle, false)
    ctx.fillStyle = '#9edee8'; ctx.font = '9px ui-monospace, monospace'; ctx.fillText(`S9-${String(unit.id + 1).padStart(2, '0')}`, unit.x + 18, unit.y + 20)
  }
  for (const raider of world.raiders) {
    drone(ctx, raider, raider.angle, true, raider.armored)
    ctx.fillStyle = '#ff5e6c30'; ctx.fillRect(raider.x - 13, raider.y + 20, 26, 2)
    ctx.fillStyle = raider.armored ? '#ffbd5a' : coral
    ctx.fillRect(raider.x - 13, raider.y + 20, 26 * raider.hp / (raider.armored ? 3 : 2), 2)
  }
  for (const item of world.effects) {
    const progress = item.age / item.life
    ctx.save()
    ctx.globalAlpha = Math.max(0, 1 - progress)
    ctx.strokeStyle = item.kind === 'breach' ? coral : item.kind === 'pulse' ? lime : cyan
    ctx.lineWidth = item.kind === 'pulse' ? 2 : 1.3
    ctx.beginPath(); ctx.ellipse(item.x, item.y, item.kind === 'pulse' ? 20 + progress * 265 : 5 + progress * 28, item.kind === 'pulse' ? 10 + progress * 160 : 5 + progress * 20, 0, 0, Math.PI * 2); ctx.stroke()
    if (item.kind !== 'pulse') {
      for (let i = 0; i < 7; i++) {
        const angle = i * Math.PI * 2 / 7 + item.seed
        const radius = 8 + progress * 36
        ctx.beginPath(); ctx.moveTo(item.x + Math.cos(angle) * radius, item.y + Math.sin(angle) * radius)
        ctx.lineTo(item.x + Math.cos(angle) * (radius + 5), item.y + Math.sin(angle) * (radius + 5)); ctx.stroke()
      }
    }
    ctx.restore()
  }
}
