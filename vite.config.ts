import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** Emit a real directory entry so direct /fr refreshes work on static GitHub Pages. */
function frenchPage(): Plugin {
  let output = ''
  return {
    name: 'sentinel-french-page', apply: 'build',
    configResolved(config) { output = path.resolve(config.root, config.build.outDir) },
    async closeBundle() {
      const html = await readFile(path.join(output, 'index.html'), 'utf8')
      const title = 'SENTINEL//9 — Réseau autonome de défense urbaine'
      const description = 'Un centre de commande cyberpunk par Louis Ho : défense urbaine interactive, drones configurables et simulations de réponse aux menaces.'
      const french = html.replace('<html lang="en">', '<html lang="fr">')
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*(")/g, `$1${description}$2`)
        .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*(")/g, `$1${title}$2`)
        .replace(/(<meta property="og:locale" content=")[^"]*(")/, '$1fr_FR$2')
        .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, '$1Interface cyberpunk SENTINEL//9 avec le titre Decisions (en anglais) et un signal réseau cyan.$2')
        .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1https://louislaziat.github.io/sentinel-9/fr/$2')
        .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1https://louislaziat.github.io/sentinel-9/fr/$2')
        .replace('SENTINEL//9 is an interactive frontend demo. Enable JavaScript to explore the command network.', 'SENTINEL//9 est une démo frontend interactive. Activez JavaScript pour explorer le centre de commande.')
      await mkdir(path.join(output, 'fr'), { recursive: true })
      await writeFile(path.join(output, 'fr/index.html'), french)
    },
  }
}

export default defineConfig({
  plugins: [react(), frenchPage()],
  base: process.env.GITHUB_ACTIONS ? '/sentinel-9/' : '/',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
