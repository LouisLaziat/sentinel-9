export function createSparkline(points: number[]) {
  const values = points.filter(Number.isFinite)
  if (!values.length) return ''
  if (values.length === 1) return '0,20 100,20'
  const min = Math.min(...values)
  const range = Math.max(...values) - min
  return values.map((value, index) => `${index / (values.length - 1) * 100},${range ? 34 - (value - min) / range * 28 : 20}`).join(' ')
}
