---
name: component-intent
description: Write {component}.intent.json beside each component — when to use it, when not to, what each variant is for, where it goes, what it pairs with, the tokens it needs and its accessibility facts — transposed from the Figma documentation page, the code and the stories. Never invents a product rule.
---

# Write component intent

## When to use this
Use this when a component exists in `src/components/` and its intent file is missing, or when
its Figma documentation, its code or its stories changed since the intent file was written. Run
it across every component, not one: the release review compares components against each other.

Do not use it to decide how a component *should* be used. This skill records what the design
documentation, the code and the stories already say. Where they say nothing, the field stays
empty.

**A plausible sentence in these fields is worse than an empty field.** Nothing downstream can
tell it is wrong: the release review checks that fields are present, and the docs site prints
them as rules. An empty field is a visible gap someone can fill. An invented one is a product rule
nobody decided.

## The file

One file per component, beside it, named after the component's own source file:
`src/components/<Name>/<Name>.intent.json` — e.g. `src/components/chip/chip.intent.json`,
`src/components/Button/Button.intent.json`.

```json
{
  "component": "chip",
  "figma": "https://www.figma.com/design/<fileKey>/<file>?node-id=72-19",
  "commit": "<full sha the code and stories were read at>",

  "use_when": [
    { "text": "<the usage region's words>", "source": "figma:<text node id>" }
  ],
  "dont_use_when": [
    { "text": "<the usage region's words>", "alternative": "<component it names, or null>", "source": "figma:<text node id>" }
  ],
  "variant_intent": {
    "<prop>": {
      "values": { "<value>": "<what the code says this value is for, or null>" },
      "default": "<value>",
      "source": "src/components/<Name>/<Name>.tsx#L<n>"
    }
  },
  "placement": [
    { "context": "<where the story places it>", "story": "<storybook story id>", "source": "src/components/<Name>/<Name>.stories.tsx#L<n>" }
  ],
  "pairs_with": [
    { "component": "<Name>", "how": "<how the story combines them>", "story": "<story id>", "source": "<stories file>#L<n>" }
  ],
  "required_tokens": [
    { "token": "--semantic-…", "from": "src/components/<Name>/<Name>.css#L<n>" }
  ],
  "a11y": [
    { "fact": "<what the code does, concretely>", "source": "src/components/<Name>/<Name>.tsx#L<n>" }
  ],

  "gaps": [ "<what is missing, and from which source>" ]
}
```

The seven fields are always present, even when empty — `[]` or `{}`, never omitted, never
`null`. Every entry carries a `source`. An entry you cannot point at a source for does not go in
the file.

Line numbers are read at `commit`. They go stale when the file changes; that is what the commit is
for.

## Steps

### 1 · Pin the commit, list the components
Record `git rev-parse HEAD`. Everything below is read at that commit — a working tree with
uncommitted changes gives line numbers nobody else can find, so commit or stash first.

Every folder in `src/components/` with a non-story `.tsx` is a component. The Figma node is in the
header comment of that `.tsx` (and at the top of its stories file).

**Check:** you have a list of components, each with a commit and a Figma node URL.

### 2 · Figma documentation → `use_when`, `dont_use_when`
Read the component's documentation page over the Figma MCP connection — `get_metadata` to find the
page and its usage region, `get_design_context` on the region to read its text. The usage region
already carries when to use, when not to, and best practice.

**Transpose it faithfully.** One entry per item as the region lays it out, in its order, in its
words. Do not merge two items, split one, tidy the grammar, or generalise a specific instruction
into a vaguer one. "Use for the primary action in a form" does not become "Use for important
actions".

For each `dont_use_when` item, set `alternative` only when the item itself names what to use
instead. If it does not, `alternative` is `null`. Do not supply the component you think it meant —
the release review flags a missing alternative as a warning so a designer can add one to Figma.

Best practice is not one of the seven fields and does not go in this file. The docs site reads it
from the live Figma reads, so leave it in Figma.

**If the component has no usage region:** `use_when` and `dont_use_when` are `[]`, and `gaps`
says so — `"No usage region on the Figma documentation page for <node>"`.

**If Figma cannot be reached:** stop. Write nothing for any component. An empty field means the
design documentation has no usage region; an unreachable connection is not evidence of that, and
writing `[]` would record a gap that does not exist.

**Check:** every `use_when` and `dont_use_when` entry can be read, word for word, in the Figma
region its `source` names.

### 3 · Code → `variant_intent`, `required_tokens`, `a11y`

**`variant_intent`.** One key per prop whose type is a union of literals or a boolean that switches
a variant (the Figma variant properties — the header comment lists the matrix). `values` lists
every member of the union. A value's purpose is the doc comment's words when the code states one;
otherwise `null`. A doc comment that only says `Figma property \`status\`` states no purpose.
`default` is the default in the function signature.

**`required_tokens`.** Every `var(--…)` the component's stylesheet reads, plus those of every
component it composes (its imports from `../<other>/`), with `from` naming the stylesheet and
line. Leave out custom properties the stylesheet declares for itself (`--hds-*`): they are local,
not tokens. List each token once.

**`a11y`.** What the component actually does for assistive technology, one fact per entry: the
role it renders, the ARIA attributes it sets and from what, what becomes inert when disabled, how
the accessible name is formed, what is hidden from the accessibility tree. Each with the line that
does it. Read `CLAUDE.md` for the states a component is meant to cover, but record only what the
code does — not what it should do.

`"Accessible"`, `"Follows WCAG"`, `"Screen-reader friendly"` are not facts. `"Sets aria-pressed
only when favourited is passed, so the default render is not announced as a toggle"` is.

**Check:** every token in `required_tokens` appears in the stylesheet line it names, and every
`a11y` fact is visible on its source line.

### 4 · Stories → `placement`, `pairs_with`
Read `<Name>.stories.tsx`. `placement` is where the stories put the component — inside a card, a
form, a fixed-width frame — as the story's own render and name show it. `pairs_with` is every
other component rendered in the same story, and how.

A story that renders the component alone on an empty canvas places it nowhere. If no story shows
context, `placement` is `[]` and `gaps` says so. Do not describe where the component would
typically go.

The story id is Storybook's: the `title` lowercased with runs of other characters turned into one
dash, then `--`, then the export name the same way (`Components/chip` + `WithIcon` →
`components-chip--with-icon`).

**Check:** every `placement` and `pairs_with` entry names a story that exists.

### 5 · Write and validate
Write the file, two-space indented, with a trailing newline. Parse it back. Confirm the seven keys
are present on every file.

Do not edit anything else. The intent file sits beside the component; the component's `.tsx`,
`.css` and stories are read, never changed — a wrong or missing doc comment is reported, not
fixed.

### 6 · Report
```
component-intent · <short sha>
<name>   ✓ use_when <n> · dont_use_when <n> (<n> without alternative) · variants <n> · placement <n> · pairs <n> · tokens <n> · a11y <n>
<name>   ⚠ use_when — · dont_use_when — (no usage region on <node>) · …
Gaps: <every gaps entry, by component>
```

## Judgement — what is and is not a source
- **The Figma usage region is the only source for `use_when` and `dont_use_when`.** Not the
  header comment in the `.tsx`, not a naming doc, not the story names. A header comment quoting
  Figma's own description ("Use this component when need CTA") is still a quotation of the
  component description, not the usage region — record it only if the usage region says it too.
- **Awkward wording in Figma is transposed as it is.** Correcting "when need CTA" to "when you need
  a CTA" is paraphrase. If the wording is wrong, that is Figma's to fix.
- **A composed component is not a `pairs_with`.** `cardImage` inside `cardLayout` is composition,
  which the docs site reads from the imports. `pairs_with` is what a story puts *beside* it.
- **`docs/*-design-gaps.md` is not intent.** A recorded gap explains why something is missing; it
  does not authorise a rule in its place.

## References
- The components: `src/components/<Name>/`
- The tokens they must resolve against: `build/css/web.css` (generated — read it, never edit it)
- What a component must cover: `CLAUDE.md`
- Who reads this file next: `.claude/skills/release-review/SKILL.md` and `.claude/skills/astro-page/SKILL.md`

## Self-check
- [ ] Every component has an intent file, and every file has all seven fields
- [ ] `use_when` and `dont_use_when` are the Figma usage region's own words, in its order
- [ ] No `alternative` was supplied that the usage region does not name
- [ ] A component with no usage region has empty fields and a gap — not a plausible sentence
- [ ] Figma was reachable; if it was not, I wrote nothing
- [ ] Every entry has a source, and every source line says what the entry claims
- [ ] Every `a11y` entry is a specific fact, not a quality
- [ ] I changed no `.tsx`, `.css` or story file
