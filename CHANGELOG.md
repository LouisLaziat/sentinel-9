# Changelog

## 0.10.0 — Delivery 10: Citadel defense

- Made a futuristic tower-defense theater the default Operations view, retaining the original map under Tactical grid.
- Added a code-native isometric city, shielded Citadel, orbiting interceptors, incoming attack drones, homing shots, and localized effects.
- Added five deterministic waves, shield-first damage, defense score, bounded event feed, and clear end states.
- Added an EMP pulse with range/cooldown, pause, manual stepping, and restart controls.
- Added two side-by-side Drone and Automatic tower cards with live remaining counts; removed the dropdown, Add button, and guard robot from this battle.
- Made defender choices prominent with larger names/help, always-visible cyan/lime neon borders, and explicit click-to-choose prompts. Short phone labels preserve readability.
- Swapped the city-status and defender-choice sections: a full-width city summary above the battlefield, with the chooser on its right; smaller screens keep choices above the map.
- Added the complete French interface at `/fr`, an EN/FR header switch that preserves active state, French command search, localized canvas labels, and language-preserving scenario links.
- Emitted `fr/index.html` with French metadata for direct static GitHub Pages navigation and refresh; English remains the default without browser-language overrides.
- Added four glowing air circles for point-based drone placement and highlighted all 19 surrounding buildings for tower placement. Budgets remain three extra drones and four towers.
- Added local drone patrols that stay inside their chosen air zone, automatic tower targeting, lime tracer fire, and per-battle reset of placed defenses.
- Paused combat while choosing a position, added cancel/Escape, prevented overlapping drones and occupied rooftops, and returned keyboard focus after placement. Phone placement uses a contained, swipeable zoomed map.
- Simplified instructions, defender counts, emergency-pulse help, and playback labels for non-technical visitors.
- Suspended work outside the visible arena, during command/share dialogs, and in hidden tabs; respected motion preferences and OS reduced motion.
- Added 35 model/deployment/placement/lifecycle tests and 15 localization tests, bringing the regression suite to 110 tests.

No packages, hosted services, accounts, or telemetry integrations were added. Publication remains an owner action.

## 0.9.0 — Delivery 09: Portfolio launch

- Reworked the README around the live demo, a short walkthrough, and real app media.
- Added architecture, case-study, media, launch, and draft release documentation.
- Added source-code and case-study footer links while preserving Louis Ho attribution.
- Added sharing-card metadata and a static 1200 × 630 social preview.
- Centralized HUD build labels using the package version.
- Added release validation for local documentation links, media budgets, metadata, and Pages build assets; included it in CI and Pages packaging.
- Added three release-metadata tests, bringing the regression suite to 60 tests.

The Delivery 09 files prepare publication. The owner still reviews, commits, pushes, and optionally creates the GitHub release.

## 0.8.0 — Delivery 08: Production polish

Keyboard/mobile accessibility, page-wide preferences, lazy workspaces, background-aware updates, preserved fleet sessions, and 57 regression tests.

## 0.7.0 — Delivery 07: Command system

Searchable command palette, global shortcuts, scenario sharing, and validated local response recovery.

## Earlier deliveries

Deliveries 00–06 established the repository and Pages workflow, design system, cinematic startup, command shell, operations map, fleet systems, and deterministic threat simulation. See the [README roadmap](README.md#delivery-roadmap) and focused guides under `docs` for their scope.
