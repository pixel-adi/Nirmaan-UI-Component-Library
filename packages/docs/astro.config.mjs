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
				// Inject our generated tokens visually into the site so React elements can use them
				'../../packages/tokens/build/css/primitives.css',
				'../../packages/tokens/build/css/light.css'
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
						{ label: 'Design Themes', slug: 'foundations/themes' },
						{ label: 'Typography', slug: 'foundations/typography' },
						{ label: 'Accessibility', slug: 'foundations/accessibility' },
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
				}
			],
		}),
	],
});
