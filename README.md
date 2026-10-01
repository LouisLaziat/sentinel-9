# SENTINEL//9

> Autonomous Megacity Defense Network

SENTINEL//9 is a cinematic frontend experience set inside a cyberpunk city. The finished application will let visitors monitor and dispatch autonomous drones and ground units, investigate incidents, and watch the simulated city react in real time.

## Current delivery

**Delivery 08 — Production polish**

- React and strict TypeScript application powered by Vite
- Page-wide motion and contrast controls with operating-system reduced-motion support
- Accessible mobile disclosure navigation and keyboard-operated fleet tabs
- Touch-friendly district controls and refined phone/tablet layouts
- Lazy-loaded command and fleet workspaces with loading and recovery states
- Background-aware simulation, clock, cursor lighting, and animation updates
- Fleet loadouts, staging, and inspection state preserved across workspace changes
- Validated preference recovery and 57 automated regression tests
- Searchable cyberpunk command palette with 32 contextual commands
- Direct access to workspaces, district inspectors, unit tracking, fleet frames, and threat scenarios
- Keyboard navigation, category filters, shortcut guide, and accessible modal focus handling
- Ctrl/⌘+K and slash palette shortcuts, plus Alt+1–6 workspace navigation
- Shareable scenario links that reproduce custom response teams on GitHub Pages
- Locally saved simulation state with paused recovery after a refresh
- Simulation progress preserved while navigating between workspaces
- Deterministic threat-response engine with success and failure outcomes
- Three selectable incident models with distinct deadlines and capability requirements
- Configurable aerial and ground response teams with calculated readiness scores
- Animated tactical routes, unit movement, threat mitigation, and simulation time
- Pause, resume, manual time-step, reset, and replay controls
- Live response-event stream and final containment reports
- Responsive six-workspace command shell for operations, fleet, simulation, situation, signals, and systems
- Interactive fleet manifest with aerial and ground-unit selection
- Animated hangar visualization with blueprint and frame-specific modes
- Configurable sensor, power-core, and utility equipment slots
- Live performance and energy calculations for every loadout change
- Local deployment-staging state with service-lock behavior
- Interactive city map with five selectable operational districts
- Live drone, ground-unit, route, and threat visualization
- Independent unit and threat filters with three map zoom levels
- Contextual inspector for districts, units, and threat signals
- Unit tracking state, district asset lists, and a live activity stream
- Animated network topology with drone, ground-unit, and relay telemetry
- Actionable signal queue with acknowledgement state and live alert counts
- Persistent operator preferences stored locally in the browser
- Live operational clock, district health, operator identity, and system status
- Animated signal treatment for the hero word “Decisions”
- Five-stage autonomous network boot sequence with live progress telemetry
- Animated cyberpunk skyline, defense drones, targeting lattice, and city uplinks
- Cinematic handoff from system initialization into the interface
- Skippable sequence with keyboard support and an in-app replay control
- Reduced-motion behavior that preserves the narrative without prolonged animation
- Complete color, typography, spacing, geometry, and motion tokens
- Reusable buttons, HUD panels, status badges, telemetry cards, tooltips, and loaders
- Responsive navigation and design-system showcase
- Cursor lighting, atmospheric grid, signal effects, and restrained interface motion
- ESLint, Vitest, and production build checks
- GitHub Actions continuous integration
- Automated GitHub Pages deployment
- Keyboard focus, semantic landmarks, skip navigation, and reduced-motion support

The component rules and usage guidance are documented in [`docs/design-system.md`](docs/design-system.md). Command-shell behavior is documented in [`docs/command-center.md`](docs/command-center.md), the map interaction model in [`docs/operations-grid.md`](docs/operations-grid.md), fleet configuration in [`docs/fleet-systems.md`](docs/fleet-systems.md), the deterministic scenario model in [`docs/threat-simulation.md`](docs/threat-simulation.md), and command search, shortcuts, and sharing in [`docs/command-system.md`](docs/command-system.md). Accessibility, performance, and release checks are documented in [`docs/production-polish.md`](docs/production-polish.md).

## Command controls

Open **Command uplink** from the command center, or press **Ctrl+K** (Windows/Linux), **⌘K** (macOS), or **/**. Search by callsign, unit ID, district, incident, or action. Use the arrow keys and Enter to execute a result; Escape closes the palette. Press **?** for the shortcut guide, and **Alt+1–6** to switch workspaces.

In Simulation, select **Share scenario** to copy a link with the current incident and response team. The recipient starts at briefing. Active runs continue across workspace changes and reopen paused after a refresh; browser storage is optional and sharing does not require an account.

Environmental Motion applies to the whole page, including startup and the blue “Decisions” signal. System reduced-motion settings always take priority. Background tabs suspend animation and simulation time; returning resumes an active response without catching up hidden time. Fleet configurations survive workspace navigation but reset on a page refresh.

## Run locally

Requirements: Node.js 24 or newer. Node.js 24 is used in CI.

```bash
npm install
npm run dev
```

Run every quality check before committing:

```bash
npm run check
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production build |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run lint, tests, and build together |

## Delivery roadmap

0. **System foundation** — repository, quality tooling, deployment, branded shell
1. **Brand and design system** — tokens, components, responsive navigation, motion language
2. **Cinematic entry** — city reveal, boot sequence, layered environmental motion
3. **Command center shell** — application structure, navigation, alerts, operator preferences
4. **Operations grid** — interactive city map, districts, drone and robot telemetry
5. **Fleet systems** — unit inspection, animated hangar, equipment configuration
6. **Threat simulation** — incidents, dispatching, routes, deterministic event engine
7. **Command system** — keyboard palette, search, shortcuts, scenario sharing
8. **Production polish** — accessibility, responsive refinement, performance and testing
9. **Portfolio launch** — final documentation, media, architecture notes, release

Each delivery is intended to be independently reviewable and represented by focused commits.

## Deployment

Pushes to `main` are checked by CI and deployed through the Pages workflow. Vite automatically uses `/sentinel-9/` as the production base path when building inside GitHub Actions.

---

`SENTINEL NETWORK // BUILD 00.08.00`
