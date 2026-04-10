import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toggle } from '@nirman/components';

const meta: Meta<typeof Toggle> = {
  title: 'Elements/Toggle',
  component: Toggle,
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
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Toggle {...args} label="Email notifications" description="Get application status updates via email" defaultChecked />
      <Toggle {...args} label="SMS notifications" description="Receive OTP and critical alerts via SMS" defaultChecked />
      <Toggle {...args} label="DigiLocker sync" description="Auto-store issued certificates in DigiLocker" />
      <Toggle {...args} label="Marketing communications" description="Scheme announcements and updates" />
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
    const labels: Record<string, { label: string; description: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'सूचनाएँ सक्षम करें', description: 'एसएमएस और ईमेल के माध्यम से अपडेट प्राप्त करें', dir: 'ltr' },
      Tamil: { label: 'அறிவிப்புகளை இயக்கு', description: 'SMS மற்றும் மின்னஞ்சல் வழியாக புதுப்பிப்புகளைப் பெறுங்கள்', dir: 'ltr' },
      Urdu: { label: 'اطلاعات کو فعال کریں', description: 'ایس ایم ایس اور ای میل کے ذریعے اپ ڈیٹس حاصل کریں', dir: 'rtl' },
      Bengali: { label: 'বিজ্ঞপ্তি সক্ষম করুন', description: 'এসএমএস এবং ইমেলের মাধ্যমে আপডেট পান', dir: 'ltr' },
      English: { label: 'Enable notifications', description: 'Get application status updates via SMS and email.', dir: 'ltr' },
    };
    const content = labels[language as string] || labels.English;
    return (
      <div dir={content.dir} lang={(language || 'English').slice(0,2).toLowerCase()}>
        <Toggle {...rest} label={content.label} description={content.description} />
      </div>
    );
  },
};
