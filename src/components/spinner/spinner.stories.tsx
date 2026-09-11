/**
 * .spinner stories.
 *
 * Figma node: 84:33
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-33
 *
 * One story per row of the matrix read off that node. The matrix has a single
 * axis — `Size` = sm | md | lg (84:27, 84:29, 84:31) — so there are three
 * rows and three stories, plus a matrix story showing all three together the
 * way the component set lays them out on the canvas.
 *
 * There is no state axis on this node and none has been added: a spinner is
 * always spinning and has no hovered, selected or disabled cell to pin.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner';

const meta = {
  title: 'Components/spinner',
  component: Spinner,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-33',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- size, the only variant axis ---- */

export const Sm: Story = {
  name: 'size=sm (84:27)',
  args: { size: 'sm' },
};

export const Md: Story = {
  name: 'size=md (84:29)',
  args: { size: 'md' },
};

export const Lg: Story = {
  name: 'size=lg (84:31)',
  args: { size: 'lg' },
};

/* ---- the whole set, laid out as the component set is ---- */

const SIZES = ['sm', 'md', 'lg'] as const;

export const Matrix: Story = {
  name: 'matrix (all 3)',
  args: { size: 'sm' },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Spinner key={size} size={size} label={`Loading, ${size}`} />
      ))}
    </div>
  ),
};
