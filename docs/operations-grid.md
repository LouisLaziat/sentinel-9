# City operations grid

Delivery 04 adds a spatial command surface to SENTINEL//9. The Operations workspace is the default command-center view and turns the fictional megacity into an explorable system of districts, autonomous units, routes, and threats.

## Map interaction

- Select any district to inspect integrity, population, defense coverage, and assigned assets.
- Select a drone or ground unit to inspect its callsign, task, battery, signal, and operating state.
- Select a threat marker to inspect its classification, vector, confidence, severity, and affected district.
- Toggle drone, ground-unit, and threat layers independently.
- Step between 100%, 120%, and 145% map zoom levels.
- Track the selected unit from the inspector; tracking stays local to the current session.

## Keyboard and accessibility

- Districts, units, and threats are keyboard-focusable controls inside the SVG map.
- The SVG is an accessible group rather than a single flattened image, so its interactive controls remain exposed.
- Native district buttons above the map provide a larger touch and keyboard alternative.
- Enter and Space activate the focused map target.
- Filter and zoom controls expose their current state with native buttons and ARIA attributes.
- Active targets use both color and geometry, so selection is not communicated by color alone.
- Motion is removed when the operating system requests reduced motion or Environmental Motion is disabled in Systems.
- Hiding a unit layer clears an inspector selection from that layer. Selection changes use a short screen-reader status instead of announcing the entire inspector.

## Data and state

The district, unit, threat, and activity records are intentionally local fixtures for this delivery. UI state is held inside `OperationsMap`, while pure filter and zoom rules live in `src/lib/operations.ts` and are covered by Vitest.

## Delivery boundary

This delivery provides selection, filtering, inspection, and visual tracking. Units do not yet move through a time-based simulation, and dispatch controls do not mutate the scenario. Those behaviors belong to the later threat-simulation delivery.
