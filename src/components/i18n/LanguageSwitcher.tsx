import type { MouseEvent } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { localeHref } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'

export function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale()
  function select(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    changeLocale(next)
  }
  return <nav className="language-switcher" aria-label={locale === 'fr' ? 'Langue du site' : 'Website language'}>
    <a aria-current={locale === 'en' ? 'page' : undefined} href={localeHref('en', import.meta.env.BASE_URL, window.location.search, window.location.hash)} hrefLang="en" lang="en" onClick={(event) => select(event, 'en')} title="View the English version">EN</a>
    <a aria-current={locale === 'fr' ? 'page' : undefined} href={localeHref('fr', import.meta.env.BASE_URL, window.location.search, window.location.hash)} hrefLang="fr" lang="fr" onClick={(event) => select(event, 'fr')} title="Afficher la version française">FR</a>
  </nav>
}
