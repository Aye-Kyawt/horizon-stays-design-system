/**
 * Info — vendored from the "Simple Design System" Figma library.
 *
 * Provenance, so this can be re-pulled or replaced without guesswork:
 *   library    Simple Design System (subscribed to the Horizon file, not a
 *              local component — the repo has no npm package for it)
 *   libraryKey lk-e0ffcff14368019c4f30f45401cd233d6cbc5f869988484192d04cbbef
 *              801fb0064ef68feaa8a2775ee4f1f05d9a4af1a6d07b2658eac4aefb7afb1
 *              8728c4066
 *   set        component_set 949466955628b71eb8fb4205918c9e29da5ae069
 *   instance   `.Button` 31:140 binds iconLeft1 / iconRight1 to this glyph;
 *              read off 30:93 (left) and 30:95 (right) of 30:97.
 *
 * This is the glyph the design actually references. It is NOT Material
 * Symbols — `.iconBtn` uses that font because its Figma glyph was unreachable,
 * but this one exports cleanly, so the real artwork is vendored rather than
 * substituted.
 *
 * Geometry, preserved from the node rather than eyeballed:
 *   outer box   16x16 (the `Info` instance)
 *   vector bbox 13.3333 square at (1.3333, 1.3333) — the path without stroke
 *   stroke      1.6, round cap and join
 * The exported SVG arrives with its own 14.9333 viewBox (bbox + stroke) and an
 * origin of 0.5333. Every coordinate below is that export shifted by +0.5333
 * into a 16x16 viewBox, which puts the circle dead centre on (8, 8) with
 * r=6.6667 and reproduces the 1.3333/13.3333 vector box exactly.
 *
 * `stroke="currentColor"` is the one deliberate change from the export, which
 * ships a baked stroke (white on Fill, #1E1E1E elsewhere). Inheriting the
 * colour is what lets one glyph serve all fifteen cells — the button sets the
 * colour from a token on the icon slot.
 */

import type { SVGProps } from 'react';

export function Info({ focusable, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable={focusable ?? false}
      {...rest}
    >
      <path
        d="M8 10.6667V8M8 5.3333H8.0067M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.3333 11.6819 1.3333 8C1.3333 4.3181 4.3181 1.3333 8 1.3333C11.6819 1.3333 14.6667 4.3181 14.6667 8Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Info;
