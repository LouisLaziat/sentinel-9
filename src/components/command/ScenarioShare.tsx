import { useMemo, useRef, useState } from 'react'
import { createScenarioLink } from '../../lib/scenario-sharing'
import { getResponseScore, getScenario, responseUnits } from '../../lib/simulation'
import type { SimulationState } from '../../lib/simulation'
import { CloseIcon, LinkIcon, ShieldIcon } from '../ui/Icons'
import { Modal } from '../ui/Modal'

export function ScenarioShare({ simulation, onClose }: { simulation: SimulationState; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'manual'>('ready')
  const url = useMemo(() => createScenarioLink(window.location.href, simulation), [simulation])
  const scenario = getScenario(simulation.scenarioId)
  const assigned = responseUnits.filter((unit) => simulation.assignedUnitIds.includes(unit.id))
  const score = getResponseScore(simulation)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
    } catch {
      inputRef.current?.focus()
      inputRef.current?.select()
      setCopyState('manual')
    }
  }

  return (
    <Modal className="scenario-share" labelledBy="scenario-share-title" describedBy="scenario-share-description" onClose={onClose}>
      <header className="uplink-dialog__header"><div><LinkIcon /><span>Scenario uplink <i /><b>READY</b></span></div><button aria-label="Close scenario sharing" onClick={onClose} type="button"><CloseIcon /></button></header>
      <div className="scenario-share__body">
        <span className="uplink-eyebrow">SEND THE SAME CHALLENGE</span><h2 id="scenario-share-title">Share the response.</h2>
        <p id="scenario-share-description">This link opens the incident with your selected team, ready for a fresh run.</p>
        <div className="scenario-share__brief">
          <div><span>{scenario.code} / {scenario.district}</span><strong>{scenario.title}</strong></div><ShieldIcon />
          <dl><div><dt>Response score</dt><dd>{score}<small> / {scenario.threshold} required</small></dd></div><div><dt>Response window</dt><dd>{scenario.deadline}s</dd></div></dl>
          <div className="scenario-share__units">{assigned.length ? assigned.map((unit) => <span key={unit.id}>{unit.id} <b>{unit.callsign}</b></span>) : <span>No units assigned</span>}</div>
        </div>
        <label className="scenario-share__link"><span>Scenario link</span><input onFocus={(event) => event.target.select()} readOnly ref={inputRef} value={url} /></label>
        <button className="scenario-share__copy" onClick={copyLink} type="button"><LinkIcon />{copyState === 'copied' ? 'Link copied' : 'Copy scenario link'}</button>
        <p className="scenario-share__feedback" role="status">{copyState === 'copied' ? 'Copied. Paste the link anywhere you want to share this scenario.' : copyState === 'manual' ? 'Automatic copy is unavailable. The link is selected—press Ctrl+C or ⌘C to copy.' : 'The link contains only the incident and response team.'}</p>
      </div>
    </Modal>
  )
}
