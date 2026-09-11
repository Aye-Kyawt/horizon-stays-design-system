/**
 * Remove — vendored from the "Simple Design System" Figma library.
 *
 * Provenance, so this can be re-pulled or replaced without guesswork:
 *   library   Simple Design System (subscribed to the Horizon file, not a
 *             local component — the repo has no npm package for it)
 *   instance  `.chip` 72:19 binds the trailing clear control to this glyph;
 *             read off 72:5 (default / hovered), 72:14 (selected) and
 *             72:18 (disabled).
 *
 * This is the glyph the design actually references, vendored rather than
 * substituted, following `src/icons/Info.tsx`. It is NOT Material Symbols.
 *
 * Geometry, preserved from the node rather than eyeballed:
 *   slot box    8x8 (the `Remove` frame inside the chip)
 *   vector bbox 8 square at (0.75, 0.75) — the cross without its stroke
 *   stroke      1.5, round cap
 * The export arrives in a 9.5 viewBox: the 8-unit cross plus 0.75 of stroke
 * on each side. The cross therefore centres on (4.75, 4.75) and fills the
 * 8x8 slot exactly, with the stroke overflowing it — which is why the CSS
 * gives the slot `overflow: visible` rather than scaling the artwork down to
 * 8 units and quietly shrinking the cross to 6.7.
 *
 * `stroke="currentColor"` is the one deliberate change from the export, which
 * ships a baked #667289. Inheriting the colour is what lets one glyph serve
 * all four chip states — the chip sets the colour from a token per state.
 */

import type { SVGProps } from 'react';

export function Remove({ focusable, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="9.5"
      height="9.5"
      viewBox="0 0 9.5 9.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable={focusable ?? false}
      {...rest}
    >
      <path
        d="M0.75 0.75L8.75 8.75M8.75 0.75L0.75 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
