import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { localeFromPath, localeHref } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'
import { LocaleContext } from '../../lib/locale-context'
import { project } from '../../lib/project'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(() => localeFromPath(window.location.pathname, import.meta.env.BASE_URL))
  const changeLocale = useCallback((next: Locale) => {
    if (next === locale) return
    window.history.pushState(null, '', localeHref(next, import.meta.env.BASE_URL, window.location.search, window.location.hash))
    setLocale(next)
  }, [locale])

  useEffect(() => {
    const onPopState = () => setLocale(localeFromPath(window.location.pathname, import.meta.env.BASE_URL))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    const title = locale === 'fr' ? 'SENTINEL//9 — Réseau autonome de défense urbaine' : 'SENTINEL//9 — Autonomous Megacity Defense Network'
    const description = locale === 'fr' ? 'Un centre de commande cyberpunk par Louis Ho : défense urbaine interactive, drones configurables et simulations de réponse aux menaces.' : 'A cinematic cyberpunk command center by Louis Ho. Inspect a megacity, configure autonomous drones, and simulate threat responses in a browser-local React + TypeScript demo.'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    for (const property of ['og:title', 'twitter:title']) document.querySelector(`meta[property="${property}"], meta[name="${property}"]`)?.setAttribute('content', title)
    for (const property of ['og:description', 'twitter:description']) document.querySelector(`meta[property="${property}"], meta[name="${property}"]`)?.setAttribute('content', description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale === 'fr' ? 'fr_FR' : 'en_US')
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', locale === 'fr' ? 'Interface cyberpunk SENTINEL//9 avec le titre Decisions (en anglais) et un signal réseau cyan.' : 'SENTINEL//9 cyberpunk interface with its Decisions title and cyan autonomous network signal.')
    const canonical = `${project.demoUrl}${locale === 'fr' ? 'fr/' : ''}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
  }, [locale])

  return <LocaleContext.Provider value={{ locale, changeLocale }}>{children}</LocaleContext.Provider>
}
