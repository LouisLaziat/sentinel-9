# v0.10.0 — Citadel defense

Prepared release copy. No Git tag or GitHub release is created by these files.

## Highlights

- Automatic five-wave tower defense in Operations, with an isometric city and shielded futuristic Citadel
- Orbiting interceptors, attacking drones, homing shots, localized impact effects, and live defense telemetry
- Two side-by-side defender cards, glowing air circles for three reserve drones, and glowing buildings for four automatic towers across 19 possible rooftops
- Larger defender labels, persistent neon card borders, and explicit click-to-choose guidance
- Complete English/French interface, English by default and French at `/fr`, with state-preserving language switching and static Pages entries
- Visitor-chosen positions, safe placement pause, cancel/Escape, keyboard focus recovery, and a swipeable phone placement map; guard robots removed from the battle
- Automatic movement/aiming, plain-language help, emergency pulse, pause/resume, Next second, Start over, and a city-protected outcome
- Viewport/dialog/background suspension and reduced-motion manual mode
- Original district inspection retained under Tactical grid

- Cinematic, skippable cyberpunk startup and animated Decisions title
- Six-workspace command center with city inspection, fleet configuration, and signal acknowledgement
- Deterministic threat simulation with three incidents, team assignment, pause/step/reset, and outcome reports
- Searchable command palette, keyboard shortcuts, and shareable scenario/team links
- Shared local preferences, system reduced motion, and background-aware updates
- Responsive phone/tablet layouts and keyboard-operated equipment controls
- Portfolio README, real app screenshots, demo GIF, architecture guide, and case study
- Social-preview metadata and a release validator for docs, media, and built assets

## Technical summary

React + strict TypeScript, CSS/SVG/Canvas visual systems, pure simulation/search/validation rules, lazy workspaces, and static GitHub Pages hosting. The release includes 110 automated tests plus lint, type checking, and bilingual build validation.

## Known boundaries

This is a fictional frontend portfolio demo. Citadel defense resets when leaving Operations and is independent of Fleet and the scenario-based Simulation workspace. Fleet loadouts are independent of response scoring; fleet sessions reset on refresh. Simulation and preferences recover locally when browser storage is available. Browser checks are focused coverage, not a universal device or accessibility guarantee.

## Try it

[Live demo](https://louislaziat.github.io/sentinel-9/) · [Source](https://github.com/LouisLaziat/sentinel-9) · [Architecture](architecture.md) · [Case study](case-study.md)
