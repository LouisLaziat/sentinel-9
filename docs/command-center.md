# Command center shell

Delivery 03 turns the SENTINEL//9 design language into an interactive application shell. It deliberately stops short of the complete city map and simulation engine planned for later deliveries.

## Workspaces

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

The topology in this delivery communicates application structure and system state. Delivery 04 will replace it with the interactive city operations grid, district selection, and detailed unit positioning.
