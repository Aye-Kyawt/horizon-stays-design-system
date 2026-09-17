/**
 * .cardContainer — "sub container of the main card."
 *
 * Figma node: 39:2065 (component set)
 * Instance this build was commissioned from: 39:2355
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2355
 *
 * Component set: Status (default | hovered).
 *
 * The `carditems` slot is `children`. Its default content is a `cardLayout`,
 * which is what the slot actually holds in Figma — so the parent composes the
 * subcomponent rather than restating its styles.
 *
 * Composes: cardLayout -> cardImage, cardText.
 */

import type { ReactNode } from 'react';
import { CardLayout, type CardLayoutProps } from '../cardLayout/cardLayout';

export type CardContainerStatus = 'default' | 'hovered';

export interface CardContainerProps {
  /**
   * Figma property `Status`. `hovered` pins the hover elevation on; the real
   * `:hover` state applies it too, so the card behaves without being driven.
   */
  status?: CardContainerStatus;
  /** Contents of the Figma `carditems` slot. Defaults to a `cardLayout`. */
  children?: ReactNode;
  /** Forwarded to the default `cardLayout` when `children` is not given. */
  layout?: CardLayoutProps;
  className?: string;
}

export function CardContainer({
  status = 'default',
  children,
  layout,
  className,
}: CardContainerProps) {
  return (
    <div
      className={className ? `hds-cardContainer ${className}` : 'hds-cardContainer'}
      data-name="cardContainer"
      data-status={status}
    >
      <div className="hds-cardContainer__items" data-name="carditems">
        {children ?? <CardLayout orientation="horizontal" {...layout} />}
      </div>
    </div>
  );
}

export default CardContainer;
