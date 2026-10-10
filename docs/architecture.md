# Architecture

SENTINEL//9 is a static React + TypeScript application. It uses native browser APIs, CSS animation, and SVG rather than a backend, a 3D engine, or a component framework. Vite builds the deployable assets; GitHub Actions verifies and publishes them to GitHub Pages.

## Component and state boundaries

```text
App
├── shared preferences + OS motion + document visibility
├── BootSequence / Navigation / Environment / CursorGlow
├── design-system showcase
└── WorkspaceBoundary → lazy CommandCenter
    ├── simulation + fleet session + alert acknowledgement
    ├── OperationsMap              workspace-local selection and filters
    ├── lazy FleetSystems          controlled fleet session
    ├── ThreatSimulation           controlled simulation state
    ├── Situation / Signals / Systems
    ├── CommandClock               isolated timer
    └── CommandPalette / ScenarioShare → native Modal
```

`src/lib` contains the data fixtures and pure interaction rules. Components display state and invoke those rules; they do not hide scoring or URL validation inside animation code. CSS files are organized by system/workspace, with `polish.css` loaded last for shared accessibility and responsive rules.

## State lifetime

| State | Owner | Workspace switch | Refresh |
| --- | --- | --- | --- |
| Motion, precision, contrast | App | Preserved and shared | Validated local recovery |
| Incident, team, phase, time | CommandCenter | Preserved; active run continues while visible | Active run recovers paused |
| Frame, slot, loadouts, staging, blueprint | CommandCenter | Preserved | Fixture defaults |
| Alert acknowledgements | CommandCenter | Preserved | Fixture defaults |
| Map filters, zoom, tracking, selection | OperationsMap | Workspace-local view remounts | Fixture defaults |
| Palette query and category | CommandPalette | Dialog-local | Reset |

A validated scenario URL overrides a saved simulation. It carries only an incident and response team, never preferences, elapsed time, or an operator identity. Storage failure is nonfatal: the UI still works in memory.

## Deterministic response model

The engine models `briefing → active ↔ paused → resolved/failed`. A reset returns to briefing with the same team. Changing an incident loads its recommended team.

The score adds assigned-unit response strengths and a capability bonus, capped at 100. At the incident deadline, that score is compared with the scenario threshold. Route progress and threat level are derived from the same simulation time; animations visualize the model but do not decide the result. A 650ms interval advances one simulated second (approximately 1.5× time scale).

This makes success and failure reproducible in tests, with no random outcomes or network timing. The scoring model is intentionally a portfolio demonstration, not a physical or safety-critical simulation.

## Loading, motion, and background work

The command center loads after startup and Fleet loads on first use. Suspense provides a loading panel, and an error boundary offers a reload path for failed chunks. The clock has its own state so each one-second update does not rerender the entire shell.

Document visibility suspends simulation ticks, boot timers, clock updates, cursor work, and CSS animations. Active responses resume without hidden-time catch-up. OS reduced motion takes precedence over the local motion setting; calm mode removes page-wide CSS animations/transitions and pointer lighting.

## Accessible interaction

The application uses landmarks, a skip link, native buttons and checkboxes, labelled SVG controls, a roving vertical equipment tablist, and native modal dialogs. Dialog queries remain in a combobox with an associated result list and active-descendant selection. Mobile navigation uses an inert, hidden collapsed state. Touch-sized district buttons complement the map targets.

These are implemented accessibility features, not a certification of complete WCAG compliance. See [production polish](production-polish.md) for the verification boundary.

## Build and release

- Node.js 24, React 19, TypeScript, Vite, ESLint, and Vitest are declared in `package.json`; the lockfile pins the installation graph.
- `src/lib/project.ts` derives every visible build label from the package version.
- `npm run check:release` adds documentation, media, metadata, and local build-asset validation to the regular quality checks.
- CI runs that release check. The Pages workflow validates its `/sentinel-9/` production assets before uploading `dist`.
- GitHub Pages requires no application server. Query-based scenario links work without route-rewrite rules.
- `docs/media` is repository presentation media, not part of the app entry download. Only `public/social-preview.jpg` is copied to `dist` for sharing cards.

## Boundaries and tradeoffs

All city metrics, units, operators, events, coordinates, encryption labels, and threat models are fictional fixtures. There is no real telemetry, drone control, authentication, encryption service, analytics integration, or application backend. The normal app flow does not send simulation state or preferences to a remote service. Sharing a URL intentionally discloses its scenario/team configuration.

Fleet equipment is independent of simulation scoring. Operations selection is not a durable city model. Source maps are intentionally generated and public when deployed; they contain source code, so secrets must never enter source or build-time variables. Screenshots and GIFs are captured from the local demo, not fabricated interface mockups.
