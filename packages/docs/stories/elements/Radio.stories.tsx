import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

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

export const HindiLabels: Story = {
  name: 'Hindi (Devanagari)',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        name="lang-pref"
        label="भाषा चुनें"
        value={value}
        onChange={setValue}
      >
        <Radio value="hi" label="हिंदी" />
        <Radio value="en" label="अंग्रेज़ी" />
        <Radio value="ur" label="उर्दू" />
      </RadioGroup>
    );
  },
};

export const TamilLabels: Story = {
  name: 'Tamil',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        name="lang-ta"
        label="மொழியைத் தேர்ந்தெடுக்கவும்"
        value={value}
        onChange={setValue}
      >
        <Radio value="ta" label="தமிழ்" />
        <Radio value="en" label="ஆங்கிலம்" />
        <Radio value="hi" label="இந்தி" />
      </RadioGroup>
    );
  },
};
