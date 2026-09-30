# Command system

Delivery 07 adds a command palette, keyboard shortcuts, saved response recovery, and shareable simulation briefings. It uses existing React and browser APIs without an additional dependency or backend.

## Operator uplink

The command-center header exposes the palette on desktop and mobile. It can also be opened anywhere after startup with Ctrl+K, ⌘K, or slash. Search covers:

- Six workspaces
- Five district inspectors
- Six live map assets and four fleet frames
- Three incident scenarios
- Preferences, response controls, and scenario sharing

Search accepts partial names, IDs with punctuation, and multiple terms. Title matches rank above descriptive matches, and unavailable commands appear after enabled results. Category filters narrow the result list. An unmatched query provides a clear-search action.

Arrow keys move through results and Enter executes the selected command. The palette exposes the active result with `aria-activedescendant`. Native modal dialogs keep focus inside, Escape closes them, and dismissal restores the opener. Navigation commands move focus into the destination workspace.

## Shortcuts

| Key | Action |
| --- | --- |
| Ctrl+K / ⌘K | Toggle command palette |
| / | Open command palette |
| ? | Open palette with shortcut guide |
| Alt+1 | Operations |
| Alt+2 | Fleet |
| Alt+3 | Simulation |
| Alt+4 | Situation |
| Alt+5 | Signals |
| Alt+6 | Systems |
| ↑ / ↓ | Select a palette result |
| Enter | Execute the selected result |
| Escape | Close the active dialog |

Single-key and workspace shortcuts are suppressed in editable fields. Shortcuts are inactive during startup and scenario sharing. A pointer-accessible shortcut guide is also available in the command status bar.

## Scenario sharing

Share links use the current origin and pathname, preserving `/sentinel-9/` on GitHub Pages. The versioned query contains only:

```text
?s9=1&scenario=transit-breach&units=DR-41%2CGR-22#command
```

The recipient opens the same incident and response team at briefing, not at the sender's elapsed time. Empty teams are preserved. Unknown incident or unit IDs, unsupported versions, duplicate parameters, and oversized input are rejected. Unit duplicates are normalized. A valid link takes priority over locally saved state.

The sharing dialog previews the incident, score, deadline, and assigned units. Copy uses the Clipboard API; if browser access is unavailable, the link is selected for manual copying. Sharing is entirely client-side and requires no account.

## Response persistence

The command shell owns the simulation state and timer. Navigating to another workspace does not discard or pause the run. A versioned local snapshot under `sentinel-9-simulation` saves the incident, assignments, phase, and elapsed time. Reloading an active response restores it paused. Completed outcomes are checked against the response engine when restored. Invalid or unavailable storage falls back to a fresh response.

Reset/replay preserves the current response team. Selecting a different incident loads its recommended team. During an active or paused response, incident commands remain unavailable until Reset, preventing accidental replacement.

## Implementation and verification

- `src/lib/commands.ts` owns the search index and contextual command descriptions.
- `src/lib/scenario-sharing.ts` owns URL serialization and validated session recovery.
- `CommandCenter` executes commands against the existing workspaces and response engine.
- `CommandPalette`, `ScenarioShare`, and `Modal` own the interface and dialog behavior.
- Operations and Fleet data fixtures are shared with the search index to keep names and IDs consistent.
- Vitest covers search/ranking, unavailable controls, URL round trips, invalid input, and saved-response recovery.
- Browser verification covers keyboard execution, asset selection, modal focus, copying, direct shared links, refresh recovery, and mobile layout.
