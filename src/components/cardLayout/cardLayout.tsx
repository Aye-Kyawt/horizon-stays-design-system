/**
 * cardLayout — "Subcomponent of the card. Use to configure the orientation."
 *
 * Figma node: 39:2346
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2346
 *
 * Component set: Orientation (horizontal | vertical), plus the boolean
 * property `hasSlot`. Composes .cardImage and .cardText — their styles are
 * imported as components, never copied.
 */

import type { ReactNode } from 'react';
import { CardImage, type CardImageProps } from '../cardImage/cardImage';
import { CardText, type CardTextProps } from '../cardText/cardText';

export type CardLayoutOrientation = 'horizontal' | 'vertical';

export interface CardLayoutProps {
  /** Figma property `Orientation`. */
  orientation?: CardLayoutOrientation;
  /** Figma property `hasSlot`. Renders the slot beneath the card text. */
  hasSlot?: boolean;
  /** Contents of the slot. */
  children?: ReactNode;
  /** Forwarded to the composed `.cardImage`. */
  image?: CardImageProps;
  /** Forwarded to the composed `.cardText`. */
  text?: CardTextProps;
  className?: string;
}

export function CardLayout({
  orientation = 'vertical',
  hasSlot = true,
  children,
  image,
  text,
  className,
}: CardLayoutProps) {
  return (
    <div
      className={className ? `hds-cardLayout ${className}` : 'hds-cardLayout'}
      data-name="cardLayout"
      data-orientation={orientation}
    >
      <CardImage {...image} />
      <div className="hds-cardLayout__body">
        <CardText {...text} />
        {hasSlot && (
          <div className="hds-cardLayout__slot" data-name="Slot">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardLayout;
