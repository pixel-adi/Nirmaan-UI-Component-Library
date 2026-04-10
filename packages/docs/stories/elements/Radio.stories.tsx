import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from '@nirman/components';

const meta: Meta<typeof RadioGroup> = {
  title: 'Elements/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('general');
    return (
      <RadioGroup
        name="category"
        label="Certificate Type"
        value={value}
        onChange={setValue}
      >
        <Radio value="income" label="Income Certificate" />
        <Radio value="domicile" label="Domicile Certificate" />
        <Radio value="caste" label="Caste Certificate" />
        <Radio value="general" label="General Certificate" />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('male');
    return (
      <RadioGroup
        name="gender"
        label="Gender"
        value={value}
        onChange={setValue}
        direction="horizontal"
      >
        <Radio value="male" label="Male" />
        <Radio value="female" label="Female" />
        <Radio value="other" label="Other" />
      </RadioGroup>
    );
  },
};

export const WithHelper: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        name="delivery"
        label="Document Delivery"
        value={value}
        onChange={setValue}
        helperText="Select how you want to receive the certificate."
      >
        <Radio value="digilocker" label="DigiLocker (recommended)" />
        <Radio value="email" label="Email" />
        <Radio value="post" label="Indian Post" />
      </RadioGroup>
    );
  },
};

export const WithError: Story = {
  render: () => {
    return (
      <RadioGroup
        name="district"
        label="Select District"
        error="Please select a district to continue."
      >
        <Radio value="lucknow" label="Lucknow" />
        <Radio value="varanasi" label="Varanasi" />
        <Radio value="agra" label="Agra" />
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <RadioGroup
        name="verified"
        label="Verification Status"
        value="aadhaar"
        disabled
      >
        <Radio value="aadhaar" label="Aadhaar Verified" />
        <Radio value="pan" label="PAN Verified" />
      </RadioGroup>
    );
  },
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
    const [value, setValue] = useState('');
    const locales: Record<string, { label: string; p1: string; p2: string; p3: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'भाषा चुनें', p1: 'हिंदी', p2: 'अंग्रेज़ी', p3: 'उर्दू', dir: 'ltr' },
      Tamil: { label: 'மொழியைத் தேர்ந்தெடுக்கவும்', p1: 'தமிழ்', p2: 'ஆங்கிலம்', p3: 'இந்தி', dir: 'ltr' },
      Urdu: { label: 'زبان منتخب کریں', p1: 'اردو', p2: 'انگریزی', p3: 'ہندی', dir: 'rtl' },
      Bengali: { label: 'ভাষা নির্বাচন করুন', p1: 'বাংলা', p2: 'ইংরেজি', p3: 'হিন্দি', dir: 'ltr' },
      English: { label: 'Select Language', p1: 'English', p2: 'Hindi', p3: 'Other', dir: 'ltr' },
    };
    const content = locales[language as string] || locales.English;
    return (
      <div dir={content.dir} lang={(language || 'English').slice(0,2).toLowerCase()}>
        <RadioGroup {...rest} name="lang-pref" label={content.label} value={value} onChange={setValue}>
          <Radio value="p1" label={content.p1} />
          <Radio value="p2" label={content.p2} />
          <Radio value="p3" label={content.p3} />
        </RadioGroup>
      </div>
    );
  },
};
