import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  BellIcon,
  BoltIcon,
  DroneIcon,
  GridIcon,
  RadarIcon,
  RobotIcon,
  SettingsIcon,
  ShieldIcon,
} from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

type Workspace = 'situation' | 'signals' | 'systems'

type Preferences = {
  environmentalMotion: boolean
  precisionTelemetry: boolean
  tacticalContrast: boolean
}

type Alert = {
  id: string
  sector: string
  title: string
  detail: string
  time: string
  severity: 'critical' | 'warning' | 'observe'
}

const workspaceItems = [
  { id: 'situation' as const, label: 'Situation', icon: <RadarIcon /> },
  { id: 'signals' as const, label: 'Signals', icon: <BellIcon /> },
  { id: 'systems' as const, label: 'Systems', icon: <SettingsIcon /> },
]

const alerts: Alert[] = [
  {
    id: 'TR-091',
    sector: 'Ashfall / N-07',
    title: 'Unregistered aerial signature',
    detail: 'Vector entered protected airspace below the transit ceiling.',
    time: '00:12',
    severity: 'critical',
  },
  {
    id: 'INF-204',
    sector: 'Neon Ward / E-03',
    title: 'Reactor lattice variance',
    detail: 'Thermal output is 4.8% above the predictive baseline.',
    time: '00:38',
    severity: 'warning',
  },
  {
    id: 'NET-034',
    sector: 'Civic Core / C-12',
    title: 'Packet-loss concentration',
    detail: 'Mesh reroute completed. Passive observation remains active.',
    time: '01:04',
    severity: 'observe',
  },
]

const networkNodes = [
  { id: 'DR-09', type: 'drone', x: 24, y: 31, delay: 0.2 },
  { id: 'DR-41', type: 'drone', x: 70, y: 24, delay: 0.8 },
  { id: 'GR-07', type: 'ground', x: 58, y: 68, delay: 1.4 },
  { id: 'DR-18', type: 'drone', x: 36, y: 72, delay: 1.9 },
  { id: 'NX-12', type: 'node', x: 78, y: 55, delay: 0.5 },
] as const

const districts = [
  { name: 'Civic Core', code: 'C-12', value: 99 },
  { name: 'Neon Ward', code: 'E-03', value: 96 },
  { name: 'Ashfall', code: 'N-07', value: 82 },
  { name: 'Lower Arc', code: 'S-04', value: 94 },
] as const

const defaultPreferences: Preferences = {
  environmentalMotion: true,
  precisionTelemetry: true,
  tacticalContrast: false,
}

function loadPreferences(): Preferences {
  try {
    const stored = window.localStorage.getItem('sentinel-9-preferences')
    if (!stored) return defaultPreferences

    const parsed = JSON.parse(stored) as Partial<Preferences>
    return {
      environmentalMotion: typeof parsed.environmentalMotion === 'boolean' ? parsed.environmentalMotion : true,
      precisionTelemetry: typeof parsed.precisionTelemetry === 'boolean' ? parsed.precisionTelemetry : true,
      tacticalContrast: typeof parsed.tacticalContrast === 'boolean' ? parsed.tacticalContrast : false,
    }
  } catch {
    return defaultPreferences
  }
}

function SituationWorkspace({ openAlerts }: { openAlerts: number }) {
  return (
    <div className="command-view command-view--situation">
      <div className="command-view__heading">
        <div>
          <span>Live operational picture</span>
          <h3>Metropolitan situation</h3>
        </div>
        <div className="command-view__heading-status">
          <StatusBadge tone="online" pulse>Network synchronized</StatusBadge>
          <span>REF / SIT-2039-09</span>
        </div>
      </div>

      <div className="command-metrics" aria-label="Command center metrics">
        <article><span>Fleet online</span><strong>128<small>/132</small></strong><i><b style={{ width: '97%' }} /></i></article>
        <article><span>Protected sectors</span><strong>24<small>/24</small></strong><i><b style={{ width: '100%' }} /></i></article>
        <article><span>Open signals</span><strong>{String(openAlerts).padStart(2, '0')}<small>ACTIVE</small></strong><i><b className="is-warning" style={{ width: '36%' }} /></i></article>
        <article><span>Response median</span><strong>01:42<small>MIN</small></strong><i><b style={{ width: '84%' }} /></i></article>
      </div>

      <div className="situation-layout">
        <article className="network-theater" aria-label="SENTINEL network topology">
          <div className="network-theater__topline"><span>Topology / Grid 09</span><strong>LIVE FEED</strong></div>
          <div className="network-theater__field">
            <div className="network-theater__grid" />
            <div className="network-theater__rings"><i /><i /><i /></div>
            <div className="network-theater__sweep" />
            <div className="network-theater__core"><ShieldIcon /><span>S9</span></div>
            <div className="network-theater__axis network-theater__axis--x" />
            <div className="network-theater__axis network-theater__axis--y" />
            {networkNodes.map((node) => (
              <div
                className={`network-node network-node--${node.type}`}
                key={node.id}
                style={{ '--node-x': `${node.x}%`, '--node-y': `${node.y}%`, '--node-delay': `${node.delay}s` } as CSSProperties}
              >
                <i>{node.type === 'drone' ? <DroneIcon /> : node.type === 'ground' ? <RobotIcon /> : <GridIcon />}</i>
                <span>{node.id}</span>
              </div>
            ))}
            <svg className="network-theater__routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M24 31 50 50 70 24M50 50 58 68 36 72M50 50 78 55" />
            </svg>
          </div>
          <div className="network-theater__legend">
            <span><i className="is-drone" />Aerial</span>
            <span><i className="is-ground" />Ground</span>
            <span><i className="is-node" />Relay</span>
            <strong>43.6532° N / 79.3832° W</strong>
          </div>
        </article>

        <aside className="district-panel">
          <div className="district-panel__header"><span>District integrity</span><strong>04 / ONLINE</strong></div>
          <div className="district-panel__list">
            {districts.map((district) => (
              <article key={district.code}>
                <div><span>{district.code}</span><strong>{district.name}</strong><small>{district.value}%</small></div>
                <i><b className={district.value < 90 ? 'is-warning' : ''} style={{ width: `${district.value}%` }} /></i>
              </article>
            ))}
          </div>
          <div className="district-panel__footer"><BoltIcon /><span>Predictive coverage</span><strong>97.2%</strong></div>
        </aside>
      </div>
    </div>
  )
}

function SignalsWorkspace({ acknowledged, onAcknowledge }: { acknowledged: string[]; onAcknowledge: (id: string) => void }) {
  const openAlerts = alerts.filter((alert) => !acknowledged.includes(alert.id))

  return (
    <div className="command-view command-view--signals">
      <div className="command-view__heading">
        <div><span>Network event triage</span><h3>Signal intelligence</h3></div>
        <div className="command-view__heading-status"><StatusBadge tone={openAlerts.length ? 'warning' : 'online'}>{openAlerts.length} awaiting review</StatusBadge><span>AUTO-SORT / SEVERITY</span></div>
      </div>

      <div className="signal-workspace">
        <div className="signal-queue">
          {alerts.map((alert) => {
            const isAcknowledged = acknowledged.includes(alert.id)
            return (
              <article className={`signal-event signal-event--${alert.severity}${isAcknowledged ? ' is-acknowledged' : ''}`} key={alert.id}>
                <div className="signal-event__code"><span>{alert.id}</span><i /></div>
                <div className="signal-event__body"><span>{alert.sector}</span><h4>{alert.title}</h4><p>{alert.detail}</p></div>
                <time>{alert.time}</time>
                <button disabled={isAcknowledged} onClick={() => onAcknowledge(alert.id)} type="button">{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</button>
              </article>
            )
          })}
        </div>

        <aside className="signal-analysis">
          <span className="signal-analysis__eyebrow">Signal density</span>
          <div className="signal-analysis__score"><strong>72</strong><span>/100</span><i /></div>
          <div className="signal-analysis__wave" aria-hidden="true">{[28, 44, 33, 72, 52, 86, 42, 60, 38, 76, 48, 66].map((height, index) => <i key={`${height}-${index}`} style={{ height: `${height}%` }} />)}</div>
          <p>Predictive analysis indicates a localized pattern. No city-wide escalation detected.</p>
          <dl><div><dt>Confidence</dt><dd>94.7%</dd></div><div><dt>Sources</dt><dd>38</dd></div><div><dt>Noise floor</dt><dd>−82 dB</dd></div></dl>
        </aside>
      </div>
    </div>
  )
}

function SystemsWorkspace({ preferences, onToggle }: { preferences: Preferences; onToggle: (key: keyof Preferences) => void }) {
  const preferenceItems = [
    { key: 'environmentalMotion' as const, title: 'Environmental motion', detail: 'Radar sweeps, orbital tracks, and ambient grid movement.', icon: <RadarIcon /> },
    { key: 'precisionTelemetry' as const, title: 'Precision telemetry', detail: 'Expose high-resolution diagnostic and coordinate values.', icon: <GridIcon /> },
    { key: 'tacticalContrast' as const, title: 'Tactical contrast', detail: 'Raise panel separation for high-glare environments.', icon: <ShieldIcon /> },
  ]

  return (
    <div className="command-view command-view--systems">
      <div className="command-view__heading">
        <div><span>Operator configuration</span><h3>System preferences</h3></div>
        <div className="command-view__heading-status"><StatusBadge tone="online">Profile synchronized</StatusBadge><span>OP-074 / LOCAL</span></div>
      </div>

      <div className="systems-layout">
        <div className="preference-console">
          {preferenceItems.map((item) => (
            <label className="command-preference" key={item.key}>
              <i>{item.icon}</i>
              <span><strong>{item.title}</strong><small>{item.detail}</small></span>
              <input checked={preferences[item.key]} onChange={() => onToggle(item.key)} type="checkbox" />
              <b aria-hidden="true" />
            </label>
          ))}
        </div>

        <aside className="operator-card">
          <div className="operator-card__portrait" aria-hidden="true"><span>LV</span><i /></div>
          <span>Primary operator</span>
          <h4>Lt. Vega</h4>
          <p>Command authorization / Tier 04</p>
          <dl><div><dt>Session</dt><dd>04:28:16</dd></div><div><dt>Clearance</dt><dd>S9-OMEGA</dd></div><div><dt>Channel</dt><dd>Encrypted</dd></div></dl>
          <StatusBadge tone="online" pulse>Authenticated</StatusBadge>
        </aside>
      </div>
    </div>
  )
}

export function CommandCenter() {
  const [workspace, setWorkspace] = useState<Workspace>('situation')
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('sentinel-9-preferences', JSON.stringify(preferences))
    } catch {
      // The command center still works when storage is unavailable.
    }
  }, [preferences])

  const openAlerts = alerts.length - acknowledged.length
  const clockLabel = useMemo(() => clock.toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), [clock])

  function acknowledgeAlert(id: string) {
    setAcknowledged((current) => current.includes(id) ? current : [...current, id])
  }

  function togglePreference(key: keyof Preferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className={`command-shell${preferences.environmentalMotion ? '' : ' command-shell--calm'}${preferences.tacticalContrast ? ' command-shell--contrast' : ''}`}>
      <aside className="command-sidebar">
        <div className="command-sidebar__brand"><span>S9</span><div><strong>COMMAND</strong><small>CORE / 03</small></div></div>
        <nav aria-label="Command center workspaces">
          {workspaceItems.map((item, index) => (
            <button aria-current={workspace === item.id ? 'page' : undefined} className={workspace === item.id ? 'is-active' : ''} key={item.id} onClick={() => setWorkspace(item.id)} type="button">
              <i>{item.icon}</i><span>{item.label}</span><small>0{index + 1}</small>
              {item.id === 'signals' && openAlerts > 0 && <b aria-label={`${openAlerts} open alerts`}>{openAlerts}</b>}
            </button>
          ))}
        </nav>
        <div className="command-sidebar__operator"><span>LV</span><div><strong>LT. VEGA</strong><small>OPERATOR / 074</small></div><i /></div>
      </aside>

      <div className="command-console">
        <header className="command-topbar">
          <div className="command-topbar__breadcrumb"><span>Sentinel network</span><i>/</i><strong>{workspace}</strong></div>
          <div className="command-topbar__status">
            <span className="command-topbar__clock">{clockLabel}<small>UTC−04</small></span>
            <button aria-label={`${openAlerts} open alerts. Open signal intelligence.`} className={openAlerts ? 'has-alerts' : ''} onClick={() => setWorkspace('signals')} type="button"><BellIcon /><b>{openAlerts}</b></button>
            <button aria-label="Open system preferences" className={workspace === 'systems' ? 'is-active' : ''} onClick={() => setWorkspace('systems')} type="button"><SettingsIcon /></button>
          </div>
        </header>

        <div className="command-console__viewport" key={workspace}>
          {workspace === 'situation' && <SituationWorkspace openAlerts={openAlerts} />}
          {workspace === 'signals' && <SignalsWorkspace acknowledged={acknowledged} onAcknowledge={acknowledgeAlert} />}
          {workspace === 'systems' && <SystemsWorkspace preferences={preferences} onToggle={togglePreference} />}
        </div>

        <footer className="command-statusbar">
          <span><i />S9 CORE CONNECTED</span>
          <span>UPLINK 2.8 GB/S</span>
          <span>ENCRYPTION AES-512</span>
          <strong>BUILD 00.03.00</strong>
        </footer>
      </div>
    </div>
  )
}
