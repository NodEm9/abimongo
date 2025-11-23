// Global ambient declarations to help the editor/tsserver resolve site aliases
declare module '@site/*' {
	const value: any;
	export default value;
}

declare module '*.module.css' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.css';
