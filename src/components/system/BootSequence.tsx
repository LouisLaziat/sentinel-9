import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type BootSequenceProps = {
  onComplete: () => void
}

const bootStages = [
  {
    code: 'S9/KERNEL',
    label: 'Defense kernel',
    message: 'Decrypting autonomous defense kernel',
    detail: 'SIGNATURE 8F:9A:77 VERIFIED',
    duration: 760,
  },
  {
    code: 'CITY/MESH',
    label: 'City mesh',
    message: 'Reconstructing metropolitan topology',
    detail: '2,048 GRID NODES DISCOVERED',
    duration: 920,
  },
  {
    code: 'FLEET/LINK',
    label: 'Fleet uplink',
    message: 'Pairing autonomous response units',
    detail: '128 AERIAL + GROUND UNITS ONLINE',
    duration: 980,
  },
  {
    code: 'THREAT/SCAN',
    label: 'Threat scan',
    message: 'Calibrating predictive threat lattice',
    detail: 'CITY RISK ENVELOPE NOMINAL',
    duration: 1_040,
  },
  {
    code: 'NETWORK/LIVE',
    label: 'Network live',
    message: 'Operator channel established',
    detail: 'WELCOME TO SENTINEL//9',
    duration: 1_050,
  },
] as const

const districts = [
  ['N-01', 'Neon Ward'],
  ['A-07', 'Ashfall'],
  ['C-12', 'Civic Core'],
  ['L-04', 'Lower Arc'],
] as const

const buildings = [
  { x: 18, width: 72, height: 205 },
  { x: 96, width: 54, height: 150 },
  { x: 156, width: 86, height: 268 },
  { x: 249, width: 46, height: 184 },
  { x: 302, width: 110, height: 332 },
  { x: 420, width: 65, height: 220 },
  { x: 492, width: 94, height: 286 },
  { x: 594, width: 51, height: 190 },
  { x: 652, width: 126, height: 390 },
  { x: 786, width: 58, height: 250 },
  { x: 852, width: 102, height: 315 },
  { x: 962, width: 72, height: 210 },
  { x: 1042, width: 58, height: 274 },
  { x: 1107, width: 76, height: 170 },
] as const

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? bootStages.length - 1
      : 0
  ))
  const activeStage = bootStages[stage] ?? bootStages[0]
  const progress = ((stage + 1) / bootStages.length) * 100

  const onlineDistricts = useMemo(
    () => Math.min(districts.length, Math.max(0, stage)),
    [stage],
  )

  useEffect(() => {
    document.body.classList.add('is-booting')

    return () => {
      document.body.classList.remove('is-booting')
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const timer = window.setTimeout(() => {
      if (stage === bootStages.length - 1) {
        onComplete()
        return
      }

      setStage((current) => current + 1)
    }, mediaQuery.matches ? 320 : activeStage.duration)

    return () => window.clearTimeout(timer)
  }, [activeStage.duration, onComplete, stage])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])

  return (
    <section
      aria-label="SENTINEL 9 network startup"
      aria-modal="true"
      className={`boot-sequence boot-sequence--stage-${stage}`}
      role="dialog"
      style={{ '--boot-progress': `${progress}%` } as CSSProperties}
    >
      <div className="boot-sequence__noise" aria-hidden="true" />
      <div className="boot-sequence__scanlines" aria-hidden="true" />

      <header className="boot-header">
        <div className="boot-brand" aria-label="SENTINEL 9">
          <span className="boot-brand__mark" aria-hidden="true"><b>S</b><i>9</i></span>
          <span>SENTINEL<i>//9</i></span>
        </div>

        <div className="boot-header__protocol">
          <span>Initialization protocol</span>
          <strong>ENTRY / 02</strong>
        </div>

        <button aria-label="Skip startup sequence" className="boot-skip" onClick={onComplete} type="button">
          <span>Skip sequence</span>
          <kbd>ESC</kbd>
        </button>
      </header>

      <div className="boot-layout">
        <aside className="boot-rail boot-rail--left" aria-label="Boot phases">
          <span className="boot-rail__eyebrow">Boot architecture</span>
          <ol>
            {bootStages.map((item, index) => (
              <li
                className={index === stage ? 'is-active' : index < stage ? 'is-complete' : ''}
                key={item.code}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.label}</strong><small>{item.code}</small></div>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>
          <p><span>Encryption</span><strong>AES-512 / ACTIVE</strong></p>
        </aside>

        <div className="boot-visual" aria-hidden="true">
          <div className="boot-visual__coordinates">
            <span>43.6532° N</span>
            <span>79.3832° W</span>
          </div>

          <div className="boot-visual__designation">
            <span>Protected territory</span>
            <strong>MEGACITY / 09</strong>
          </div>

          <svg className="boot-city" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="city-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#58e8ff" stopOpacity="0.13" />
                <stop offset="1" stopColor="#58e8ff" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="city-line" x1="0" x2="1">
                <stop offset="0" stopColor="#58e8ff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#58e8ff" />
                <stop offset="1" stopColor="#58e8ff" stopOpacity="0" />
              </linearGradient>
              <filter id="city-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g className="boot-city__horizon">
              <path d="M0 570H1200" />
              <path d="M90 530H1110" opacity=".18" />
            </g>

            <g className="boot-city__buildings">
              {buildings.map((building, index) => {
                const top = 570 - building.height
                const notch = Math.min(18, building.width / 4)
                const path = `M${building.x} 570V${top + notch}L${building.x + notch} ${top}H${building.x + building.width - notch}L${building.x + building.width} ${top + notch}V570Z`

                return (
                  <g
                    className="boot-city__building"
                    key={`${building.x}-${building.height}`}
                    style={{ '--building-order': index } as CSSProperties}
                  >
                    <path d={path} />
                    <path d={`M${building.x + building.width / 2} ${top}V${top - 24 - (index % 3) * 14}`} />
                    <path className="boot-city__building-core" d={`M${building.x + building.width * 0.28} ${top + 28}V550M${building.x + building.width * 0.72} ${top + 28}V550`} />
                  </g>
                )
              })}
            </g>

            <g className="boot-city__transit">
              <path d="M80 496C260 452 380 488 550 440S890 400 1120 462" />
              <circle cx="550" cy="440" r="4" />
              <circle cx="860" cy="410" r="4" />
            </g>

            <g className="boot-drone boot-drone--one" filter="url(#city-glow)">
              <path d="M-28 0h18l10-8 10 8h18l-9 5H8L0 13-8 5h-11Z" />
              <circle cx="0" cy="2" r="2" />
            </g>
            <g className="boot-drone boot-drone--two">
              <path d="M-20 0h13l7-6 7 6h13l-6 4H6L0 9-6 4h-8Z" />
            </g>
          </svg>

          <div className="boot-target">
            <span className="boot-target__ring boot-target__ring--outer" />
            <span className="boot-target__ring boot-target__ring--inner" />
            <span className="boot-target__cross boot-target__cross--x" />
            <span className="boot-target__cross boot-target__cross--y" />
            <i />
          </div>

          <div className="boot-title">
            <span>Autonomous megacity defense network</span>
            <h1>SENTINEL<i>//9</i></h1>
            <p key={activeStage.code}>{activeStage.message}</p>
          </div>

          <div className="boot-perspective-grid" />
        </div>

        <aside className="boot-rail boot-rail--right" aria-label="District connections">
          <span className="boot-rail__eyebrow">District uplinks</span>
          <ul>
            {districts.map(([code, name], index) => (
              <li className={index < onlineDistricts ? 'is-online' : ''} key={code}>
                <span>{code}</span>
                <strong>{name}</strong>
                <i aria-hidden="true" />
              </li>
            ))}
          </ul>
          <div className="boot-rail__metric"><span>Latency</span><strong>08<small>MS</small></strong></div>
          <div className="boot-rail__metric"><span>Grid integrity</span><strong>99.8<small>%</small></strong></div>
        </aside>
      </div>

      <footer className="boot-footer">
        <div className="boot-footer__message" aria-live="polite" aria-atomic="true">
          <span>{activeStage.code}</span>
          <strong key={activeStage.detail}>{activeStage.detail}</strong>
        </div>
        <div className="boot-progress" aria-label={`Startup ${Math.round(progress)} percent complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <i />
        </div>
        <span className="boot-footer__count">{String(stage + 1).padStart(2, '0')} / {String(bootStages.length).padStart(2, '0')}</span>
      </footer>

      <div className="boot-sequence__exit" aria-hidden="true" />
    </section>
  )
}
