# Horizon Stays Design System

`@aye_kyawt/horizon-stays-design-system`

The React component library and design tokens behind Horizon Stays. Components are
built from Figma nodes, tested against them variant by variant, and reviewed before
release — the [component registry](https://airtable.com/) tracks where each one is on
that ladder.

> **Status: not yet published.** The package is marked `"private": true` until the
> first release, so the install command below will 404 against npm today. It is
> published by `npm run release:publish -- <version>`, which removes the guard for the
> length of the publish and puts it back.

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
import { Button, CardContainer } from '@aye_kyawt/horizon-stays-design-system';
import '@aye_kyawt/horizon-stays-design-system/tokens.css';
import '@aye_kyawt/horizon-stays-design-system/styles.css';

export function Example() {
  return <Button type="primary" status="default">Book a stay</Button>;
}
```

`tokens.css` carries the custom properties; `styles.css` carries every component rule
that reads them. Load tokens first — the rules resolve against it.

## Components

The public surface is `src/index.ts`. Anything not exported there is internal and may
change without a major version.

| Component | Exported types |
|---|---|
| `Button` | `ButtonProps`, `ButtonType`, `ButtonStatus`, `ButtonIconSlot` |
| `Avatar` | `AvatarProps`, `AvatarStatus` |
| `CardContainer` | `CardContainerProps`, `CardContainerStatus` |
| `Chip` | `ChipProps`, `ChipStatus` |
| `ProgressBar` | `ProgressBarProps`, `ProgressBarTone` |
| `Spinner` | `SpinnerProps`, `SpinnerSize` |
| `Tooltip` | `TooltipProps`, `TooltipPlacement` |

`cardLayout`, `cardImage`, `cardText` and `iconBtn` are deliberately internal. Their
whole prop surface is reachable through `CardContainer`'s `layout` prop, and cards are
assembled by the parent rather than by consumers from parts. Exporting one later is a
minor release; taking one back would be a major.

## Tokens

Tokens are exported from Figma into `tokens/token.json` and built with Style Dictionary
into three platforms — web, mobile and back-office — each with a light and a dark theme.

Components read **semantic** tokens only (`--color-surface-*`, not `--core-*`); the test
suite fails a stylesheet that reaches into the base layer.

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
