import type { Preview } from '@storybook/react';
import React from 'react';

// Token CSS
import '../../tokens/build/css/primitives.css';
import '../../tokens/build/css/light.css';
import '../../tokens/build/css/dark.css';
import '../../tokens/build/css/high-contrast.css';

// Typography foundation
import '../stories/elements/typography.css';

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
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&family=Noto+Sans+Malayalam:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <div
            data-theme={theme}
            style={{
              padding: '2rem',
              minHeight: '100px',
              background: 'var(--nir-color-surface-default, #fff)',
              color: 'var(--nir-color-text-default, #000)',
              fontFamily: 'var(--nir-font-family-body, "Noto Sans", sans-serif)',
              fontSize: 'var(--nir-font-size-body-md, 16px)',
              lineHeight: 'var(--nir-font-line-height-body, 1.5)',
              borderRadius: '8px',
            }}
          >
            <Story />
          </div>
        </>
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
