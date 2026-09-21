# cardContainer — design gaps

Raised by the engineer while building `.cardContainer` (Figma `39:2065`, commissioned
from instance `39:2355`) and its subcomponents. Every item here is a property the
Figma file leaves unbound, self-contradictory, or bound to the wrong token layer.

None of them has been guessed, substituted or filled in. Each needs a decision from
design before the affected state can be finished.

Figma file: `2k87mtkZMvxQIYwjLX82pu`
<https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2355>

---

## 1. `.cardImage` `Status=hovered` has no bound values at all — state not implemented

Node `39:2192` / `39:2198`.

The hovered variant differs from default in exactly three ways, and not one of them
is behind a variable:

| Property | Value in Figma | Bound? |
|---|---|---|
| Image opacity | `0.2` | no |
| Scrim | linear gradient, `rgba(0,0,0,0.2)` at 15.476% → `rgba(102,102,102,0.04)` at 61.905% | no |
| Surface behind the image | raw `#FFFFFF`, via a loose style named `overlay` (`"#FFFFFF,,"`) | no — the **default** variant binds this same surface to `semantic/color/bg/surfacePrimary` |

Consequence in code: `<CardImage status="hovered">` renders identically to
`status="default"`. It sets `data-status="hovered"` so the state is addressable and
testable, but paints nothing, because painting it would mean inventing three values.

The third row is the sharpest: the hovered variant **lost** a binding the default
variant has. That looks like an accident rather than a decision.

**Needed:** bind the opacity, the scrim stops and the surface colour — or confirm the
hover treatment should be dropped.

---

## 2. `.cardText` typography is bound to the base layer, and the semantic tokens in front of it disagree

Node `37:2034`. `CLAUDE.md`: *"Semantic tokens point at primitives. Components use
semantic tokens only."* This component's text is bound straight to `core/type/*`
primitives instead.

Where the semantic token happens to alias exactly the same primitives, the component
uses the semantic token — that is a resolution, not a substitution. Where it does not,
there is no legal token to use:

| Text | Figma binds | Semantic token for that role | Resolves to | Verdict |
|---|---|---|---|---|
| Title "Casa do Bairro" | size `body/md` 14px, lh 20px, ls 0.25px, weight `body/semibold/md` 600 | `semantic-type-latin-card-title` | **16px** / 24px / 0.15px / 600 | mismatch — 14 vs 16px |
| | | `semantic-type-latin-body` | 14px / 20px / 0.25px / **400** | size matches, weight does not |
| Location line | `body/sm` 12/16/0.4, weight 400 | `semantic-type-latin-meta` | 12 / 16 / 0.4 / 400 | **exact — used** |
| Price "121 EUR" | `body/md` 14px semibold, as the title | `semantic-type-latin-price` | **16px** / 24px / 0.15px / 600 | mismatch — 14 vs 16px |
| "(318 reviews)", "per night" | `body/sm` regular | `semantic-type-latin-meta` | exact | **exact — used** |

For the title and the price the component therefore takes size, line-height,
letter-spacing and family from `semantic-type-latin-body-*` (an exact alias of the
primitives Figma bound) and the weight from `--body-medium-semibold-font-weight`, the
Body/Medium Semibold text-style token, which aliases
`core/type/fontWeight/body/semibold/md` on every platform. An earlier version of this
section said no such token existed; it does, and `avatar.css` already used it. The
rating line likewise reads the `--label-medium-*` text-style tokens, which alias the
core `label/md` variables Figma binds. `cardText.css` now reads no core token.

The rendered values are unchanged. The mismatch below is still open: the
`semantic-type-latin-card-title` and `-price` tokens that *mean* these roles resolve to
16px, not the 14px the node draws.

**Needed:** either add a semantic type token for "card title / price at body-md
semibold", or re-point `type/card-title` and `type/price` at the body-md scale so the
existing semantic tokens match what the card actually renders.

---

## 3. The rating line carries two sources that contradict each other

Nodes `37:2028` ("4.7") and `37:2029` ("(318 reviews)").

These layers have variables attached **and** a raw text style on top, and they
disagree:

| | Bound variable | Raw text style `small/semibold` |
|---|---|---|
| Font size | `core/type/size/label/md` = 12px | 12 |
| Font weight | `core/type/fontWeight/label/md` = **500** | **600** (Semi Bold) |
| Letter spacing | `core/type/tracking/label/md` = **0.5px** | **0** |
| Line height | `core/type/lineHeight/label/md` = 16px | **100** |

`(318 reviews)` has the same problem against the style named `small`
(tracking 0 vs the bound `body/sm` 0.4px, line-height 100 vs 16px).

The component uses the **bound variables** and ignores the raw styles. Visible
consequence: the rating renders at weight 500, not the 600 seen in Figma.

**Needed:** delete the raw `small` / `small/semibold` text styles from these layers, or
bind them, so there is one source of truth.

---

## 4. `.iconBtn` — built. What each property landed on, and what is still open

Node `39:2185` (`.iconBtn`) containing `I39:2185;39:2159` (`Heart`).

An earlier pass left this position as an empty slot and wrote the gap up here instead.
That was wrong: the design visibly shows a heart on every card, and "report the unbound
value rather than guessing it" governs *which token* a property lands on — it does not
license shipping a component with an element missing. The component is now built at
`src/components/iconBtn/`, and `.cardImage` renders it in the overlay position by
default. The slot stays an escape hatch: `overlayAction` still toggles the position and
`children` still replaces its contents.

### The Figma matrix is one row

Read live off the file: **`.iconBtn` is not a component set.** It carries no variant
properties at all, and the instance is identical in all four `.cardImage` variants —
`39:2185`, `39:2180`, `39:2195`, `39:2199`, each 32×32 at 8px from the top-right corner.
There is no idle/hover/pressed ladder and no filled-vs-outline heart in the design.

### Where every property landed

| Property | Figma | Token used | Layer |
|---|---|---|---|
| Box background | `semantic/color/bg/negative/subtle` | `--semantic-color-bg-negative-subtle` | semantic — bound |
| Heart fill | `component/button/bg/negative/idle` | `--component-button-bg-negative-idle` | component — bound |
| Radius | raw `16px` on a raw `32px` box | `--semantic-border-radius-full` | semantic — **resolution, not a guess**: 16 on 32 *is* a circle, and `radius/full` is the system's word for circle |
| Box size | raw `32px` | `--core-size-icon-lg` (32px, "Icon box 32px") | **core, in a component** — see gap 9 |
| Glyph size | raw ~`13.3px` heart bounds | `--core-size-icon-xs` (16px) | **core, in a component** — see gap 9 |
| Offsets | raw `8px` top/right | `--semantic-spacing-padding-xs` on `.cardImage` | semantic — the bound padding resolves to the same 8px, so no raw offset was needed |

The glyph size is the one substitution. Figma's heart *vector bounds* measure ~13.3px;
16px is the em box a Material Symbols heart needs to render at roughly that size, and it
is also what `semantic/spacing/padding/xs` (8px, documented as "icon buttons") leaves
inside the 32px box. Confirmed against the Figma render, not assumed.

### The heart glyph

Figma's `Heart` (`39:2146`) is Code-Connected to a component in a library called
"Simple Design System" that this repo does not contain, and its main component is not
reachable in this file. Per `CLAUDE.md` the heart is now the **Material Symbols
`favorite` ligature**, family Material Symbols Rounded, loaded from the Google Fonts CDN
in `.storybook/preview-head.html` with `display=block`.

The font family is named by the vendor's own `.material-symbols-rounded` class, not by
`iconBtn.css` — **this token system has no icon font-family token**, and hardcoding one
in a component would break the rule the rest of the file keeps.

### Still open

1. **The heart's fill is a button-background token used as an icon colour.**
   `component/button/bg/negative/idle` → `semantic/color/bg/negative` — a *background*
   role painting a glyph. `semantic/color/icon/negative` exists and resolves to the same
   `core/color/red-600`. The design's binding is used as authored, but this looks like
   the token that was meant.
2. **No pressed state is possible.** There is no `component/button/bg/negative/pressed`
   and no `semantic/color/bg/negative/pressed`; the only pressed token in the system is
   `semantic/color/bg/primary/pressed`, which is blue. `:active` and
   `data-status="pressed"` are addressable and testable but **paint nothing** — painting
   them would mean inventing a colour.
3. **No hovered background for the box.** There is no
   `semantic/color/bg/negative/subtle/hovered`, so on hover the box keeps its bound
   background and only the heart darkens, onto `component/button/bg/negative/hovered` —
   the exact systematic sibling of the token the heart is bound to.
4. **Hovered, focused, pressed and disabled are not in Figma at all.** They are required
   by `CLAUDE.md` ("every component covers every interaction state the product uses").
   Focus uses `component/button/border/focused` + `semantic/border/width/strong`
   (documented as "Focus rings, selected states"); disabled uses
   `semantic/color/bg/disabled` + `semantic/color/icon/disabled`. Design should confirm
   or replace these.
5. **The un-favourited heart is not in Figma.** The design shows only the solid heart.
   `favourited` is an *optional* prop — leave it undefined and the button renders exactly
   what Figma shows and carries no `aria-pressed`. Pass a boolean and it becomes a real
   toggle, with the Material Symbols `FILL` axis switching solid/outline so that a
   control carrying `aria-pressed` is not signalling its state by nothing at all. The
   outline appearance needs a design decision.

### Prop naming

`CLAUDE.md` requires prop names to match the Figma property names, and requires new name
suggestions to be recorded here. **Figma defines no properties on `.iconBtn`**, so there
was nothing to match. The names chosen:

| Prop | Why |
|---|---|
| `status` | follows `.cardImage` and `.cardContainer`, which both use it for the pinned interaction state |
| `favourited` | maps to `aria-pressed`; British spelling to match the prose in this repo, while the Material Symbols ligature name stays `favorite` because that is the font's own token |
| `label` | the accessible name. The design carries no label text, so this is content the design does not specify — it defaults to "Save to favourites" |
| `icon` | the Material Symbols ligature name, so the button is not hard-wired to a heart |

---

## 5. `.cardImage` ratio variants do not match their own names

Node `39:2193`.

| Variant name | Actual frame | Actual ratio |
|---|---|---|
| `ratio=3:2` | 278 × 168 | ~5:3 (1.655), not 1.5 |
| `ratio=1:1` | 192 × 182 | ~1.055, not 1 |

The component reproduces the **measured geometry**, because that is what the design
renders and what QA will compare against. The names are wrong, not the boxes.

**Needed:** rename the variants, or resize the frames to match their names.

---

## 6. The `Slot` height is a loose 30px

Nodes `39:2590` (horizontal) and `39:2575` (vertical).

The slot in `cardLayout` is a fixed `30px` tall with nothing behind it. The component
lets the slot size to its content instead of hardcoding the number.

**Needed:** bind the reserved height, or confirm the slot should hug its content.

---

## 7. `.cardText` spacing uses an input token inside a card

Node `37:2034`. The vertical gaps inside `.cardText` are bound to
`component/input/gap/xs`, not to a card or a semantic spacing token. It resolves to the
same 8px as `semantic/spacing/gap/xs`, so nothing renders wrong today — but a change to
input spacing would silently move card text.

The component uses the binding as authored.

**Needed:** re-bind to `semantic/spacing/gap/xs` or to a card-scoped token.

---

## 8. `.cardContainer` defines only two of the states the product needs

Node `39:2065`. The set is `Status = default | hovered`.

`CLAUDE.md`: *"Every component covers every interaction state the product uses:
default, hovered, pressed, focused, disabled, error, loading as applicable."* A card
that is clickable needs at least **pressed** and **focused**; the token system already
carries `semantic/color/border/primary/focused` and
`semantic/color/bg/surfacePrimary/selected` waiting for them.

Also unused: `component/card/bg/hovered` exists, but the hovered variant changes only
the elevation and keeps `component/card/bg/idle`. That reads as deliberate, so it has
been implemented as designed — flagging it only so design can confirm.

**Needed:** decide whether the card is interactive, and if so add the missing states.

---

## 9. There is no semantic `size` layer anywhere in the token system

Not a `.cardContainer` problem — a system-wide one, surfaced by `.iconBtn` and worth
raising on its own because it will hit every icon box and every control anyone builds.

`CLAUDE.md`: *"Semantic tokens point at primitives. Components use semantic tokens
only."* Every other category honours that — `color`, `spacing`, `border/radius`,
`border/width` and `type` all have a `semantic/*` layer in front of `core/*`. The `size`
category **stops at core**. Grepping all three platform builds:

| Layer | Exists? |
|---|---|
| `core/size/icon/{2xs,xs,sm,md,lg,xl}` — 12, 16, 20, 24, 32, 40 | yes |
| `core/size/control/{sm,md,lg}` — 36, 44, 52 | yes |
| `semantic/size/*` | **none — not one token, on any platform** |
| `component/button/height/*`, `component/input/height/*` | yes, and they alias `core/size/control/*` **directly**, skipping the semantic layer |

So a component that needs a box size has no legal token to reach for. `.iconBtn` uses
`--core-size-icon-lg` (exactly the 32px the design draws, documented as "Icon box 32px")
and `--core-size-icon-xs` for the glyph, each with the layer noted at the point of use —
the same treatment `cardText.css` gives its core type refs. `core/size/control/sm` is
36px, so the control scale is not a substitute for a 32px icon box.

Note that the existing `component/*/height/*` tokens have the same problem and were
resolved the same way, which suggests this is an oversight in the export rather than a
deliberate decision.

**Needed:** add a `semantic/size/*` layer — at minimum icon-box and control-height roles
— and re-point `component/button/height/*` and `component/input/height/*` through it.
Adding tokens is not the engineer's call, so nothing was added.
