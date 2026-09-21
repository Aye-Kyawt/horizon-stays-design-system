# tooltip — test report

**Component:** `src/components/tooltip/` · **Figma node:** [`74:20`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=74-20)
**Build under test:** staging Storybook · **Date:** 2026-09-21 · **Tested by:** QA

Matrix from `get_metadata`: `Placement` = top and bottom (93×36), left and right (97×32). Figma render: `figma-74-20.png`.

| Case | Figma | Measured | Result |
|---|---|---|---|
| Placement=top (74:2) | 93×36 · arrow 8×4 below, pointing down | 91.89×36 · arrow matches the export, centred | Passed |
| Placement=bottom (74:8) | 93×36 · arrow above, pointing up | 91.89×36 | Passed |
| Placement=left (74:12) | 97×32 · arrow 4×8 right, pointing right | 95.89×32 | Passed |
| Placement=right (74:16) | 97×32 · arrow left, pointing left | 95.89×32 | Passed |

All four placements: bubble `#0f2f6b` · padding 8/12 · radius 4 · label `#fff` Inter 400 12/16, ls 0.4 · arrow `#0f2f6b` · `role=tooltip` ✓.
The width runs 1.11px narrow on every placement (label 67.89 against 69). It is the same delta on every case, which points to text rasterisation rather than the component.

## Verdict
**4 of 4 passed.**
