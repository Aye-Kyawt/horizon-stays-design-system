/**
 * .progressBar stories.
 *
 * Figma node: 84:26
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-26
 *
 * One story per row of the matrix read off that node: tone {primary,
 * positive, negative, warning} x meta {on, off}. The 320px wrapper reproduces
 * the node's frame width — the component itself is fluid.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progressBar';

const NODE_WIDTH = 320;

const meta = {
  title: 'Components/progressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <div style={{ inlineSize: NODE_WIDTH }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-26',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- tone, the variant axis (84:2, 84:8, 84:14, 84:20) ---- */

export const Primary: Story = { args: { tone: 'primary', value: 60 } };
export const Positive: Story = { args: { tone: 'positive', value: 60 } };
export const Negative: Story = { args: { tone: 'negative', value: 60 } };
export const Warning: Story = { args: { tone: 'warning', value: 60 } };

/* ---- meta off: the bare bar ---- */

export const NoMetaPrimary: Story = {
  name: 'primary / meta off',
  args: { tone: 'primary', value: 60, meta: false, label: 'Uploading' },
};

export const NoMetaPositive: Story = {
  name: 'positive / meta off',
  args: { tone: 'positive', value: 60, meta: false, label: 'Complete' },
};

/* ---- the value axis, which the node encodes by resizing the Fill ---- */

export const Empty: Story = { name: 'value 0', args: { tone: 'primary', value: 0 } };
export const Full: Story = { name: 'value 100', args: { tone: 'positive', value: 100 } };

export const Clamped: Story = {
  name: 'value out of range (clamped)',
  args: { tone: 'negative', value: 140, label: 'Clamped to 100' },
};

/* ---- the whole set ---- */

const TONES = ['primary', 'positive', 'negative', 'warning'] as const;

export const Matrix: Story = {
  name: 'matrix (all 8)',
  args: { value: 60 },
  render: () => (
    <div style={{ display: 'grid', gap: 20, inlineSize: NODE_WIDTH }}>
      {TONES.map((tone) => (
        <ProgressBar key={tone} tone={tone} value={60} label={tone} />
      ))}
      {TONES.map((tone) => (
        <ProgressBar key={`${tone}-bare`} tone={tone} value={60} meta={false} label={tone} />
      ))}
    </div>
  ),
};
