import React, { Suspense } from 'react';
import clsx from 'clsx';
import BlogPostItemFooter from './Footer';
import ClientOnly from '@docusaurus/ClientOnly';
import BlogPostItemClientFooter from './ClientFooter';

// Minimal BlogPostItem wrapper. Use a ClientOnly wrapper for the
// client footer so `useBlogPost` runs only on the client and metadata
// is passed into the defensive Footer.
export default function BlogPostItem({ children, className }: any) {
	return (
		<article className={clsx(className)}>
			{children}
			{/* Render a basic footer server-side so ShareButtons are available */}
			<BlogPostItemFooter />
			{/* Enhance on the client with metadata-driven footer if available */}
			<ClientOnly>
				<Suspense fallback={null}>
					<BlogPostItemClientFooter />
				</Suspense>
			</ClientOnly>
		</article>
	);
}
