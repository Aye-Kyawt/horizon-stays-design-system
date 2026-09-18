/**
 * .iconBtn — the overlay action that sits on a card image.
 *
 * Figma node: 39:2185 (the instance inside `.cardImage` Status=default,
 * ratio=3:2 — 39:2191). The same instance appears in all four `.cardImage`
 * variants: 39:2185, 39:2180, 39:2195, 39:2199.
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2185
 *
 * Matrix, read live off the file: `.iconBtn` is NOT a component set. It has no
 * variant properties at all — one appearance, identical in every `.cardImage`
 * variant, at 32x32 in the top-right corner. There is no idle/hover/pressed
 * ladder and no filled-vs-outline heart in the design. The interaction states
 * below therefore come from CLAUDE.md ("every component covers every
 * interaction state the product uses"), not from Figma, and each one names the
 * token it landed on. See docs/cardContainer-design-gaps.md section 4.
 *
 * The glyph: Figma's `Heart` (39:2146) is Code-Connected to a component in a
 * library called "Simple Design System" that this repo does not contain, and
 * its main component is not reachable in this file. CLAUDE.md requires icons to
 * come from Material Symbols, so the heart is the Material Symbols `favorite`
 * ligature, loaded in .storybook/preview-head.html.
 *
 * Prop naming: Figma defines no properties on this component, so CLAUDE.md's
 * "prop names match the Figma property names exactly" has nothing to match.
 * `status` follows `.cardImage` and `.cardContainer`; the rest are new names
 * and are recorded in docs/cardContainer-design-gaps.md.
 */

import type { ButtonHTMLAttributes } from 'react';

export type IconBtnStatus = 'default' | 'hovered' | 'pressed' | 'focused' | 'disabled';

export interface IconBtnProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed' | 'children'> {
  /**
   * Pins one interaction state on, so a story can show it without being
   * driven. The live `:hover`, `:focus-visible`, `:active` and `:disabled`
   * states apply on their own as well.
   */
  status?: IconBtnStatus;
  /**
   * Material Symbols ligature name. Defaults to the `favorite` heart the
   * design shows. Ligature names are the font's own, so they stay in the
   * font's American spelling.
   */
  icon?: string;
  /** Accessible name. The design carries no label, so this is required content. */
  label?: string;
  /**
   * Optional favourite toggle. Leave it undefined — the default — and the
   * button renders exactly what Figma shows (a solid heart) and carries no
   * `aria-pressed`. Pass a boolean and the button becomes a real toggle:
   * `aria-pressed` is set, and the Material Symbols FILL axis switches between
   * solid and outline. The outline appearance is NOT in the Figma file; it is
   * the accessible counterpart to the solid one, and it is reported as a gap.
   */
  favourited?: boolean;
  className?: string;
}

export function IconBtn({
  status = 'default',
  icon = 'favorite',
  label = 'Save to favourites',
  favourited,
  className,
  type = 'button',
  disabled,
  ...rest
}: IconBtnProps) {
  const isToggle = favourited !== undefined;
  const filled = isToggle ? favourited : true;

  return (
    <button
      {...rest}
      type={type}
      className={className ? `hds-iconBtn ${className}` : 'hds-iconBtn'}
      data-name="iconBtn"
      data-status={status}
      data-filled={filled ? 'true' : 'false'}
      disabled={disabled ?? status === 'disabled'}
      aria-label={label}
      aria-pressed={isToggle ? favourited : undefined}
    >
      <span className="material-symbols-rounded hds-iconBtn__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export default IconBtn;
