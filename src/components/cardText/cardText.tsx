/**
 * .cardText — card information text.
 *
 * Figma node: 37:2034
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=37-2034
 *
 * Figma exposes three boolean component properties on this component —
 * `metadata`, `review` and `price` — and they are reproduced here under those
 * exact names. The text itself is not a Figma property (the layers carry
 * fixed sample content), so the content props below are named by this repo,
 * not by the design. See docs/cardContainer-naming.md.
 */

export interface CardTextProps {
  /** Figma property `metadata`. Shows the rating and price block. */
  metadata?: boolean;
  /** Figma property `review`. Shows the rating line. Nested inside `metadata`. */
  review?: boolean;
  /** Figma property `price`. Shows the price line. Nested inside `metadata`. */
  price?: boolean;

  /** Property name. Repo-named prop — Figma has no text property for it. */
  title?: string;
  /** Neighbourhood, city and distance line. Repo-named prop. */
  location?: string;
  /** Rating value, e.g. "4.7". Repo-named prop. */
  rating?: string;
  /** Review count line, e.g. "(318 reviews)". Repo-named prop. */
  reviewCount?: string;
  /**
   * Price value, e.g. "121 EUR". Repo-named prop — it cannot be called
   * `price`, which Figma already uses for the boolean above.
   */
  priceAmount?: string;
  /** Price qualifier, e.g. "per night". Repo-named prop. */
  pricePeriod?: string;

  className?: string;
}

export function CardText({
  metadata = true,
  review = true,
  price = true,
  title = 'Casa do Bairro',
  location = 'Alfama, Lisbon · 1.2 km from centre',
  rating = '4.7',
  reviewCount = '(318 reviews)',
  priceAmount = '121 EUR',
  pricePeriod = 'per night',
  className,
}: CardTextProps) {
  return (
    <div
      className={className ? `hds-cardText ${className}` : 'hds-cardText'}
      data-name="cardText"
    >
      <div className="hds-cardText__locationInfo" data-name="Location Info">
        <p className="hds-cardText__title">{title}</p>
        <p className="hds-cardText__location">{location}</p>
      </div>

      {metadata && (
        <div className="hds-cardText__metadata" data-name="Rating and Price Info">
          {review && (
            <div className="hds-cardText__ratingInfo" data-name="Rating Info">
              <p className="hds-cardText__rating">{rating}</p>
              <p className="hds-cardText__reviewCount">{reviewCount}</p>
            </div>
          )}
          {price && (
            <div className="hds-cardText__priceInfo" data-name="Price Info">
              <p className="hds-cardText__priceAmount">{priceAmount}</p>
              <p className="hds-cardText__pricePeriod">{pricePeriod}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CardText;
