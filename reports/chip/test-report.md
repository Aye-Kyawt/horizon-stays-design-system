# chip — test report

**Component:** `src/components/chip/` · **Figma node:** [`72:19`](https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=72-19)
**Build under test:** staging Storybook, `components-chip--*` · **Date:** 2026-09-21 · **Tested by:** QA (not the author)

Matrix read live off the node with `get_metadata`: 4 variants (`Status` = default, hovered, selected, disabled), each 52×24.
Fonts confirmed loaded before measuring: Inter measured 155.5px on a canvas, against 135.5px in a fallback family.
Figma render: `figma-72-19.png`.

## Matrix

| Case | Figma | Measured | Result |
|---|---|---|---|
| Status=default (72:2) | 52×24 · bg `#f1f4f7` · border `#e6ebf0` · label `#1b2733` | 54.47×26 · colours match | **Failed**: box (F1) |
| Status=hovered (72:6) | 52×24 · bg `#f1f4f7` · border `#d7dee7` | 54.47×26 · colours match; real pointer `:hover` agrees with the pinned story | **Failed**: box (F1) |
| Status=selected (72:11) | 52×24 · bg `#eff6ff` · border/label `#1d4ed8` | 54.47×26 · colours match | **Failed**: box (F1) |
| Status=disabled (72:15) | 52×24 · bg `#f1f4f7` · border `#e6ebf0` · label `#8a94a6` · remove glyph `#8a94a6` | 54.47×26 · remove glyph `#a9b3c0` | **Failed**: box (F1), glyph (F2) |

Type (all four): Inter 500 12/16, ls 0.5 ✓ · padding 4/12 ✓ · gap 4 ✓ · radius full ✓.
Driven: Tab reaches the remove control and shows a 2px `#1d4ed8` `:focus-visible` ring ✓. When disabled, the control is `disabled`, the chip has `pointer-events: none`, the glyph is not a hit target, and it cannot take focus ✓.

## Findings

```
F1 · chip · every status · box
Expected  52×24. The 1px stroke (semantic/border/width/base) sits inside the frame: 4 + 16 + 4 = 24
Saw       54.47×26. The CSS border is added outside padding-block/padding-inline
Where     chip.css .hds-chip, padding + border-width
Fix       subtract semantic/border/width/base from both paddings, or paint the edge as an inset box-shadow
```

```
F2 · chip · Status=disabled · removable
Expected  remove glyph #8a94a6 (Figma export of 72:18, which equals semantic/color/text/disabled)
Saw       #a9b3c0, from semantic/color/icon/disabled
Where     chip.css .hds-chip[data-status='disabled'] .hds-chip__remove
```

## Design gap (not an engineering defect)
The empty icon-slot placeholder (72:3) is drawn with raw values in Figma: fill `rgba(217,224,235,0.6)`, dashed border `#a8b5c7` and radius 2. None of them is bound to a token.

## Verdict
**4 of 4 failed.** Fix F1, which clears three rows, and F2.
