import React, { useEffect, useState } from 'react';
import type { Props } from '@theme/BlogPostItem/Header/Authors';

// Server-safe wrapper that dynamically loads the client authors component.
export default function BlogPostItemHeaderAuthors({ className }: Props) {
	const [ClientAuthors, setClientAuthors] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		import('./ClientAuthors')
			.then((m) => {
				if (mounted) setClientAuthors(() => m.default);
			})
			.catch(() => { });
		return () => {
			mounted = false;
		};
	}, []);

	if (ClientAuthors) return <ClientAuthors className={className} />;

	return null;
}
