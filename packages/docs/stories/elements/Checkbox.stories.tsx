import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Elements/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
  },
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'I agree to the Terms and Conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Receive SMS notifications',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all districts',
    indeterminate: true,
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Opt in for DigiLocker',
    helperText: 'Your documents will be stored securely in DigiLocker.',
  },
};

export const WithError: Story = {
  args: {
    label: 'I accept the declaration',
    error: 'You must accept the declaration to proceed.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Aadhaar verified',
    defaultChecked: true,
    disabled: true,
  },
};

export const Group: Story = {
  name: 'Checkbox Group',
  render: () => (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{
        fontSize: 'var(--nir-font-size-sm, 14px)',
        fontWeight: 500,
        color: 'var(--nir-color-text-default)',
        marginBottom: 'var(--nir-spacing-stack-sm, 8px)',
      }}>
        Select services required
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Checkbox label="Income Certificate" />
        <Checkbox label="Domicile Certificate" />
        <Checkbox label="Caste Certificate" />
        <Checkbox label="Birth Certificate" />
      </div>
    </fieldset>
  ),
};

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  args: {
    label: 'मैं नियम और शर्तों से सहमत हूँ',
  },
};

export const TamilLabel: Story = {
  name: 'Tamil',
  args: {
    label: 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கிறேன்',
  },
};
