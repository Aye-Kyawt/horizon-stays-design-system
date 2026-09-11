# `.spinner` — prop naming

`CLAUDE.md` requires prop names to match the Figma property names exactly, and
says that any suggested rename is reported here rather than applied.

Node: [`.spinner` 84:33](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-33)

| Figma property | Implemented as | Note |
|---|---|---|
| `Size` | `size` | leading capital lowercased — see below |
| — | `label` | named by this repo, no Figma property behind it |

## The leading capital on `Size`

The component set's variant property is `Size`, with a capital S. It is
implemented as `size`.

This is the same change already made and recorded for `.cardContainer`'s
`Status` and `cardLayout`'s `Orientation` in `docs/cardContainer-naming.md`:
only the leading capital moves, to the lowercase that every non-variant
property in the file already uses. The variant *values* — `sm`, `md`, `lg` —
are verbatim.

**Suggestion for the design file:** lowercase `Size` in Figma so the node and
the code agree without a translation step. The file is already inconsistent
with itself — `icon`, `removable`, `label`, `ratio`, `hasSlot` are lowercase
while `Size`, `Status` and `Orientation` are not — so this is worth deciding
once across the library rather than per component.

## `label`, named by this repo

The node has no text or content property at all: the spinner is two ellipses
and nothing else. But a spinner with no accessible name announces nothing, so
the component takes a `label` prop that feeds `aria-label` on the `role="status"`
root, defaulting to `"Loading"`.

If design later adds a text property to the node, this prop should be renamed
to match whatever it is called there.

## Default variant

`size` defaults to `sm`, which is the component set's first variant (84:27).
Figma does not mark a default explicitly; first-child is the convention the
connection's own generated code follows for this node.
