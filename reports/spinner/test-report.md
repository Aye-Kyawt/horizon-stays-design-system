# spinner — test report

**Component:** `src/components/spinner/` · **Figma node:** [`84:33`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-33)
**Build under test:** staging Storybook · **Date:** 2026-09-21 · **Tested by:** QA

Matrix from `get_metadata`: `Size` = sm 16, md 24, lg 40. Geometry was compared against Figma's own exported SVG paths. Figma render: `figma-84-33.png`.

| Case | Figma (exported path) | Measured | Result |
|---|---|---|---|
| Size=sm (84:27) | 16² · donut R8 / r5.6 · track `#f1f4f7` · arc `#1d4ed8` 270° | 16×16 · r 6.8, stroke 2.4 · colours match · 270° | Passed |
| Size=md (84:29) | 24² · R12 / r8.88 | 24×24 · r 10.44, stroke 3.12 | Passed |
| Size=lg (84:31) | 40² · R20 / r16 | 40×40 · r 18, stroke 4 | Passed |

Rotating (`hds-spinner-rotate`, 1s, infinite) · `role=status` · `aria-label="Loading"` ✓.

**Design gap:** rotation duration and easing are unbound. Figma carries no motion tokens, so the build isolates both values on two custom properties.

## Verdict
**3 of 3 passed.**
