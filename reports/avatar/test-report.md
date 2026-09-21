# avatar — test report

**Component:** `src/components/avatar/` · **Figma node:** [`54:9211`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=54-9211)
**Build under test:** staging Storybook · **Date:** 2026-09-21 · **Tested by:** QA

Matrix from `get_metadata`: `Status` = avatar, generic icon, initial name. Figma render: `figma-54-9211.png`.

| Case | Figma | Measured | Result |
|---|---|---|---|
| Status=avatar (54:9212) | 30×30 ellipse, photo fill | 30×30 · radius full · photo covers the circle | Passed |
| Status=generic icon (54:9214) | frame `#eff6ff`, 1px `#d7dee7`, radius xl · User glyph 14² at (8,8) `#1d4ed8` | exact | Passed |
| Status=initial name (54:9217) | frame as above · "HS" Inter 600 14/20, ls 0.25, `#1d4ed8`, y 5–25 | exact | Passed |

## Design gaps (not engineering defects)
- The root of 54:9217 is 30×32, but its only visible child is 30×30, as are both sibling variants. The extra 2px of empty height exists only in Figma.
- The initials are bound to `semantic/color/icon/primary`, an icon token, on a text layer.

## Verdict
**3 of 3 passed.**
