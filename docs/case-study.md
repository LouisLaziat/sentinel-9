# SENTINEL//9 — Portfolio case study

**Creator:** Louis Ho

**Project:** A cyberpunk autonomous command-center frontend

**Stack:** React, TypeScript, Vite, CSS, SVG, Vitest, GitHub Actions, GitHub Pages

[Explore the demo](https://louislaziat.github.io/sentinel-9/) · [View the source](https://github.com/LouisLaziat/sentinel-9)

![SENTINEL//9 landing interface and autonomous network identity](media/overview.jpg)

## The brief

Create a visually memorable portfolio project that demonstrates more than a static landing page: a cinematic entry, a coherent visual system, meaningful user interaction, and frontend engineering that can be explained in an interview. Robots, drones, and a fictional megacity provide the creative setting.

The project was developed iteratively with AI-assisted implementation and review. Louis directed the concept, visual feedback, and delivery decisions. The repository documents the resulting implementation rather than claiming client work, team leadership, user research, or production adoption.

## A visitor's first minute

1. Enter the network through a skippable animated city startup.
2. Inspect a district or track an autonomous unit on the operations grid.
3. Open Fleet and configure a drone or ground frame; compare energy and performance values.
4. Launch a threat response, pause it, and advance the model to its outcome.
5. Use the command palette or share a scenario link to invite someone to try the same team.

![Command-center demonstration using real app captures](media/command-demo.gif)

## Engineering decisions worth discussing

### Visual density without losing interaction

The design uses a restrained signal palette, condensed headings, monospaced telemetry, geometric panels, and code-native SVG models. Animation provides atmosphere and state cues, while global calm mode and OS reduced-motion support allow the whole experience to become static. Small-screen district buttons and a two-row workspace rail make the desktop control model usable on a phone.

### Repeatable simulation, not random animation

Simulation rules are pure functions. Team composition determines a response score, and the deadline determines when containment succeeds or fails. Movement and threat reduction are derived from that state. This separates testable behavior from the visual layer and enables pause, step, refresh recovery, and reproducible sharing.

### State survives where it matters

The command shell owns simulation and fleet sessions, so switching workspaces does not discard a response or equipment configuration. Preferences are shared between both control surfaces and validated when restored. Map filters remain workspace-local rather than introducing an unnecessarily global state store.

### Static hosting with real application behavior

The app deploys to GitHub Pages without a backend. Query parameters carry scenario/team configuration; optional browser storage recovers local state. Strict URL validation rejects unknown or oversized configurations. The same pure rules are exercised by the automated test suite.

### Measured loading improvements

Splitting the command and fleet modules reduced the initial JavaScript entry from roughly 94.27kB to 78.79kB gzip in the Delivery 8 production comparison—about 16%. Deferred modules are still downloaded when used. This is an entry-size measurement, not a claim about total traffic, Lighthouse scores, conversion, or perceived load time.

## Result and limits

The launch package includes six workspaces, a searchable 32-command palette, configurable fleet frames, three deterministic scenarios, scenario sharing, responsive layouts, and automated regression checks. It demonstrates visual systems, typed state, modular components, accessible keyboard interaction, browser persistence, and a static deployment workflow.

All operational data is fictional. There is no real defense network, authentication, fleet hardware, or live data feed. Accessibility work has targeted browser and keyboard verification, not comprehensive screen-reader certification. No user research or business-impact metrics are claimed.

## Interview walkthrough

- Explain the state-lifetime table in [architecture](architecture.md).
- Show how a poor response team produces a failed result, then improve the team.
- Show fleet state surviving a workspace change and simulation state recovering paused after refresh.
- Explain why a native dialog, validated URLs, and a pure scoring engine were chosen.
- Discuss a next step: unify fleet equipment and simulation capabilities, with new tests before changing the model.

Before using first-person portfolio copy, review it and make sure you can explain and modify the code yourself. AI assistance is part of the project's development context, not a substitute for demonstrating understanding.
