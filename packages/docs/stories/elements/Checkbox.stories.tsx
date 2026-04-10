import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox } from '@nirman/components';

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
  render: (args) => (
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
        <Checkbox {...args} label={args.label || "Income Certificate"} />
        <Checkbox {...args} label={args.label || "Domicile Certificate"} />
        <Checkbox {...args} label={args.label || "Caste Certificate"} />
        <Checkbox {...args} label={args.label || "Birth Certificate"} />
      </div>
    </fieldset>
  ),
};

export const VernacularTesting: Story = {
  name: 'Vernacular Testing',
  argTypes: {
    language: {
      control: 'select',
      options: ['Hindi', 'Tamil', 'Urdu', 'Bengali', 'English'],
    },
  },
  args: {
    language: 'Hindi',
  },
  render: (args: any) => {
    const { language, ...rest } = args;
    const labels: Record<string, { label: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'मैं नियम और शर्तों से सहमत हूँ', dir: 'ltr' },
      Tamil: { label: 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கிறேன்', dir: 'ltr' },
      Urdu: { label: 'میں شرائط و ضوابط سے متفق ہوں', dir: 'rtl' },
      Bengali: { label: 'আমি শর্তাবলী সম্মত', dir: 'ltr' },
      English: { label: 'I agree to the Terms and Conditions', dir: 'ltr' },
    };
    const content = labels[language as string] || labels.English;
    return (
      <div dir={content.dir}>
        <Checkbox {...rest} label={content.label} />
      </div>
    );
  },
};
