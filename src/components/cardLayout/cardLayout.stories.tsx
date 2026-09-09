/**
 * cardLayout
 *
 * Figma node: 39:2346 (component set)
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2346
 *
 * Matrix: Orientation (horizontal | vertical) x hasSlot (true | false)
 * = 4 rows, one story each.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardLayout } from './cardLayout';
import sample from '../cardImage/sample.png';

const meta = {
  title: 'Components/cardLayout',
  component: CardLayout,
  parameters: { layout: 'padded', controls: { disable: false } },
  args: { image: { src: sample, alt: '' } },
  // Story chrome only: the Figma frame is 264px wide.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: 'Orientation=horizontal',
  args: { orientation: 'horizontal', hasSlot: true },
};

export const Vertical: Story = {
  name: 'Orientation=vertical',
  args: { orientation: 'vertical', hasSlot: true },
};

export const HorizontalNoSlot: Story = {
  name: 'Orientation=horizontal, hasSlot=false',
  args: { orientation: 'horizontal', hasSlot: false },
};

export const VerticalNoSlot: Story = {
  name: 'Orientation=vertical, hasSlot=false',
  args: { orientation: 'vertical', hasSlot: false },
};

/**
 * The slot with content in it, so the reserved area is visible. The Figma
 * slot is a fixed 30px tall; that height is unbound, so it is not reproduced
 * and the slot sizes to its content instead.
 */
export const SlotFilled: Story = {
  name: 'Slot filled',
  args: { orientation: 'horizontal', hasSlot: true },
  render: (args) => (
    <CardLayout {...args}>
      <span
        style={{
          color: 'var(--semantic-color-text-subtle)',
          fontFamily: 'var(--semantic-type-latin-meta-font-family), system-ui, sans-serif',
          fontSize: 'var(--semantic-type-latin-meta-font-size)',
        }}
      >
        {'Slot content'}
      </span>
    </CardLayout>
  ),
};
