/**
 * .tooltip stories.
 *
 * Figma node: 74:20
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=74-20
 *
 * One story per row of the matrix read off that node. The matrix is one axis
 * wide — Placement {top, bottom, left, right} — so there are four rows, and
 * each has a per-variant node id below so QA can open the exact cell:
 *
 *   Placement=top     74:2
 *   Placement=bottom  74:8
 *   Placement=left    74:12
 *   Placement=right   74:16
 *
 * The set carries no status axis, no size axis and no interaction state, so
 * there is no story for hovered, disabled, focus, error or loading — none of
 * them exists in the design.
 *
 * `label` is the node's text property rather than a matrix row; the story that
 * exercises it is marked as such.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, type TooltipPlacement } from './tooltip';

const meta = {
  title: 'Components/tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
    controls: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=74-20',
    },
  },
  argTypes: {
    Placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    label: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- Placement, the only variant axis ---- */

/** 74:2 — arrow beneath the bubble, pointing down at the trigger. */
export const Top: Story = { args: { Placement: 'top', label: 'Tooltip text' } };

/** 74:8 — arrow above the bubble, pointing up. */
export const Bottom: Story = { args: { Placement: 'bottom', label: 'Tooltip text' } };

/** 74:12 — arrow right of the bubble, pointing right. */
export const Left: Story = { args: { Placement: 'left', label: 'Tooltip text' } };

/** 74:16 — arrow left of the bubble, pointing left. */
export const Right: Story = { args: { Placement: 'right', label: 'Tooltip text' } };

/* ---- label, the text property (not a matrix row) ---- */

export const CustomLabel: Story = {
  name: 'label (text property)',
  args: { Placement: 'top', label: 'Free cancellation until 24h before check-in' },
};

/* ---- the whole set, all four cells ---- */

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

export const Matrix: Story = {
  name: 'matrix (all 4)',
  args: { label: 'Tooltip text' },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {PLACEMENTS.map((placement) => (
        <Tooltip key={placement} Placement={placement} label="Tooltip text" />
      ))}
    </div>
  ),
};
