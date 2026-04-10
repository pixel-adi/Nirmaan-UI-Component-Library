import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@nirman/components';

const meta: Meta<typeof Button> = {
  title: 'Elements/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Primary interactive element. All sizes meet WCAG 2.5.8 touch target (≥44px for md). ' +
          'Uses `--nir-color-primary-*` tokens — automatically adapts to brand, mode, and density themes.',
      },
    },
    // Uncomment and add your Figma file URL:
    // design: {
    //   type: 'figma',
    //   url: 'https://www.figma.com/file/YOUR_FILE_ID/Nirman?node-id=XXX',
    // },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Individual Variants ──

export const Primary: Story = {
  args: { variant: 'primary', children: 'Submit Application' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Learn More' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete Account' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Skip' },
};

// ── States ──

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
  parameters: {
    docs: {
      description: { story: 'Loading state sets `aria-busy="true"` and disables interaction. SR announces "Loading, please wait".' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Not Available' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Full Width Action' },
};

// ── Size Comparison ──

export const Sizes: Story = {
  name: 'Size Comparison',
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button {...args} size="sm">{args.children || 'Small (36px)'}</Button>
      <Button {...args} size="md">{args.children || 'Medium (44px)'}</Button>
      <Button {...args} size="lg">{args.children || 'Large (52px)'}</Button>
    </div>
  ),
};

// ── All Variants Grid ──

export const AllVariants: Story = {
  name: 'All Variants',
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">{args.children || 'Primary'}</Button>
      <Button {...args} variant="secondary">{args.children || 'Secondary'}</Button>
      <Button {...args} variant="tertiary">{args.children || 'Tertiary'}</Button>
      <Button {...args} variant="danger">{args.children || 'Danger'}</Button>
      <Button {...args} variant="ghost">{args.children || 'Ghost'}</Button>
    </div>
  ),
};

// ── Vernacular / Script Testing ──

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
    const labels: Record<string, { text: string; dir: 'ltr' | 'rtl' }> = {
      Hindi: { text: 'आवेदन जमा करें', dir: 'ltr' },
      Tamil: { text: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்', dir: 'ltr' },
      Urdu: { text: 'درخواست جمع کرائیں', dir: 'rtl' },
      Bengali: { text: 'আবেদন জমা দিন', dir: 'ltr' },
      English: { text: 'Submit Application', dir: 'ltr' },
    };
    const content = labels[language as string] || labels.English;
    return (
      <div dir={content.dir}>
        <Button {...rest}>{content.text}</Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: { story: 'Tests scripts for proper shirorekha rendering, RTL handling, and baseline alignment.' },
    },
  },
};

// ── Accessibility Test ──

export const KeyboardFocus: Story = {
  name: 'Keyboard Focus Ring',
  args: { children: 'Tab to focus me' },
  parameters: {
    docs: {
      description: { story: 'Press Tab to see the focus ring. Must be ≥2px, ≥3:1 contrast against adjacent colors.' },
    },
  },
};
