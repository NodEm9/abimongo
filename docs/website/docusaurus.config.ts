import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';



const config: Config = {
	title: 'Abimongo',
	url: 'https://nodem9.github.io',
	baseUrl: '/abimongo/',
	tagline: 'Abimongo is a MongoDB ODM for TypeScript and JavaScript',
	favicon: 'img/favicon.ico',
	organizationName: 'NodEm9',
	projectName: 'abimongo',
	clientModules: [path.resolve(__dirname, './src/css/tailwind.css')],
	onBrokenAnchors: 'ignore',
	trailingSlash: false,
	// onBrokenLinks: 'ignore',
	presets: [
		[
			'classic',
			{
				docs: false,         // we'll mount multiple docs plugins below
				blog: {
					showReadingTime: true,
					path: './blog',
					routeBasePath: 'blog',
				},
				theme: { customCss: require.resolve('./src/css/tailwind.css') },
			} satisfies Preset.Options,
		],
	],

	plugins: [
		// Content docs: Core
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'core',
				path: path.resolve(__dirname, './docs/core'),
				routeBasePath: 'core',
				showLastUpdateAuthor: true,
				showLastUpdateTime: true,
				sidebarPath: require.resolve('./sidebars.core.ts'),
			},
		],
		// Content docs: Logger
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'logger',
				path: path.resolve(__dirname, './docs/logger'),
				routeBasePath: 'logger',
				showLastUpdateAuthor: true,
				showLastUpdateTime: true,
				sidebarPath: path.resolve(__dirname, './sidebars.logger.ts'),
			},
		],
		// Content docs: CLI
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'cli',
				path: path.resolve(__dirname, './docs/create'),
				routeBasePath: 'create',
				showLastUpdateAuthor: true,
				showLastUpdateTime: true,
				sidebarPath: path.resolve(__dirname, './sidebars.create.ts'),
			},
		],
		// Content docs: Tutorials
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'tutorials',
				path: path.resolve(__dirname, './tutorials/'),
				routeBasePath: 'tutorials',
				showLastUpdateAuthor: true,
				showLastUpdateTime: true,
				sidebarPath: path.resolve(__dirname, './sidebars.tutorials.ts'),
			},
		],
		// TypeDoc API: Core
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'api-core',
				entryPoints: ['packages/core/src/index.ts'],
				tsconfig: 'packages/core/tsconfig.json',
				out: 'core/api/core',
				sidebar: { autoConfiguration: 'API (Core)' },
				readme: 'none',
			},
		],
		// TypeDoc API: Logger
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'api-logger',
				entryPoints: ['packages/logger/src/index.ts'],
				tsconfig: 'packages/logger/tsconfig.json',
				out: 'logger/api/logger',
				sidebar: { autoConfiguration: 'API (Logger)' },
				readme: 'none',
			},
		],
		// TypeDoc API: CLI (if you export a programmatic API)
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'api-create',
				entryPoints: ['packages/create/src/index.ts'],
				tsconfig: 'packages/create/tsconfig.json',
				out: 'create/api/create',
				sidebar: { autoConfiguration: 'API (CLI)' },
				readme: 'none',
			},
		]
	],

	themeConfig: {
		image: 'img/abimongo_social_card.png',
		colorMode: {
			// defaultMode: 'light',                 // or 'dark'
			respectPrefersColorScheme: true,     // keep Docusaurus behavior
			// disableSwitch: false,                // keep the toggle
			// respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'Abimongo',
			logo: {
				src: 'img/abimongo-a-logo-30x30.svg',
				// srcDark: 'img/abimongo-brand-logo_dark.svg',
			},
			items: [
				{ to: '/core/intro', label: 'Core', position: 'left' },
				{ to: '/logger/intro', label: 'Logger', position: 'left' },
				{ to: '/create/intro', label: 'Cli', position: 'left' },
				{ to: '/blog', label: 'Blog', position: 'left' },
				{ to: '/tutorials/intro', label: 'Tutorials', position: 'left' },
				// { href: 'https://github.com/NodEm9/abimongo', label: 'GitHub', position: 'right' },
			],
		},
		docs: { sidebar: { autoCollapseCategories: true } },
		footer: {
			style: 'dark',
			links: [
				// { 
				//   title: 'Docs',
				//   items: [
				//     {
				//       label: 'Tutorial',
				//       to: '/tutorials',
				//     },
				//   ],
				// },
				{
					title: 'Community',
					items: [
						{
							label: 'Issues',
							href: 'https://github.com/NodEm9/abimongo/issues',
						},
						{
							label: 'Discord',
							href: 'https://discordapp.com/invite/emmanuel_15444',
						},
						{
							label: 'X',
							href: 'https://twitter.com/NodEm9',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Blog',
							to: '/blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/NodEm9/abimongo',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} AbiMongo. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,

	// NOTE: devServer proxy removed because Docusaurus config does not accept this field.
	// Use a local reverse proxy or set iframe to the metrics server URL directly during development.
};

export default config;
