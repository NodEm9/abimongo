import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import BlogPostItemFooter from './Footer';

// Minimal BlogPostItem wrapper. Dynamically load the client footer at
// runtime to avoid importing Docusaurus runtime aliases during SSR/build.
export default function BlogPostItem({ children, className }: any) {
	const [ClientFooter, setClientFooter] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		import('./ClientFooter')
			.then((mod) => {
				if (mounted) setClientFooter(() => mod.default);
			})
			.catch(() => { });
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<article className={clsx(className)}>
			{children}
			{/* Render a basic footer server-side so ShareButtons are available */}
			<BlogPostItemFooter />
			{/* Enhance on the client with metadata-driven footer if available */}
			{ClientFooter ? <ClientFooter /> : null}
		</article>
	);
}
