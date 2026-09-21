# progressBar — test report

**Component:** `src/components/progressBar/` · **Figma node:** [`84:26`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-26)
**Build under test:** staging Storybook · **Date:** 2026-09-21 · **Tested by:** QA

Matrix from `get_metadata`: `Tone` = primary, positive, negative, warning, each 320×28. Figma render: `figma-84-26.png`.

| Case | Figma | Measured | Result |
|---|---|---|---|
| Tone=primary (84:2) | fill 192×8 `#1d4ed8` | 320×28 · fill 192×8 `#1d4ed8` | Passed |
| Tone=positive (84:8) | fill `#1b7642` | fill `#1b7642` | Passed |
| Tone=negative (84:14) | fill `#c1362f` | fill `#c1362f` | Passed |
| Tone=warning (84:20) | fill `#c97812` | fill `#c97812` | Passed |

All four tones: gap 4 · track 320×8 `#f1f4f7` with radius full · label `#4a5768` and value `#667289`, Inter 400 12/16, ls 0.4 · `role=progressbar`, `aria-valuenow=60` ✓.

## Verdict
**4 of 4 passed.**
