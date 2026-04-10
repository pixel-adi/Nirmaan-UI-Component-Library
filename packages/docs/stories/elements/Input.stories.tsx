import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Elements/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    helperText: 'We will send a verification link to this email.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Aadhaar Number',
    placeholder: 'XXXX-XXXX-XXXX',
    error: 'Please enter a valid 12-digit Aadhaar number.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Application ID',
    value: 'APP-2026-00451',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Address',
    placeholder: 'Enter your complete address',
    fullWidth: true,
  },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium (default)" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
};

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  args: {
    label: 'पूरा नाम',
    placeholder: 'अपना पूरा नाम दर्ज करें',
    helperText: 'जैसा आपके आधार कार्ड पर है',
  },
};

export const TamilLabel: Story = {
  name: 'Tamil',
  args: {
    label: 'முழு பெயர்',
    placeholder: 'உங்கள் முழு பெயரை உள்ளிடவும்',
  },
};
