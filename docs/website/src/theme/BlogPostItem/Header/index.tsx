import React from 'react';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
import SocialIcons from '../../../components/SOCIAL-ICONS/SocialIcons';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItemHeader(): React.ReactNode {
	const { metadata } = useBlogPost();

	// Render header with subcomponents (server-capable via useBlogPost).
	// Place social icons under the authors block so they stack nicely on
	// mobile and appear just under the author info on desktop.
	return (
		<header>
			<div>
				<BlogPostItemHeaderTitle />
				<BlogPostItemHeaderInfo />
				<BlogPostItemHeaderAuthors />
				{metadata ? (
					<div className="col col--12 margin-top--sm">
						<SocialIcons />
					</div>
				) : null}
			</div>
		</header>
	);
}
