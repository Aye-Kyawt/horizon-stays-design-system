---
name: registry
description: The Airtable registry contract for the Horizon Stays design system — every table, every column, and the one agent that owns each one. Read it before writing any cell, and before believing what a status column says.
---

# The registry

The registry is the Airtable base that carries a component from a Figma node to a released,
documented component. It is the only place where the state of a component is recorded, and it
records **evidence, not intention**: a link goes in a cell after someone opened it and saw it
render, never before.

Read this file before you write a cell. It answers three questions and nothing else: what the
columns are, who owns each one, and where the base does not do what it says it does.

## Resolving IDs

**This file names no base, table, or field ID, and neither does any agent file.** IDs live in
`.claude/registry.local.json`, which is gitignored. Generate it:

```
AIRTABLE_PAT=pat... npm run registry:init
```

That resolves every name in `.claude/registry.local.example.json` — the committed template, which
holds names and placeholder IDs only — against the live base, and writes the real IDs to the
gitignored file. Add `-- --force` to overwrite an existing one. The token needs the
`schema.bases:read` scope; make one at https://airtable.com/create/tokens and do not commit it.

If a name in the template no longer matches the base, the script **refuses and writes nothing**,
naming the table or column that drifted. That is deliberate: a half-resolved file would fail later,
at a write, on whichever column happened to be missing.

**Never put a real ID in `registry.local.example.json`.** It is tracked, the repo is public, and
git history is permanent.

Every column below is named the way it is named in Airtable. To act on one, look the name up in
the local file and use the ID it gives you:

```
.claude/registry.local.json
  -> baseId
  -> tables["Components"].id
  -> tables["Components"].fields["Staging Storybook"]
```

If the local file is missing, stop and say so. Do not guess an ID, do not read one out of a
browser URL, and do not paste one into a skill, an agent file, or a script — the whole point of
the split is that the IDs exist in exactly one place, and a renamed or rebuilt base is then a
one-file fix.

## Who owns what

An owner is the single agent permitted to write a column. Everyone else reads it. There is no
shared column and no "whoever gets there first" — if a column has your name on it, nobody else
writes it, and if it does not, you do not write it even when you are sure you are right.

| Owner | Agent file | Writes |
|---|---|---|
| 🔨 Engineer | `.claude/agents/engineer.md` | The build side of Components, and all of GitHub Commits |
| 🔍 QA | `.claude/agents/qa.md` | All of Staging Testing, and the test links on Components |
| 🚀 DevOps | `.claude/agents/devops.md` | Production Storybook |
| 📚 Doc Generator | `.claude/agents/doc-generator.md` | Astro Link, and the intent files beside each component |
| 🧭 Reviewer | *none yet* | Release Review and Release Verdict |
| 📋 PM | *none yet* | Feedback triage and One-Off Components |
| 🎨 Designer | a human, not an agent | The design side of Components |
| 👤 Submitter | a human, not an agent | What they report into DS Feedback |
| ⚙️ Airtable | — | Every derived column. **No agent may write these** |

Two notes on that table. **📦 Release owns no column in this base** — it prepares releases and
never performs them, so it writes nothing. And **🎛️ Token Runner owns no column either**: its
agent file gives it `Bash` and `Read` only, so it cannot reach Airtable at all.

Owners marked **stated** below are fixed by a field description in the base or by an existing
agent file. Owners marked *inferred* are this contract's reading, and a human may overrule them —
say so here when they do, rather than in one agent's file.

## Components

The spine of the base. One row per component.

| Column | Type | Owner | Notes |
|---|---|---|---|
| Components | Single line text | 🎨 Designer *inferred* | Primary field. The component name, e.g. `.button` |
| Category | Single select | 🎨 Designer *inferred* | ATOMS · MOLECULES · ORGANISMS · TEMPLATES · UI |
| Figma | URL | 🎨 Designer *inferred* | The node. Feeds precedence 8 |
| Staging Storybook | URL | 🔨 Engineer **stated** | Written after the staging build was opened and seen to render. Feeds precedence 7 |
| Production Storybook | URL | 🚀 DevOps **stated** | Feeds precedence 5. The Engineer is explicitly barred |
| Astro Link | URL | 📚 Doc Generator **stated** | The deployed Starlight page, written only after it was fetched. Feeds precedence 4. See Flag 6 |
| Design | Single select | 🎨 Designer **stated** | To-do · In progress · In testing · Done · To be fixed. A human's column — no agent nudges it |
| Development | Formula | ⚙️ Airtable **stated** | Derived status. **No agent may write it.** See below |
| Synchronization % | Formula | ⚙️ Airtable | `Staging Passed Count / Total Staging Tests`, as text |
| Commit | URL | 🔨 Engineer **stated** | |
| Last Modified | Last modified time | ⚙️ Airtable | Also the staleness test for Release Review |
| [Staging] Test Records | Linked records → Staging Testing | 🔍 QA **stated** | QA creates the rows; the link comes with them. The Engineer may not create one |
| Staging Testing Results Summary | Rollup | ⚙️ Airtable | The Testing Results of every linked row. Feeds precedence 1, 2, 3 and 6 |
| Total Staging Tests | Count | ⚙️ Airtable | |
| Staging Passed Count | Count | ⚙️ Airtable | Passed rows only. This is the one that feeds Synchronization % |
| [Production] Test Records | Single line text | 🔍 QA *inferred* | Free text, **not** a link field, unlike its staging counterpart |
| Staging Passed Tests | Rollup | ⚙️ Airtable | Broken and unused. See Flag 4 |
| Semantic Tokens | Single line text | 🔨 Engineer *inferred* | The tokens resolved in build stage 2. Token Runner cannot write it |
| GitHub Commits | Linked records → GitHub Commits | 🔨 Engineer **stated** | |
| Composes | Linked records → Components | 🔨 Engineer **stated** | The components this one imports. Build up, never sideways |
| Composed Into | Linked records → Components | ⚙️ Airtable **stated** | The reverse of Composes. Answers "who must be re-tested". See Trap 2 |
| Release Review | URL | 🧭 Reviewer **stated** | The report *at the commit it reviewed* — never a branch URL. Write it with the verdict or not at all |
| Release Verdict | Single select | 🧭 Reviewer **stated** | Cleared · Blocked. Empty means not reviewed |

## Staging Testing

One row per test case: one component, one variant, one size, one state.
**🔍 QA owns every column in this table** — stated, in the Engineer's own file. The Engineer
pushes a fix and stops; it never opens, amends, or scores a row here, because the builder does
not mark its own work fixed.

| Column | Type | Owner |
|---|---|---|
| Component/Sub Component | Single line text | 🔍 QA |
| Testing Results | Single select — Passed · Failed · `Fixed (To re-test)` | 🔍 QA |
| Composed In | Linked records → Components | 🔍 QA |
| Variants | Long text | 🔍 QA |
| Size | Multiple select — xs · sm · md · lg · xl · compact · comfort · null | 🔍 QA |
| State | Multiple select — idle · hovered · focus · selected · disabled · loading · error · filled · draft · pending · upcoming · completed · rejected · cancelled · isCurrent | 🔍 QA |
| Context | Single line text | 🔍 QA |
| Attachment | Attachments | 🔍 QA |
| Expected Results | Long text | 🔍 QA |
| Suggestion for Improvement | Long text | 🔍 QA |

The exact choice name is `Fixed (To re-test)`. It is what moves Development to `Fixed`, and the
formula matches on the substring `re-test`, case-sensitively.

## DS Feedback

Inbound reports from people using the system. Intake is the submitter's; triage is PM's.

| Column | Type | Owner |
|---|---|---|
| Feedback | Long text | 👤 Submitter *inferred* |
| Components | Single line text | 👤 Submitter *inferred* |
| Submitted By | Single line text | 👤 Submitter *inferred* |
| Step to Reproduce | Long text | 👤 Submitter *inferred* |
| Suggestion | Single line text | 👤 Submitter *inferred* |
| Urgency | Single line text | 📋 PM *inferred* — triage, not self-report |
| Attachment | URL | 👤 Submitter *inferred* |
| Status | Single select — Not Started · In Progress · Completed | 📋 PM *inferred* |

A feedback row is not a work order. PM turns one into a ticket; no agent starts building because
a row appeared here.

## GitHub Commits

**🔨 Engineer owns every column** — stated, in the Engineer's own file.

| Column | Type | Owner |
|---|---|---|
| Commit Hash | Single line text | 🔨 Engineer |
| Message | Single line text | 🔨 Engineer |
| Author | Single line text | 🔨 Engineer |
| Date Committed | Date and time (UTC) | 🔨 Engineer |
| Link to Components | Linked records → Components | 🔨 Engineer |
| Files Changed | Long text | 🔨 Engineer |
| Commit URL | URL | 🔨 Engineer |
| Commit Type | Single select — Feature · Bugfix · Documentation · Chore · Refactor · Other | 🔨 Engineer |

## One-Off Components

Components built inside a project rather than in the system — the candidate list for promotion.
Nothing here feeds Development, and no agent file claims this table today.

| Column | Type | Owner |
|---|---|---|
| Components | Single line text | 📋 PM *inferred* |
| Project | Single line text | 📋 PM *inferred* |
| Usage quantity | Number | 📋 PM *inferred* |
| Git Repo | Single line text | 📋 PM *inferred* |
| Figma | URL | 📋 PM *inferred* |

## The Development formula

`Development` is the clock of this base. It wakes the Engineer and it wakes QA, and it is
computed, never typed.

**No agent may write it.** It is a formula field, so Airtable will refuse the write anyway — but
the rule matters beyond the API error: if the status is wrong, the evidence underneath it is
wrong, and the evidence is what you fix. Never route around a status you disagree with.

First match wins, top to bottom:

| # | Condition | Result |
|---|---|---|
| 1 | Results summary contains `Failed` **and** `re-test` | **Fixing** |
| 2 | Results summary contains `Failed` | **To be fixed** |
| 3 | Results summary contains `re-test` | **Fixed** |
| 4 | Astro Link set **and** Release Review set **and** Release Verdict = `Cleared` | **Released** |
| 5 | Production Storybook set | **Completed** |
| 6 | Results summary is not empty | **To be deployed** |
| 7 | Staging Storybook set | **Ready for Testing** |
| 8 | Figma set **and** Design = `Done` | **To-do** |
| 9 | otherwise | empty — but see Flag 1 |

"Results summary" is the `Staging Testing Results Summary` rollup, and `re-test` reaches it from
the `Fixed (To re-test)` choice on a test row.

Three consequences worth holding on to.

**A failure outranks everything below it.** A released component that fails a re-test reads
`To be fixed`, not `Released`. That is correct: it is broken, and being published is what makes
it urgent.

**One cell moves the status, and that is the whole handoff.** Writing `Staging Storybook` moves
the row to `Ready for Testing`, which wakes QA. No agent messages another agent; the status is
the message.

**Reading up the ladder is not reading down it.** A row at `Ready for Testing` proves a staging
link exists. It does not prove the design is signed off, or that anyone looked at the link.

## Flags — where the description and the formula disagree

Each of these is a field whose description in Airtable says something the base does not do. They
are listed so no agent is caught believing a cell. **Fix the description in Airtable, or fix the
field — do not quietly fix your reading of it and move on.**

**Flag 1 · Development, branch 9 — "otherwise blank" is not blank.**
The formula's last branch returns an empty string, but the field's result is typed as a single
select whose default choice is `To-do`, so an empty result **renders as `To-do`**. Verified
live: every row with a Figma link and an empty `Design` — `.button`, `.menu`, `.checkBox label`
and about twenty more — currently reads `To-do`.
*Consequence:* `To-do` is **not** proof that Design is `Done`. Branch 8 and branch 9 are
indistinguishable in the cell. Before building, read the `Design` column itself.

**Flag 2 · Release Review — "It does not feed Development" is false.**
The description says the column "does not feed Development and is not part of the
staging-to-production ladder". The formula reads it in branch 4: without it, `Released` is
unreachable. It is on the ladder.

**Flag 3 · Release Verdict — "Deliberately not wired into Development" is false.**
Same branch. The formula tests `Release Verdict = "Cleared"` before it will say `Released`. The
description's reasoning — that folding this gate in would make a shipped component read
unfinished — describes a decision that was not implemented.

**Flag 4 · Staging Passed Tests — both halves of the description are false.**
It says "Counts only test rows marked Passed. Feeds Synchronization %."
It feeds nothing: `Synchronization %` is computed from `Staging Passed Count` and
`Total Staging Tests`, and never references this field. And it does not count: on `.table`,
which has 34 test rows, 31 of them passed, and a `Synchronization %` of 91.18%, this field reads
**0**. It is a numeric rollup over a single-select text value, so it sums to zero on every row.
*Consequence:* do not read this column, and do not try to repair it by writing to it — it is a
rollup. `Staging Passed Count` is the working one.

**Flag 5 · Development, branch 6 — "any staging test rows exist" is not what it tests.**
The description says branch 6 fires when staging test rows exist. The formula tests whether the
**Testing Results rollup is non-empty**. Linked rows whose `Testing Results` is still blank
produce an empty rollup, so a component with a full but unscored test matrix keeps reading
`Ready for Testing`. Rows existing is not the trigger; rows being scored is.

**Flag 6 · Astro Link — "shipped" is never checked.**
The description reads `Released` as "built, tested, shipped, documented, reviewed and published".
Branch 4 sits above branch 5 and never looks at `Production Storybook`, so a row with an Astro
link, a review and a `Cleared` verdict reads `Released` while `Production Storybook` is empty —
documented and reviewed, but never shipped to production.

## Traps that are not formula disagreements

1. **`[Production] Test Records` is single line text**, not a linked-record field, even though it
   is named like one and its staging counterpart is one. Nothing rolls up from it.
2. **`Composed Into` is editable.** Airtable's symmetric link means the cell accepts a write, and
   a write there silently edits the other component's `Composes`. The description's "nobody
   writes this" is a rule this contract enforces, not something the base prevents.
3. **`Synchronization %` is text, not a number** — `"91.18%"`. It sorts and filters
   lexicographically, so `"9%"` sorts after `"91.18%"`. Do not threshold on it.
4. **`Fixed (Re-test)` does not exist.** `.claude/agents/engineer.md` names the choice that way;
   the real one is `Fixed (To re-test)`. Write the real name — the formula's `re-test` match
   happens to survive the confusion, but the write does not.
5. **The seven release gates live in `.claude/skills/release-review/SKILL.md`.** Two field
   descriptions send the Reviewer there. A `Release Verdict` written without running it is an
   opinion in a cell. There is still no Reviewer agent file, so nothing in this crew runs it yet.

## Before you write a cell

- [ ] The column is mine in the owner table above — not "mostly mine", not "nobody else is doing it"
- [ ] I resolved the ID through `.claude/registry.local.json`, and hardcoded nothing
- [ ] If I am writing a link, I opened it and watched it render
- [ ] I am not writing a formula, rollup, count, last-modified, or reverse-link column
- [ ] I know which precedence branch my write moves, and that the move is the one I intend
- [ ] I am not writing a status to make a row look right — I am changing the evidence under it
