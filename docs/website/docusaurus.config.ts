import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';



const siteUrl = process.env.SITE_URL ?? 'https://abimongo.com';
const baseUrlValue = process.env.BASE_URL ?? '/';

const config: Config = {
	title: 'Abimongo',
	url: siteUrl,
	baseUrl: baseUrlValue,
	tagline: 'Abimongo is a MongoDB ODM for TypeScript and Node.js, designed for ease of use and type safety.',
	favicon: 'img/favicon.ico',
	organizationName: 'NodEm9',
	projectName: 'abimongo',
	clientModules: [require.resolve('./src/css/custom.css'), require.resolve('./src/client/comingSoon.tsx')],
	onBrokenAnchors: 'ignore',
	trailingSlash: false,
	headTags: [
		// Prefer a small thumbnail card for social shares so platforms
		// display a left-side thumbnail next to the link title.
		{
			tagName: 'meta',
			attributes: {
				name: 'x:card',
				content: 'summary',
			},
		},
		{
			tagName: 'meta',
			attributes: {
				name: 'x:image',
				content: `${baseUrlValue}img/abiimongo-logo_socials.png`,
			},
		},
		{
			tagName: 'meta',
			attributes: {
				property: 'og:image',
				content: `${baseUrlValue}img/abiimongo-logo_socials.png`,
			},
		},
		{
			tagName: 'meta',
			attributes: {
				property: 'og:image:alt',
				content: 'Abimongo logo',
			},
		},
	],
	presets: [
		[
			'classic',
			{
				docs: false,         // we'll mount multiple docs plugins below
				blog: {
					showReadingTime: true,
					path: './blog',
					routeBasePath: 'blog',
					// Tidy blog warnings: allow inline authors and untruncated posts to avoid
					// build-time warnings for existing content. See authors.yml for a
					// canonical authors list if you want stricter declarations.
					onInlineAuthors: 'ignore',
					onUntruncatedBlogPosts: 'ignore',
				},
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
		// Use a raster PNG as the default social image so link previews
		// (LinkedIn, Facebook, Twitter) reliably render a thumbnail
		// next to the title. This references an existing file in
		// `docs/website/static/img` named `abiimongo-logo.png`.
		image: 'img/abiimongo-logo_socials.png',
		colorMode: {
			defaultMode: 'light',                 // or 'dark'
			respectPrefersColorScheme: true,     // keep Docusaurus behavior
			disableSwitch: false,                // keep the toggle
		},
		navbar: {
			title: 'Abimongo',
			logo: {
				alt: 'Abimongo Logo',
				src: 'img/abimongo-logo_light.svg',
				srcDark: 'img/abimongo-logo_dark.svg',
				height: 32,
				width: 32,
			},
			items: [
				{ to: '/core/intro', label: 'Core', position: 'left' },
				{ to: '/logger/intro', label: 'Logger', position: 'left' },
				{ to: '/create/intro', label: 'Cli', position: 'left' },
				{ to: '/blog', label: 'Blog', position: 'left' },
				{ to: '/tutorials', label: 'Tutorials', position: 'left' },
				// { href: 'https://github.com/NodEm9/abimongo', label: 'GitHub', position: 'right' },
			],
		},
		docs: {
			sidebar: {
				hideable: false,
				autoCollapseCategories: true
			}
		},
		footer: {
			style: 'dark',
			links: [
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
							href: 'https://x.com/AbimongoCore',
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
			logo: {
				alt: 'Abimongo Logo',
				src: 'img/abimongo-logo_dark.svg',
				href: `${siteUrl}${baseUrlValue}`,
				width: 32,
				height: 32,
			},
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
