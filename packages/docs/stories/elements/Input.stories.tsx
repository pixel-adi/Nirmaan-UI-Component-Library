import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from '@nirman/components';

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
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input {...args} size="sm" label={args.label || "Small"} placeholder={args.placeholder || "Small input"} />
      <Input {...args} size="md" label={args.label || "Medium (default)"} placeholder={args.placeholder || "Medium input"} />
      <Input {...args} size="lg" label={args.label || "Large"} placeholder={args.placeholder || "Large input"} />
    </div>
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
    const labels: Record<string, { label: string; placeholder: string; helper: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'पूरा नाम', placeholder: 'अपना पूरा नाम दर्ज करें', helper: 'जैसा आपके आधार कार्ड पर है', dir: 'ltr' },
      Tamil: { label: 'முழு பெயர்', placeholder: 'உங்கள் முழு பெயரை உள்ளிடவும்', helper: 'உங்கள் அடையாள அட்டைப்படி', dir: 'ltr' },
      Urdu: { label: 'پورا نام', placeholder: 'اپنا پورا نام درج کریں', helper: 'جیسا کہ آپ کے شناختی کارڈ پر ہے', dir: 'rtl' },
      Bengali: { label: 'পুরো নাম', placeholder: 'আপনার পুরো নাম লিখুন', helper: 'আপনার আইডি কার্ড অনুযায়ী', dir: 'ltr' },
      English: { label: 'Full Name', placeholder: 'Enter your full name', helper: 'As it appears on your ID card', dir: 'ltr' },
    };
    const content = labels[language as string] || labels.English;
    return (
      <div dir={content.dir} style={{ maxWidth: '400px' }}>
        <Input {...rest} label={content.label} placeholder={content.placeholder} helperText={content.helper} />
      </div>
    );
  },
};
