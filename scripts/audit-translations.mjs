import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const phrases = new Set()
const attributes = new Set(['aria-label', 'aria-description', 'alt', 'title', 'placeholder', 'label', 'description', 'eyebrow', 'meta', 'change'])
const properties = new Set(['label', 'title', 'detail', 'description', 'message', 'text', 'name', 'phase', 'classification', 'requirement', 'role', 'task', 'status', 'state', 'assignment', 'location', 'range', 'note'])
const normalize = (text) => text.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
function add(value) { const text = normalize(value); if (/[a-zA-Z]{2}/.test(text) && !/^[.#/]?[-a-z]+(?:[-/#][a-z\d]+)+$/.test(text)) phrases.add(text) }
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) { if (!['locales', 'i18n'].includes(entry.name)) await scan(file); continue }
    if (!/\.tsx?$/.test(entry.name) || /\.test\./.test(entry.name) || /(?:Icons|i18n|locale-context)\.tsx?$/.test(entry.name)) continue
    const source = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true)
    function visit(node) {
      if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
        let parts = [], slot = 0
        const flush = () => { if (parts.some((part) => /[a-zA-Z]{2}/.test(part.replace(/\{\d+\}/g, '')))) add(parts.join('')); parts = []; slot = 0 }
        for (const child of node.children) {
          if (ts.isJsxText(child)) parts.push(child.text)
          else if (ts.isJsxExpression(child) && child.expression && !ts.isJsxElement(child.expression) && !ts.isJsxSelfClosingElement(child.expression) && !ts.isConditionalExpression(child.expression) && !ts.isBinaryExpression(child.expression)) parts.push(`{${slot++}}`)
          else flush()
        }
        flush()
      }
      if (ts.isJsxText(node)) add(node.text)
      else if (ts.isJsxAttribute(node) && attributes.has(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) add(node.initializer.text)
      else if (ts.isPropertyAssignment(node) && properties.has(node.name.getText(source).replace(/['"]/g, '')) && ts.isStringLiteralLike(node.initializer)) add(node.initializer.text)
      else if (ts.isTemplateExpression(node)) {
        let text = node.head.text
        node.templateSpans.forEach((span, index) => { text += `{${index}}${span.literal.text}` })
        if (/\s/.test(text) && !/[<>]|--|(?:rgba|translate|width:)/.test(text)) add(text)
      } else if (ts.isStringLiteralLike(node) && ts.isConditionalExpression(node.parent)) add(node.text)
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
}
await scan(path.join(root, 'src'))
const catalog = JSON.parse(await readFile(path.join(root, 'src/locales/fr.json'), 'utf8'))
const keys = new Set(Object.keys(catalog).map((key) => normalize(key).toLowerCase()))
const missing = [...phrases].filter((text) => !keys.has(text.toLowerCase())).sort()
console.log(JSON.stringify(missing, null, 2))
console.log(`${phrases.size} source phrases; ${missing.length} uncatalogued candidates (includes intentional codes, classes, and key names; review manually).`)
