import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useMediaQuery, usePageVisibility } from './hooks/useBrowserSignals'
import { loadPreferences } from './lib/preferences'
import type { PreferenceKey } from './lib/preferences'
import { WorkspaceBoundary } from './components/ui/WorkspaceBoundary'
import { BootSequence } from './components/system/BootSequence'
import { CursorGlow } from './components/system/CursorGlow'
import { Environment } from './components/system/Environment'
import { Navigation } from './components/system/Navigation'
import { Button } from './components/ui/Button'
import { HudPanel } from './components/ui/HudPanel'
import {
  ArrowUpRightIcon,
  BoltIcon,
  CrosshairIcon,
  GridIcon,
  RadarIcon,
  ShieldIcon,
} from './components/ui/Icons'
import { LoadingIndicator } from './components/ui/LoadingIndicator'
import { SectionHeading } from './components/ui/SectionHeading'
import { StatusBadge } from './components/ui/StatusBadge'
import { TelemetryCard } from './components/ui/TelemetryCard'
import { Tooltip } from './components/ui/Tooltip'

const CommandCenter = lazy(() => import('./components/command/CommandCenter').then((module) => ({ default: module.CommandCenter })))

const telemetry = [
  { label: 'Active units', value: '128', change: '+08 today', tone: 'lime' as const, points: [4, 6, 5, 9, 8, 12, 11, 16, 15, 19] },
  { label: 'Grid integrity', value: '99.8', unit: '%', change: 'Nominal', tone: 'cyan' as const, points: [18, 17, 18, 18, 16, 19, 18, 19, 20, 19] },
  { label: 'Response median', value: '01:42', change: '−12 sec', tone: 'violet' as const, points: [18, 17, 15, 16, 12, 13, 9, 10, 8, 7] },
  { label: 'Open signals', value: '03', change: '1 priority', tone: 'warning' as const, points: [5, 5, 9, 7, 13, 10, 8, 12, 9, 7] },
]

const colorTokens = [
  { name: 'Signal Lime', value: '#A3FF12', className: 'token-swatch--lime' },
  { name: 'Ion Cyan', value: '#58E8FF', className: 'token-swatch--cyan' },
  { name: 'Neural Violet', value: '#9B7BFF', className: 'token-swatch--violet' },
  { name: 'Threat Coral', value: '#FF5E6C', className: 'token-swatch--coral' },
  { name: 'Deep Field', value: '#06090D', className: 'token-swatch--field' },
]

const alerts = [
  { id: 'S-09', zone: 'Ashfall', detail: 'Thermal variance detected', tone: 'warning' as const, time: '00:12' },
  { id: 'D-41', zone: 'Neon Ward', detail: 'Patrol path completed', tone: 'online' as const, time: '00:38' },
  { id: 'G-02', zone: 'Lower Arc', detail: 'Signal interruption', tone: 'critical' as const, time: '01:04' },
]

function SignalBars() {
  return (
    <span className="signal-bars" aria-label="Signal strength: excellent">
      {[30, 52, 74, 100].map((height) => (
        <i key={height} style={{ height: `${height}%` }} />
      ))}
    </span>
  )
}

export function App() {
  const [isBooting, setIsBooting] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [preferences, setPreferences] = useState(loadPreferences)
  const [controlPreview, setControlPreview] = useState('Control preview. Real response actions are available in the command network.')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const pageVisible = usePageVisibility()
  const motionEnabled = preferences.environmentalMotion && !reducedMotion

  useEffect(() => {
    try {
      window.localStorage.setItem('sentinel-9-preferences', JSON.stringify(preferences))
    } catch {
      // Preferences work in memory when browser storage is unavailable.
    }
  }, [preferences])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.motion = motionEnabled ? 'on' : 'off'
    root.dataset.pageVisible = String(pageVisible)
    root.dataset.precision = String(preferences.precisionTelemetry)
    root.dataset.contrast = String(preferences.tacticalContrast)
    return () => {
      delete root.dataset.motion
      delete root.dataset.pageVisible
      delete root.dataset.precision
      delete root.dataset.contrast
    }
  }, [motionEnabled, pageVisible, preferences.precisionTelemetry, preferences.tacticalContrast])

  const togglePreference = useCallback((key: PreferenceKey) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }, [])

  const completeBoot = useCallback(() => {
    setHasEntered(true)
    setIsBooting(false)
    window.requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
  }, [])

  const replayBoot = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setIsBooting(true)
  }, [])

  return (
    <>
      {isBooting && <BootSequence onComplete={completeBoot} reducedMotion={!motionEnabled} visible={pageVisible} />}

      <div className="app-shell" aria-hidden={isBooting} inert={isBooting}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Environment />
      <CursorGlow enabled={motionEnabled && pageVisible} />
      <Navigation onReplay={replayBoot} />

      <main id="main-content" tabIndex={-1}>
        <section className="hero-section page-section" id="overview" aria-labelledby="hero-title" tabIndex={-1}>
          <div className="hero-section__copy">
            <div className="protocol-label">
              <span>Interface protocol</span>
              <strong>08 / Production polish</strong>
            </div>
            <h1 id="hero-title">Designed for <span className="hero-title__signal">decisions<span aria-hidden="true" className="hero-title__signal-overlay">decisions</span></span> at machine speed.</h1>
            <p className="hero-section__lede">
              A precision interface system for the operators, machines, and
              autonomous agents protecting tomorrow&apos;s megacities.
            </p>
            <div className="hero-section__actions">
              <Button href="#command" icon={<ArrowUpRightIcon />}>Open command network</Button>
              <Button href="#primitives" variant="secondary">View system</Button>
            </div>
            <div className="hero-section__footnote">
              <span>S9–DS / REV.01</span>
              <span>Human-machine interface</span>
            </div>
          </div>

          <HudPanel className="identity-panel" eyebrow="Core identity" meta="Live preview" title="Sentinel signal" tone="cyan">
            <div className="identity-sigil" aria-hidden="true">
              <div className="identity-sigil__orbit identity-sigil__orbit--outer" />
              <div className="identity-sigil__orbit identity-sigil__orbit--inner" />
              <div className="identity-sigil__sweep" />
              <div className="identity-sigil__mark"><span>S</span><i>9</i></div>
              <span className="identity-sigil__target identity-sigil__target--one" />
              <span className="identity-sigil__target identity-sigil__target--two" />
            </div>
            <div className="identity-panel__footer">
              <div><span>Uplink</span><strong>Encrypted</strong></div>
              <SignalBars />
            </div>
          </HudPanel>
        </section>

        <section className="telemetry-grid page-section" aria-label="System telemetry">
          {telemetry.map((item) => <TelemetryCard key={item.label} {...item} />)}
        </section>

        <section className="page-section system-section command-section" id="command" aria-labelledby="command-title" tabIndex={-1}>
          <SectionHeading description="Explore the city grid, dispatch response teams, and take command with a single keystroke." id="command-title" index="02" title="Autonomous command network" />
          <WorkspaceBoundary>
            <Suspense fallback={<div className="workspace-loading"><LoadingIndicator label="Connecting command network" /></div>}>
              {hasEntered && <CommandCenter enabled={!isBooting} onTogglePreference={togglePreference} preferences={preferences} />}
            </Suspense>
          </WorkspaceBoundary>
        </section>

        <section className="page-section system-section" id="primitives" aria-labelledby="primitives-title" tabIndex={-1}>
          <SectionHeading description="A restrained signal palette and sharply defined hierarchy keep dense information readable under pressure." id="primitives-title" index="03" title="Visual primitives" />

          <div className="primitive-grid">
            <HudPanel eyebrow="Palette / Signal states" meta="5 tokens" title="Color protocol">
              <div className="color-tokens">
                {colorTokens.map((token) => (
                  <div className="color-token" key={token.name}>
                    <span className={`token-swatch ${token.className}`} />
                    <span><strong>{token.name}</strong><code>{token.value}</code></span>
                  </div>
                ))}
              </div>
            </HudPanel>

            <HudPanel eyebrow="Typography / Hierarchy" meta="3 scales" title="Operator type">
              <div className="type-specimen">
                <div className="type-specimen__display"><span>Display / Condensed</span><strong>THREAT 09</strong></div>
                <div className="type-specimen__interface"><span>Interface / Sans</span><strong>Autonomous response network</strong></div>
                <div className="type-specimen__data"><span>Data / Mono</span><strong>48.1432° N / SECTOR 7G</strong></div>
              </div>
            </HudPanel>

            <HudPanel className="control-showcase" eyebrow="Controls / Action hierarchy" meta="4 modes" title="Operator controls">
              <div className="button-showcase">
                <Button icon={<BoltIcon />} onClick={() => setControlPreview('Deploy preview: primary actions use a high-visibility lime signal.')} size="small">Deploy</Button>
                <Button icon={<CrosshairIcon />} onClick={() => setControlPreview('Locate preview: secondary actions preserve the current context.')} size="small" variant="secondary">Locate</Button>
                <Button icon={<GridIcon />} onClick={() => setControlPreview('Filter preview: quiet actions refine the current view.')} size="small" variant="ghost">Filter</Button>
                <Button onClick={() => setControlPreview('Abort preview: destructive actions use the threat-coral signal. No simulation was changed.')} size="small" variant="danger">Abort</Button>
              </div>
              <p className="showcase-feedback" role="status">{controlPreview}</p>
              <div className="status-showcase">
                <StatusBadge tone="online" pulse>Operational</StatusBadge>
                <StatusBadge tone="warning">Attention</StatusBadge>
                <StatusBadge tone="critical">Critical</StatusBadge>
                <StatusBadge>Standby</StatusBadge>
              </div>
              <div className="micro-showcase">
                <LoadingIndicator label="Synchronizing grid" />
                <Tooltip label="Encrypted satellite uplink is stable"><span className="icon-control"><RadarIcon /></span></Tooltip>
                <Tooltip label="All defense protocols are active"><span className="icon-control"><ShieldIcon /></span></Tooltip>
              </div>
            </HudPanel>
          </div>
        </section>

        <section className="page-section system-section" id="modules" aria-labelledby="modules-title" tabIndex={-1}>
          <SectionHeading description="Composable panels turn the visual system into a believable command surface ready for live simulation data." id="modules-title" index="04" title="Interface modules" />

          <div className="module-grid">
            <HudPanel className="alert-module" eyebrow="Network events" meta="3 open" title="Signal queue" tone="warning">
              <div className="alert-list">
                {alerts.map((alert) => (
                  <article className="alert-row" key={alert.id}>
                    <div className="alert-row__id"><StatusBadge tone={alert.tone}>{alert.id}</StatusBadge></div>
                    <div className="alert-row__copy"><strong>{alert.zone}</strong><span>{alert.detail}</span></div>
                    <time>{alert.time}</time>
                  </article>
                ))}
              </div>
              <Button className="alert-module__action" href="#command" icon={<ArrowUpRightIcon />} variant="ghost" size="small">Explore live operations</Button>
            </HudPanel>

            <HudPanel className="readiness-module" eyebrow="Fleet systems" meta="128 units" title="Deployment readiness" tone="cyan">
              <div className="readiness-score">
                <div className="readiness-score__dial"><span>94</span><small>%</small></div>
                <div><StatusBadge tone="online">Ready</StatusBadge><p>All critical response classes are above deployment threshold.</p></div>
              </div>
              <div className="readiness-bars">
                <div><span>Aerial drones</span><i><b style={{ width: '96%' }} /></i><strong>96%</strong></div>
                <div><span>Ground units</span><i><b style={{ width: '88%' }} /></i><strong>88%</strong></div>
                <div><span>Med systems</span><i><b style={{ width: '92%' }} /></i><strong>92%</strong></div>
              </div>
            </HudPanel>

            <HudPanel className="preference-module" eyebrow="Operator profile" meta="Local" title="Interface preferences">
              <div className="preference-list">
                <label><span><strong>Environmental motion</strong><small>{reducedMotion ? 'Your system requests reduced motion' : 'Page-wide animation and scan effects'}</small></span><input checked={preferences.environmentalMotion} onChange={() => togglePreference('environmentalMotion')} type="checkbox" /><i aria-hidden="true" /></label>
                <label><span><strong>Precision telemetry</strong><small>Show detailed map coordinates</small></span><input checked={preferences.precisionTelemetry} onChange={() => togglePreference('precisionTelemetry')} type="checkbox" /><i aria-hidden="true" /></label>
                <label><span><strong>Tactical contrast</strong><small>Increase text and panel separation</small></span><input checked={preferences.tacticalContrast} onChange={() => togglePreference('tacticalContrast')} type="checkbox" /><i aria-hidden="true" /></label>
              </div>
            </HudPanel>
          </div>
        </section>

        <section className="page-section system-section motion-section" id="motion" aria-labelledby="motion-title" tabIndex={-1}>
          <SectionHeading description="Motion communicates system state. It stays purposeful, interruptible, and fully removable when reduced motion is requested." id="motion-title" index="05" title="Motion language" />

          <div className="motion-grid">
            <article className="motion-card"><span className="motion-card__index">01</span><div className="motion-demo motion-demo--acquire"><i /></div><h3>Acquire</h3><p>Fast linear movement signals detection and targeting.</p></article>
            <article className="motion-card"><span className="motion-card__index">02</span><div className="motion-demo motion-demo--confirm"><i /></div><h3>Confirm</h3><p>Measured pulses acknowledge stable system state.</p></article>
            <article className="motion-card"><span className="motion-card__index">03</span><div className="motion-demo motion-demo--escalate"><i /><i /><i /></div><h3>Escalate</h3><p>Compressed rhythm draws attention to urgent changes.</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer page-section">
        <div className="navigation__brand">
          <span className="navigation__mark" aria-hidden="true"><span>S</span><i>9</i></span>
          <span className="navigation__wordmark">SENTINEL<i>//9</i></span>
        </div>
        <p>Production polish / Delivery 08</p>
        <span className="site-footer__author">Created by <strong>Louis Ho</strong></span>
        <span className="site-footer__build">BUILD 00.08.00</span>
      </footer>
      </div>
    </>
  )
}
