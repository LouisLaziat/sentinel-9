import french from '../locales/fr.json'

export type Locale = 'en' | 'fr'
const catalog: Record<string, string> = french
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
const exact = new Map(Object.entries(catalog).map(([key, value]) => [normalize(key).toLowerCase(), value]))
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const templates = Object.entries(catalog).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => {
  const slots: number[] = []
  const pattern = normalize(key).split(/(\{\d+\})/).map((part) => {
    const slot = /^\{(\d+)\}$/.exec(part)
    if (!slot) return escape(part)
    slots.push(Number(slot[1]))
    return '(.+?)'
  }).join('')
  return { expression: new RegExp(`^${pattern}$`, 'i'), value, slots, specificity: key.replace(/\{\d+\}/g, '').length }
}).sort((a, b) => b.specificity - a.specificity)

/** Only the explicit /fr path selects French; browser settings never override English. */
export function localeFromPath(pathname: string, base = '/'): Locale {
  const prefix = `${base.replace(/\/+$/, '')}/`
  if (!pathname.startsWith(prefix)) return 'en'
  return /^fr\/?$/.test(pathname.slice(prefix.length)) ? 'fr' : 'en'
}

export function localeHref(locale: Locale, base = '/', search = '', hash = '') {
  return `${base.replace(/\/+$/, '')}/${locale === 'fr' ? 'fr' : ''}${search}${hash}`
}

/** Presentation-only translation. IDs, actions, storage, URLs and model state stay unchanged. */
export function translateText(text: string, locale: Locale, depth = 0): string {
  if (locale === 'en' || depth > 5 || !text.trim()) return text
  const normalized = normalize(text)
  let translated = exact.get(normalized.toLowerCase())
  if (!translated) {
    for (const template of templates) {
      const match = template.expression.exec(normalized)
      if (!match) continue
      translated = template.value.replace(/\{(\d+)\}/g, (_, index: string) => {
        const capture = template.slots.indexOf(Number(index))
        return translateText(match[capture + 1] ?? '', locale, depth + 1)
      })
      break
    }
  }
  if (!translated) {
    const numeric = /^(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d+)(%| [A-Za-z]+)?$/.exec(normalized)
    if (numeric?.[1]) translated = `${Number(numeric[1].replace(/,/g, '')).toLocaleString('fr-FR', { maximumFractionDigits: 6 })}${numeric[2] ?? ''}`
    else return text
  }
  if (/^1 disponible/.test(translated)) translated = translated.replace('disponibles', 'disponible')
  if (/^1 alertes/.test(translated)) translated = translated.replace('alertes ouvertes', 'alerte ouverte')
  translated = translated.replace(/\b1 tours automatiques\b/g, '1 tour automatique').replace(/\b1 drones\b/g, '1 drone')
  if (/[a-z]/i.test(normalized) && normalized === normalized.toUpperCase()) translated = translated.toLocaleUpperCase('fr')
  return `${text.match(/^\s*/)?.[0] ?? ''}${translated}${text.match(/\s*$/)?.[0] ?? ''}`
}
