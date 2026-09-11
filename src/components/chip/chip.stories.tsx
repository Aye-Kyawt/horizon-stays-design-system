/**
 * .chip stories.
 *
 * Figma node: 72:19
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=72-19
 *
 * One story per row of the matrix read off that node: status {default,
 * hovered, selected, disabled} x icon {off, on} x removable {off, on}.
 * The four status stories pin the state so it can be inspected without a
 * pointer; the live `:hover` still applies on its own.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './chip';
import { Info } from '../../icons/Info';

const meta = {
  title: 'Components/chip',
  component: Chip,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=72-19',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- status, the variant axis (72:2, 72:6, 72:11, 72:15) ---- */

export const Default: Story = { args: { status: 'default', label: 'Chip' } };
export const Hovered: Story = { args: { status: 'hovered', label: 'Chip' } };
export const Selected: Story = { args: { status: 'selected', label: 'Chip' } };
export const Disabled: Story = { args: { status: 'disabled', label: 'Chip' } };

/* ---- icon, the leading slot ---- */

export const IconSlotEmpty: Story = {
  name: 'icon (empty slot)',
  args: { status: 'default', label: 'Chip', icon: true },
};

export const IconSlotFilled: Story = {
  name: 'icon (filled slot)',
  args: { status: 'default', label: 'Chip', icon: true, icon1: <Info /> },
};

/* ---- removable, the trailing clear control ---- */

export const Removable: Story = {
  args: { status: 'default', label: 'Chip', removable: true },
};

export const RemovableSelected: Story = {
  name: 'removable / selected',
  args: { status: 'selected', label: 'Chip', removable: true },
};

export const RemovableDisabled: Story = {
  name: 'removable / disabled',
  args: { status: 'disabled', label: 'Chip', removable: true },
};

/* ---- the whole set, 4 statuses x icon x removable ---- */

const STATUSES = ['default', 'hovered', 'selected', 'disabled'] as const;

export const Matrix: Story = {
  name: 'matrix (all 16)',
  args: { label: 'Chip' },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {STATUSES.map((status) => (
        <div key={status} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Chip status={status} label="Chip" />
          <Chip status={status} label="Chip" icon icon1={<Info />} />
          <Chip status={status} label="Chip" removable />
          <Chip status={status} label="Chip" icon icon1={<Info />} removable />
        </div>
      ))}
    </div>
  ),
};
