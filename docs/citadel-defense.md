# Citadel defense — Delivery 10

Operations opens to an animated, futuristic tower-defense theater. Enemy drones approach the central Citadel while three friendly drones orbit and fire homing shots. Visitors see two side-by-side cards: **Drone** and **Automatic tower**. Selecting a card lights up its valid places directly on the battlefield. Visitors choose a position; defenders aim and fire automatically. Guard robots are removed from this battle. The original district map remains under **Tactical grid**; palette inspection commands open that view directly.

![Isometric Citadel defense in the Operations workspace](media/defense.jpg)

## Pick, place, watch

1. Click either visible defender card. Its description explains where it goes and shows how many remain.
2. Click **inside a glowing blue circle** for a drone, or **on a glowing green building** for a tower. Combat pauses while you choose. A drone can go anywhere inside a circle, not just at its center.
3. Placement clears the selection and restores the previous playback state. Watch the defender fight, select another card to place more, or use **Start over** for a fresh battle.

Both cards have persistent cyan/lime glowing contours, larger names, and an explicit **Click to choose** prompt beneath **Choose your defender**. The full French interface at `/fr` includes placement instructions, live feedback, canvas labels, and keyboard target names. Switching EN/FR preserves placed units, wave progress, and manual pause. Compact sidebars and phones show **Auto tower / Tour auto**, with the full accessible name and placement description retained.

**Your city** is a full-width status strip above the battlefield: health, shield, defender counts, and emergency pulse are visible together. On desktop, the defender chooser sits beside the map on the right. On tablets and phones it stacks above the map, so selection comes before placement in both visual and keyboard order. Both defender cards remain side by side.

| Choice | Automatic behavior | Available to add per battle |
| --- | --- | --- |
| Drone | Patrols near its chosen point inside one of 4 air circles; shoots enemy drones | 3 extra, in addition to 3 starting drones |
| Automatic tower | Stays on the chosen building, aims, and fires lime bursts | 4 towers across 19 surrounding buildings |

All surrounding buildings accept a tower; the central Citadel does not. Each roof accepts one tower and occupied buildings stop glowing. The model rejects invalid/outside-circle points, overlapping drone posts, duplicate rooftops, and exhausted budgets. Completed cards read **All placed** and are disabled. When every reserve is used, the prompt reads **All defenders placed**. A separate live status confirms placements and explains rejected positions without announcing every combat tick.

**Cancel**, Escape, or clicking the selected card again exits placement without spending a defender. Successful placement returns keyboard focus to an available card. Native target buttons support Enter and Space; keyboard drone placement uses a circle's center. On phones, selecting a card zooms the map inside its frame, centers it, and reveals swipe guidance. The page itself does not overflow sideways.

Once all defenders are placed, keyboard focus moves to an available playback control rather than disappearing with the placement targets.

## Other controls and lifecycle

- **Automatic start:** a fresh drill begins once the arena becomes visible after startup and Operations is selected. There is no Play gate.
- **Emergency pulse:** clears enemies within 260 logical scene units of the tower, then recharges over 12 simulated seconds. It does not clear outer-ring enemies or repair shields.
- **Pause / Resume:** stops or resumes the model and all canvas movement.
- **Next second:** advances the same engine in a paused/static view, including shots, collisions, and cooldowns.
- **Start over / Play again:** resets the clock, score, entities, all reserves, and placement selection. Motion preferences remain respected.

The five waves increase enemy count, speed, and armor. All defenders fire automatically; a successful run ends with **City protected!**. A depleted shield sends remaining impact damage to tower health; reaching zero ends the battle. Finished battles disable additions until replay, and do not restart automatically.

Switching between Defense theater and Tactical grid preserves the drill. Leaving Operations unmounts the theater, cancels the animation loop, and starts a fresh drill on return. Scrolling the arena out of view, opening a command/share dialog, rebooting, or hiding the browser tab suspends work without hidden-time catch-up. EMP cooldowns also stop while suspended.

Environmental Motion off or OS reduced motion disables automatic animation, including placement glow pulses; targets remain clearly highlighted. **Next second** still runs the model without continuous motion. Placement remains available while paused or motion-off and does not advance time. Manual playback controls are disabled while choosing a location to prevent accidentally moving the battle. Cards remain side by side on phones; zoomed building targets are at least 44px. Tower health and shield use labelled meters. The canvas description reports current defender counts and explains keyboard placement.

## Implementation

- `src/lib/defense.ts`: shared two-choice catalog, deterministic 30Hz simulation, immutable advance/pulse/placement actions, nested placement anchors, bounded entities/events, and a tested animation eligibility rule.
- `src/lib/defense-city.ts`: four drone circles, city blocks, and 19 rooftop mounts shared by the model, renderer, and native targets. The four-tower budget is independent of location count.
- `src/lib/defense-renderer.ts`: Canvas 2D city, tower, shield, drones, mounted towers, building highlights, shots, and effects. No WebGL engine or downloaded artwork.
- `DefenseTheater`: isolated frame loop, cached backdrop, resize observer, viewport intersection, motion/visibility signals, and HUD updates capped at four per second during playback.
- The drawing buffer caps device pixel ratio at 1.5. The frame loop caps elapsed gaps at 100ms; a fresh timestamp on resume prevents background catch-up.
- Thirty-five defense tests cover combat, shield-first damage, success/failure, pulse range/cooldown, immutable nested state, grouped-frame determinism, bounds, unit limits, circle-center/edge/arbitrary-point placement, invalid points, overlap protection, every building, independent tower budgets, bounded local patrols, reset, and lifecycle eligibility.

This is a fictional, local visual game. It is independent of Fleet equipment, the district inspector fixtures, and the separate scenario-based Simulation workspace. No defense run is stored or sent to a server; no scenario-link format changed. The existing GitHub Pages deployment remains unchanged.

## Review and commit

Local verification for Delivery 10 passed:

- Lint, 110 tests across 13 files, TypeScript checking, and production builds.
- Release validation at `/` and `/sentinel-9/`, including the new real-app screenshot.
- Earlier Delivery 10 checks covered five-wave autoplay, containment, pulse hits/recharge, offscreen suspension, and palette inspection. The revised controls retain those underlying lifecycle rules.
- The visual cards placed drones and towers and reached both reserve limits. Mouse clicks, Enter/Space, Escape, occupied-roof disabling, overlap feedback, focus recovery, and the all-placed state worked.
- The revised city-summary/chooser layout was checked in English and French. Keyboard drone/tower placement updated the top defender counts, while manual pause and language switching preserved the drill. At 390px, 320px and 1024px, the city strip and chooser stacked before the arena without page overflow; roof targets remained at least 44px.
- Deployment left a paused clock unchanged, manual steps ran reinforced combat, view switching preserved added defenses, and leaving Operations restored all reserves.
- Palette-based unit inspection still opens Tactical grid and its correct inspector.
- Offscreen playback stayed frozen; Environmental Motion off stayed static while manual stepping advanced the model.
- At 390px and 320px, page scroll width matched usable client width, including browser scrollbars. Both cards stayed side by side. Placement zoom stayed inside the map frame; all building targets were at least 44px, and drone circles were about 87px on the zoomed map.
- The Pages-shaped production preview placed a drone in the West air zone and a tower on Building 19 through the new controls. It completed all five waves with 40 enemies stopped, 4,800 points, full tower/shield health, and no console warnings/errors.

These are local checks, not proof of deployment or complete accessibility coverage. OS reduced-motion changes, real browser-tab switching, screen-reader behavior, and additional browsers remain recommended manual checks before public release.

Run `npm run check:release`, then try both cards, glowing circles and buildings, occupied/full states, cancel/Escape, pause/step/replay, emergency pulse, both Operations views, and a phone layout. Also review with Environmental Motion off. No commit or deployment is performed automatically.

Suggested commit: `Improve defender selection and add full French interface`.
