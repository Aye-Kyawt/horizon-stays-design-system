# Release 0.1.0 — token proposal

Release review `v0.1.0-ecf0c4d` blocked every component on gate G3: `npm test` fails while any
component stylesheet reads a base-layer `--core-*` token, so **no component can be Cleared until
all 40 reads are gone**. This document sorts those 40 reads into:

- **Part A (8 reads):** reads with a token that already exists and resolves to the same
  primitive on every platform. The engineer can fix these now, with no design decision and no
  rendered change.
- **Part B (32 reads):** reads with no legal destination. Design has to decide each one.

Read at `2875311` (`origin/main`). Figma file `2k87mtkZMvxQIYwjLX82pu`. Nothing in `tokens/` or
`src/` is changed by this document. Adding tokens is design's call, and every name below is a
**proposal**.

| Stylesheet | Reads | Part A | Part B |
|---|---|---|---|
| `Button.css` | 9 | 1 | 8 |
| `cardText.css` | 7 | 7 | 0 |
| `chip.css` | 6 | 0 | 6 |
| `spinner.css` | 6 | 0 | 6 |
| `iconBtn.css` | 5 | 0 | 5 |
| `tooltip.css` | 4 | 0 | 4 |
| `avatar.css` | 2 | 0 | 2 |
| `progressBar.css` | 1 | 0 | 1 |
| **Total** | **40** | **8** | **32** |

---

## Part A · Engineer can repoint now (8 reads, no design decision)

Each replacement is a typography style token that aliases **the same `core/*` primitive** the
stylesheet reads today. This was verified in all three builds: `build/css/web.css`, `mobile.css`
and `back-office.css`. The computed value cannot change, so no staging row that passed is
affected.

| Where | Reads today | Replace with | Same alias on all 3 platforms |
|---|---|---|---|
| `Button.css#L125` | `--core-type-fontweight-label-lg` | `--label-large-font-weight` | ✓ |
| `cardText.css#L58` | `--core-type-fontweight-body-semibold-md` | `--body-medium-semibold-font-weight` | ✓ |
| `cardText.css#L107` | `--core-type-fontweight-body-semibold-md` | `--body-medium-semibold-font-weight` | ✓ |
| `cardText.css#L83` | `--core-type-fontfamily-brand` | `--label-medium-font-family` | ✓ |
| `cardText.css#L84` | `--core-type-size-label-md` | `--label-medium-font-size` | ✓ |
| `cardText.css#L85` | `--core-type-lineheight-label-md` | `--label-medium-line-height` | ✓ |
| `cardText.css#L86` | `--core-type-tracking-label-md` | `--label-medium-letter-spacing` | ✓ |
| `cardText.css#L87` | `--core-type-fontweight-label-md` | `--label-medium-font-weight` | ✓ |

Two stylesheet comments are now out of date:

- `Button.css` says the `--label-large-*` set "has no font-weight member at all".
  `--label-large-font-weight` exists in all three builds.
- `cardText.css` and `docs/cardContainer-design-gaps.md` §2 say "no semantic type token carries
  body-md at semibold". `--body-medium-semibold-*` does, and `avatar.css` already uses it.

This clears `cardText.css` completely, but it does not clear G3 on its own. G3 is a whole-repo
test run, so Part B still has to land.

**Checked and rejected:** `chip.css#L99`'s `--core-border-radius-xs` → `--semantic-border-radius-sm`
looks like the same alias. It is on web and mobile (4px), but on back-office
`semantic/border/radius/sm` points at `core/border/radius/2xs` (2px). It is not value-identical, so
it is in Part B.

---

## Part B · Design decides (32 reads)

### B1 · A `semantic/size/*` layer (13 reads)

The `size` category is the only one with no semantic layer (`docs/cardContainer-design-gaps.md`
§9). Proposed, each aliasing the core step the components already read:

| Proposed token | Aliases | Value | Replaces |
|---|---|---|---|
| `semantic/size/icon/xs` | `core/size/icon/xs` | 16 | `chip.css#L86-87` (icon slot), `spinner.css#L63-64` (sm), `iconBtn.css#L113-115` (glyph) |
| `semantic/size/icon/md` | `core/size/icon/md` | 24 | `spinner.css#L69-70` (md) |
| `semantic/size/icon/lg` | `core/size/icon/lg` | 32 | `iconBtn.css#L35-36` (box) |
| `semantic/size/icon/xl` | `core/size/icon/xl` | 40 | `spinner.css#L75-76` (lg) |

While the layer is being added, re-point `component/button/height/*` and
`component/input/height/*` through it; both alias `core/size/control/*` directly today.

### B2 · Avatar box (2 reads)

`avatar.css#L55` builds its 14px glyph box from `core/size/icon/2xs` + `core/spacing/2`, because
nothing carries 14 or 30. Pick one:

- **`component/avatar/size` = 30** and **`component/avatar/glyph` = 14**, or
- add a 14 step to the icon ramp (`semantic/size/icon/2xs-plus` or similar).

### B3 · Artwork geometry (7 reads)

These values describe drawn shapes, not spacing, so a spacing token is the wrong home even where
the number matches.

| Proposed token | Value | Replaces |
|---|---|---|
| `component/tooltip/arrow/length` | 8 | `tooltip.css#L106`, `#L114` |
| `component/tooltip/arrow/depth` | 4 | `tooltip.css#L107`, `#L113` |
| `component/progress/track/height` | 8 | `progressBar.css#L74` |
| `component/chip/remove/size` | 8 | `chip.css#L115-116` |

### B4 · Focus-ring offset (3 reads)

| Proposed token | Value | Replaces |
|---|---|---|
| `semantic/focus/offset/sm` | 2 | `chip.css#L132` (remove control outline offset) |
| `semantic/focus/offset/md` | 4 | `Button.css#L79`, `#L206` (ring inset) |

### B5 · Chip icon-slot placeholder radius (1 read)

`chip.css#L99` reads `core/border/radius/xs` (4px) for the empty slot's placeholder. The Figma
node (72:3) draws it with a **raw 2px**, and its fill `rgba(217,224,235,0.6)` and dashed border
`#a8b5c7` are raw too. Bind the placeholder in Figma, then the component follows. If it binds to
`semantic/border/radius/xs` (2px on every platform), the fix is a one-line repoint.

### B6 · Button (6 reads, from `docs/button-design-gaps.md`)

| Where | Reads | Proposed token | Decision needed |
|---|---|---|---|
| `Button.css#L58` | `core/color/sky/700` `#235d93` | `component/button/bg/primary/hovered` | The node draws `sky/700`, but that token resolves to `blue/800`. Which colour is right? |
| `Button.css#L59` | `core/color/blue/900` `#17307b` | **new** `component/button/border/hovered` | None; it only needs to exist |
| `Button.css#L60` | `core/color/navy/600` `#1b4a8f` | **new** `component/button/icon/hovered` | None; it only needs to exist |
| `Button.css#L61` | `core/color/neutral/600` `#8a94a6` | **new** `component/button/icon/disabled` | `neutral/600` (as drawn) or `neutral/500` (`semantic/color/icon/disabled`)? |
| `Button.css#L103` | `core/spacing/8` + `core/spacing/2` (10px) | **new** `component/button/padding/y/default` | 10px has no core step. Add `core/spacing/10`, or make the button 44px tall and change the node |

`chip.css`'s disabled remove glyph raises the same `icon/disabled` question. QA's staging pass
found the node draws `#8a94a6` (= `neutral/600`), while the build uses
`semantic/color/icon/disabled`. One decision answers both.

---

## What clears the release, in order

1. **Engineer:** Part A, 8 repoints with no value change, which clears `cardText.css`. Also fix the
   two chip findings from QA's staging pass (the border outside the padding, and the disabled
   glyph once B6 is decided).
2. **Design:** decide B1–B6, add the tokens in Figma and re-export.
3. **Token Runner:** rebuild tokens.
4. **Engineer:** repoint the 32 Part B reads. `npm test` must pass.
5. **QA:** re-test every touched component on staging. The values must not have moved.
6. **Design:** record a decision on `showPrice` / `showReview` / `showMetadata`
   (`docs/cardContainer-naming.md#L28-L40`), which clears G5 for `cardText`.
7. **Reviewer:** re-run release review. G1 for `cardText` is already satisfied:
   `src/components/cardText/cardText.intent.json` landed in `6a9abbb`. Once Part A lands, that
   file's `required_tokens` needs regenerating, because it lists the seven `--core-*` reads as the
   stylesheet reads them today.
