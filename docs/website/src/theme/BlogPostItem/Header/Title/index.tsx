import React, { useEffect, useState } from 'react';
import type { Props } from '@theme/BlogPostItem/Header/Title';
import styles from './styles.module.css';

// Server-safe wrapper. Dynamically load client implementation that uses
// `useBlogPost` to avoid importing Docusaurus internals during SSR/build.
export default function BlogPostItemHeaderTitle({ className }: Props) {
	const [ClientTitle, setClientTitle] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		import('./ClientTitle')
			.then((m) => {
				if (mounted) setClientTitle(() => m.default);
			})
			.catch(() => { });
		return () => {
			mounted = false;
		};
	}, []);

	if (ClientTitle) return <ClientTitle className={className} />;

	// Fallback server-side: render nothing (title is usually in children)
	return null;
}
