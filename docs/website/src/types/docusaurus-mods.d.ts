// Type declarations to silence editor/TS errors for Docusaurus module aliases
declare module '@docusaurus/*';
declare module '@theme/*';
declare module '@site/*';
declare module '@generated/*';
declare module '@docusaurus/plugin-content-blog/client';
declare module '@docusaurus/theme-common';
declare module '@docusaurus/utils-common';

// Generic fallback for other Docusaurus packages
declare module '@docusaurus/*' {
	const whatever: any;
	export default whatever;
}
