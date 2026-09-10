/**
 * .Button
 *
 * Figma node: 31:140
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=31-140
 *
 * The matrix is 15 cells, Type x Status, and every one has a story below.
 * Per-variant nodes, so QA can open the exact cell it is testing:
 *
 *   Fill         default 30:97   hovered 31:155  focus 31:161
 *                disabled 31:202 error   31:216
 *   outline      default 31:233  hovered 31:237  focus 31:241
 *                disabled 31:246 error   31:250
 *   transparent  default 32:292  hovered 32:296  focus 32:300
 *                disabled 32:305 error   32:309
 *
 * There is no size axis, no loading state and no pressed state in the node, so
 * there is no story for any of them.
 *
 * Title is `Components/Button`. The token documentation page that used to own
 * the id `components--button` now lives under `Component tokens` — it
 * documents --component-button-* and advertises a Primary/Secondary/Negative
 * axis that this component set does not use. Build against the node, not that
 * page.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonStatus, type ButtonType } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'padded', controls: { disable: false } },
  argTypes: {
    type: { control: 'inline-radio', options: ['Fill', 'outline', 'transparent'] },
    status: {
      control: 'inline-radio',
      options: ['default', 'hovered', 'focus', 'disabled', 'error'],
    },
    label: { control: 'text' },
    iconLeft: { control: 'boolean' },
    iconRight: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------- Fill --- */

/** 30:97 — the default cell. Hover and tab to it: both states apply live. */
export const FillDefault: Story = {
  name: 'Fill / default',
  args: { type: 'Fill', status: 'default' },
};

/** 31:155 — bg moves to bg/primary/hovered; the border does not move. */
export const FillHovered: Story = {
  name: 'Fill / hovered',
  args: { type: 'Fill', status: 'hovered' },
};

/** 31:161 — same fill as default, plus the detached ring at 3px. */
export const FillFocus: Story = {
  name: 'Fill / focus',
  args: { type: 'Fill', status: 'focus' },
};

/** 31:202 — and genuinely disabled, not just grey. */
export const FillDisabled: Story = {
  name: 'Fill / disabled',
  args: { type: 'Fill', status: 'disabled' },
};

/** 31:216 — bg/negative with a matching icon/negative border. */
export const FillError: Story = {
  name: 'Fill / error',
  args: { type: 'Fill', status: 'error' },
};

/* ------------------------------------------------------------- outline --- */

/** 31:233 */
export const OutlineDefault: Story = {
  name: 'outline / default',
  args: { type: 'outline', status: 'default' },
};

/** 31:237 — the cell where icon and label take DIFFERENT colours:
 *  icon/hover #1b4a8f against text/action hover #235d93. */
export const OutlineHovered: Story = {
  name: 'outline / hovered',
  args: { type: 'outline', status: 'hovered' },
};

/** 31:241 */
export const OutlineFocus: Story = {
  name: 'outline / focus',
  args: { type: 'outline', status: 'focus' },
};

/** 31:246 */
export const OutlineDisabled: Story = {
  name: 'outline / disabled',
  args: { type: 'outline', status: 'disabled' },
};

/** 31:250 */
export const OutlineError: Story = {
  name: 'outline / error',
  args: { type: 'outline', status: 'error' },
};

/* --------------------------------------------------------- transparent --- */

/** 32:292 — no fill and no border, so 201x40 where the others are 203x42. */
export const TransparentDefault: Story = {
  name: 'transparent / default',
  args: { type: 'transparent', status: 'default' },
};

/** 32:296 */
export const TransparentHovered: Story = {
  name: 'transparent / hovered',
  args: { type: 'transparent', status: 'hovered' },
};

/** 32:300 — ring inset -3 rather than -4, because there is no border to
 *  absorb. The gap to the painted edge is 3px here as everywhere. */
export const TransparentFocus: Story = {
  name: 'transparent / focus',
  args: { type: 'transparent', status: 'focus' },
};

/** 32:305 */
export const TransparentDisabled: Story = {
  name: 'transparent / disabled',
  args: { type: 'transparent', status: 'disabled' },
};

/** 32:309 */
export const TransparentError: Story = {
  name: 'transparent / error',
  args: { type: 'transparent', status: 'error' },
};

/* ------------------------------------------------------------ the grid --- */

const TYPES: ButtonType[] = ['Fill', 'outline', 'transparent'];
const STATUSES: ButtonStatus[] = ['default', 'hovered', 'focus', 'disabled', 'error'];

/**
 * All 15 cells in the node's own layout — Status across, Type down — for
 * comparing against the frame side by side.
 */
export const Matrix: Story = {
  name: 'matrix (all 15)',
  args: { type: 'Fill', status: 'default' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, max-content)',
        gap: 'var(--semantic-spacing-gap-lg)',
        alignItems: 'center',
      }}
    >
      {TYPES.flatMap((type) =>
        STATUSES.map((status) => (
          <Button key={`${type}-${status}`} type={type} status={status} />
        )),
      )}
    </div>
  ),
};

/**
 * The icon slots. Figma ships both on in every cell; these are the same cell
 * with one or none, which the `iconLeft` / `iconRight` booleans allow.
 */
export const IconSlots: Story = {
  name: 'icon slots',
  args: { type: 'Fill', status: 'default' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--semantic-spacing-gap-md)', flexWrap: 'wrap' }}>
      <Button label="Both (the node)" />
      <Button label="Left only" iconRight={false} />
      <Button label="Right only" iconLeft={false} />
      <Button label="Label only" iconLeft={false} iconRight={false} />
    </div>
  ),
};
