/**
 * .cardContainer
 *
 * Figma node (component set): 39:2065
 * Figma node (the instance this build was commissioned from): 39:2355
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2355
 *
 * Matrix: Status (default | hovered) = 2 rows. The stories below add the two
 * cardLayout orientations, because that is how the container is actually
 * used — the instance in Figma fills its carditems slot with a cardLayout.
 *
 * Composes: cardLayout -> cardImage -> iconBtn, and cardText.
 *
 * The heart in the top-right of every card below is the composed `.iconBtn`.
 * It arrives with no prop passed at any level of the chain, which is what
 * Figma shows.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardContainer } from './cardContainer';
import { IconBtn } from '../iconBtn/iconBtn';
import sample from '../cardImage/sample.png';

const meta = {
  title: 'Components/cardContainer',
  component: CardContainer,
  parameters: { layout: 'padded', controls: { disable: false } },
  args: { layout: { image: { src: sample, alt: '' } } },
  // Story chrome only: the Figma component set is 276px wide, the instance 378px.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 378, padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Status=default. Hover it with the mouse to see the elevation apply for real. */
export const Default: Story = {
  name: 'Status=default',
  args: { status: 'default' },
};

/** Status=hovered — the level-2 drop shadow, pinned on. */
export const Hovered: Story = {
  name: 'Status=hovered',
  args: { status: 'hovered' },
};

/** The node this build was commissioned from: 39:2355, horizontal layout. */
export const AsBuiltInstance: Story = {
  name: 'Instance 39:2355 (horizontal)',
  args: {
    status: 'default',
    layout: { orientation: 'horizontal', hasSlot: true, image: { src: sample, alt: '' } },
  },
};

/** The same container with the vertical cardLayout in its slot. */
export const VerticalLayout: Story = {
  name: 'carditems = cardLayout (vertical)',
  args: {
    status: 'default',
    layout: { orientation: 'vertical', hasSlot: true, image: { src: sample, alt: '' } },
  },
};

/** Both statuses side by side, for comparing the elevation against Figma. */
export const StatusMatrix: Story = {
  name: 'Status matrix',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--semantic-spacing-gap-2xl)',
      }}
    >
      <CardContainer status="default" layout={{ image: { src: sample, alt: '' } }} />
      <CardContainer status="hovered" layout={{ image: { src: sample, alt: '' } }} />
    </div>
  ),
};

/**
 * The overlay heart driven as a favourite toggle, through the whole chain.
 * Click it or Tab to it — `aria-pressed` flips and the FILL axis follows.
 * The un-favourited outline is not in the Figma file; see the design gaps doc.
 */
export const FavouriteToggle: Story = {
  name: 'overlay heart as a toggle',
  render: function FavouriteToggleStory() {
    const [favourited, setFavourited] = useState(false);
    return (
      <CardContainer
        status="default"
        layout={{
          orientation: 'horizontal',
          image: {
            src: sample,
            alt: '',
            children: (
              <IconBtn
                favourited={favourited}
                label={favourited ? 'Remove from favourites' : 'Save to favourites'}
                onClick={() => setFavourited((on) => !on)}
              />
            ),
          },
        }}
      />
    );
  },
};
