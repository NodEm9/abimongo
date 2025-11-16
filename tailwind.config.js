/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');

module.exports = {
	darkMode: ['class', '[data-theme="dark"]'],
	content: [
		// Project sources
		'./src/**/*.{js,jsx,ts,tsx,mdx}',
		'./packages/**/*.{js,ts,jsx,tsx,md,mdx}',
		'./docs/**/*.{md,mdx}',
		'./docs/website/blog/**/*.{md,mdx}',
		'./docusaurus.config.{js,ts}',
		// Docusaurus website sources (ensure the docs site classes are discovered)
		'./docs/website/src/**/*.{js,jsx,ts,tsx,md,mdx}',
		'./docs/website/**/*.{md,mdx}',
	],
	theme: {
		extend: {
			colors: {
				navy: '#0B1E33',
				blueBrand: '#1E88E5',
				tealBrand: '#00C4B4',
				canvas: '#F5F7FA',
				textDark: '#0B1726',
				textMuted: '#5C6B7A',
				borderLight: '#E5EAF0',
				accent: '#3CE0D2',
			},
			boxShadow: {
				card: '0 10px 32px rgba(0,0,0,.15)',
			},
		},
	},
	plugins: [typography],
};
