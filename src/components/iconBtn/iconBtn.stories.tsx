/**
 * .iconBtn
 *
 * Figma node: 39:2185
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=39-2185
 *
 * The Figma matrix is ONE row. `.iconBtn` is not a component set — it carries
 * no variant properties, and the instance is byte-identical in all four
 * `.cardImage` variants (39:2185, 39:2180, 39:2195, 39:2199). `Default` below
 * is that row.
 *
 * Every other story is an interaction state CLAUDE.md requires and Figma does
 * not define. `Pressed` renders as default on purpose: no negative pressed
 * token exists, so nothing is invented. `Favourited=false` shows the outline
 * heart, which is likewise not in Figma. See docs/cardContainer-design-gaps.md.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconBtn } from './iconBtn';

const meta = {
  title: 'Components/iconBtn',
  component: IconBtn,
  parameters: { layout: 'padded', controls: { disable: false } },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The only appearance the Figma file defines. */
export const Default: Story = {
  name: 'default (the Figma row)',
  args: { status: 'default' },
};

/** Hover it for real too — the heart darkens onto component/button/bg/negative/hovered. */
export const Hovered: Story = {
  name: 'hovered',
  args: { status: 'hovered' },
};

/** Tab to the button to see the same ring apply for real. */
export const Focused: Story = {
  name: 'focused',
  args: { status: 'focused' },
};

/** Renders as default. No negative pressed token exists — nothing is guessed. */
export const Pressed: Story = {
  name: 'pressed (unpainted — no token)',
  args: { status: 'pressed' },
};

export const Disabled: Story = {
  name: 'disabled',
  args: { status: 'disabled' },
};

/** The toggle, on. Same solid heart as the Figma row, plus aria-pressed="true". */
export const FavouritedTrue: Story = {
  name: 'favourited=true',
  args: { status: 'default', favourited: true, label: 'Remove from favourites' },
};

/** The toggle, off. The outline heart is not in Figma — reported, not designed. */
export const FavouritedFalse: Story = {
  name: 'favourited=false (outline — not in Figma)',
  args: { status: 'default', favourited: false, label: 'Save to favourites' },
};

/** Every row at once, for comparing against the Figma frame. */
export const Matrix: Story = {
  name: 'matrix',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--semantic-spacing-gap-md)', flexWrap: 'wrap' }}>
      <IconBtn status="default" />
      <IconBtn status="hovered" />
      <IconBtn status="focused" />
      <IconBtn status="pressed" />
      <IconBtn status="disabled" />
      <IconBtn favourited />
      <IconBtn favourited={false} />
    </div>
  ),
};
