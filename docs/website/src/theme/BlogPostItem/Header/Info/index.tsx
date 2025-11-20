import React, { useEffect, useState } from 'react';
import type { Props } from '@theme/BlogPostItem/Header/Info';

// Server-safe wrapper that dynamically loads the client info component.
export default function BlogPostItemHeaderInfo({ className }: Props) {
	const [ClientInfo, setClientInfo] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		import('./ClientInfo')
			.then((m) => {
				if (mounted) setClientInfo(() => m.default);
			})
			.catch(() => { });
		return () => {
			mounted = false;
		};
	}, []);

	if (ClientInfo) return <ClientInfo className={className} />;

	return null;
}
