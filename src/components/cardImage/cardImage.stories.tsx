/**
 * .cardImage
 *
 * Figma node: 39:2193 (component set)
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2193
 *
 * Matrix: Status (default | hovered) x ratio (3:2 | 1:1) x overlayAction
 * (true | false) = 8 rows, one story each. When `overlayAction` is on the slot
 * renders the composed `.iconBtn` heart, which is what Figma puts there.
 *
 * Known gap: `status="hovered"` renders identically to `default`. Its only
 * differences in Figma are an image opacity of 0.2, a black-to-grey gradient
 * scrim and a raw #FFFFFF surface — none of them bound to a variable, so none
 * of them guessed here. See docs/cardContainer-design-gaps.md.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardImage } from './cardImage';
import { IconBtn } from '../iconBtn/iconBtn';
import sample from './sample.png';

const meta = {
  title: 'Components/cardImage',
  component: CardImage,
  parameters: { layout: 'padded', controls: { disable: false } },
  args: { src: sample, alt: '' },
  // Story chrome only: the Figma 3:2 frame is 278px wide.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 278, padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default32: Story = {
  name: 'Status=default, ratio=3:2',
  args: { status: 'default', ratio: '3:2', overlayAction: true },
};

export const Hovered32: Story = {
  name: 'Status=hovered, ratio=3:2',
  args: { status: 'hovered', ratio: '3:2', overlayAction: true },
};

export const Default11: Story = {
  name: 'Status=default, ratio=1:1',
  args: { status: 'default', ratio: '1:1', overlayAction: true },
};

export const Hovered11: Story = {
  name: 'Status=hovered, ratio=1:1',
  args: { status: 'hovered', ratio: '1:1', overlayAction: true },
};

export const Default32NoOverlay: Story = {
  name: 'Status=default, ratio=3:2, overlayAction=false',
  args: { status: 'default', ratio: '3:2', overlayAction: false },
};

export const Hovered32NoOverlay: Story = {
  name: 'Status=hovered, ratio=3:2, overlayAction=false',
  args: { status: 'hovered', ratio: '3:2', overlayAction: false },
};

export const Default11NoOverlay: Story = {
  name: 'Status=default, ratio=1:1, overlayAction=false',
  args: { status: 'default', ratio: '1:1', overlayAction: false },
};

export const Hovered11NoOverlay: Story = {
  name: 'Status=hovered, ratio=1:1, overlayAction=false',
  args: { status: 'hovered', ratio: '1:1', overlayAction: false },
};

/**
 * The slot is still an escape hatch. Passing `children` replaces the default
 * `.iconBtn` — here with a toggle-flavoured one in its un-favourited state.
 */
export const OverlayActionSlotOverridden: Story = {
  name: 'overlayAction slot overridden',
  args: { status: 'default', ratio: '3:2', overlayAction: true },
  render: (args) => (
    <CardImage {...args}>
      <IconBtn favourited={false} label="Save to favourites" />
    </CardImage>
  ),
};
