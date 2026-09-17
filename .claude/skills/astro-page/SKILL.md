---
name: astro-page
description: Build and deploy the whole Horizon Stays docs site — Astro Starlight in docs-site/ on the astro branch — from the repo at a pinned commit, the board's statuses, live Figma reads and the deployed Storybook. Verifies every live page before writing a single Astro Link. Never builds one page at a time, never invents.
---

# Build the docs site

## When to use this
Use this when a component reaches production, when a release ships, or when anything the site is
generated from has changed. **Every run builds the whole site.** There is no "just this page": a
component page links to Tokens, Tokens to Theming, the Changelog to every component, and a page
rebuilt alone is a page checked against a site that is no longer there.

The format to match is https://horizon-docs-alpha.vercel.app — open it before you start, and
match its navigation, its component page layout and its embeds. It is the shape, not the content:
nothing on it is a source for this site.

Writing `Astro Link` is 🚀 DevOps's column (registry owner table). If you are not running as DevOps,
stop after step 9 and hand DevOps the verified page URLs.

## Where it lives
- **Site:** Astro Starlight in `docs-site/`, its own npm package, on the `astro` branch
- **Deploy:** the Vercel project that deploys `astro` to production — `tools.md` records the
  folder, the project and the production URL. Read it there; do not repeat it here
- **Other branches** carry a `docs-site/vercel.json` that turns deployment off. When you merge
  `main` into `astro`, keep `astro`'s own `docs-site/vercel.json`

## Sources — and nothing else
| Source | Gives | Written by |
|---|---|---|
| The repo at a **pinned commit** of `main` | components, stories, intent files, README, `src/index.ts`, `docs/`, git log and tags, `build/css/` | — (read only) |
| `docs-site/sources/board.json` | each component's `Development` and `Design` status, by component name. **No record IDs** | you, each run |
| `docs-site/sources/figma.json` | per component: the node, its variant matrix, the usage region's best practice, the values it never bound. With the time it was read | you, each run |
| The deployed Storybook's `index.json` | story ids, titles, names and `type` (story or docs) | — (fetched) |

`board.json` holds no base, table, record or field ID — the repo is public and history is
permanent (registry: Resolving IDs). Statuses and names only.

**Missing source:** keep the section in place, with a notice that names exactly what is missing —
`No README in the repo at <sha>, so there is no usage example to show.` Never fill the gap with a
plausible sentence, a guessed date or an example you wrote.

## The sidebar
Written out in `docs-site/astro.config.mjs`, entry by entry, as `slug` items — never
`autogenerate`. Starlight fails the build when a `slug` has no page, so a page that failed to
generate breaks the build instead of quietly disappearing from the navigation.

| Group | Entries, in this order | Slugs |
|---|---|---|
| Get Started | Changelog, Roadmap, News, Versioning, Upgrading | `get-started/changelog`, `…/roadmap`, `…/news`, `…/versioning`, `…/upgrading` |
| Designing | Introduction | `designing/introduction` |
| Developing | Introduction, React, React Router | `developing/introduction`, `…/react`, `…/react-router` |
| Skills | Knowledge skill | `skills/knowledge-skill` |
| Core | Components → All components, then one page per component · Tokens | `core/components/overview`, `core/components/<name>`, `core/tokens` |
| Styling | Theming | `styling/theming` |
| Help | FAQ, Report a bug, Request a feature, Contributing, Embedding | `help/faq`, `help/bug-report`, `help/feature-request`, `help/contributing`, `help/embedding` |

The per-component entries are rewritten each run from `src/components/` at the pinned commit, in
alphabetical order. They are still written out, slug by slug.

## What is generated and what is written
**Generated, never edited by hand:** Home, All components, every component page, Tokens,
Changelog, Roadmap, News. One script builds all of them — `docs-site/scripts/generate.mjs` — from
the four sources above. It replaces `docs-site/scripts/generate-pages.mjs`; there is one generator,
not two. Generated pages are gitignored.

**Written from the repo:** every other page — the guides. Each run, re-read every guide against
the code at the pinned commit and correct any sentence that stopped being true: a renamed prop, a
command that changed, an export that moved. Correct the sentence; do not add a caveat beside it.

**Roadmap and News** state no date, owner or priority that a source does not state. Roadmap lists
components by their board status. News lists releases (tags) and the components that reached
production. Neither predicts.

## Steps

### 1 · Pin the commit
Take the tip of `main`, record its full SHA, and read every repo source at that SHA — not at
whatever `astro` happens to contain. Merge `main` into `astro` first so the site's own code is
current, keeping `astro`'s `docs-site/vercel.json`.

**Check:** the SHA is recorded, and the generator will be run with it (`node scripts/generate.mjs --commit <sha>`).

### 2 · Write the two source files
- **`board.json`:** read `Development` and `Design` for every component through the registry
  contract. Write names and statuses only.
- **`figma.json`:** for every component, read its node over the Figma MCP connection — the variant
  matrix (`get_metadata`), the best practice in its documentation page's usage region, and every
  property the design leaves unbound (`get_design_context`). Record when it was read.

If Figma or the registry cannot be reached, stop. A stale or empty source file would publish a
site that says components have no statuses, no matrix and no best practice.

**Check:** both files exist, `board.json` contains no ID, and `figma.json` has an entry for every
component.

### 3 · Generate
Run the generator. It fetches the deployed Storybook's `index.json` (the production Storybook URL
is in `tools.md`) and writes every generated page.

#### Home — a splash page
- **Hero line:** the first paragraph of the repo's README
- **Buttons:** Start designing → `designing/introduction` · Start coding → `developing/introduction` ·
  Open Storybook → the production Storybook
- **Latest release:** the newest `v*` tag and its install command, `npm install <package name>@<version>`
  — the package name from `package.json` at that tag. No tag: a notice, not an install command
- **Link cards:** Designing, Developing, Components, Tokens

#### All components
Every component, with its board status, and whether `src/index.ts` exports it or names it
internal.

#### Component page
**Header strip:** status (board `Development`) and the version it shipped in (the earliest `v*`
tag whose `src/index.ts` exports it — else `Unreleased`), then links to its Storybook stories, its
Figma node and its source at the pinned commit.

Then five Starlight tabs, in this order:

| Tab | Content | From |
|---|---|---|
| **Usage** | when to use · where it goes · when not to, with each alternative · best practice · what each variant is for · accessibility facts, each linked to its source line · composition · what this version promises | intent file · `figma.json` best practice · imports · Versioning guide + public or internal |
| **Examples** | the README usage example, then every story that is **not** a variant-matrix row, embedded live from Storybook in light and in dark | README · `index.json` · stories |
| **Code** | the import · props with defaults and doc comments · union types · the tokens it needs with light and dark values · Storybook's own props table, embedded | `.tsx` types · intent `required_tokens` resolved in `build/css/web.css` · Storybook docs entry |
| **Design** | the Figma node embedded · the variant matrix with every matrix story linked · both themes · every value Figma never bound · the design gaps recorded against it | `figma.json` · `index.json` · `docs/<name>-*.md` |
| **Changelog** | `git log` for the component's folder and every subcomponent it imports, each commit marked with the version it shipped in | git log · `git tag --contains` (earliest `v*`, else `Unreleased`) |

- **Embeds** use the story iframe with the theme global, once per theme:
  `<storybook>/iframe.html?id=<story id>&viewMode=story&globals=theme:light` (and `theme:dark`).
- **A variant-matrix row** is a story whose args pin exactly one cell of the Figma matrix in
  `figma.json`. Every other story is an example. A story you cannot classify goes under Examples
  and is listed in the run report.
- **Token values:** light from `:root`, dark from `[data-theme="dark"]`. A token with no dark
  override shows its light value, marked as unchanged.
- **Storybook's props table** exists only if the deployed Storybook has a docs entry for the
  component in `index.json`. If it does not, the notice says so.

#### Tokens
Every token in `build/css/`, grouped by category, with its value per platform and in light and
dark.

#### Changelog, Roadmap, News
Changelog: one section per `v*` tag, newest first, with the commits since the previous tag.
Roadmap and News as described above.

**Check:** the generator exited 0 and wrote a page for every sidebar slug.

### 4 · Re-read the guides
Read every written page against the code at the pinned commit. Correct what stopped being true.

**Check:** every command, import, prop and file path in a guide exists at the pinned commit.

### 5 · The site wears the system's tokens
One stylesheet, `docs-site/src/styles/custom.css`, maps Starlight's `--sl-*` variables onto the
system's **semantic** tokens — light onto `:root`, dark onto `[data-theme="dark"]`, which is also the
attribute Starlight's theme switch sets. It declares no hex, rgb or px value of its own. Load the
built token CSS before it.

Fonts are self-hosted: font files served from the site itself, declared with `@font-face`. No
request to Google Fonts. Adding a package for the font files is a dependency — explain it in the
run report (`tools.md`: dependency rules).

**Check:** `custom.css` contains no raw colour or length, and the built site makes no request to
`fonts.googleapis.com` or `fonts.gstatic.com`.

### 6 · Build — zero broken internal links
`npm --prefix docs-site run build` must fail on a broken internal link, not warn. Use the
`starlight-links-validator` plugin; if it is not installed yet, add it and say why in the report.

**Check:** the build exits 0 with zero broken internal links.

### 7 · Look at it, before pushing
Serve the build (`npm --prefix docs-site run preview`) and open, in light **and** in dark:
- the home page
- one component page, clicking through **every** tab
- Tokens

Look for empty tabs, embeds that do not load, unreadable contrast, and text in the wrong face.

**Check:** you opened all three pages in both themes and every tab of the component page had
content.

### 8 · Push and deploy
Commit on `astro` — the generator's inputs (`board.json`, `figma.json`), the guides you corrected,
and any site code. The message names the pinned SHA. Push. Find the deployment for that commit in
the Vercel project and wait until it is `READY`. `ERROR` or `CANCELED` is a failure: stop and
report it.

### 9 · Verify the live site
Against the production URL, not the preview:
- **Every page** in the sitemap answers `200`, and the page states the pinned SHA — proof it is the
  new deployment, not the old one still being served.
- **Every component page** has all five tabs, and each tab panel has content.
- **Every header link** answers `200`. The one exception: a Figma link to a team-only file may
  answer `403`.

If anything fails, **write nothing** to the registry, and report exactly which page or link
failed.

**Check:** every page, tab and header link passed, and the list of what you fetched is in the report.

### 10 · Write the links
Only now, and only as DevOps: write each component's page URL into `Astro Link`, through the
registry contract. Skip any component whose `Production Storybook` is empty — branch 4 does not
check it, and a documented component that was never shipped would read `Released` (registry
Flag 6). List the skipped components in the report.

## Report
```
astro-page · main@<short sha> → astro@<short sha> · deployment <READY | ERROR>
Pages <n>/<n> 200 · component pages <n>/<n> with 5 tabs · header links <n>/<n> (<n> × 403 Figma team-only)
Missing sources: <source> (<sections showing a notice>)
Guides corrected: <slug> — <what stopped being true>
Unclassified stories: <component> <story> → Examples
Astro Link written: <n> · skipped, no Production Storybook: <components>
```

## Judgement
- **A notice is not a failure.** A missing README is a source gap and the page says so. A tab with
  nothing in it at all — not even the notice — is a failure.
- **A 403 from anything but a team-only Figma link is a failure.** Storybook, GitHub and the site's
  own pages must be public.
- **A page that renders is not a page that is true.** A status shown on the site that disagrees with
  `board.json`, or a token value that disagrees with `build/css/`, is a generator bug. Report it;
  do not hand-edit the generated page.

## References
- The site folder, Vercel project and production URL: `tools.md`
- Board columns, owners and the Development formula: `.claude/skills/registry/SKILL.md`
- The intent files the Usage tab reads: `.claude/skills/component-intent/SKILL.md`
- What `Astro Link` means to the ladder: `.claude/agents/devops.md`
- Token and naming rules: `CLAUDE.md`

## Self-check
- [ ] I built the whole site, from one pinned commit of `main`
- [ ] The sidebar is written out slug by slug, in the order above
- [ ] `board.json` holds statuses and names, and no ID of any kind
- [ ] Every missing source left its section in place with a notice naming what is missing
- [ ] Roadmap and News state no date, owner or priority that a source does not state
- [ ] `custom.css` maps onto semantic tokens with no raw value, and fonts are self-hosted
- [ ] The build had zero broken internal links
- [ ] I opened home, a component page (every tab) and Tokens, in light and in dark, before pushing
- [ ] Every live page, tab and header link was verified against production before any registry write
- [ ] I wrote `Astro Link` only as DevOps, only after verification, and only where Production Storybook is set
