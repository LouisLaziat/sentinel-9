# SENTINEL//9 Interface Design System

Delivery 01 establishes the visual and interaction grammar used by every later command-center feature. The system favors high information density, clear status communication, and restrained cyberpunk styling over decorative noise.

## Foundations

Design tokens live in `src/styles/tokens.css` and cover:

- Core and semantic colors
- Transparent UI surfaces and borders
- Typography families and scales
- Spacing and cut-corner geometry
- Shadows and signal glows
- Animation timing and easing
- Responsive page dimensions

Use semantic variables such as `--color-critical` or `--line-default` rather than inserting new color values in component styles.

## Typography

The interface uses three deliberately separate voices:

| Role | Token | Purpose |
| --- | --- | --- |
| Display | `--font-display` | Titles, major metrics, section headings |
| Interface | `--font-interface` | Explanations and human-readable content |
| Data | `--font-data` | Telemetry, labels, coordinates, and system state |

Uppercase data text should be brief. Paragraphs remain mixed case for readability.

## Components

Reusable React components live under `src/components/ui`.

### Button

Variants: `primary`, `secondary`, `ghost`, and `danger`. Use one primary action per region; reserve danger for destructive or irreversible operations.

### HudPanel

The base container for operational modules. It provides the shared cut-corner geometry, header hierarchy, accent line, and tone support.

### StatusBadge

Status is communicated with text, shape, and color. Supported tones are `online`, `warning`, `critical`, and `neutral`.

### TelemetryCard

Displays one primary measurement, contextual change, optional unit, and compact trend line. Trend data remains decorative until a later delivery adds accessible chart summaries.

### Tooltip

Available on pointer hover and keyboard focus. Tooltips clarify unfamiliar controls but never contain information required to complete an action.

### LoadingIndicator

Provides a visible animation and a semantic live status message. Motion is removed automatically when reduced motion is requested.

## Motion principles

- **Acquire:** fast directional movement communicates detection.
- **Confirm:** measured pulses acknowledge stable state.
- **Escalate:** compressed rhythm draws attention to urgent change.

All animation must have a functional reason. The reduced-motion media query disables environmental and continuous motion while preserving state and hierarchy.

## Accessibility rules

- Maintain visible keyboard focus on every interactive element.
- Never communicate state through color alone.
- Use native controls where possible.
- Keep body copy at readable sizes and line lengths.
- Preserve the skip link and semantic heading order.
- Test every module at 320px and at 200% browser zoom.

## File structure

```text
src/
├── components/
│   ├── system/       # Navigation and global environmental behavior
│   └── ui/           # Reusable interface primitives
└── styles/
    ├── tokens.css
    ├── base.css
    ├── environment.css
    ├── components.css
    ├── page.css
    └── responsive.css
```
