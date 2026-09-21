/**
 * The package's only public surface. Anything not exported here is internal
 * and may change without a major version.
 *
 * Styles are not imported from here. Load `@aye_kyawt/horizon-stays-design-system/tokens.css`
 * and `@aye_kyawt/horizon-stays-design-system/styles.css` once, at the app root.
 *
 * 0.1.0 ships Button only. A component is exported once it has been built,
 * tested on staging, shipped to production Storybook (`Development` =
 * `Completed`) and cleared by the release review. Button is the only one on
 * that path for 0.1.0. Exporting a component later is a minor release; taking
 * one back after publishing would be a major, which is why nothing unreviewed
 * goes out now.
 *
 * Not yet public: they are built, but not cleared for release:
 *   Avatar, CardContainer, Chip, ProgressBar, Spinner, Tooltip.
 *   Each is exported in the release whose review clears it. Their stylesheets
 *   still ship in styles.css, because scripts/build-css.mjs requires every
 *   component stylesheet to be imported. The `hds-` classes are inert without
 *   the component that renders them.
 *
 * Deliberately internal:
 *   cardLayout, cardImage, cardText, iconBtn   subcomponents of the card. Their
 *       whole prop surface is reachable through CardContainer's `layout` prop
 *       (`layout.image`, `layout.text`), and CLAUDE.md has cards assembled by
 *       the parent, not by consumers from parts. Exporting one later is a minor
 *       release; taking one back would be a major.
 *   src/icons/*   vendored Simple Design System glyphs, used by components.
 */

export { Button, type ButtonProps, type ButtonType, type ButtonStatus, type ButtonIconSlot } from './components/Button/Button';
