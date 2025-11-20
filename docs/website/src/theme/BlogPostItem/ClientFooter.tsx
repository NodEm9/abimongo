import React from 'react';
import BlogPostItemFooter from './Footer';

// Client footer no longer imports Docusaurus internals. The defensive
// Footer will render the ShareButtons even without metadata.
export default function BlogPostItemClientFooter() {
	return <BlogPostItemFooter />;
}

