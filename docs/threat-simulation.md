# Threat simulation

Delivery 06 adds a deterministic response simulator to SENTINEL//9. It lets an operator choose an incident, assemble a response team, launch the model, and inspect the resulting containment outcome.

## Scenarios

- **Rogue swarm** requires aerial capability before an Ashfall power-lattice deadline.
- **Reactor cascade** rewards ground capability during a Neon Ward infrastructure failure.
- **Transit breach** requires a mixed aerial and ground response in Lower Arc.

Each scenario defines a deadline, response threshold, target location, capability requirement, and recommended response team.

## Response engine

The pure rules in `src/lib/simulation.ts` calculate:

- Response score from assigned unit strength and capability bonuses
- Route progress and interpolated unit positions
- Threat mitigation over simulated time
- A resolved or failed outcome at the deterministic deadline

The engine contains no randomness, so a given scenario and response team always produce the same result. Vitest covers successful responses, underpowered failures, empty-team launch protection, and route calculations.

## Operator controls

- Change scenarios and response assignments during briefing.
- Launch the configured response.
- Pause and resume the running simulation.
- Advance paused time manually in five-second increments.
- Reset an active run or replay a completed scenario.
- Reset and replay preserve the custom response team; selecting a scenario loads its recommended team.
- Monitor unit ETAs, threat level, response score, and the event timeline.
- Share the incident and current team as a fresh briefing link.
- Launch, pause, resume, reset, or step a response from the global command palette.

## Delivery boundary

Delivery 07 moves simulation ownership into the command shell. A running response continues when another workspace is open. State is saved locally under `sentinel-9-simulation`; interrupted active responses recover paused with their elapsed time and team intact. A valid shared link takes priority over the saved response and opens Simulation at briefing. Invalid links and corrupt saved data are ignored safely.

Simulation does not modify the Operations map, Fleet loadouts, or acknowledged signal state. See [`command-system.md`](command-system.md) for the share format and keyboard controls.
