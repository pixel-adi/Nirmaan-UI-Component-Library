import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, DropdownOption } from '@nirman/components';

const meta: Meta<typeof Dropdown> = {
  title: 'Elements/Dropdown',
  component: Dropdown,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const states: DropdownOption[] = [
  { value: 'up', label: 'Uttar Pradesh' },
  { value: 'mh', label: 'Maharashtra' },
  { value: 'br', label: 'Bihar' },
  { value: 'wb', label: 'West Bengal' },
  { value: 'mp', label: 'Madhya Pradesh' },
  { value: 'tn', label: 'Tamil Nadu' },
  { value: 'rj', label: 'Rajasthan' },
  { value: 'ka', label: 'Karnataka' },
  { value: 'gj', label: 'Gujarat' },
  { value: 'ap', label: 'Andhra Pradesh' },
  { value: 'kl', label: 'Kerala' },
  { value: 'pb', label: 'Punjab' },
];

const certificates: DropdownOption[] = [
  { value: 'income', label: 'Income Certificate', description: 'For income-based schemes and benefits' },
  { value: 'domicile', label: 'Domicile Certificate', description: 'Proof of permanent residence' },
  { value: 'caste', label: 'Caste Certificate', description: 'SC/ST/OBC reservation benefits' },
  { value: 'birth', label: 'Birth Certificate', description: 'Legal proof of birth' },
  { value: 'death', label: 'Death Certificate', description: 'Available only to next of kin', disabled: true },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <Dropdown
        label="Select State"
        options={states}
        value={value}
        onChange={setValue}
        placeholder="Choose a state"
      />
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>('income');
    return (
      <Dropdown
        label="Certificate Type"
        options={certificates}
        value={value}
        onChange={setValue}
        helperText="Select the document you want to apply for."
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <Dropdown
        label="District"
        options={[
          { value: 'lucknow', label: 'Lucknow' },
          { value: 'varanasi', label: 'Varanasi' },
          { value: 'agra', label: 'Agra' },
        ]}
        value={value}
        onChange={setValue}
        error="Please select a district to continue."
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Dropdown
      label="District"
      options={[{ value: 'lko', label: 'Lucknow' }]}
      value="lko"
      disabled
    />
  ),
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: (args) => {
    const [v1, setV1] = useState<string>('');
    const [v2, setV2] = useState<string>('');
    const [v3, setV3] = useState<string>('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
        <Dropdown {...args} label={args.label || "Small"} size="sm" options={states.slice(0, 4)} value={v1} onChange={setV1} />
        <Dropdown {...args} label={args.label || "Medium (default)"} size="md" options={states.slice(0, 4)} value={v2} onChange={setV2} />
        <Dropdown {...args} label={args.label || "Large"} size="lg" options={states.slice(0, 4)} value={v3} onChange={setV3} />
      </div>
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
    const locales: Record<string, { label: string; placeholder: string; helperText: string; p1: string; p2: string; p3: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'राज्य चुनें', placeholder: 'कोई राज्य चुनें', helperText: 'अपने राज्य का चयन करें', p1: 'उत्तर प्रदेश', p2: 'महाराष्ट्र', p3: 'बिहार', dir: 'ltr' },
      Tamil: { label: 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்', placeholder: 'ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்', helperText: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்', p1: 'சென்னை', p2: 'மதுரை', p3: 'கோயம்புத்தூர்', dir: 'ltr' },
      Urdu: { label: 'ریاست منتخب کریں', placeholder: 'کوئی ریاست منتخب کریں', helperText: 'اپنی ریاست کا انتخاب کریں', p1: 'مدھیہ پردیش', p2: 'بہار', p3: 'مہاراشٹر', dir: 'rtl' },
      Bengali: { label: 'রাজ্য নির্বাচন করুন', placeholder: 'একটি রাজ্য নির্বাচন করুন', helperText: 'আপনার রাজ্য নির্বাচন করুন', p1: 'পশ্চিমবঙ্গ', p2: 'বিহার', p3: 'মহারাষ্ট্র', dir: 'ltr' },
      English: { label: 'Select State', placeholder: 'Choose a state', helperText: 'Select your state', p1: 'Uttar Pradesh', p2: 'Maharashtra', p3: 'Bihar', dir: 'ltr' },
    };
    const content = locales[language as string] || locales.English;
    return (
      <div dir={content.dir} lang={(language || 'English').slice(0,2).toLowerCase()}>
        <Dropdown
          {...rest}
          label={content.label}
          placeholder={content.placeholder}
          helperText={content.helperText}
          options={[
            { value: 'p1', label: content.p1 },
            { value: 'p2', label: content.p2 },
            { value: 'p3', label: content.p3 },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};
