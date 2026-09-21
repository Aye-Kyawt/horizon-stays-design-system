# Token export drift: Figma Semantic library vs `tokens/`

The component file (`2k87mtkZMvxQIYwjLX82pu`) uses a remote **Semantic** library collection
(modes Light and Dark, 62 variables). The committed export in `tokens/semantic.light.tokens.json`
and `tokens/semantic.dark.tokens.json` does not match it. The comparison below was read live over
the Figma connection on 2026-09-21, following each variable to its alias target in each mode, and
compared with the export at `629492c`.

**Result: 50 match, 2 differ, 4 exist only in Figma, and 36 exist only in the export.**

It is not clear which side is newer. The export carries 36 variables the library does not, so it
is not simply stale; the library carries 4 the export lacks, so it is not simply ahead. **Design
decides which source is canonical,** then the other is brought in line and the Token Runner
rebuilds. No token file was edited to produce this report.

## Differ (2)

| Variable | Figma library (Light · Dark) | Committed export (Light · Dark) | Who notices |
|---|---|---|---|
| `semantic/color/icon/disabled` | `neutral/600` `#8a94a6` · `neutral/400` | `neutral/500` `#a9b3c0` · `neutral/700` | `.chip`: the disabled clear control renders `#a9b3c0` where the node draws `#8a94a6` (QA staging finding). Also `Button.css#L61`, which reads `core/color/neutral/600` because the export's `icon/disabled` disagreed with the node |
| `semantic/color/icon/base` | `base/black` · `base/white` | `neutral/800` · `neutral/200` | No component reads it today |

## In the Figma library, not in the export (4)

| Variable | Light · Dark | Relevance |
|---|---|---|
| `semantic/color/icon/hover` | `navy/600` · `navy/300` | This is exactly `Button.css#L60`'s `core/color/navy/600`. The release proposal (B6) said no icon-hover role existed; it exists in Figma |
| `semantic/color/border/on hover` | `blue/900` · `neutral/300` | This is exactly `Button.css#L59`'s `core/color/blue/900` |
| `semantic/color/text/action hover` | → `semantic/color/text/info` (`sky/700`) | This is exactly `Button.css#L58`'s `core/color/sky/700` |
| `semantic/color/text/on-action` | → `semantic/color/text/inverse` | The export has `text/onprimary` instead |

If design makes the library canonical and these reach the export, three of the six Button reads in
the proposal's B6 are resolved by existing design decisions, and a fourth (`L61`) is resolved by the
`icon/disabled` row above. The proposal's B6 table should then be read in that light.

## In the export, not in the Figma library (36)

`bg-brand`, `bg-primary-pressed`, `bg-negative-hovered`, `bg-disabled-idle`, `bg-placeholder`,
`text-onprimary`, `text-onsecondary`, `text-link-visited`, `icon-brand`, `icon-positive`,
`icon-warning`, `icon-info`, and the 24 `decorative-{violet,teal,gold,magenta,coral,indigo,lime,cyan}-{subtle,base,strong}`
tokens.

One component depends on them today: `Button.css#L156` reads `component-button-text-primary`, which
aliases `text-onprimary`. Several component tokens (`component-button-bg-primary-pressed`,
`-bg-negative-hovered`, `-text-secondary`) alias others on the list. Deleting them to match the
library would break those reads, which is another reason the choice of canonical source belongs to
design and not to a re-export run.
