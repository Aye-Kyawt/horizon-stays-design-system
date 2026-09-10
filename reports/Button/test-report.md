# Button — test report

**Component:** `src/components/Button/` · **Figma node:** [`31:140`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=31-140) (`.Button`)
**Date:** 2026-09-10 · **Tested by:** QA (not the author of the component)

---

## How this run was done, and what that limits

The Figma MCP connection and the browser tools were **both unavailable** for this
session. Step 1 of the test skill (pull the node live) and steps 3–5 (load the
component in Storybook, measure computed style, drive the states, screenshot)
could not be run as written.

Rather than compare the component to its own story file — which proves nothing —
this run used the **Figma render captured live on 2026-09-09**,
`reports/Button/figma-31-140-all-15-cells.png`, as the design side of the
comparison. That PNG was decoded and **sampled pixel by pixel**: box extents
found by scanning for painted pixels, colours read out of the buffer. No value
below was judged by eye.

The component side was taken by resolving every custom property in
`Button.css` through `build/css/web.css` to its literal value.

So the comparison is **Figma's own render vs. the component's declared and
resolved token values**. What that cannot prove is that the browser's *computed*
result matches the declaration — cascade, specificity and font loading are
unverified. Every geometry figure below is arithmetic from resolved tokens, not
a measurement of a rendered button.

---

## Per-cell results

Colours are Figma's, sampled from the render; the component column is the
resolved token chain.

### Fill

| Status | Property | Figma (sampled) | Component (resolved) | |
|---|---|---|---|---|
| default | background | `#1d4ed8` | `bg-primary` → blue-700 `#1d4ed8` | PASS |
| | border | `#1d4ed8` | `border-primary-focused` → blue-700 `#1d4ed8` | PASS |
| hovered | background | `#1b3fa8` | `bg-primary-hovered` → blue-800 `#1b3fa8` | PASS |
| | border | `#1d4ed8` | inherited from Fill base `#1d4ed8` | PASS |
| focus | background | `#1d4ed8` | `#1d4ed8` | PASS |
| | ring | `#1d4ed8`, box 209×48 | inset −4px on a 201×40 padding box → 209×48 | PASS |
| disabled | background | `#f1f4f7` | `bg-disabled` → neutral-100 `#f1f4f7` | PASS |
| | border | `#8a94a6` | stand-in → neutral-600 `#8a94a6` | PASS (see G1) |
| | label | `#8a94a6` | `text-disabled` → neutral-600 `#8a94a6` | PASS |
| error | background | `#c1362f` | `bg-negative` → red-600 `#c1362f` | PASS |
| | border | `#c1362f` | `icon-negative` → red-600 `#c1362f` | PASS |

### outline

| Status | Property | Figma (sampled) | Component (resolved) | |
|---|---|---|---|---|
| default | background | `#ffffff` | `bg-surfaceprimary` → white | PASS |
| | border | `#1d4ed8` | `border-primary-focused` `#1d4ed8` | PASS |
| hovered | border | `#17307b` | stand-in → blue-900 `#17307b` | PASS (see G2) |
| | icon | `#1b4a8f` | stand-in → navy-600 `#1b4a8f` | PASS (see G2) |
| | label | (lighter than icon) | stand-in → sky-700 `#235d93` | PASS (see G2) |
| focus | ring | box 209×48 | inset −4px → 209×48 | PASS |
| disabled | border | `#8a94a6` | stand-in → neutral-600 `#8a94a6` | PASS (see G1) |
| error | border | `#c1362f` | `icon-negative` → red-600 `#c1362f` | PASS |

### transparent

| Status | Property | Figma (sampled) | Component (resolved) | |
|---|---|---|---|---|
| all | background | none painted | `transparent` | PASS |
| all | border | none painted | `border-width-none` → 0px | PASS |
| hovered | icon | `#1b4a8f` | navy-600 `#1b4a8f` | PASS |
| focus | ring | box 207×46 | inset `1px − 4px` = −3px on 201×40 → 207×46 | PASS |
| error | label | `#c1362f` | `text-negative` → red-600 `#c1362f` | PASS |
| disabled | label | `#8a94a6` | `text-disabled` → neutral-600 `#8a94a6` | PASS |

**15 of 15 cells agree with the Figma render on every colour sampled.**

---

## Geometry

Figma's rendered box, measured at the horizontal centre of each cell to avoid
the 8px corner radius:

| | Figma (measured) | Component (resolved arithmetic) | |
|---|---|---|---|
| Fill / outline height | **42px** | 20 line-height + 10 + 10 padding + 1 + 1 border = **42** | PASS |
| transparent height | **40px** | 20 + 10 + 10, no border = **40** | PASS |
| Fill / outline focus ring | **209 × 48** | inset −4px on 201×40 padding box | PASS |
| transparent focus ring | **207 × 46** | inset −3px on 201×40 border box | PASS |
| padding-inline | 12px | `padding-x-sm` → `spacing-12` = 12px | PASS |
| padding-block | 10px | `calc(spacing-8 + spacing-2)` = 10px | PASS (see G3) |
| gap | 8px | `gap-md` → `gap-xs` → `spacing-8` = 8px | PASS |
| radius | 8px | `radius-md` → `radius-sm` = 8px | PASS |
| ring radius | 12px | `card-radius-lg` → `radius-md` = 12px | PASS |
| border width | 1px | `border-width-base` → 1px | PASS |

The focus-ring geometry is worth calling out: the two inset values are **not** a
rounding accident. −4px on a bordered box and −3px on an unbordered one both put
the ring exactly 3px outside the painted edge, and the measured 209×48 / 207×46
confirm it to the pixel.

**Width is NOT verified.** Figma renders Fill/outline at 203px. The component is
hug-contents, so its width depends on how the browser shapes the label — which
needs a browser this session did not have.

---

## Typography

| | Figma | Component (resolved) | |
|---|---|---|---|
| family | Inter | `label-large-font-family` → `fontfamily-brand` → Inter | PASS |
| size | 14px | `size-label-lg` = 14px | PASS |
| line-height | 20px | `lineheight-label-lg` = 20px | PASS |
| tracking | 0.1px | `tracking-label-lg` = 0.1px | PASS |
| weight | 500 | `fontweight-label-lg` → medium = **500** | PASS |

The weight is on the 500 token, not the heavier `--semantic-type-latin-button-*`
that would have given 600. Correct.

**Font loading is NOT verified** — that check requires a canvas measurement in a
browser. No width claim in this report depends on it.

---

## Icon

`src/icons/Info.tsx` compared against the Figma asset saved from node `30:93`
(`reports/Button/figma-info-icon-30-93.svg`):

- Path data is **identical** apart from 5-decimal values rounded to 4
  (`5.33333`→`5.3333`, `1.33333`→`1.3333`, `8.00667`→`8.0067`). Sub-thousandth
  of a pixel — not a defect.
- `viewBox="0 0 16 16"`, 16×16, `stroke-width` 1.6, round cap and join — all match.
- `stroke="currentColor"` replaces the export's baked `stroke="white"`. This is
  deliberate and necessary: one glyph serves all fifteen cells and takes its
  colour from the slot. Correct.

**This is the real Simple Design System asset, not a substitute.** PASS.

*Documentation nit:* the header comment in `Info.tsx` describes the export as
arriving with a 14.9333 viewBox at origin 0.5333, requiring a +0.5333 shift. The
export on disk is already 16×16 with matching coordinates. The geometry is
right; the provenance note describes a transform that the saved artifact does not
need.

---

## Contrast (computed, WCAG 2.1)

| | ratio | |
|---|---|---|
| light — Fill label `#ffffff` on `#1d4ed8` | **6.70:1** | passes AA |
| dark — Fill label `#1b2733` on `#60a5fa` | **5.97:1** | passes AA |
| dark — if white were pinned instead | **2.54:1** | **would fail AA** |
| light — error label `#ffffff` on `#c1362f` | 5.47:1 | passes AA |
| light — outline hovered label `#235d93` | 6.87:1 | passes AA |
| light — outline hovered icon `#1b4a8f` | 8.67:1 | passes AA |
| light — disabled label `#8a94a6` on `#f1f4f7` | 2.77:1 | exempt (disabled) |

I checked whether label and icon disagree in dark mode, since they come from two
different tokens. They do not: `--semantic-color-text-inverse` (line 1216) and
`--semantic-color-icon-inverse` (line 1277) are **both** overridden to
neutral-950 in the dark block. Label and icon stay in step. Not a finding.

---

## Token discipline

`vitest run` → **19/19 pass** (`src/test/tokenDiscipline.test.ts`).

With comments stripped, `Button.css` contains **no raw hex, px, rem or rgb() in
any declaration** — 54 `var(--…)` references and nothing else. `Info.tsx` is
clean. PASS.

---

## Design gaps — reported as gaps, not logged against the engineer

**G1 · `semantic/color/icon/disabled` disagrees between Figma and the token build.**
Figma's value, sampled from its own render, is `#8a94a6` (core neutral-600). The
local `--semantic-color-icon-disabled` resolves to `--core-color-neutral-500`
= `#a9b3c0` — one step lighter. The component bypasses the semantic token with a
marked stand-in to match the design. That is the right call under "Figma is the
source of truth," and the measurement confirms Figma really is `#8a94a6`. **The
token needs fixing, not the component.**

**G2 · Three semantic tokens do not exist locally.** `text/action hover`,
`border/on hover` and `icon/hover` are bridged to the primitives that already
carry the right values (sky-700, blue-900, navy-600), each with a comment naming
the token that should replace it. Deleting the block and repointing three usages
is the whole cleanup once tokens are re-exported.

**G3 · Two Figma values are unbound.** padding-y is 10px where the spacing scale
offers only 8 and 12; the focus-ring offset is a raw −4/−3. Both are built as
`calc()` from real tokens rather than rounded — rounding padding-y to 8 or 12
would break the measured 42px height.

**G4 · `--component-button-height-md` contradicts the design.** It resolves to
44px; Figma is 40px tall (42 with border). The component correctly sets no
`height` at all and lets padding and line-height produce it. The token still
needs a design owner's decision.

**G5 · Dark theme has no `prefers-color-scheme` block.** `build/css/web.css`
defines dark only under `[data-theme="dark"]`, so a viewer with a system dark
preference and no explicit attribute gets the light palette. Outside Button's
scope — a token-build matter — but it affects how the dark values above are ever
reached.

---

## Not tested, and why

Everything here needs a browser, which this session did not have:

- **Rendered width** — the 203px Figma / ~201px browser question. The author
  attributes it to Inter text shaping (129px vs 127.28px for the label string).
  Plausible and consistent with the arithmetic, but **unverified**.
- **Font loading** — the canvas double-measure against a bogus family.
- **Driven states** — real Tab focus (`:focus-visible` vs the pinned
  `[data-status='focus']` story), real pointer hover, and whether `disabled`
  genuinely suppresses the click handler. The CSS defines both a pinned-state
  and a live-interaction rule for hover and focus; only the pinned half is
  evidenced here.
- **Accessibility** — accessible name, the a11y addon, focus order.
- **Screenshots of the component.** The only images in `reports/Button/` are the
  Figma side.

The pinned stories and the live interaction rules are *declared* consistently in
`Button.css`. Confirming they *behave* consistently is exactly what the missing
browser would have shown.

---

## Status

No cell contradicts the Figma render on any value that could be measured without
a browser. Colour, geometry arithmetic, typography bindings, icon geometry and
token discipline all agree. Five design gaps are recorded above; G1 is the one
that needs action, and it is a token fix.

The component remains **unverified in a browser**. This report is not a
substitute for that pass — re-run `/test` with the Figma MCP and browser tools
connected to close out width, fonts, driven states and accessibility.

Nothing in `src/` was changed by this run.
