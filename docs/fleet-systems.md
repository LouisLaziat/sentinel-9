# Fleet systems

Delivery 05 adds an interactive Fleet workspace to the SENTINEL//9 command shell. It presents autonomous units as configurable machines rather than static map markers.

## Fleet manifest

- Four representative aerial and ground frames are available from the active manifest.
- Selecting a unit updates the hangar model, frame identity, readiness, battery, runtime, mass, bay, and equipment loadout.
- Ready, calibrating, and service states have distinct visual treatments.
- Service-locked units cannot be staged for deployment.

## Hangar visualization

- A code-native SVG model changes between aerial and ground frames.
- Frame color, annotations, scanning effects, platform telemetry, and the surrounding diagnostic field follow the selected unit.
- Blueprint mode changes the model to an engineering-line treatment.
- Environmental Motion and `prefers-reduced-motion` both disable the hangar animations.

## Equipment configuration

Each unit has three configurable slots:

- Sensor array
- Power core
- Utility system

Compatible modules modify power, mobility, defense, and projected energy draw. The pure calculation rules live in `src/lib/fleet.ts` and are covered by Vitest. Loadout and staging changes remain local to the current session.

## Delivery boundary

Staging communicates readiness intent but does not dispatch a unit or mutate the city map. Moving units, incident outcomes, and deterministic scenario state belong to the later threat-simulation delivery.
