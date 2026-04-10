import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Elements/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { label: 'Enable notifications' },
};

export const Checked: Story = {
  args: { label: 'SMS alerts', defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'DigiLocker integration',
    description: 'Automatically store your certificates in DigiLocker.',
    defaultChecked: true,
  },
};

export const LabelLeft: Story = {
  args: {
    label: 'Dark mode',
    labelPosition: 'left',
  },
};

export const Small: Story = {
  args: { label: 'Compact mode', size: 'sm' },
};

export const Disabled: Story = {
  args: { label: 'Coming soon', disabled: true },
};

export const SettingsPanel: Story = {
  name: 'Settings Panel Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Toggle label="Email notifications" description="Get application status updates via email" defaultChecked />
      <Toggle label="SMS notifications" description="Receive OTP and critical alerts via SMS" defaultChecked />
      <Toggle label="DigiLocker sync" description="Auto-store issued certificates in DigiLocker" />
      <Toggle label="Marketing communications" description="Scheme announcements and updates" />
    </div>
  ),
};

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  args: {
    label: 'सूचनाएँ सक्षम करें',
    description: 'एसएमएस और ईमेल के माध्यम से अपडेट प्राप्त करें',
  },
  parameters: {
    docs: { description: { story: 'Uses Noto Sans Devanagari automatically when lang="hi" set on parent.' } },
  },
  decorators: [
    (Story) => <div lang="hi"><Story /></div>,
  ],
};

export const TamilLabel: Story = {
  name: 'Tamil',
  args: {
    label: 'அறிவிப்புகளை இயக்கு',
    description: 'SMS மற்றும் மின்னஞ்சல் வழியாக புதுப்பிப்புகளைப் பெறுங்கள்',
  },
  decorators: [
    (Story) => <div lang="ta"><Story /></div>,
  ],
};
