/**
 * .avatar — "Use this for current user account."
 *
 * Figma node: 54:9211
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=54-9211
 *
 * Matrix, read live off the node — a component set with ONE variant axis and
 * three values, so 3 cells and no booleans:
 *   Status   avatar | generic icon | initial name   (54:9212, 54:9214, 54:9217)
 *
 * `Status` becomes `status` here, the same leading-capital-lowercased mapping
 * `.cardContainer`, `.cardImage` and `.chip` already use in this file. The
 * variant VALUES are verbatim, spaces and all — `'generic icon'`, not
 * `'genericIcon'`. See docs/avatar-naming.md.
 *
 * Content is NOT a Figma property. The set exposes `Status` and nothing else:
 * the photo is a baked image fill on the `Ellipse` 54:9213, and the initials
 * are a fixed "HS" text layer 54:9219. A component that can only ever be one
 * person is not a component, so `src` / `alt` / `initials` are props named by
 * this repo — following `.cardImage`, whose Figma fill is likewise a
 * placeholder rather than a design value. No artwork is invented: with no
 * `src` the photo variant shows its bare `surfacePrimary` ground. The gap is
 * reported in docs/avatar-naming.md rather than papered over.
 *
 * The `generic icon` glyph is the `User` component from the Simple Design
 * System library, vendored into src/icons/User.tsx — the real artwork, not a
 * Material Symbols substitute.
 *
 * Composes: nothing. Every child is markup owned by this component.
 */

import type { HTMLAttributes } from 'react';
import { User } from '../../icons/User';
import './avatar.css';

/** Figma property `Status`, values verbatim. */
export type AvatarStatus = 'avatar' | 'generic icon' | 'initial name';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma property `Status`. */
  status?: AvatarStatus;
  /**
   * Photo for `status="avatar"`. Named by this repo — Figma bakes the image
   * into the ellipse fill instead of exposing it. With nothing passed the
   * variant renders its `surfacePrimary` ground and no image.
   */
  src?: string;
  /** Alternative text for that photo. Empty marks it decorative. */
  alt?: string;
  /**
   * Initials for `status="initial name"`. Named by this repo — Figma's layer
   * carries a fixed "HS", which is kept as the default so the untouched
   * component matches the node.
   */
  initials?: string;
}

export function Avatar({
  status = 'avatar',
  src,
  alt = '',
  initials = 'HS',
  className,
  ...rest
}: AvatarProps) {
  return (
    <span
      className={className ? `hds-avatar ${className}` : 'hds-avatar'}
      data-name="avatar"
      data-status={status}
      {...rest}
    >
      {status === 'avatar' && (
        <span className="hds-avatar__photo" aria-hidden={alt === '' ? true : undefined}>
          {src ? <img className="hds-avatar__img" src={src} alt={alt} /> : null}
        </span>
      )}

      {status === 'generic icon' && (
        <span className="hds-avatar__frame">
          <User className="hds-avatar__glyph" aria-hidden="true" />
        </span>
      )}

      {status === 'initial name' && (
        <span className="hds-avatar__frame">
          <span className="hds-avatar__initials">{initials}</span>
        </span>
      )}
    </span>
  );
}

export default Avatar;
