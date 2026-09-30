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
- Monitor unit ETAs, threat level, response score, and the event timeline.

## Delivery boundary

Simulation state is local to the Simulation workspace. It does not modify the Operations map, Fleet loadouts, or acknowledged signal state. Persisted and shareable scenarios belong to the later command-system delivery.
