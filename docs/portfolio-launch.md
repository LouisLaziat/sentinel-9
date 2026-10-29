# Portfolio launch handoff

Delivery 10 extends the original portfolio launch with Citadel defense and prepares version 0.10.0 for review, commit, and publication through the existing GitHub Pages workflow. It does not create a commit, push, tag, or public release automatically. See [the defense guide](citadel-defense.md) for the new behavior.

## Local checks

Use Node.js 24 or newer. In an existing checkout with a matching lockfile, use `npm ci`; close any running Vite process first on Windows so native dependency files are not locked. There is no need to reinstall dependencies simply to run this delivery.

```bash
npm run check:release
npm run dev
```

Open the local URL printed by Vite. The preview server may use a different port if 5173 is occupied. A production preview is also available with `npm run preview` after a build.

For a Pages-shaped production check in PowerShell:

```powershell
$env:GITHUB_ACTIONS = 'true'
npm run build
node scripts/check-release.mjs --pages
Remove-Item Env:GITHUB_ACTIONS
npm run preview -- --base /sentinel-9/
```

Open the preview's `/sentinel-9/` path for this build. The explicit preview base is required after clearing the environment variable; otherwise nested asset requests can return the HTML fallback instead of JavaScript. This environment variable affects only the current PowerShell session; the Pages workflow sets it automatically. Run a normal `npm run build` afterward if you want a root-path production preview again.

## Historical Delivery 09 verification

For the current delivery's checks and remaining verification boundaries, see [Delivery 10 verification](citadel-defense.md#review-and-commit).

Local verification completed for this launch package:

- Lint, 60 tests across 11 test files, strict TypeScript checking, and production builds passed.
- Release validation passed for both `/` and `/sentinel-9/` asset prefixes, documentation link targets, media budgets, and social-preview dimensions.
- Browser checks covered desktop layout, 390px and 320px phone widths, footer link focus/targets, fleet configuration, palette execution, simulation success/failure, and paused refresh recovery.
- The Pages-shaped production preview loaded the command and Fleet modules. A scenario URL opened in a fresh tab at briefing with the expected incident, two-unit team, and score.
- The supplied GIF was reviewed as a 14-frame, 13.2-second edited walkthrough.

These are the earlier local results, not confirmation of the current public deployment. Delivery 10 increases the suite to 110 tests and adds defense/deployment/placement and localization checks. GitHub workflow status, the public build, and the additional manual checks below still need owner review after publication.

## Review in GitHub Desktop

1. Confirm the selected repository is `sentinel-9` and the branch is `main`.
2. Review the source, metadata, documentation, scripts, and media changes. `dist` and dependencies should remain ignored.
3. Confirm the displayed author email is your GitHub noreply address. Do not include email-rewrite backups or command files from outside this repository.
4. Suggested summary: `Add autonomous Citadel defense to Operations`.
5. Suggested description: `Add a futuristic tower-defense scene with two visible defender cards, glowing drone circles and buildings, visitor-chosen positions, automatic combat, and motion-aware playback.`
6. Commit, then Push origin when you are ready.
7. In GitHub Actions, wait for CI and Pages deployment to finish successfully.

## Verify the deployed version

The expected public URL is [SENTINEL//9](https://louislaziat.github.io/sentinel-9/). After the push, verify **Delivery 10 / BUILD 00.10.00**, then test:

- Startup completion and Escape skip
- Phone navigation and layout
- English default, French `/sentinel-9/fr` direct access/refresh, EN/FR switching, French command search, and French scenario links
- Defense autoplay, five waves, EMP range/recharge, pause/step/restart, offscreen suspension, and Tactical grid inspection
- Command palette search, Enter execution, Escape, and focus return
- Fleet configuration and state preservation across navigation
- Simulation success/failure, pause/step/reset, and paused refresh recovery
- A copied scenario link in a new tab, including the `/sentinel-9/` prefix
- Motion off, tactical contrast, OS reduced motion, and real tab visibility changes
- Source/case-study footer links and the deployed `social-preview.jpg`

OS motion, screen readers, browser zoom, and additional browsers are recommended manual checks. Automated release validation does not test remote availability or current GitHub workflow status.

## Optional GitHub release

Only after the deployed build passes your review, create a release from GitHub's Releases page. Use tag `v0.10.0`, target the Delivery 10 commit on `main`, and use [release notes](release-notes.md) as the draft description. Save a draft if you want to review before publishing. The tag/release is optional for Pages deployment.

See [GitHub's release instructions](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) for the current interface.

## Presentation media

- [Overview](media/overview.jpg), [Operations](media/operations.jpg), [Fleet](media/fleet.jpg), [Simulation](media/simulation.jpg), and [phone layout](media/mobile.jpg)
- [Citadel defense](media/defense.jpg): the Delivery 10 Operations theater
- [Command demo GIF](media/command-demo.gif): a short, stepped walkthrough, not a real-time performance recording
- [Social preview](../public/social-preview.jpg): 1200 × 630 JPEG, derived from the app overview
- [Media guide](media-guide.md): reproduction notes and a recording script

These are app-only captures; they contain fictional fixture data and no desktop chrome, local paths, account email, or authentication content.
