---
name: release-review
description: Review a release candidate at one pinned commit against 7 gates and 6 checks, write the report at that commit, and give each component a verdict of Cleared or Blocked. Never edits an intent file, never fixes what it finds, never publishes.
---

# Review a release

## When to use this
Use this before a version is published, to decide whether the components in it are ready. It is
the criteria behind the registry's `Release Review` and `Release Verdict` columns — a verdict
written without this file is an opinion in a cell.

📦 Release runs it — `.claude/agents/release.md`, which the registry's owner table names for
`Release Review` and `Release Verdict`. Do not run it on components you built, tested, deployed or
wrote the intent for: the reviewer who made the work cannot clear it.

This skill reads and reports. It **never** edits an intent file, **never** fixes a finding — not a
typo, not a token, not a missing field — and **never** publishes, tags or deploys. The one thing it
merges is its own report, in step 4, which is documentation and never code. A review that repaired
what it found has reviewed its own work.

## The verdict
- **Blocked** — any gate fails, or any check other than check 2 fails.
- **Cleared** — every gate passes and every blocking check passes. Warnings are listed in the
  report and do not block.

A verdict is given per component. The release as a whole is Cleared only when every component in
it is.

## Steps

### 1 · Pin the commit
Review one commit, by full SHA — never a branch, whose tip moves while you read it. Check it out
detached, in a clean tree, and record:
- the SHA
- `version` from `package.json`
- the last release tag (`git tag --list 'v*' --sort=-v:refname`, first entry), or "none"

The components under review are every folder in `src/components/` at that commit.

**Check:** `git status --porcelain` is empty and `HEAD` is the SHA you recorded.

### 2 · The 7 gates
Each is pass or fail per component, with the evidence that decided it.

| # | Gate | Passes when |
|---|---|---|
| G1 | **Intent written** | `src/components/<Name>/<Name>.intent.json` exists at the commit and parses as JSON |
| G2 | **Development is `Completed`** | The component's `Development` cell in the registry reads exactly `Completed` |
| G3 | **Tokens clean** | `npm run build:tokens` and `npm test` pass at the commit, and the component's stylesheet reads no base-layer `--core-*` token — `CLAUDE.md`: "Components use semantic tokens only" |
| G4 | **Public surface decided** | `src/index.ts` exports the component, or its header comment names it as deliberately internal. In neither is undecided |
| G5 | **Names final** | No `docs/<name>-naming.md` for the component marks a rename as suggested without a recorded decision on it |
| G6 | **States complete** | Every row of the Figma variant matrix has a story, and every Staging Testing row linked to the component reads `Passed` |
| G7 | **Version meaning known** | The report can say what this version number promises — see below |

**G2.** Read the registry through `.claude/skills/registry/SKILL.md` — resolve IDs through
`.claude/registry.local.json`, and remember `To-do` can be a blank in disguise (Flag 1). Only
`Completed` passes. A row reading `Released` has been cleared before: stop and ask a human whether
this is a re-review, rather than passing or failing it on your own reading.

**G6.** Build the matrix from the Figma node, not the story file (same reason as
`.claude/skills/test/SKILL.md`). A `Fixed (To re-test)` or blank `Testing Results` is not `Passed`.

**G7.** Compare the public surface at the commit with the last release tag: the exports of
`src/index.ts`, and the props and union types of each exported component. Classify the change —
removed or narrowed means breaking, added means minor, neither means patch — and check the
`version` bump says the same. Below `1.0.0`, say that the version promises no stability, and
name what changed anyway. With no previous tag, the gate passes when the report states what
this first version covers. It fails when the change cannot be classified — for example, the last
tag cannot be found.

**Check:** every gate has a pass or fail for every component, each citing a file, a command's
result or a registry cell.

### 3 · The 6 checks
These read the intent files. **Read them; never correct them.**

| # | Check | Severity | Fails when |
|---|---|---|---|
| C1 | **Fields present** | blocker | Any of `use_when`, `dont_use_when`, `variant_intent`, `placement`, `pairs_with`, `required_tokens`, `a11y` is missing. Empty is present: `[]` with a recorded gap passes |
| C2 | **Every `dont_use_when` names an alternative** | **warning, never a blocker** | An entry's `alternative` is `null` |
| C3 | **`a11y` is specific, not generic** | blocker | An entry states a quality instead of a behaviour ("accessible", "follows WCAG"), or its source line does not do what it says |
| C4 | **`required_tokens` resolve in the built output** | blocker | A token is not declared in `:root` of each of `build/css/web.css`, `mobile.css` and `back-office.css` after `npm run build:tokens` at the commit. Also report tokens the stylesheet reads that the list leaves out |
| C5 | **All variants covered** | blocker | A value of a variant prop's union type in the code, or of a variant property in the Figma node, has no entry in `variant_intent` |
| C6 | **No two components claim the same job** | blocker | Two components' `use_when` entries apply to the same situation, and neither's `dont_use_when` sends that situation to the other |

**C2 is a warning because the fix is a design decision.** A `dont_use_when` with no alternative is
honest — it is what Figma says. Blocking on it would pressure someone to invent an alternative in
the intent file, which is the one thing that file must never hold.

**C6 names both components and quotes both entries.** It does not say which one should own the
job.

**Check:** every check has a result for every component, and every failure quotes the entry that
failed.

### 4 · Write the report
One file: `reports/release-review/v<version>-<short sha>.md`.

```
# Release review · v<version> · <full sha>

Reviewed commit: <full sha>   Last release: <tag or none>   Reviewed: <UTC time>
Release verdict: Cleared | Blocked

## Version meaning
<G7's classification and what this version promises>

## <component> — Cleared | Blocked
| Gate | Result | Evidence |
| G1 … G7 | pass / fail | <file@sha, command result, or registry cell> |

| Check | Result | Finding |
| C1 … C6 | pass / fail / warning | <quoted entry and what is wrong with it> |
```

Every file link in it is a permalink at the reviewed SHA (`blob/<sha>/…#L<n>`), never a branch
link, so the evidence still reads the same after the code moves on.

Commit the report on its own branch, `review/v<version>`, created at the reviewed commit. The
report is the only file in that commit, so its tree is the reviewed tree plus the report. Push
the branch, open its PR into `staging`, and merge it — that merge therefore carries documentation
and nothing else.

Never open a PR into `main`, and never merge anything but the report. This is the whole of the
merge permission: `.claude/agents/release.md` grants exactly this and no more, and the two files
say the same thing — neither overrides the other.

**Check:** the report's permalink opens, and it names the SHA you reviewed.

### 5 · Record the verdict
Only after the report's permalink has been opened and read, write per component, through the
registry contract:
- `Release Review` — the report's permalink at the commit that added it
- `Release Verdict` — `Cleared` or `Blocked`

Write both or neither. A verdict without its report, or a report link without its verdict, is the
half-record the registry forbids.

**If the registry cannot be written** — `.claude/registry.local.json` missing, an ID that does not
resolve, Airtable unreachable — then write **neither**. State both verdicts in the report, and
report the write as blocked, naming what stopped it and the remedy. Never write one cell to show
progress, and never guess an ID. The report is the record; the cells catch up when the blocker
clears. A review that ends this way is complete, not failed.

Understand what the write moves: `Cleared` with an `Astro Link` present makes `Development` read
`Released` (branch 4). That is the verdict's job. Do not withhold `Cleared` to avoid moving the
status, and do not write it to move the status.

## Judgement — what is and is not a finding
- **An empty `use_when` with a recorded gap is not a C1 failure.** It is the intent skill doing
  its job. It shows in the report as a gap, not as a defect.
- **A finding you could fix in one line is still only a finding.** The report names it. The owner
  fixes it, and a later review clears it.
- **A gate you cannot evaluate fails.** An unreachable registry fails G2; a missing token build
  fails G3 and C4. "Could not check" never becomes "pass".
- **Your preference is not a check.** A `use_when` you would have worded better, a variant you
  think is unnecessary, a token you would have chosen differently — none of these is in the 7
  gates or the 6 checks, so none is in the report.

## References
- The registry contract, column owners and the Development formula: `.claude/skills/registry/SKILL.md`
- What the intent files hold and where each field comes from: `.claude/skills/component-intent/SKILL.md`
- How a component is tested against Figma: `.claude/skills/test/SKILL.md`
- The rules the gates cite: `CLAUDE.md`
- Commands: `tools.md`

## Self-check
- [ ] I reviewed one pinned SHA, in a clean tree, and every link in the report is a permalink at it
- [ ] Every component has a result for all 7 gates and all 6 checks, each with evidence
- [ ] C2 findings are warnings; nothing was blocked on C2 alone
- [ ] Anything I could not evaluate is a fail, with the reason
- [ ] I edited no intent file, fixed nothing, published nothing, tagged nothing, deployed nothing,
      and merged nothing but my own report
- [ ] The report was pushed and opened before I wrote either registry column
- [ ] I wrote `Release Review` and `Release Verdict` together, for every component, or not at all —
      and if I could write neither, the report carries the verdicts and names what blocked the write
- [ ] I did not review work I built, tested, deployed or wrote the intent for
