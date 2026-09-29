# SENTINEL//9

> Autonomous Megacity Defense Network

SENTINEL//9 is a cinematic frontend experience set inside a cyberpunk city. The finished application will let visitors monitor and dispatch autonomous drones and ground units, investigate incidents, and watch the simulated city react in real time.

## Current delivery

**Delivery 00 — System foundation**

- React and strict TypeScript application powered by Vite
- Initial responsive visual shell and motion language
- ESLint, Vitest, and production build checks
- GitHub Actions continuous integration
- Automated GitHub Pages deployment
- Reduced-motion support from the first release

## Run locally

Requirements: Node.js 24 or newer. Node.js 24 is used in CI.

```bash
npm install
npm run dev
```

Run every quality check before committing:

```bash
npm run check
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production build |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run lint, tests, and build together |

## Delivery roadmap

1. **System foundation** — repository, quality tooling, deployment, branded shell
2. **Cinematic entry** — city reveal, boot sequence, layered environmental motion
3. **Operations grid** — interactive city map, districts, drone and robot telemetry
4. **Fleet systems** — unit inspection, animated hangar, equipment configuration
5. **Threat simulation** — incidents, dispatching, routes, deterministic event engine
6. **Production polish** — accessibility, responsive refinement, performance and testing

Each delivery is intended to be independently reviewable and represented by focused commits.

## Deployment

Pushes to `main` are checked by CI and deployed through the Pages workflow. Vite automatically uses `/sentinel-9/` as the production base path when building inside GitHub Actions.

---

`SENTINEL NETWORK // BUILD 00.00.01`
