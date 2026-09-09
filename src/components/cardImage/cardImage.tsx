/**
 * .cardImage — "Use it for image container."
 *
 * Figma node: 39:2193
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2193
 *
 * Component set: Status (default | hovered) x ratio (3:2 | 1:1), plus the
 * boolean property `overlayAction`. Prop names are the Figma property names.
 *
 * Composes: .iconBtn — the heart the design puts in the overlay position.
 */

import type { ReactNode } from 'react';
import { IconBtn } from '../iconBtn/iconBtn';
import './cardImage.css';

export type CardImageStatus = 'default' | 'hovered';
export type CardImageRatio = '3:2' | '1:1';

export interface CardImageProps {
  /** Figma property `Status`. */
  status?: CardImageStatus;
  /** Figma property `ratio`. */
  ratio?: CardImageRatio;
  /** Figma property `overlayAction`. Renders the overlay action slot. */
  overlayAction?: boolean;
  /**
   * Contents of the overlay action slot. In Figma this position holds a
   * `.iconBtn` instance (39:2185) wrapping a `Heart`, so that is what the slot
   * renders when nothing is passed. Pass `children` to put something else
   * there; the slot itself stays an escape hatch.
   */
  children?: ReactNode;
  /** Image source. The Figma fill is a placeholder, not a design value. */
  src?: string;
  /** Alternative text. Empty marks the image decorative. */
  alt?: string;
  className?: string;
}

export function CardImage({
  status = 'default',
  ratio = '3:2',
  overlayAction = true,
  children,
  src,
  alt = '',
  className,
}: CardImageProps) {
  return (
    <div
      className={className ? `hds-cardImage ${className}` : 'hds-cardImage'}
      data-name=".cardImage"
      data-status={status}
      data-ratio={ratio}
    >
      <div className="hds-cardImage__media" aria-hidden={alt === '' ? true : undefined}>
        {src ? <img className="hds-cardImage__img" src={src} alt={alt} /> : null}
      </div>
      {overlayAction && (
        <div className="hds-cardImage__overlayAction" data-name="overlayAction">
          {children ?? <IconBtn />}
        </div>
      )}
    </div>
  );
}

export default CardImage;
