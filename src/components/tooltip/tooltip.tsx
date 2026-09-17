/**
 * .tooltip — the label that hangs off a trigger.
 *
 * Figma node: 74:20
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=74-20
 *
 * Figma's own description: "Tooltip. Placement puts the arrow on the side
 * facing the trigger. Keep the label to one short line."
 *
 * Matrix, read live off the node — a component set with ONE variant axis and
 * four cells, so 4 rows and nothing else:
 *   Placement   top | bottom | left | right   (74:2, 74:8, 74:12, 74:16)
 *   label       text — the `Label` text layer, default "Tooltip text"
 *
 * There is no status axis, no size axis and no interaction state in the set:
 * no hovered, no disabled, no error. So there is no prop and no story for any
 * of them. The matrix is four cells wide, which is exactly what ships here.
 *
 * Prop naming follows CLAUDE.md's "prop names match the Figma property names
 * exactly". The variant property is spelled `Placement` on the node, with a
 * capital P — an unconventional shape for a React prop, but renaming it here
 * would break the rule QA tests against. The suggestion to lowercase it in
 * Figma is recorded in docs/tooltip-naming.md rather than applied unilaterally.
 * `Button.tsx` set the same precedent in the other direction by keeping the
 * capitalised variant *value* `Fill`.
 *
 * Presentational only. The node describes a bubble and an arrow and nothing
 * about anchoring, so this component renders that and leaves placement on the
 * page to the consumer — no positioning library, per tools.md's rule against
 * adding dependencies the stack does not need. `Placement` chooses which side
 * the arrow sits on and which way it points; it does not move the tooltip.
 *
 * Structure, per the node: Bubble (74:3) then Arrow (74:7), always in that DOM
 * order so the label is read before the decoration. The four placements are
 * reached by flipping the flex axis in CSS rather than by reordering the JSX.
 *
 * The arrow is local artwork — a `vector` drawn inside this Horizon node, not
 * a glyph from the Simple Design System library — so it lives here rather than
 * in src/icons/. The four paths below are the Figma SVG exports verbatim; the
 * only change is `fill="currentColor"` in place of the baked #0F2F6B, which is
 * what lets the CSS colour the arrow from the same token as the bubble.
 */

import type { HTMLAttributes } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * The arrow, one entry per placement cell. `box` is the vector's own frame as
 * the node reports it — 8x4 lying down for top/bottom (74:7, 74:11), 4x8 on
 * its side for left/right (74:15, 74:19).
 */
const ARROW: Record<TooltipPlacement, { viewBox: string; d: string }> = {
  /* 74:7 — below the bubble, pointing down at the trigger. */
  top: { viewBox: '0 0 8 4', d: 'M0 0L4 4L8 0H0Z' },
  /* 74:11 — above the bubble, pointing up. */
  bottom: { viewBox: '0 0 8 4', d: 'M0 4L4 0L8 4H0Z' },
  /* 74:15 — right of the bubble, pointing right. */
  left: { viewBox: '0 0 4 8', d: 'M0 0L4 4L0 8V0Z' },
  /* 74:19 — left of the bubble, pointing left. */
  right: { viewBox: '0 0 4 8', d: 'M4 0L0 4L4 8V0Z' },
};

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Which side of the bubble the arrow sits on, facing the trigger. Figma's
   * `Placement` variant property, spelled exactly as the node spells it.
   */
  Placement?: TooltipPlacement;
  /** Figma's `label` text property (the `Label` layer, 74:6). One short line. */
  label?: string;
}

export function Tooltip({ Placement = 'top', label = 'Tooltip text', ...rest }: TooltipProps) {
  const arrow = ARROW[Placement];

  return (
    <div className="hds-tooltip" data-placement={Placement} role="tooltip" {...rest}>
      <div className="hds-tooltip__bubble">
        <p className="hds-tooltip__label">{label}</p>
      </div>

      <svg
        className="hds-tooltip__arrow"
        viewBox={arrow.viewBox}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable={false}
      >
        <path d={arrow.d} fill="currentColor" />
      </svg>
    </div>
  );
}

export default Tooltip;
