# `.chip` — prop naming

`CLAUDE.md` requires prop names to match the Figma property names exactly, and
says that any suggested rename is reported here rather than applied.

Node: [`.chip` 72:19](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=72-19)

| Figma property | Implemented as | Note |
|---|---|---|
| `status` | `status` | — |
| `icon` | `icon` | boolean — shows the leading slot |
| `icon1` | `icon1` | **rename suggested** |
| `label` | `label` | — |
| `removable` | `removable` | — |

## The `icon1` suggestion

`icon1` is Figma's auto-generated name for the instance-swap slot that sits
inside the `icon` boolean. The digit carries no meaning — it exists only
because a property called `icon` was already taken on the same component.

A reader of the code cannot tell `icon` from `icon1` without opening the node,
and the pair is easy to transpose: `icon` decides *whether* the slot shows,
`icon1` decides *what is in it*. `iconContent`, `iconSlot` or simply accepting
a node on `icon` itself (truthy shows the slot) would all read better.

This has not been applied. Renaming it in code alone would break the rule QA
tests against, and would make the component disagree with the node it is
supposed to mirror. **The rename belongs in Figma first**; the code should
follow whatever the property is called there.

The same shape appears on other components in this library that carry an icon
boolean plus a swap slot, so a decision here is worth making once rather than
per component.
