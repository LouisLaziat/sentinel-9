export type UnitKind = 'drone' | 'ground'

export type UnitFilters = {
  drones: boolean
  ground: boolean
}

export const MAP_ZOOM_LEVELS = [1, 1.2, 1.45] as const

export function stepMapZoom(current: number, direction: 'in' | 'out'): number {
  const closestIndex = MAP_ZOOM_LEVELS.reduce((closest, level, index) => (
    Math.abs(level - current) < Math.abs(MAP_ZOOM_LEVELS[closest]! - current) ? index : closest
  ), 0)
  const nextIndex = direction === 'in'
    ? Math.min(closestIndex + 1, MAP_ZOOM_LEVELS.length - 1)
    : Math.max(closestIndex - 1, 0)

  return MAP_ZOOM_LEVELS[nextIndex]!
}

export function isUnitVisible(kind: UnitKind, filters: UnitFilters): boolean {
  return kind === 'drone' ? filters.drones : filters.ground
}
