/**
 * .avatar stories.
 *
 * Figma node: 54:9211 (component set)
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=54-9211
 *
 * Matrix: Status (avatar | generic icon | initial name) = 3 rows, one story
 * each, plus the whole set side by side. One axis, no booleans — the set is
 * genuinely this small.
 *
 * `AvatarNoImage` is not a matrix row. It is the `avatar` variant with nothing
 * passed to `src`, which is the state the component is actually in before a
 * user has a photo. Figma has no such cell because it bakes a photo into the
 * ellipse fill; the story exists so that state is visible rather than assumed.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';
import sample from './sample.png';

const meta = {
  title: 'Components/avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    controls: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=54-9211',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--semantic-spacing-padding-lg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- Status, the one variant axis ---- */

/** 54:9212 — the ellipse with a photo fill. */
export const AvatarPhoto: Story = {
  name: 'avatar',
  args: { status: 'avatar', src: sample, alt: 'Hanna Schmidt' },
};

/** 54:9214 — the vendored Simple Design System `User` glyph at 14x14. */
export const GenericIcon: Story = {
  name: 'generic icon',
  args: { status: 'generic icon' },
};

/** 54:9217 — "HS", the initials the node's text layer carries. */
export const InitialName: Story = {
  name: 'initial name',
  args: { status: 'initial name', initials: 'HS' },
};

/* ---- the photo variant with no photo — not a Figma cell ---- */

export const AvatarNoImage: Story = {
  name: 'avatar (no src)',
  args: { status: 'avatar' },
};

/* ---- the whole set ---- */

export const Matrix: Story = {
  name: 'matrix (all 3)',
  args: { status: 'avatar' },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar status="avatar" src={sample} alt="Hanna Schmidt" />
      <Avatar status="generic icon" />
      <Avatar status="initial name" initials="HS" />
    </div>
  ),
};
