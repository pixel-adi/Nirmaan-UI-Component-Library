import type { Preview } from '@storybook/react';
import React from 'react';
import '../../tokens/build/css/primitives.css';
import '../../tokens/build/css/light.css';
import '../../tokens/build/css/dark.css';
import '../../tokens/build/css/high-contrast.css';
import '@nirman/components/dist/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: ['Foundations', 'Getting Started', 'Elements', 'Contributing'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      return (
        <div data-theme={theme}>
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: 'Appearance mode',
      toolbar: {
        title: 'Mode',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;