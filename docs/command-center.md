# Command center shell

Delivery 03 turned the SENTINEL//9 design language into an interactive application shell. Delivery 04 adds the Operations workspace while preserving the shell's navigation, alerts, and operator preferences.

## Workspaces

### Operations

- Interactive city map with selectable districts
- Drone, ground-unit, route, and threat overlays
- Filter, zoom, tracking, and contextual inspection controls
- Full interaction details are documented in [`operations-grid.md`](operations-grid.md)

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

The original Situation topology remains available as a system-wide summary. The Operations workspace now provides detailed city positioning and selection; a deterministic simulation and unit dispatch workflow remain planned for later deliveries.
