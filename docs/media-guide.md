# Demo media

All committed images are actual local app captures. The demo GIF uses captured Delivery 09 interaction states with edited playback timing; it is not a real-time benchmark. Delivery 10's defense screenshot shows the newer default Operations view. No AI-generated artwork, paid asset, external font, or stock-image download was introduced in either delivery.

## Included assets

| Asset | Purpose |
| --- | --- |
| `docs/media/overview.jpg` | README first impression |
| `docs/media/operations.jpg` | District inspection and city controls |
| `docs/media/defense.jpg` | Delivery 10 Operations theater with city status above, defender choices beside the map, and glowing placement zones |
| `docs/media/defense-fr.jpg` | Complete French Operations interface with larger glowing defender cards |
| `docs/media/fleet.jpg` | Configurable machine / equipment view |
| `docs/media/simulation.jpg` | Paused tactical response |
| `docs/media/mobile.jpg` | Narrow-screen layout |
| `docs/media/command-demo.gif` | Short simulation and command walkthrough |
| `public/social-preview.jpg` | Link-sharing card, 1200 × 630 |

JPEG screenshots remain below 1MB each, the social preview below 500kB, and the GIF below 3MB. The release validator enforces those limits and checks local documentation links and built-asset paths. The screenshots and GIF are documentation assets, not imported into the frontend bundle.

## Reproduce the captures

1. Start the app and finish or skip startup. Use default motion/precision settings for the standard media set.
2. Capture the overview with the Decisions title and cyan network signal visible.
3. In Operations, pause Defense theater and select a Drone or Automatic tower card with enemies present. Include both visible cards and the glowing circles/buildings. Place a defender before repeating the capture if desired. Switch to Tactical grid, choose a district, and include both the map and inspector for the original map shot.
4. In Fleet, choose a frame and expose the loadout panel; avoid a pending transition.
5. In Simulation, use Rogue swarm with its recommended team, launch, pause, and use manual stepping to expose movement. Reset after capture.
6. Capture a phone-sized layout and check that the title and navigation are not clipped.
7. Keep browser/account chrome, desktop notifications, and unrelated content out of every image.

Use an app-only browser capture tool or manually capture the visible application. For optional image packaging, `scripts/package-demo-media.py` takes an existing capture folder and creates the documented media files. It requires Pillow and never controls a browser. Do not pass personal screenshots to it.

## Optional 45-second recording

| Time | Action | What it demonstrates |
| --- | --- | --- |
| 0–5s | Startup, then enter | Visual direction and motion |
| 5–12s | Inspect a city district / asset | Spatial interaction and contextual state |
| 12–20s | Configure a fleet module | Derived telemetry and immutable session updates |
| 20–32s | Launch, pause, and step a response | Deterministic simulation controls |
| 32–39s | Ctrl/⌘+K, search, execute | Keyboard-oriented command UX |
| 39–45s | Show scenario sharing and calm mode | Reproducibility and motion control |

Record locally with software you already use. Hide personal notifications, avoid capturing account pages, and describe the project as a fictional, AI-assisted frontend portfolio. A longer video is optional; the committed GIF is the supplied lightweight demo.
