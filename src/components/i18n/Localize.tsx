import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { translateText } from '../../lib/i18n'
import { useLocale } from '../../hooks/useLocale'
import type { Locale } from '../../lib/i18n'

const textProps = new Set(['aria-label', 'aria-description', 'alt', 'title', 'placeholder', 'label', 'description', 'eyebrow', 'meta', 'change'])

function translateNode(node: ReactNode, locale: Locale): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') return translateText(String(node), locale)
  if (Array.isArray(node)) {
    // Canonicalize keys in BOTH languages, so switching never remounts a game.
    const result: ReactNode[] = [...node]
    for (let index = 0; index < node.length; index++) {
      const child = node[index]
      if (typeof child !== 'string' && typeof child !== 'number') continue
      let text = String(child)
      let end = index + 1
      while (end < node.length && (typeof node[end] === 'string' || typeof node[end] === 'number')) { text += String(node[end]); result[end] = null; end++ }
      result[index] = text
      index = end - 1
    }
    return Children.map(result, (child) => translateNode(child, locale))
  }
  if (!isValidElement<Record<string, unknown>>(node)) return node
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node.props)) {
    if (textProps.has(key) && typeof value === 'string') props[key] = translateText(value, locale)
    else if (key === 'children') props.children = translateNode(value as ReactNode, locale)
  }
  return cloneElement(node, props)
}

/** Localize React display text and accessible labels without touching DOM or behavior props. */
export function Localize({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  return translateNode(children, locale)
}
