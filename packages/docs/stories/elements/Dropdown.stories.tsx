import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, DropdownOption } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Elements/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
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
  render: () => {
    const [v1, setV1] = useState<string>('');
    const [v2, setV2] = useState<string>('');
    const [v3, setV3] = useState<string>('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
        <Dropdown label="Small" size="sm" options={states.slice(0, 4)} value={v1} onChange={setV1} />
        <Dropdown label="Medium (default)" size="md" options={states.slice(0, 4)} value={v2} onChange={setV2} />
        <Dropdown label="Large" size="lg" options={states.slice(0, 4)} value={v3} onChange={setV3} />
      </div>
    );
  },
};

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div lang="hi">
        <Dropdown
          label="राज्य चुनें"
          options={[
            { value: 'up', label: 'उत्तर प्रदेश' },
            { value: 'mh', label: 'महाराष्ट्र' },
            { value: 'br', label: 'बिहार' },
            { value: 'mp', label: 'मध्य प्रदेश' },
            { value: 'rj', label: 'राजस्थान' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="कोई राज्य चुनें"
          helperText="अपने राज्य का चयन करें"
        />
      </div>
    );
  },
};

export const TamilLabel: Story = {
  name: 'Tamil',
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div lang="ta">
        <Dropdown
          label="மாவட்டத்தைத் தேர்ந்தெடுக்கவும்"
          options={[
            { value: 'che', label: 'சென்னை' },
            { value: 'mdu', label: 'மதுரை' },
            { value: 'cbe', label: 'கோயம்புத்தூர்' },
            { value: 'tri', label: 'திருச்சிராப்பள்ளி' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்"
        />
      </div>
    );
  },
};
