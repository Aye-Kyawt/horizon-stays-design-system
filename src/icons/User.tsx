/**
 * User — vendored from the "Simple Design System" Figma library.
 *
 * Provenance, so this can be re-pulled or replaced without guesswork:
 *   library   Simple Design System (subscribed to the Horizon file, not a
 *             local component — the repo has no npm package for it)
 *   instance  `.avatar` 54:9211 places this glyph in the `generic icon`
 *             variant; read off 54:9216, the `User` instance inside
 *             `Frame 2` 54:9215.
 *   export    figma asset 0fc35d33-5b20-4072-b760-d8963d8a4fb6.svg
 *
 * This is the glyph the design actually references, vendored rather than
 * substituted, following `src/icons/Info.tsx` and `src/icons/Remove.tsx`.
 * It is NOT Material Symbols.
 *
 * Geometry, preserved from the node rather than eyeballed:
 *   slot box    14x14 (the `User` instance inside the 30x30 frame, at 8,8)
 *   viewBox     0 0 14 14 — the export's own box, no shifting needed
 *   stroke      2, round cap and join
 * The path coordinates run 1.75 -> 12.25, which is a 24-unit Feather/Lucide
 * `user` outline scaled by 14/24. Figma scaled the geometry but kept the
 * stroke at an absolute 2, so the export's strokes are proportionally heavier
 * than the source icon's. That is what the node renders, so it is preserved
 * rather than rescaled to 14/24 * 2 = 1.1667.
 *
 * The intrinsic `width`/`height` of 14 is deliberate: it is the one place the
 * avatar's 14px glyph box is written down, because Figma binds no variable to
 * it. `avatar.css` derives its 30x30 box from that 14 plus the padding token,
 * rather than hardcoding 30.
 *
 * `stroke="currentColor"` is the one deliberate change from the export, which
 * ships a baked #1D4ED8 — the resolved value of `semantic/color/icon/primary`.
 * Inheriting the colour lets the avatar set it from that token instead.
 */

import type { SVGProps } from 'react';

export function User({ focusable, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable={focusable ?? false}
      {...rest}
    >
      <path
        d="M11.6667 12.25V11.0833C11.6667 10.4645 11.4208 9.871 10.9832 9.43342C10.5457 8.99583 9.95217 8.75 9.33333 8.75H4.66667C4.04783 8.75 3.45434 8.99583 3.01675 9.43342C2.57917 9.871 2.33333 10.4645 2.33333 11.0833V12.25M9.33333 4.08333C9.33333 5.372 8.28866 6.41667 7 6.41667C5.71134 6.41667 4.66667 5.372 4.66667 4.08333C4.66667 2.79467 5.71134 1.75 7 1.75C8.28866 1.75 9.33333 2.79467 9.33333 4.08333Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default User;
