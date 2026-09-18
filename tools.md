# tools.md - what this project is built with

Stack facts and commands only. Rules about how we work live in 'CLAUDE.md'.

## Stack

- Framework : React 19 with Vite
- Language : Typescript, strict
- Package manager : npm
- Styling : CSS custom properties, generated from tokens
- Tokens : Style Dictionary v5, reading the Figma "Design Tokens" plugin export
- Component workshop : Storybook 10 (react-vite)
- Tests : Vitest
- Accessibility : Storybook a11y addon
- Reference site : Astro Starlight, in `docs-site/` (its own npm package), deployed on Vercel

## Commands
| Job | Command |
|---|---|
|Install | `npm install` |
|Resolve registry IDs | `AIRTABLE_PAT=pat... npm run registry:init` |
|Build tokens | `npm run build:tokens` |
|Run Storybook | `npm run storybook` |
|Build Storybook | `npm run build-storybook` |
|Test | `npm test` |
|Type check | `npm run Lint` |
|Install reference site | `npm install --prefix docs-site` |
|Run reference site | `npm --prefix docs-site run dev` |
|Build reference site | `npm --prefix docs-site run build` |

## Paths
- Tokens souce : `tokens/token.json` (exported from Figma, commited)
- Token config : `style-dictionary.config.js`
- Generated output : `build/tokens/` (never edit by hand , gitignoreed)
- Components : `src/components/<Name>/`
- Agents : `.claude/agents/`
- Skills : `.claude/skills/`
- Reference site : `docs-site/` — component pages are generated into `docs-site/src/content/docs/components/` from `src/components/` (never edit by hand, gitignored)

## Dependency rules
- Match the package manager in this file. This project uses npm. not yarn or pnpm.
- Use the existing package scripts before inventing commands.
- Do not add a dependency without explaining why in your report.
- Do not add a UI or component library. This repo is the component library.
- If ths file disagrees with `package.json`, inspect the repo and say so.

## Docs site deployment
- Folder : `docs-site/` — its own npm package (Astro + Starlight), with its own `package.json` and `package-lock.json`
- Vercel project : `horizon-stays-docs` (`prj_ar797IkOlHmF0Nk7RR2vSoplKsBn`, team `aye-kyawts-projects`), root directory `docs-site`
- Production branch : `astro` — every push to it deploys production
- Production URL : https://horizon-stays-docs.vercel.app
- Build config : `docs-site/vercel.json` on `astro` (framework, `npm install`, `npm run build`, output `dist`). Install is `npm install`, not `npm ci`: a lockfile written on macOS can omit packages Linux needs, and `npm ci` refuses it
- Every other branch : `docs-site/vercel.json` holds only `{"git": {"deploymentEnabled": false}}`, so pushes there do not build the docs project and leave no failing check. Keep `astro`'s own `docs-site/vercel.json` when merging `main` into it
