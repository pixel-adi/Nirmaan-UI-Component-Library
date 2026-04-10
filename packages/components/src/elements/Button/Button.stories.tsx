import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@nirman/components';

const meta: Meta<typeof Button> = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
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
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small (36px)</Button>
      <Button size="md">Medium (44px)</Button>
      <Button size="lg">Large (52px)</Button>
    </div>
  ),
};

// ── All Variants Grid ──

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// ── Vernacular / Script Testing ──

export const HindiLabel: Story = {
  name: 'Hindi (Devanagari)',
  args: { children: 'आवेदन जमा करें' },
  parameters: {
    docs: {
      description: { story: 'Devanagari script — verifies shirorekha rendering, matra spacing, and line-height token.' },
    },
  },
};

export const TamilLabel: Story = {
  name: 'Tamil',
  args: { children: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்' },
};

export const UrduLabel: Story = {
  name: 'Urdu (RTL)',
  args: { children: 'درخواست جمع کرائیں', dir: 'rtl' },
  parameters: {
    docs: {
      description: { story: 'Urdu/Nastaliq — RTL direction. Verifies text alignment and padding inversion.' },
    },
  },
};

export const BengaliLabel: Story = {
  name: 'Bengali',
  args: { children: 'আবেদন জমা দিন' },
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
