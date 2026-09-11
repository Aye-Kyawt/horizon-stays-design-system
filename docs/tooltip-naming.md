# `.tooltip` — prop naming

`CLAUDE.md` requires prop names to match the Figma property names exactly, and
says that any suggested rename is reported here rather than applied.

Node: [`.tooltip` 74:20](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=74-20)

| Figma property | Implemented as | Note |
|---|---|---|
| `Placement` | `Placement` | **rename suggested** — capital `P` |
| `label` | `label` | — |

Variant values are `top`, `bottom`, `left`, `right`, all lowercase on the node
and all lowercase in code.

## The `Placement` suggestion

The variant property is spelled with a capital `P` on the node — the layer
names are `Placement=top`, `Placement=bottom`, `Placement=left`,
`Placement=right`. Every other property in this library is lowercase or
camelCase: `.Button` has `type`, `status`, `label`, `iconLeft`, `iconRight`;
`.chip` has `status`, `icon`, `icon1`, `label`, `removable`. `Placement` is the
only capitalised property name in the set.

That matters in code in a way it does not in Figma. React props are
conventionally camelCase, and a capitalised one reads at a glance like a
component rather than a prop:

```tsx
<Tooltip Placement="left" label="Tooltip text" />
```

Lowercasing it to `placement` would match every other property in the library,
match Figma's own code generator (which already emits `placement`), and match
what any consumer will type from muscle memory. It is also the name the CSS
attribute already uses internally (`data-placement`), because a `data-*`
attribute cannot carry an uppercase letter — HTML lowercases it — so the node's
spelling and the DOM's spelling already disagree.

This has not been applied. Renaming it in code alone would break the rule QA
tests against, and would make the component disagree with the node it mirrors.
**The rename belongs in Figma first**; the code should follow whatever the
property is called there.

## Not a naming problem, but worth recording

`Placement` names which side of the bubble the arrow sits on. It does **not**
position the tooltip — this component is presentational and the consumer
anchors it. `Placement="top"` means "the tooltip sits above its trigger, so the
arrow hangs off the bottom edge", which is the convention every popover library
uses, but the property name alone does not say so. Figma's description does:
"Placement puts the arrow on the side facing the trigger."
