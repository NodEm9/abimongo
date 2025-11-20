import React from 'react';

// Minimal BlogPostItem wrapper: render children inside an article.
// Keep implementation intentionally simple to avoid direct runtime
// imports from Docusaurus plugin internals which can fail in some
// build environments. Subcomponents (Header/Content/Footer) remain
// available but are not imported here to reduce bundle resolution surface.
export default function BlogPostItem({ children, className }: any) {
	return (
		<article className={className}>
			{children}
		</article>
	);
}
