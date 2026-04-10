import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete, AutocompleteOption } from '@nirman/components';

const meta: Meta<typeof Autocomplete> = {
  title: 'Elements/Autocomplete',
  component: Autocomplete,
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
    const [value, setValue] = useState<string | null>(null);
    const locales: Record<string, { label: string; placeholder: string; helperText: string; noResultsText: string; p1: string; p2: string; p3: string; p1Desc: string; p2Desc: string; p3Desc: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { label: 'शहर का नाम', placeholder: 'शहर खोजें...', helperText: 'अपना शहर खोजें और चुनें', noResultsText: 'कोई परिणाम नहीं मिला', p1: 'मुंबई', p2: 'नई दिल्ली', p3: 'लखनऊ', p1Desc: 'महाराष्ट्र', p2Desc: 'दिल्ली', p3Desc: 'उत्तर प्रदेश', dir: 'ltr' },
      Tamil: { label: 'நகரத்தைத் தேடுங்கள்', placeholder: 'நகரத்தின் பெயரை உள்ளிடவும்...', helperText: 'நகரத்தைத் தேர்வுசெய்யவும்', noResultsText: 'முடிவுகள் இல்லை', p1: 'சென்னை', p2: 'மதுரை', p3: 'கோயம்புத்தூர்', p1Desc: 'தமிழ்நாடு', p2Desc: 'தமிழ்நாடு', p3Desc: 'தமிழ்நாடு', dir: 'ltr' },
      Urdu: { label: 'شہر کا نام', placeholder: 'شہر تلاش کریں...', helperText: 'اپنا شہر داخل کریں', noResultsText: 'کوئی نتیجہ نہیں ملا', p1: 'لکھنو', p2: 'دہلی', p3: 'ممبئی', p1Desc: 'اتر پردیش', p2Desc: 'دہلی', p3Desc: 'مہاراشٹر', dir: 'rtl' },
      Bengali: { label: 'শহরের নাম', placeholder: 'শহর খুঁজুন...', helperText: 'শহর নির্বাচন করুন', noResultsText: 'কোন ফলাফল পাওয়া যায়নি', p1: 'কলকাতা', p2: 'দিল্লি', p3: 'মুম্বাই', p1Desc: 'পশ্চিমবঙ্গ', p2Desc: 'দিল্লি', p3Desc: 'মহারাষ্ট্র', dir: 'ltr' },
      English: { label: 'City Name', placeholder: 'Search for a city...', helperText: 'Find and select your city', noResultsText: 'No results found', p1: 'Mumbai', p2: 'Delhi', p3: 'Lucknow', p1Desc: 'Maharashtra', p2Desc: 'Delhi', p3Desc: 'Uttar Pradesh', dir: 'ltr' },
    };
    const content = locales[language as string] || locales.English;
    return (
      <div dir={content.dir} lang={(language || 'English').slice(0,2).toLowerCase()} style={{ width: '360px' }}>
        <Autocomplete
          {...rest}
          label={content.label}
          placeholder={content.placeholder}
          helperText={content.helperText}
          noResultsText={content.noResultsText}
          options={[
            { value: 'p1', label: content.p1, description: content.p1Desc },
            { value: 'p2', label: content.p2, description: content.p2Desc },
            { value: 'p3', label: content.p3, description: content.p3Desc },
          ]}
          value={value || undefined}
          onChange={setValue}
        />
      </div>
    );
  },
};
