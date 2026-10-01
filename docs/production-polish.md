# Production polish

Delivery 08 hardens the existing cyberpunk interface without changing its visual identity. The blue Decisions signal and moving underline remain available when motion is enabled. This is a fictional client-side portfolio demo, not an operational defense system.

## Accessibility and responsive behavior

- Collapsed mobile navigation is hidden and inert. Escape closes it and returns focus to the menu button; section navigation moves focus to its destination.
- Startup focuses its skip control, keeps Tab inside the overlay, supports Escape, and hands focus to main content on completion.
- Fleet equipment slots follow the [WAI-ARIA vertical tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), including roving focus, Up/Down, Home/End, and a labelled tabpanel.
- Interactive map targets remain exposed as controls, with native district buttons for easier touch selection and visible SVG focus strokes.
- Dialogs use native modal focus handling. Escape restores the opener, and clicking dialog padding does not accidentally dismiss the panel.
- Tooltip Escape dismissal, concise live announcements, honest showcase feedback, and a JavaScript-disabled message improve fallback behavior.
- Secondary text is brighter, small data labels use at least 10px at the default root size, and workspace descriptive copy uses 12px. Phone/coarse-pointer buttons have a minimum 44px height; compact icon controls also have a minimum 44px width.
- The phone headline fits its container, mobile workspace navigation uses two rows, palette filters wrap, and the tablet operations toolbar adapts to the sidebar.

These are targeted accessibility improvements, not a claim of complete WCAG conformance. Screen-reader testing, browser zoom, and additional browser/device coverage remain useful release checks.

## Preferences and state

Both preference panels share validated browser-local state. Malformed, oversized, missing, or unavailable storage falls back to safe defaults. Environmental Motion controls the whole page; system reduced-motion settings always override it. Precision Telemetry controls detailed map coordinates, and Tactical Contrast strengthens secondary text and panel separation.

Fleet loadouts, staging, blueprint mode, selected frame, and active slot survive workspace changes and palette inspection. They reset on refresh. Simulation and preferences retain their existing optional local-storage persistence. Fleet staging is separate from simulation assignment.

## Performance and resilience

- [React lazy loading](https://react.dev/reference/react/lazy) separates the command center and fleet modules. The command network loads after startup; Fleet loads when first opened. Loading and error-recovery panels handle unavailable chunks.
- The initial JavaScript entry changed from 321.40kB / 94.27kB gzip to approximately 256.61kB / 78.79kB gzip in the local production comparison: about 20% smaller raw and 16% smaller compressed. Deferred chunks are still downloaded when used; this is not a total-bundle reduction or a measured load-time score.
- The operational clock updates in an isolated component rather than rerendering the entire command center each second.
- The [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) suspends simulation, boot timers, clock updates, cursor tracking, and CSS animations in hidden documents. An active simulation resumes without hidden-time catch-up.
- Cursor lighting runs only on fine-pointer desktop layouts and cancels queued frames/listeners when disabled.
- Sparkline generation safely handles empty, single-value, flat, and non-finite input.

No new package dependency, account, analytics service, or external data source was added.

## Verification

`npm run check` runs lint, 57 tests across 10 files, strict TypeScript checking, and a production build. Added tests cover preference recovery, tab navigation, background-timer guards, immutable fleet sessions/service locks, sparkline edge cases, and malformed share links/snapshots.

Browser checks used the local app at 320px, 390px, 768px, and 1440px viewport widths. All six workspaces were checked at phone, tablet, and desktop sizes. Focused checks covered:

- Mobile menu disclosure, Escape dismissal, and section navigation
- Startup keyboard trapping, Escape skip, and main-content focus handoff
- Palette search, no-results feedback, and Enter execution
- Fleet arrow keys, module installation, staging, workspace preservation, and service locks
- Synchronized preference panels, global calm mode, contrast/precision attributes, and refresh recovery
- Simulation launch, pause, manual stepping, reset, and share-dialog dismissal
- GitHub Pages `/sentinel-9/` build asset paths

The operating-system reduced-motion and hidden-document behavior should additionally be checked with real OS settings and tab switching before a release. Unit coverage verifies the timer guard; viewport testing is not a substitute for those checks.

## Pre-commit checklist

1. Run `npm run check`.
2. Preview locally with `npm run dev` and inspect the phone layout and command palette.
3. In GitHub Desktop, review the Delivery 08 source and documentation changes; generated `dist` files remain ignored.
4. Commit and push when ready. Suggested title: `Polish accessibility, responsiveness, and performance`.
5. Confirm CI and Pages deployment succeed after the push.

Delivery 09 remains the portfolio launch phase: final media, architecture presentation, repository polish, and release handoff.
