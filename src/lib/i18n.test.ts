import { createElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Localize } from '../components/i18n/Localize'
import french from '../locales/fr.json'
import { LocaleContext } from './locale-context'
import { localeFromPath, localeHref, translateText } from './i18n'

describe('explicit language routes', () => {
  it('keeps English as the default', () => {
    for (const path of ['/', '/en', '/fr-other', '/fr/unknown', '/FR']) expect(localeFromPath(path)).toBe('en')
  })
  it('recognizes both French directory forms', () => {
    expect(localeFromPath('/fr')).toBe('fr')
    expect(localeFromPath('/fr/')).toBe('fr')
  })
  it('supports the GitHub Pages repository prefix', () => {
    expect(localeFromPath('/sentinel-9/fr', '/sentinel-9/')).toBe('fr')
    expect(localeFromPath('/sentinel-9/fr/', '/sentinel-9/')).toBe('fr')
    expect(localeFromPath('/fr', '/sentinel-9/')).toBe('en')
    expect(localeFromPath('/sentinel-9/', '/sentinel-9/')).toBe('en')
  })
  it('preserves scenario queries and section hashes when switching', () => {
    expect(localeHref('fr', '/', '?scenario=s9-v1', '#command')).toBe('/fr?scenario=s9-v1#command')
    expect(localeHref('en', '/sentinel-9/', '?scenario=s9-v1', '#command')).toBe('/sentinel-9/?scenario=s9-v1#command')
    expect(localeHref('fr', '/sentinel-9/')).toBe('/sentinel-9/fr')
  })
})

describe('French presentation catalog', () => {
  it('never changes English output', () => {
    for (const key of Object.keys(french)) expect(translateText(key, 'en')).toBe(key)
  })
  it('translates all six workspace labels', () => {
    expect(['Operations', 'Fleet', 'Simulation', 'Situation', 'Signals', 'Systems'].map((label) => translateText(label, 'fr'))).toEqual(['Opérations', 'Flotte', 'Simulation', 'Situation', 'Signaux', 'Systèmes'])
  })
  it('preserves surrounding whitespace and uppercase display styles', () => {
    expect(translateText('  Choose your defender\n', 'fr')).toBe('  Choisissez votre défenseur\n')
    expect(translateText('SHIELD', 'fr')).toBe('BOUCLIER')
  })
  it('localizes dynamic defender placement labels', () => {
    expect(translateText('Click a glowing building on the map', 'fr')).toBe('Cliquez sur un bâtiment lumineux de la carte')
    expect(translateText('Click anywhere inside a glowing circle on the map', 'fr')).toBe('Cliquez où vous voulez dans un cercle lumineux de la carte')
    expect(translateText('Place automatic tower on Building 19', 'fr')).toBe('Placer une tour automatique sur Bâtiment 19')
    expect(translateText('City defense battlefield: 4 drones and 1 automatic towers. Choose a defender card to reveal its placement zones.', 'fr')).toBe('Champ de bataille : 4 drones et 1 tour automatique. Choisissez une carte pour afficher les emplacements.')
    expect(translateText('DR-09 / Recon / rapid response', 'fr')).toBe('DR-09 / Reconnaissance / intervention rapide')
  })
  it('handles singular reserves and alert counts', () => {
    expect(translateText('1 available', 'fr')).toBe('1 disponible')
    expect(translateText('1 open alerts', 'fr')).toBe('1 alerte ouverte')
    expect(translateText('3 available', 'fr')).toBe('3 disponibles')
  })
  it('formats English decimal and score values for French', () => {
    expect(translateText('99.8', 'fr')).toBe('99,8')
    expect(translateText('94.7%', 'fr')).toBe('94,7%')
    expect(translateText('40 enemies stopped / 4,800 points', 'fr')).toBe(`40 ennemis arrêtés / ${Number(4800).toLocaleString('fr-FR')} points`)
  })
  it('leaves unknown names, identifiers, and codes intact', () => {
    for (const text of ['SENTINEL//9', 'Louis Ho', 'S9-OMEGA', 'C-12', '00:49', '#58E8FF']) expect(translateText(text, 'fr')).toBe(text)
  })
  it('keeps every catalog entry nonempty and preserves template slots', () => {
    for (const [source, translation] of Object.entries(french)) {
      expect(translation.trim(), source).not.toBe('')
      expect([...(translation.match(/\{\d+\}/g) ?? [])].sort(), source).toEqual([...(source.match(/\{\d+\}/g) ?? [])].sort())
    }
  })
})

function render(locale: 'en' | 'fr') {
  return renderToStaticMarkup(createElement(LocaleContext.Provider, { value: { locale, changeLocale: () => undefined } },
    createElement(Localize, null,
      createElement('section', { id: 'defense', className: 'Choose your defender' },
        createElement('button', { 'aria-label': 'Choose a drone', title: 'Choose your defender' }, 'Choose your defender'),
        createElement('input', { placeholder: 'Choose your defender', value: 'Drone', readOnly: true }),
        createElement('a', { href: '/fr?scenario=Drone#command' }, 'Source code'),
        createElement('p', null, 3, ' available'),
      ),
    ),
  ))
}

function KeyProbe({ children }: { children?: ReactNode }) {
  const keys = Array.isArray(children) ? children.map((child) => isValidElement(child) ? child.key : null) : []
  return createElement('pre', null, JSON.stringify(keys))
}

function renderKeys(locale: 'en' | 'fr') {
  return renderToStaticMarkup(createElement(LocaleContext.Provider, { value: { locale, changeLocale: () => undefined } },
    createElement(Localize, null, createElement(KeyProbe, null,
      createElement('span', null, 'Drone'),
      createElement('span', { key: 'tower' }, 'Automatic tower'),
    )),
  ))
}

describe('React presentation localization', () => {
  it('translates visible text, placeholders, and accessible names', () => {
    const html = render('fr')
    expect(html).toContain('aria-label="Choisir un drone"')
    expect(html).toContain('placeholder="Choisissez votre défenseur"')
    expect(html).toContain('title="Choisissez votre défenseur"')
    expect(html).toContain('3 disponibles')
  })
  it('never translates behavioral props, IDs, classes, controlled values or URLs', () => {
    const html = render('fr')
    expect(html).toContain('id="defense"')
    expect(html).toContain('class="Choose your defender"')
    expect(html).toContain('value="Drone"')
    expect(html).toContain('href="/fr?scenario=Drone#command"')
    expect(renderKeys('fr')).toBe(renderKeys('en'))
  })
  it('renders original English without a French fallback', () => {
    expect(render('en')).toContain('aria-label="Choose a drone"')
    expect(render('en')).toContain('3 available')
  })
})
