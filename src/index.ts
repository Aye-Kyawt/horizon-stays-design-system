/**
 * The package's only public surface. Anything not exported here is internal
 * and may change without a major version.
 *
 * Styles are not imported from here. Load `@aye_kyawt/horizon-stays-design-system/tokens.css`
 * and `@aye_kyawt/horizon-stays-design-system/styles.css` once, at the app root.
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
export { Avatar, type AvatarProps, type AvatarStatus } from './components/avatar/avatar';
export { CardContainer, type CardContainerProps, type CardContainerStatus } from './components/cardContainer/cardContainer';
export { Chip, type ChipProps, type ChipStatus } from './components/chip/chip';
export { ProgressBar, type ProgressBarProps, type ProgressBarTone } from './components/progressBar/progressBar';
export { Spinner, type SpinnerProps, type SpinnerSize } from './components/spinner/spinner';
export { Tooltip, type TooltipProps, type TooltipPlacement } from './components/tooltip/tooltip';
