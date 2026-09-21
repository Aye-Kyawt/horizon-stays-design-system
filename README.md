# Horizon Stays Design System

`@aye_kyawt/horizon-stays-design-system`

The React component library and design tokens behind Horizon Stays. Components are
built from Figma nodes, tested against them variant by variant, and reviewed before
release — the [component registry](https://airtable.com/) tracks where each one is on
that ladder.

> **Status: 0.1.0 is published.** It exports `Button` only. 0.1.0 was released by the
> owner's override while the release review was Blocked; `CHANGELOG.md` records what
> that override skipped. `package.json` keeps `"private": true` between releases, and
> `npm run release:publish -- <version>` removes that guard only for the length of a
> publish.

## Install

```bash
npm install @aye_kyawt/horizon-stays-design-system
```

React is a **peer** dependency — the package does not bundle it. Bring your own:

```bash
npm install react@^19 react-dom@^19
```

## Usage

Import the components you need, and load the two stylesheets **once**, at your app root:

```jsx
import { Button } from '@aye_kyawt/horizon-stays-design-system';
import '@aye_kyawt/horizon-stays-design-system/tokens.css';
import '@aye_kyawt/horizon-stays-design-system/styles.css';

export function Example() {
  return <Button type="Fill" label="Book a stay" iconLeft={false} iconRight={false} />;
}
```

`Button` takes its text through `label`, not children. `type` is the Figma `Type`:
`Fill`, `outline` or `transparent`. The DOM button type is `htmlType`, and it defaults
to `button`.

`tokens.css` carries the custom properties; `styles.css` carries every component rule
that reads them. Load tokens first — the rules resolve against it.

## Components

The public surface is `src/index.ts`. Anything not exported there is internal and may
change without a major version.

| Component | Exported types |
|---|---|
| `Button` | `ButtonProps`, `ButtonType`, `ButtonStatus`, `ButtonIconSlot` |

`Avatar`, `CardContainer`, `Chip`, `ProgressBar`, `Spinner` and `Tooltip` are built but
not yet public. Each one is exported in the release whose review clears it. Their
stylesheets already ship in `styles.css`, because the build requires every component
stylesheet, but their classes do nothing without the component that renders them.

`cardLayout`, `cardImage`, `cardText` and `iconBtn` are deliberately internal. Their
whole prop surface is reachable through `CardContainer`'s `layout` prop, and cards are
assembled by the parent rather than by consumers from parts. Exporting one later is a
minor release; taking one back would be a major.

## Tokens

Tokens are exported from the Figma token library with the Design Tokens plugin into
`tokens/*.tokens.json`. The library is the source of truth. They are built with Style
Dictionary into three platforms (web, mobile and back-office), each with a light and a
dark theme. `tokens.css` in the package is the web build.

Components are meant to read **semantic** tokens only (`--semantic-*`, `--component-*`
and the text-style tokens such as `--label-large-*`), never the base `--core-*` layer.
The test suite fails a stylesheet that reads a base-layer token. At 0.1.0, 7 stylesheets
still do, and `CHANGELOG.md` lists them.

```bash
npm run build:tokens
```

## Development

```bash
npm install          # npm 11.19.1, pinned via "packageManager"
npm run storybook    # component workshop on :6006
npm test             # vitest
npm run lint         # tsc --noEmit
npm run build:package  # tokens → library → CSS bundle
```

`tools.md` has the full command list, the stack, and the paths. `CLAUDE.md` has the
rules the components are held to.

## Links

- Storybook (production) — https://horizon-stays-storybook-production.vercel.app
- Reference site — https://horizon-stays-docs.vercel.app

## License

ISC
