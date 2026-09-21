# Changelog

All notable changes to `@aye_kyawt/horizon-stays-design-system`.

## 0.1.0 — 2026-09-21

First published version.

### Public surface
- `Button`, with `ButtonProps`, `ButtonType` (`Fill` · `outline` · `transparent`), `ButtonStatus`
  (`default` · `hovered` · `focus` · `disabled` · `error`) and `ButtonIconSlot`.
- `tokens.css`: the web platform token build, re-synced from the Horizon.Token.V1.0 Figma library.
- `styles.css`: component styles. It also contains the stylesheets of components that are built
  but not yet public (`Avatar`, `CardContainer`, `Chip`, `ProgressBar`, `Spinner`, `Tooltip`).
  Those classes are inert without their components, which later releases will export.

### Released by override, not by a cleared review
0.1.0 was published at the owner's explicit instruction **while the release review was Blocked**.
The override is recorded here so it is not mistaken for a clean release:

- **Gate G3 fails.** `npm test` has 7 failing tests, all `reads no base-layer --core-* token`, for
  avatar, Button, chip, iconBtn, progressBar, spinner and tooltip. The publish skipped only those 7.
  The type check, the build and the other 38 tests ran and passed.
- **Button still reads 4 base-layer tokens:** the focus-ring offset (`--core-spacing-4`, twice) and
  the 10px vertical padding (`--core-spacing-8` + `--core-spacing-2`). Their replacements are
  approved (`semantic/focus/offset/md`, `core/spacing/10` →
  `component/button/padding/y/default`) but not yet in the Figma library. Rendered values are
  unaffected.
- **The last release review of record** is `reports/release-review/v0.1.0-ecf0c4d.md`, verdict
  Blocked. No review was run for this publish, and the `Release Verdict` cells were not changed by
  it.

What clears the next release: the approved tokens are added to the Figma library and re-exported,
the 32 remaining core reads are repointed, `npm test` goes green, QA re-tests, and a fresh review
runs. See `docs/release-0.1.0-token-proposal.md`.
