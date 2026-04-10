import type { Preview } from '@storybook/react';
import React from 'react';
import '../../tokens/build/css/primitives.css';
import '../../tokens/build/css/light.css';
import '../../tokens/build/css/dark.css';
import '../../tokens/build/css/high-contrast.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      return (
        <div
          data-theme={theme}
          style={{
            padding: '2rem',
            minHeight: '100px',
            background: 'var(--nir-color-surface-default, #fff)',
            color: 'var(--nir-color-text-default, #000)',
            fontFamily: 'var(--nir-font-family-body, "Noto Sans", sans-serif)',
            borderRadius: '8px',
          }}
        >
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