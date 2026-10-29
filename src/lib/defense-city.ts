/** Shared city geometry keeps deployment controls and rendered rooftops aligned. */
export const DEFENSE_BUILDINGS = [
  [115, 140, 22, 60], [184, 120, 28, 95], [240, 165, 20, 46], [108, 310, 27, 72],
  [166, 370, 30, 95], [220, 402, 24, 65], [272, 460, 33, 110], [346, 500, 26, 66],
  [730, 130, 25, 70], [808, 178, 33, 115], [874, 275, 23, 80], [778, 388, 31, 99],
  [695, 446, 26, 72], [628, 480, 32, 100], [537, 534, 20, 60], [429, 116, 20, 56],
  [532, 112, 22, 44], [90, 455, 24, 53], [891, 461, 28, 70],
] as const

const NAMED_ROOFS = [
  { id: 'neon', code: 'R-01', name: 'Neon Ward', building: 2 },
  { id: 'ashfall', code: 'R-02', name: 'Ashfall', building: 10 },
  { id: 'arc', code: 'R-03', name: 'Lower Arc', building: 4 },
  { id: 'meridian', code: 'R-04', name: 'Meridian', building: 12 },
]

/** Every surrounding building can host a tower; the central Citadel is excluded. */
export const ROOF_SITES = [
  ...NAMED_ROOFS,
  ...DEFENSE_BUILDINGS.flatMap((_, building) => NAMED_ROOFS.some((site) => site.building === building) ? [] : [{
    id: `roof-${building}`, code: `B-${String(building + 1).padStart(2, '0')}`,
    name: `Building ${String(building + 1).padStart(2, '0')}`, building,
  }]),
].map((site) => {
  const [x, y, , height] = DEFENSE_BUILDINGS[site.building]!
  return { ...site, x, y: y - height, width: DEFENSE_BUILDINGS[site.building]![2], height }
})

export const DRONE_ZONES = [
  { id: 'north', name: 'North air zone', x: 480, y: 135, radius: 65 },
  { id: 'east', name: 'East air zone', x: 675, y: 290, radius: 65 },
  { id: 'south', name: 'South air zone', x: 470, y: 465, radius: 65 },
  { id: 'west', name: 'West air zone', x: 285, y: 310, radius: 65 },
] as const
