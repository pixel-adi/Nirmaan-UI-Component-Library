// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		starlight({
			title: 'Nirmaan UI Design System',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			customCss: [
				// Design system theme: Noto Serif typography + light/dark colour mapping
				'./src/custom.css',
				// Tier 1 — Raw primitives (hex values, spacing scale, radius)
				'../../packages/tokens/build/css/primitives.css',
				// Tier 2 — Semantic mappings (--nir-color-primary-default, etc.)
				'../../packages/tokens/build/css/light.css',
				// Component styles (Button, Input, Checkbox, Toggle, etc.)
				'../../packages/components/dist/index.css',
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Setup & Installation', slug: 'getting-started/setup' },
						{ label: 'Developer Workflow', slug: 'getting-started/developer' },
						{ label: 'Designer Workflow', slug: 'getting-started/designer' },
					],
				},
				{
					label: 'Foundations',
					items: [
						{ label: 'Primitive Tokens', slug: 'foundations/primitives' },
						{ label: 'Semantic Tokens', slug: 'foundations/semantics' },
						{ label: 'Typography', slug: 'foundations/typography' },
						{ label: 'Design Themes', slug: 'foundations/themes' },
						{ label: 'Accessibility', slug: 'foundations/accessibility' },
						{ label: 'Token Pipeline', slug: 'foundations/pipeline' },
					],
				},
				{
					label: 'Icons',
					items: [
						{ label: 'Usage & Platforms', slug: 'icons/usage' }
					]
				},
				{
					label: 'Components',
					autogenerate: { directory: 'components' }
				},
				{
					label: 'Page Templates',
					autogenerate: { directory: 'templates' }
				}
			],
		}),
	],
	vite: {
		optimizeDeps: {
			include: ['react', 'react-dom', 'react-dom/client']
		}
	}
});
