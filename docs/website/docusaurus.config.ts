import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';
// import './src/css/fontello-9c142965/font/fontello.svg';


const config: Config = {
	title: 'Abimongo',
	url: 'https://nodem9.github.io',
	baseUrl: '/abimongo/',
	tagline: 'Abimongo is a MongoDB ODM for TypeScript and JavaScript',
	favicon: 'img/favicon.ico',
	organizationName: 'NodEm9',
	projectName: 'abimongo',
	clientModules: [path.resolve(__dirname, './src/css/custom.css')],
	onBrokenAnchors: 'ignore',
	trailingSlash: false,
	// onBrokenLinks: 'ignore',
	presets: [
		[
			'classic',
			{
				docs: false,         // we'll mount multiple docs plugins below
				blog: false,
				theme: { customCss: require.resolve('./src/css/custom.css') },
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
		// TypeDoc API: Core
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'api-core',
				entryPoints: ['packages/core/src/index.ts'],
				tsconfig: 'packages/core/tsconfig.json',
				out: '/core/api/core',
				sidebar: { autoConfiguration: 'API (Core)', position: 10 },
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
				out: '/logger/api/logger',
				sidebar: { autoConfiguration: 'API (Logger)', position: 20 },
				readme: 'none',
			},
		],
		// TypeDoc API: CLI (if you export a programmatic API)
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'api-create',
				entryPoints: ['packages/create/bin/abimongo-cli.ts'],
				tsconfig: 'packages/create/tsconfig.json',
				out: '/docs/create/api/create',
				sidebar: { autoConfiguration: 'API (CLI)', position: 30 },
				readme: 'none',
			},
		],
	],

	themeConfig: {
		image: 'img/abimongo_social_card.png',
		colorMode: {
			respectPrefersColorScheme: true,
		},
		font: {
			'family': 'Inter, sans-serif',
			'size': '46px',
			// 'weight': '700',
		},
		navbar: {
			title: 'Abimongo',
			logo: {
				alt: 'Abimongo Logo',
				src: 'img/abimongo-logo-v1.svg',
			},
			items: [
				{ to: '/core/intro', label: 'Core', position: 'left' },
				{ to: '/logger/intro', label: 'Logger', position: 'left' },
				{ to: '/create/intro', label: 'Create New Project', position: 'left' },
				// { to: '/core/api', label: 'API', position: 'right' },
				{ href: 'https://github.com/NodEm9/abimongo', label: 'GitHub', position: 'right' },
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
				//       to: '/docs',
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
						// {
						//   label: 'Blog',
						//   to: '/blog',
						// },
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
};

export default config;
