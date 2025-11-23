import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import BlogPostItemHeader from './Header';
import BlogPostItemFooter from './Footer';

// Minimal BlogPostItem wrapper. Dynamically load the client footer at
// runtime to avoid importing Docusaurus runtime aliases during SSR/build.
export default function BlogPostItem(props: any) {
	const { children, className } = props;
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
			<BlogPostItemHeader />
			{children}
			<BlogPostItemFooter isBlogPostPage={true} />
			{ClientFooter ? <ClientFooter /> : null}
		</article>
	);
}
