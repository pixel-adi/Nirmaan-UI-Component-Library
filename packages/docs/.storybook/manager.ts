import { addons } from '@storybook/manager-api';
import nirmanTheme from './nirman-theme';

addons.setConfig({
  theme: nirmanTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['foundations'],
  },
});
