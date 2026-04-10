import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete, AutocompleteOption } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Elements/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    minChars: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const indianCities: AutocompleteOption[] = [
  { value: 'mumbai', label: 'Mumbai', description: 'Maharashtra' },
  { value: 'delhi', label: 'New Delhi', description: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore', description: 'Karnataka' },
  { value: 'hyderabad', label: 'Hyderabad', description: 'Telangana' },
  { value: 'ahmedabad', label: 'Ahmedabad', description: 'Gujarat' },
  { value: 'chennai', label: 'Chennai', description: 'Tamil Nadu' },
  { value: 'kolkata', label: 'Kolkata', description: 'West Bengal' },
  { value: 'pune', label: 'Pune', description: 'Maharashtra' },
  { value: 'jaipur', label: 'Jaipur', description: 'Rajasthan' },
  { value: 'lucknow', label: 'Lucknow', description: 'Uttar Pradesh' },
  { value: 'kanpur', label: 'Kanpur', description: 'Uttar Pradesh' },
  { value: 'nagpur', label: 'Nagpur', description: 'Maharashtra' },
  { value: 'indore', label: 'Indore', description: 'Madhya Pradesh' },
  { value: 'thane', label: 'Thane', description: 'Maharashtra' },
  { value: 'bhopal', label: 'Bhopal', description: 'Madhya Pradesh' },
  { value: 'visakhapatnam', label: 'Visakhapatnam', description: 'Andhra Pradesh' },
  { value: 'patna', label: 'Patna', description: 'Bihar' },
  { value: 'vadodara', label: 'Vadodara', description: 'Gujarat' },
  { value: 'ghaziabad', label: 'Ghaziabad', description: 'Uttar Pradesh' },
  { value: 'ludhiana', label: 'Ludhiana', description: 'Punjab' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: '360px' }}>
        <Autocomplete
          label="City"
          options={indianCities}
          value={value || undefined}
          onChange={setValue}
          placeholder="Type to search cities..."
        />
      </div>
    );
  },
};

export const WithHelper: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: '360px' }}>
        <Autocomplete
          label="Birth Place"
          options={indianCities}
          value={value || undefined}
          onChange={setValue}
          placeholder="Start typing your city..."
          helperText="Enter the city as mentioned on your birth certificate."
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: '360px' }}>
        <Autocomplete
          label="Current Address City"
          options={indianCities}
          value={value || undefined}
          onChange={setValue}
          error="Please select a valid city from the list."
        />
      </div>
    );
  },
};

export const LargeList: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    // simulate large dataset
    const many = Array.from({ length: 200 }, (_, i) => ({
      value: 'city-' + i,
      label: 'City ' + (i + 1),
    }));
    return (
      <div style={{ width: '360px' }}>
        <Autocomplete
          label="Choose from 200 cities"
          options={many}
          value={value || undefined}
          onChange={setValue}
          helperText="Only top 10 matches shown."
          maxResults={10}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '360px' }}>
      <Autocomplete
        label="City"
        options={indianCities}
        value="mumbai"
        disabled
      />
    </div>
  ),
};

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div lang="hi" style={{ width: '360px' }}>
        <Autocomplete
          label="शहर का नाम"
          placeholder="शहर खोजें..."
          options={[
            { value: 'mumbai', label: 'मुंबई', description: 'महाराष्ट्र' },
            { value: 'delhi', label: 'नई दिल्ली', description: 'दिल्ली' },
            { value: 'lucknow', label: 'लखनऊ', description: 'उत्तर प्रदेश' },
            { value: 'jaipur', label: 'जयपुर', description: 'राजस्थान' },
            { value: 'patna', label: 'पटना', description: 'बिहार' },
            { value: 'bhopal', label: 'भोपाल', description: 'मध्य प्रदेश' },
          ]}
          value={value || undefined}
          onChange={setValue}
          helperText="अपना शहर खोजें और चुनें"
          noResultsText="कोई परिणाम नहीं मिला"
        />
      </div>
    );
  },
};

export const TamilLabel: Story = {
  name: 'Tamil',
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div lang="ta" style={{ width: '360px' }}>
        <Autocomplete
          label="நகரத்தைத் தேடுங்கள்"
          placeholder="நகரத்தின் பெயரை உள்ளிடவும்..."
          options={[
            { value: 'chennai', label: 'சென்னை', description: 'தமிழ்நாடு' },
            { value: 'madurai', label: 'மதுரை', description: 'தமிழ்நாடு' },
            { value: 'coimbatore', label: 'கோயம்புத்தூர்', description: 'தமிழ்நாடு' },
            { value: 'trichy', label: 'திருச்சிராப்பள்ளி', description: 'தமிழ்நாடு' },
            { value: 'salem', label: 'சேலம்', description: 'தமிழ்நாடு' },
          ]}
          value={value || undefined}
          onChange={setValue}
          noResultsText="முடிவுகள் இல்லை"
        />
      </div>
    );
  },
};
