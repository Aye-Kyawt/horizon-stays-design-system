# button — design gaps

Raised by the release review of `v0.1.0` at commit `3e0cf2c`, which gave `.button` a
verdict of **Blocked** on gate G3. Every item here is a place where `Button.css` reads
a `core/*` primitive because the semantic layer in front of it carries nothing for that
role — or carries a token whose value disagrees with the node.

`CLAUDE.md`: *"Semantic tokens point at primitives. Components use semantic tokens
only."* and *"A token that exists in one mode and not another is a design gap; report
it rather than filling it in."*

Nothing here has been guessed, substituted or filled in. Substituting would mean either
changing what the component renders — diverging from the Figma node that QA passed 15 of
15 staging rows against — or pointing a role at a token that means something else, which
satisfies the gate while defeating the rule behind it.

Figma file: `2k87mtkZMvxQIYwjLX82pu`
<https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=31-140>

Release review: `reports/release-review/v0.1.0-3e0cf2c.md`

---

## 1. Four interaction colours bind to primitives, and no semantic token carries their values

`Button.css` L58–61. These four are the only reads in the file with **no comment
explaining them** — the padding and the focus ring below both carry their reasoning at
the point of use, these do not.

| Line | Custom property | Binds | Resolves to | Nearest token *by value* | Token that *means* the role | Conflict |
|---|---|---|---|---|---|---|
| 58 | `--hds-button-c-action-hover` | `core/color/sky/700` | `#235d93` | `semantic/color/text/info` | `component/button/bg/primary/hovered` | means-correct token is `core/color/blue/800` — **a different colour** |
| 59 | `--hds-button-c-border-hover` | `core/color/blue/900` | `#17307b` | `semantic/color/bg/primary/pressed`, `semantic/color/text/link/visited` | **none** — no border-hover role exists at any layer | — |
| 60 | `--hds-button-c-icon-hover` | `core/color/navy/600` | `#1b4a8f` | **none, on any layer** | **none** — no icon role at `component/button/*` | value appears nowhere else in the system |
| 61 | `--hds-button-c-icon-disabled` | `core/color/neutral/600` | `#8a94a6` | `semantic/color/text/disabled` | `semantic/color/icon/disabled` | means-correct token is `core/color/neutral/500` — **a different colour** |

Two distinct problems in one table.

**L59 and L60 have no destination at all.** The `component/button/*` tier is otherwise
well populated — it carries `bg/primary/{idle,hovered,pressed,disabled}`,
`bg/secondary/*`, `bg/negative/*`, `text/*`, `border/secondary`, `border/focused`,
`radius/md`, `padding/x/*`, `padding/y/*` and `gap/md`, and `Button.css` already uses
five of them. It has **no icon role and no border-hover role**. Those two reads have
nowhere to go even in principle.

**L58 and L61 have a destination that disagrees with the node.** The semantically
correct token exists, and resolves to a different colour than the button draws. Moving
to it changes the rendered component; staying put reads a primitive.

**Needed:** add `component/button/icon/{hovered,disabled}` and
`component/button/border/hovered`; and confirm whether the hover action colour is
`sky/700` (what the node draws) or `blue/800` (what `bg/primary/hovered` resolves to),
and whether a disabled icon is `neutral/600` (drawn) or `neutral/500` (semantic). Either
answer is fine — but the two must stop disagreeing.

---

## 2. The 10px `padding-block` cannot be expressed in semantic spacing

`Button.css` L103 — `calc(var(--core-spacing-8) + var(--core-spacing-2))`.

The reasoning is already recorded in the file: `component/button/height/md` aliases
`core/size/control/md` at 44px, but the Figma button is 40px tall, so height is left to
fall out of `10 + 20 + 10` (+1 +1 of border on Fill and outline), landing on exactly 42
and 40. Setting the height token would contradict the node.

The gap is that 10px has no semantic expression. The spacing ramp starts at
`semantic/spacing/padding/2xs` = 4px, and `component/button/padding/y/sm` is 8px — two
short. There is no 2px step and no 10px step anywhere in `semantic/spacing/*`.

`docs/avatar-naming.md` records the same shape of problem for its 14x14 glyph box,
citing this very line.

**Needed:** either a `component/button/padding/y` that resolves to the 10px the node
draws, or a decision that the button is 44px and the node changes.

---

## 3. The focus-ring inset has no offset token

`Button.css` L79 and L206 — `calc(-1 * var(--core-spacing-4))`, and on the transparent
type `calc(var(--semantic-border-width-base) - var(--core-spacing-4))`.

The file documents the intent: a 3px gap outside the painted edge in every cell, where
only the border width makes the raw numbers differ between types.

4px exists at five places by value — `semantic/spacing/padding/2xs`,
`semantic/spacing/gap/2xs`, `semantic/border/radius/sm`, `semantic/border/width/emphasis`
and `semantic/elevation/y/level3` — and **not one of them means "focus ring offset"**.
Using padding for an outline offset is a value coincidence, not a token.

**Needed:** a `semantic/focus/offset` (or `component/button/focus/offset`) role.

---

## 4. The label weight has no button-label type token

`Button.css` L125 — `font-weight: var(--core-type-fontweight-label-lg)` = 500.

The rest of the type block on the same rule reads `--label-large-*` for family, size,
line-height and letter-spacing. Only the weight drops to a primitive.

500 is carried by four semantic type tokens — `subtitle`, `link`, `field-label` and
`field-helper` font weights — all Latin. `field-label` is the closest by name and is
still wrong: that is a form field's label, not a button's.

**Needed:** a semantic or component type token for a button label at weight 500, or
confirmation that `field-label` is intended to cover button labels too.

---

## 5. This is not Button's problem alone

The same class of read appears in 8 of the 11 component stylesheets. Recorded here
because the review surfaced the tally, not to widen this document:

| Stylesheet | `core/*` reads |
|---|---|
| `Button.css` | 8 |
| `cardText.css` | 7 |
| `chip.css` | 6 |
| `spinner.css` | 6 |
| `iconBtn.css` | 5 |
| `tooltip.css` | 4 |
| `avatar.css` | 1 |
| `progressBar.css` | 1 |

Only `cardContainer`, `cardImage` and `cardLayout` are clean.

Two of these are already documented and are **not** re-raised here:

- `cardText`'s type bindings — `docs/cardContainer-design-gaps.md` §2.
- The missing `semantic/size/*` layer, which is what drives the `core/size/icon/*` reads
  in `iconBtn`, `chip`, `spinner`, `tooltip` and `avatar` — `docs/cardContainer-design-gaps.md` §9.

---

## What this blocks

`src/test/tokenDiscipline.test.ts` fails a component stylesheet that reads a base-layer
`--core-*` token, so `npm test` is red until these are resolved. Gate G3 requires both a
passing test run and a clean stylesheet, which means **no component can be Cleared for
release** while any of the eight stylesheets above still reads a primitive — not just
the one being reviewed.

Adding tokens is not the engineer's call, so nothing was added and nothing in
`src/` was changed.
