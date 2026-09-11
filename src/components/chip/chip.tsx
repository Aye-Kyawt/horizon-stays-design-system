/**
 * .chip — the filter chip.
 *
 * Figma node: 72:19
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=72-19
 *
 * Matrix, read live off the node — a component set with four variant rows and
 * two booleans, so 4 x 2 x 2 = 16 cells:
 *   status     default | hovered | selected | disabled   (72:2, 72:6, 72:11, 72:15)
 *   icon       boolean — shows the leading 16px slot
 *   removable  boolean — shows the trailing clear control
 *   label      text
 *
 * Prop naming follows CLAUDE.md's "prop names match the Figma property names
 * exactly". That includes `icon1`, which is Figma's own name for the
 * instance-swap slot that sits inside the `icon` boolean — an unhelpful name,
 * but renaming it here would break the rule that QA tests against. The
 * suggestion to rename it is recorded in docs/chip-naming.md rather than
 * applied unilaterally.
 *
 * The design describes the leading slot as "takes any 16px icon", so it is a
 * genuine slot rather than a fixed glyph: `icon1` accepts any node and the
 * dashed placeholder only stands in when the slot is switched on and empty.
 * The trailing clear control IS a fixed glyph, and comes from the Simple
 * Design System library via src/icons/Remove.tsx — vendored, not substituted.
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { Remove } from '../../icons/Remove';
import './chip.css';

export type ChipStatus = 'default' | 'hovered' | 'selected' | 'disabled';

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Pins one state on so a story can show it without being driven. The live
   * `:hover` state applies on its own as well; `selected` and `disabled` are
   * states of the chip rather than of the pointer, so they only ever arrive
   * through this prop.
   */
  status?: ChipStatus;
  /** Shows the leading 16px icon slot. Figma's `icon` boolean. */
  icon?: boolean;
  /** What goes in that slot. Figma's `icon1` instance swap. */
  icon1?: ReactNode;
  /** Figma's `label` text property. */
  label?: string;
  /** Shows the trailing clear control. Figma's `removable` boolean. */
  removable?: boolean;
  /** Fired when the clear control is activated. Never fires while disabled. */
  onRemove?: () => void;
}

export function Chip({
  status = 'default',
  icon = false,
  icon1,
  label = 'Chip',
  removable = false,
  onRemove,
  ...rest
}: ChipProps) {
  const disabled = status === 'disabled';

  return (
    <span className="hds-chip" data-status={status} {...rest}>
      {icon && (
        <span className="hds-chip__icon" aria-hidden={icon1 ? undefined : true}>
          {icon1 ?? <span className="hds-chip__icon-placeholder" />}
        </span>
      )}

      <span className="hds-chip__label">{label}</span>

      {removable && (
        <button
          type="button"
          className="hds-chip__remove"
          disabled={disabled}
          aria-label={`Remove ${label}`}
          onClick={disabled ? undefined : onRemove}
        >
          <Remove className="hds-chip__remove-glyph" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
