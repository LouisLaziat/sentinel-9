# Command center shell

Delivery 03 turned the SENTINEL//9 design language into an interactive application shell. Deliveries 04–06 added Operations, Fleet, and Simulation. Delivery 07 connects the shell to global command search, shortcuts, saved responses, and scenario sharing. Delivery 08 improves accessibility, responsive layouts, shared preferences, and background-aware updates.

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
- Response progress preserved across workspace changes
- Local session recovery and shareable incident/team links
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
- The system honors `prefers-reduced-motion`; Environmental Motion also stops animations across the entire page. Both preference panels control the same state.
- Precision Telemetry hides detailed map coordinates; Tactical Contrast strengthens page-wide secondary text and panel boundaries.
- Preference recovery validates each saved field and falls back safely if storage is malformed or unavailable.
- Layouts collapse from desktop sidebar to mobile tab navigation without losing features.
- The command palette uses a native modal dialog, an accessible combobox/listbox, arrow-key navigation, Escape dismissal, and focus restoration.
- Ctrl/⌘+K or slash opens the palette; Alt+1–6 selects a workspace, and ? opens the shortcut guide.
- Typing in a field suppresses workspace and single-key shortcuts.
- Full command behavior is documented in [`command-system.md`](command-system.md).

## Delivery boundary

The original Situation topology remains available as a system-wide summary. Operations provides city positioning, Fleet provides frame configuration, and Simulation models response outcomes. Simulation state belongs to the command shell and continues across workspace changes. Operations and Fleet fixture values remain independent of simulation assignments. Shared links carry an incident and response team; they do not publish fleet loadouts or operator preferences.

Fleet configuration and inspection state also belong to the shell and survive workspace switches. Operations selection/filter state is workspace-local. Hidden browser tabs suspend simulation ticks and the operational clock; an active run resumes when visible without advancing through hidden time. The clock updates independently rather than rerendering the entire shell each second.
