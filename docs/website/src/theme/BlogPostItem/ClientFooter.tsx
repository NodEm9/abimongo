import React from 'react';
import BlogPostItemFooter from './Footer';

// Importing this hook here: this component will be rendered inside a
// ClientOnly wrapper to ensure it runs only on the client. That limits
// potential server-side bundling issues while restoring metadata-driven
// footer content (tags/edit meta).
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItemClientFooter() {
	const { metadata, isBlogPostPage } = useBlogPost();
	return <BlogPostItemFooter metadata={metadata} isBlogPostPage={isBlogPostPage} />;
}  
 