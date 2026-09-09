/**
 * .cardText
 *
 * Figma node: 37:2034
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=37-2034
 *
 * .cardText is a single component, not a component set — it has no variants.
 * Its matrix is the three boolean Figma properties: metadata, review, price.
 * `review` and `price` only have an effect while `metadata` is on, so the
 * meaningful rows are the five below.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardText } from './cardText';

const meta = {
  title: 'Components/cardText',
  component: CardText,
  parameters: { layout: 'padded', controls: { disable: false } },
  // Story chrome only: the Figma frame is 278px wide.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 278, padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** metadata on, review on, price on — the default the Figma component ships. */
export const Default: Story = {
  args: { metadata: true, review: true, price: true },
};

/** metadata off — location block only. */
export const MetadataOff: Story = {
  name: 'metadata = false',
  args: { metadata: false },
};

/** review off — price line survives. */
export const ReviewOff: Story = {
  name: 'review = false',
  args: { metadata: true, review: false, price: true },
};

/** price off — rating line survives. */
export const PriceOff: Story = {
  name: 'price = false',
  args: { metadata: true, review: true, price: false },
};

/** Both inner booleans off — metadata block renders empty. */
export const ReviewAndPriceOff: Story = {
  name: 'review = false, price = false',
  args: { metadata: true, review: false, price: false },
};

/** Long content, to prove the word-break rule the design carries. */
export const LongContent: Story = {
  args: {
    title: 'Casa do Bairro Alto with the very long descriptive name',
    location: 'Alfama, Lisbon · 1.2 km from centre · near the tram terminus',
  },
};
