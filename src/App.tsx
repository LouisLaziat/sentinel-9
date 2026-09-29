import { getNetworkStatus } from './lib/system'

const telemetry = [
  { label: 'Network', value: 'Online' },
  { label: 'Sectors', value: '09' },
  { label: 'Units', value: '128' },
]

export function App() {
  const networkStatus = getNetworkStatus(true)

  return (
    <main className="shell">
      <div className="grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="./" aria-label="Sentinel 9 home">
          <span className="brand-mark">S9</span>
          <span>SENTINEL//9</span>
        </a>
        <div className="network-state">
          <span className="status-pulse" aria-hidden="true" />
          {networkStatus}
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Autonomous Megacity Defense Network</p>
          <h1 id="hero-title">
            The city never
            <span> sleeps.</span>
          </h1>
          <p className="intro">
            SENTINEL coordinates the machines that watch the skyline, defend
            its streets, and respond before a threat becomes visible.
          </p>
          <div className="actions">
            <button className="primary-action" type="button">
              Initialize network
              <span aria-hidden="true">↗</span>
            </button>
            <span className="build-id">BUILD 00.00.01</span>
          </div>
        </div>

        <div className="radar-panel" aria-label="Network radar preview">
          <div className="corner corner--top-left" />
          <div className="corner corner--top-right" />
          <div className="corner corner--bottom-left" />
          <div className="corner corner--bottom-right" />
          <div className="radar">
            <div className="radar-sweep" />
            <span className="target target--one" />
            <span className="target target--two" />
            <span className="target target--three" />
            <div className="radar-core">
              <span>09</span>
            </div>
          </div>
          <p>Sector scan / preview interface</p>
        </div>
      </section>

      <footer className="telemetry" aria-label="Network telemetry">
        {telemetry.map((item) => (
          <div className="telemetry-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
        <p>DELIVERY 00 / SYSTEM FOUNDATION</p>
      </footer>
    </main>
  )
}
