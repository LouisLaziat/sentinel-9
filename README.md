# SENTINEL//9

> Autonomous Megacity Defense Network

SENTINEL//9 is a cinematic frontend experience set inside a cyberpunk city. The finished application will let visitors monitor and dispatch autonomous drones and ground units, investigate incidents, and watch the simulated city react in real time.

## Current delivery

**Delivery 05 — Fleet systems**

- React and strict TypeScript application powered by Vite
- Interactive fleet manifest with aerial and ground-unit selection
- Animated hangar visualization with blueprint and frame-specific modes
- Configurable sensor, power-core, and utility equipment slots
- Live performance and energy calculations for every loadout change
- Local deployment-staging state with service-lock behavior
- Responsive five-workspace command shell for operations, fleet, situation, signals, and systems
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

The component rules and usage guidance are documented in [`docs/design-system.md`](docs/design-system.md). Command-shell behavior is documented in [`docs/command-center.md`](docs/command-center.md), the map interaction model in [`docs/operations-grid.md`](docs/operations-grid.md), and fleet configuration in [`docs/fleet-systems.md`](docs/fleet-systems.md).

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

1. **System foundation** — repository, quality tooling, deployment, branded shell
2. **Brand and design system** — tokens, components, responsive navigation, motion language
3. **Cinematic entry** — city reveal, boot sequence, layered environmental motion
4. **Command center shell** — application structure, navigation, alerts, operator preferences
5. **Operations grid** — interactive city map, districts, drone and robot telemetry
6. **Fleet systems** — unit inspection, animated hangar, equipment configuration
7. **Threat simulation** — incidents, dispatching, routes, deterministic event engine
8. **Command system** — keyboard palette, search, shortcuts, scenario sharing
9. **Production polish** — accessibility, responsive refinement, performance and testing
10. **Portfolio launch** — final documentation, media, architecture notes, release

Each delivery is intended to be independently reviewable and represented by focused commits.

## Deployment

Pushes to `main` are checked by CI and deployed through the Pages workflow. Vite automatically uses `/sentinel-9/` as the production base path when building inside GitHub Actions.

---

`SENTINEL NETWORK // BUILD 00.05.00`
