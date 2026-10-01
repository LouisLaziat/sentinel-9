export function nextTabIndex(key: string, index: number, count: number, orientation: 'horizontal' | 'vertical') {
  if (!count) return null
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  const previous = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (key === previous) return (index - 1 + count) % count
  if (key === next) return (index + 1) % count
  return null
}

export function canRunSimulation(enabled: boolean, visible: boolean, phase: string) {
  return enabled && visible && phase === 'active'
}
