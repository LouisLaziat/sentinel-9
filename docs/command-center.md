# Command center shell

Delivery 03 turned the SENTINEL//9 design language into an interactive application shell. Deliveries 04–06 add the Operations, Fleet, and Simulation workspaces while preserving the shell's navigation, alerts, and operator preferences.

## Workspaces

### Operations

- Interactive city map with selectable districts
- Drone, ground-unit, route, and threat overlays
- Filter, zoom, tracking, and contextual inspection controls
- Full interaction details are documented in [`operations-grid.md`](operations-grid.md)

### Fleet

- Selectable drone and ground-unit manifest
- Animated hangar inspection with blueprint mode
- Equipment configuration and calculated performance telemetry
- Local deployment staging and service-lock states
- Full interaction details are documented in [`fleet-systems.md`](fleet-systems.md)

### Simulation

- Three deterministic incident scenarios
- Configurable aerial and ground response teams
- Animated routes, simulation clock, threat mitigation, and event stream
- Successful and failed outcomes based on repeatable response scoring
- Full interaction details are documented in [`threat-simulation.md`](threat-simulation.md)

### Situation

- Live fleet, sector, alert, and response telemetry
- Animated network topology with aerial, ground, and relay nodes
- District-integrity readings and predictive coverage status
- Motion can be disabled from the Systems workspace

### Signals

- Severity-coded network event queue
- Individual acknowledgement actions
- Alert counters update in the sidebar and top bar
- Signal-density analysis and source diagnostics

### Systems

- Environmental motion control
- Precision telemetry preference
- Tactical-contrast preference
- Settings persist in `localStorage` under `sentinel-9-preferences`

## Interaction and accessibility

- Every workspace and action uses semantic buttons and visible focus styles.
- Active workspaces expose `aria-current="page"`.
- Alert controls have descriptive accessible labels.
- Native checkboxes remain available to assistive technology.
- The system honors `prefers-reduced-motion`; the local Environmental Motion setting can also stop command-center animations.
- Layouts collapse from desktop sidebar to mobile tab navigation without losing features.

## Delivery boundary

The original Situation topology remains available as a system-wide summary. Operations provides city positioning, Fleet provides frame configuration, and Simulation models response outcomes. Simulation assignments remain isolated from the live Operations and Fleet fixtures; cross-workspace scenario sharing belongs to the later command-system delivery.
