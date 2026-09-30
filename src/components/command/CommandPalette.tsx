import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { searchCommands, workspaceDefinitions } from '../../lib/commands'
import type { CommandCategory, CommandEntry } from '../../lib/commands'
import { CloseIcon, CommandIcon, CrosshairIcon, GridIcon, HangarIcon, PulseIcon, SearchIcon } from '../ui/Icons'
import { Modal } from '../ui/Modal'

const categories: CommandCategory[] = ['Navigate', 'Districts', 'Units', 'Scenarios', 'Actions']
const categoryIcons = { Navigate: <CommandIcon />, Districts: <GridIcon />, Units: <HangarIcon />, Scenarios: <PulseIcon />, Actions: <CrosshairIcon /> }

type CommandPaletteProps = {
  commands: CommandEntry[]
  shortcutModifier: string
  showShortcuts: boolean
  onExecute: (entry: CommandEntry) => void
  onClose: () => void
}

export function CommandPalette({ commands, shortcutModifier, showShortcuts, onExecute, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CommandCategory>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHelpVisible, setHelpVisible] = useState(showShortcuts)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchCommands(commands, query, category), [commands, query, category])
  const selectedIndex = Math.min(activeIndex, Math.max(0, results.length - 1))
  const selected = results[selectedIndex]

  useEffect(() => {
    if (selected) document.getElementById(`result-${selected.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  function execute(entry?: CommandEntry) {
    if (entry && !entry.disabled) onExecute(entry)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(results.length ? (selectedIndex + direction + results.length) % results.length : 0)
    }
  }

  return (
    <Modal className="command-palette" describedBy="command-palette-description" initialFocus={inputRef} labelledBy="command-palette-title" onClose={onClose}>
      <header className="uplink-dialog__header">
        <div><CommandIcon /><span>Operator uplink <i /> <b>CONNECTED</b></span></div>
        <button aria-label="Close command palette" onClick={onClose} type="button"><CloseIcon /><kbd>Esc</kbd></button>
      </header>

      <div className="command-palette__intro"><span>DIRECT ACCESS / S9</span><h2 id="command-palette-title">Your next move.</h2><p id="command-palette-description">Search the network. Take command.</p></div>

      <form className="command-palette__search" onSubmit={(event) => { event.preventDefault(); execute(selected) }}>
        <SearchIcon />
        <input
          aria-activedescendant={selected ? `result-${selected.id}` : undefined}
          aria-autocomplete="list"
          aria-controls="command-palette-results"
          aria-expanded="true"
          aria-label="Search commands, units, districts, and scenarios"
          autoComplete="off"
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
          onKeyDown={handleKeyDown}
          placeholder="Try a callsign, district, or command…"
          ref={inputRef}
          role="combobox"
          spellCheck={false}
          value={query}
        />
        <span aria-hidden="true">_</span>
      </form>

      <div className="command-palette__filters" role="group" aria-label="Filter command results">
        <button aria-pressed={!category} onClick={() => { setCategory(undefined); setActiveIndex(0); inputRef.current?.focus() }} type="button">All <b>{commands.length}</b></button>
        {categories.map((item) => <button aria-pressed={category === item} key={item} onClick={() => { setCategory(item); setActiveIndex(0); inputRef.current?.focus() }} type="button">{item}</button>)}
      </div>

      {isHelpVisible && (
        <section className="command-palette__help" aria-label="Keyboard shortcuts">
          <div><strong>Keyboard shortcuts</strong><button onClick={() => setHelpVisible(false)} type="button">Hide guide</button></div>
          <dl>
            <div><dt>Command palette</dt><dd><kbd>{shortcutModifier} K</kbd><span>or</span><kbd>/</kbd></dd></div>
            <div><dt>Shortcut guide</dt><dd><kbd>?</kbd></dd></div>
            {workspaceDefinitions.map((workspace, index) => <div key={workspace.id}><dt>{workspace.label}</dt><dd><kbd>Alt {index + 1}</kbd></dd></div>)}
          </dl>
          <p>Workspace shortcuts stay inactive while you type in a field.</p>
        </section>
      )}

      <div className="command-palette__result-label"><span>{query ? 'Matching signals' : category ?? 'Available commands'}</span><strong role="status" aria-live="polite">{results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'}</strong></div>
      <ul aria-label="Command results" className="command-palette__results" id="command-palette-results" role="listbox">
        {results.map((entry, index) => (
          <li
            aria-disabled={entry.disabled || undefined}
            aria-selected={index === selectedIndex}
            className={`${index === selectedIndex ? 'is-selected' : ''}${entry.disabled ? ' is-disabled' : ''}`}
            id={`result-${entry.id}`}
            key={entry.id}
            onClick={() => execute(entry)}
            onPointerMove={() => setActiveIndex(index)}
            role="option"
          >
            <i>{categoryIcons[entry.category]}</i><span><strong>{entry.title}</strong><small>{entry.detail}</small></span>
            <em>{entry.category}</em>{entry.shortcut ? <kbd>{entry.shortcut}</kbd> : <b aria-hidden="true">↗</b>}
          </li>
        ))}
      </ul>
      {!results.length && <div className="command-palette__empty"><SearchIcon /><strong>No matching signals</strong><p>Try a unit ID like DR-41, a district name, or “share”.</p><button onClick={() => { setQuery(''); setCategory(undefined); setActiveIndex(0); inputRef.current?.focus() }} type="button">Clear search</button></div>}

      <footer className="command-palette__footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate <kbd>Enter</kbd> Execute</span><button aria-expanded={isHelpVisible} onClick={() => setHelpVisible((current) => !current)} type="button">Keyboard shortcuts <kbd>?</kbd></button></footer>
    </Modal>
  )
}
