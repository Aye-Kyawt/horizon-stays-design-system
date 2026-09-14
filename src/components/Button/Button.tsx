/**
 * .Button — the CTA.
 *
 * Figma node: 31:140
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=31-140
 *
 * Figma's own description: "Use this component when need CTA. Don't use it for
 * opening external link." A link that navigates is an anchor, not this.
 *
 * The matrix, read live off the node: 15 cells, Type x Status, and nothing
 * else. Type = Fill | outline | transparent. Status = default | hovered |
 * focus | disabled | error. There is no size axis, no loading state and no
 * pressed state in the component set, so none is offered here.
 *
 * Prop names are the Figma property names. `type` is one of them, which
 * collides with the DOM button attribute of the same name — the Figma name
 * wins and the DOM attribute moves to `htmlType`.
 *
 * Figma splits each icon across two properties: `iconLeft` (boolean, show or
 * hide) and `iconLeft1` (the swap slot holding the instance). Carrying both
 * would mean shipping a prop named `iconLeft1`. They are merged into one
 * `iconLeft` that takes either: `true` renders the designed `Info` glyph,
 * `false` hides the slot, and any node renders in its place. Same for
 * `iconRight`. Both default to true, as they do in the node.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Info } from '../../icons/Info';
import './Button.css';

/** Figma property `Type`. Capital F on Fill is the design's own spelling. */
export type ButtonType = 'Fill' | 'outline' | 'transparent';

/** Figma property `Status`. */
export type ButtonStatus = 'default' | 'hovered' | 'focus' | 'disabled' | 'error';

/** `true` for the designed Info glyph, `false` for none, or a node to swap in. */
export type ButtonIconSlot = boolean | ReactNode;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Figma `Type`. */
  type?: ButtonType;
  /**
   * Figma `Status`. Pins a cell of the matrix on so a story can show it
   * standing still. `default` additionally lets the live :hover and
   * :focus-visible states apply on their own.
   */
  status?: ButtonStatus;
  /** Figma `label`. */
  label?: string;
  /** Figma `iconLeft` + `iconLeft1`, merged. */
  iconLeft?: ButtonIconSlot;
  /** Figma `iconRight` + `iconRight1`, merged. */
  iconRight?: ButtonIconSlot;
  /** The DOM `type` attribute, displaced by the Figma property of that name. */
  htmlType?: 'button' | 'submit' | 'reset';
  className?: string;
}

/** `true` means the designed glyph; `false`/nullish means an empty slot. */
function renderIcon(slot: ButtonIconSlot): ReactNode {
  if (slot === true) return <Info />;
  if (slot === false || slot === null || slot === undefined) return null;
  return slot;
}

export function Button({
  type = 'Fill',
  status = 'default',
  label = 'Button Component',
  iconLeft = true,
  iconRight = true,
  htmlType = 'button',
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const left = renderIcon(iconLeft);
  const right = renderIcon(iconRight);

  // The disabled cell is a disabled control, not just a grey one. An explicit
  // `disabled` prop still wins, so a Fill/default button can be disabled
  // without pretending to be the disabled cell.
  const isDisabled = disabled ?? status === 'disabled';

  return (
    <button
      {...rest}
      // eslint-disable-next-line react/button-has-type
      type={htmlType}
      className={className ? `hds-button ${className}` : 'hds-button'}
      data-name="button"
      data-type={type}
      data-status={status}
      disabled={isDisabled}
    >
      {left ? (
        <span className="hds-button__icon" data-slot="left">
          {left}
        </span>
      ) : null}
      <span className="hds-button__label">{label}</span>
      {right ? (
        <span className="hds-button__icon" data-slot="right">
          {right}
        </span>
      ) : null}
    </button>
  );
}

export default Button;
