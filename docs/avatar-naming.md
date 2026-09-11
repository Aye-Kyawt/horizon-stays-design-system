# `.avatar` — prop naming, and what the node leaves unbound

`CLAUDE.md` requires prop names to match the Figma property names exactly, and
says that any suggested rename — or any property the design never exposed — is
reported here rather than decided unilaterally in code.

Node: [`.avatar` 54:9211](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=54-9211)

## Figma property names, kept

| Figma property | Prop in code | Note |
|---|---|---|
| `Status` | `status` | leading capital lowercased, as on `.cardContainer`, `.cardImage` and `.chip` |

The variant **values** are verbatim, spaces included:
`'avatar' | 'generic icon' | 'initial name'`. They were not camel-cased to
`genericIcon` / `initialName`, because the rule is exactness and QA tests
against the node's own spelling. If design prefers single-word values, the
rename belongs in Figma first and the code follows.

That is the whole property list. The set has one axis and no booleans.

## Properties the design never exposed

The component set exposes `Status` and nothing else. Both pieces of content are
baked into layers:

| What | Where it is baked | Prop named by this repo |
|---|---|---|
| the photo | image fill on `Ellipse` 54:9213 | `src`, `alt` |
| the initials | fixed `HS` text layer 54:9219 | `initials` |

An avatar that can only ever be one person is not a component, so these are
props. They follow the precedent `.cardImage` set, whose Figma fill is likewise
a placeholder rather than a design value. No artwork is invented: with no `src`
the photo variant renders its bare `semantic/color/bg/surfacePrimary` ground,
and `initials` defaults to the node's own `HS` so the untouched component
matches the node.

**Suggestion for design:** expose `image` (instance swap or image property) and
`initials` (text property) on the set, so the code props have something in
Figma to match and Code Connect can map them.

## Values the design left unbound

None of these were guessed onto a nearby token. Each is either composed from
real steps or left to fall out of the box model, and each is an open question
for design.

| Value | Where | Status |
|---|---|---|
| **30 x 30** frame size | all three variants (54:9212, 54:9214, 54:9217) | No variable, and no token exists that carries 30. The token file has no `semantic/size/*` layer; `core/size/icon/*` ramps 12/16/20/24/32/40 and `core/size/control/*` 36/44/52. Built in `avatar.css` as `component/button/padding/y/sm` x 2 + the 14px glyph, which is the node's own auto-layout. **Needs a size token.** |
| **14 x 14** glyph box | `User` 54:9216 | No variable. Composed from `core/size/icon/2xs` (12) + `core/spacing/2` (2) rather than rounded to 12 or 16 — rounding would change the 30x30 the node measures. Same reasoning `Button.css` records for its unbound 10px padding. **Needs a 14 step on the icon ramp, or the avatar needs to move to 16.** |
| **px 3 / py 5** | inner frame 54:9218 | No variables, and both are off the spacing scale (2, 4, 8, 12, ...). Not reproduced. The 20px line box centred in the 30px box lands the text at y 5..25 — exactly where py:5 puts it — so the value falls out instead of being invented. |

## Inconsistencies in the node, reported not corrected

1. **Two radius tokens on one component.** The variant root binds
   `semantic/border/radius/full` (9999) while the inner frame binds
   `semantic/border/radius/xl` (16). Both are kept as the node has them. On a
   30px box CSS clamps a 16 radius to 15, so the frame still renders as a true
   circle and the node's own screenshot agrees — but a component that means
   "circle" should say `radius/full` in both places.

2. **An icon token colouring text.** The initials layer 54:9219 binds
   `semantic/color/icon/primary` (#1d4ed8), not a text token. That is what the
   node reads, so that is what the CSS uses. A text colour token with the same
   value would be the honest binding.

3. **`semantic/spacing/gap/xs` on a single-child frame.** `Frame 2` 54:9215
   binds an 8px gap but holds one child, so the gap never applies. Kept,
   because it is bound; harmless either way.

4. **The `initial name` variant frame measures 30 x 32.** Its inner box is
   30 x 30 at top-left, so the extra 2px is text-bounds overflow in Figma, not
   a taller avatar. The component is built at 30 x 30, matching the other two
   variants and the inner box.

## The `generic icon` glyph

`User` 54:9216 is a **Simple Design System** library instance, vendored into
`src/icons/User.tsx` with its provenance, geometry and the one deliberate
change (`stroke="currentColor"`) recorded in the file header. It is not a
Material Symbols substitute. Figma scaled the source 24-unit outline to 14 but
kept the stroke at an absolute 2; the export is preserved as-is, because that
is what the node renders.
