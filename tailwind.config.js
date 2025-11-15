/** @type {import('tailwindcss').Config} */
export const darkMode = ['class', '[data-theme="dark"]'];
export const content = [
	'./src/**/*.{js,jsx,ts,tsx,mdx}',
	'./docs/**/*.{md,mdx}',
	'./blog/**/*.{md,mdx}',
	'./docusaurus.config.{js,ts}',
];
export const theme = {
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
};
export const plugins = [];
