/**
 * .spinner — the indeterminate loading indicator.
 *
 * Figma node: 84:33
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-33
 *
 * Matrix, read live off the node — a component set with one variant property
 * and three values, so 3 cells and no second axis:
 *   size   sm | md | lg   (84:27, 84:29, 84:31)
 *
 * There is no status, state or boolean axis on this node. A spinner has one
 * appearance and it is always spinning, so `hovered` / `disabled` do not
 * exist here the way they do on `.chip`. Nothing has been added to widen the
 * matrix past what the component set defines.
 *
 * Figma's own description of the node: "Three sizes rotate in prototype for
 * motion." The rotation is therefore part of the design, but the prototype
 * carries no keyframes the connection can read (`get_motion_context` returns
 * an empty node list) and this token system exports no motion, duration or
 * easing collection at all. Duration and easing are consequently **unbound**
 * — see spinner.css, where the placeholder is isolated on one custom property
 * and documented rather than scattered.
 *
 * Prop naming: Figma's variant property is `Size` with a leading capital.
 * It is implemented as `size`, following the precedent already set for
 * `.cardContainer`'s `Status` and recorded in docs/spinner-naming.md. The
 * variant *values* `sm` / `md` / `lg` are verbatim.
 *
 * Artwork: each variant is two ellipse nodes, `Track` (84:36 on lg) and
 * `Arc` (84:32 on lg), both filled donuts in the export rather than strokes.
 * They are the component's own geometry, not library icons, so nothing is
 * imported from src/icons/ here — and nothing is substituted from Material
 * Symbols either.
 *
 * A filled donut of outer radius R and inner radius r is identical to a
 * stroked circle of radius (R + r) / 2 and stroke-width (R - r), with butt
 * caps. That is what SIZES below records, read straight off the exported
 * SVG paths rather than eyeballed:
 *
 *   size   box   outer R   inner r   ring    circle r   viewBox
 *   sm      16      8.0      5.60     2.40      6.80    0 0 16 16
 *   md      24     12.0      8.88     3.12     10.44    0 0 24 24
 *   lg      40     20.0     16.00     4.00     18.00    0 0 40 40
 *
 * The ring is not a constant fraction of the box (0.150, 0.130, 0.100) and
 * Figma binds no variable to it, so it is per-size artwork geometry and lives
 * here with the rest of the vector, exactly as the stroke widths in
 * src/icons/Info.tsx do. The box size itself does resolve onto tokens and is
 * set in CSS, not here.
 *
 * The arc sweeps 270 degrees clockwise from twelve o'clock — the exported
 * outer path runs from (8,0) through (16,8) and (8,16) to (0,8), three
 * quadrants. `pathLength={100}` normalises the circumference so the same
 * `stroke-dasharray: 75 25` gives exactly 270 degrees at every size, and the
 * -90 degree rotate moves SVG's own start point from three o'clock to twelve.
 */

import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/** Vector geometry per variant, read off the node's exported paths. */
const SIZES: Record<SpinnerSize, { box: number; r: number; ring: number }> = {
  sm: { box: 16, r: 6.8, ring: 2.4 },
  md: { box: 24, r: 10.44, ring: 3.12 },
  lg: { box: 40, r: 18, ring: 4 },
};

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Figma's `Size` variant property, lowercased — see docs/spinner-naming.md.
   * `sm` is the component set's first variant and so the default.
   */
  size?: SpinnerSize;
  /**
   * Accessible name announced while the spinner is on screen. Named by this
   * repo, not by Figma — the node has no text property — and recorded as such
   * in docs/spinner-naming.md.
   */
  label?: string;
}

export function Spinner({ size = 'sm', label = 'Loading', ...rest }: SpinnerProps) {
  const { box, r, ring } = SIZES[size];
  const c = box / 2;

  return (
    <span
      className="hds-spinner"
      data-name="spinner"
      data-size={size}
      role="status"
      aria-label={label}
      {...rest}
    >
      <svg
        className="hds-spinner__svg"
        viewBox={`0 0 ${box} ${box}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Track — ellipse 84:36, semantic/color/bg/surfaceSecondary */}
        <circle
          className="hds-spinner__track"
          cx={c}
          cy={c}
          r={r}
          strokeWidth={ring}
        />
        {/* Arc — ellipse 84:32, semantic/color/bg/primary, 270 deg from 12 o'clock */}
        <circle
          className="hds-spinner__arc"
          cx={c}
          cy={c}
          r={r}
          strokeWidth={ring}
          pathLength={100}
          strokeDasharray="75 25"
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
    </span>
  );
}

export default Spinner;
