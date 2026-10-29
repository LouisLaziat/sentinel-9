import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const pages = process.argv.includes('--pages') || Boolean(process.env.GITHUB_ACTIONS)
assert(process.argv.slice(2).every((arg) => arg === '--pages'), 'Only --pages is supported.')
const read = (name) => readFile(path.join(root, name), 'utf8')
const packageInfo = JSON.parse(await read('package.json'))
const lock = JSON.parse(await read('package-lock.json'))
assert.equal(packageInfo.version, lock.version, 'Package and lockfile versions must match.')
assert.equal(packageInfo.version, lock.packages[''].version, 'Root lockfile version must match.')

const markdownFiles = ['README.md', 'CHANGELOG.md', ...(await readdir(path.join(root, 'docs'))).filter((name) => name.endsWith('.md')).map((name) => `docs/${name}`)]
let links = 0
for (const file of markdownFiles) {
  const markdown = await read(file)
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const destination = match[1]
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(destination)) continue
    const relative = decodeURIComponent(destination.split('#')[0])
    const target = path.resolve(root, path.dirname(file), relative)
    assert(!path.relative(root, target).startsWith('..'), `${file}: link escapes the repository: ${destination}`)
    await stat(target).catch(() => assert.fail(`${file}: missing link target ${destination}`))
    links += 1
  }
}

function jpegSize(bytes) {
  assert(bytes[0] === 0xff && bytes[1] === 0xd8, 'Expected a JPEG file.')
  let offset = 2
  while (offset + 9 < bytes.length) {
    assert.equal(bytes[offset], 0xff, 'Invalid JPEG marker.')
    const marker = bytes[offset + 1]
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) }
    if (marker === 0xda || marker === 0xd9) break
    offset += bytes.readUInt16BE(offset + 2) + 2
  }
  assert.fail('JPEG dimensions could not be read.')
}

const social = await readFile(path.join(root, 'public/social-preview.jpg'))
assert.deepEqual(jpegSize(social), { width: 1200, height: 630 }, 'Social preview must be 1200 × 630.')
assert(social.length < 500_000, 'Social preview must remain below 500kB.')
const screenshots = ['overview', 'operations', 'fleet', 'simulation', 'mobile', 'defense', 'defense-fr']
for (const name of screenshots) {
  const screenshot = await readFile(path.join(root, `docs/media/${name}.jpg`))
  jpegSize(screenshot)
  assert(screenshot.length < 1_000_000, `${name} screenshot must remain below 1MB.`)
}
const gif = await readFile(path.join(root, 'docs/media/command-demo.gif'))
assert(/^GIF8[79]a$/.test(gif.subarray(0, 6).toString()), 'Demo must be a valid GIF.')
assert(gif.length < 3_000_000, 'Demo GIF must remain below 3MB.')

const html = await read('dist/index.html')
assert(html.includes('og:image') && html.includes('twitter:card'), 'Built HTML must include sharing metadata.')
assert(html.includes('https://louislaziat.github.io/sentinel-9/social-preview.jpg'), 'Social URL must point at the Pages asset.')
const prefix = pages ? '/sentinel-9/' : '/'
let assets = 0
const frenchHtml = await read('dist/fr/index.html')
assert(html.includes('<html lang="en">'), 'Default entry must remain English.')
assert(frenchHtml.includes('<html lang="fr">'), 'French entry must declare its language.')
assert(frenchHtml.includes('<title>SENTINEL//9 — Réseau autonome de défense urbaine</title>'), 'French page title must be localized.')
assert(/name="description"\s+content="Un centre de commande cyberpunk par Louis Ho/.test(frenchHtml), 'French static description must be localized.')
assert(frenchHtml.includes('hreflang="x-default" href="https://louislaziat.github.io/sentinel-9/"'), 'English must remain the default alternate.')
assert(frenchHtml.includes('rel="canonical" href="https://louislaziat.github.io/sentinel-9/fr/"'), 'French canonical must include /fr/.')
assert(frenchHtml.includes('content="fr_FR"'), 'French social locale must be localized.')
assert(frenchHtml.includes('Activez JavaScript'), 'French noscript fallback must be localized.')
for (const entry of [html, frenchHtml]) {
  for (const [, reference] of entry.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#)/.test(reference)) continue
    assert(reference.startsWith(prefix), `Expected ${prefix} asset prefix: ${reference}`)
    await stat(path.join(root, 'dist', reference.slice(prefix.length))).catch(() => assert.fail(`Missing built asset: ${reference}`))
    assets += 1
  }
  assert(!entry.includes('/src/'), 'Built HTML must not reference development source.')
}
assert(assets >= 3, 'Expected entry script, stylesheet, and favicon.')
assert(!html.includes('/src/'), 'Built HTML must not reference development source.')
assert.deepEqual(jpegSize(await readFile(path.join(root, 'dist/social-preview.jpg'))), { width: 1200, height: 630 })

console.log(`Release ${packageInfo.version}: ${markdownFiles.length} documents, ${links} local links, ${screenshots.length + 2} media assets, and ${assets} build references across EN/FR entries verified (${prefix}).`)
