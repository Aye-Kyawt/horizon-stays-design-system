# `.progressBar` — prop naming

`CLAUDE.md` requires prop names to match the Figma property names exactly, and
says any suggested change is reported here rather than applied silently.

Node: [`.progressBar` 84:26](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-26)

| Figma property | Implemented as | Note |
|---|---|---|
| `tone` | `tone` | — |
| `meta` | `meta` | — |
| `label` | `label` | — |
| `value` | `value` | **name kept, type changed** |

## `value`: string in Figma, number in code

The node carries progress in two unconnected places:

- the `value` **property**, a string, which is only the text drawn on the right
- the **Fill layer's width**, which is what actually shows progress. The node's
  own description says "Resize the Fill layer to set the value."

A layer size is not a property, so there is nothing for a prop to match. Keeping
`value` as a string would mean either a bar that never moves, or a second
numeric prop that can silently disagree with the label — a component reading
"60%" beside a bar drawn at 25%.

`value` is therefore a number, 0-100, and drives both. The **name** still
matches Figma, which is what the rule asks for; only the type differs. Values
outside the range are clamped rather than rejected, so a caller cannot paint
past either end of the track.

## Worth fixing in Figma

The cleanest resolution is on the design side: make the Fill width a real
variable so progress is a property rather than a manual resize. Until then this
component's behaviour is defined here rather than in the node, which is the
wrong way round for a design system.
