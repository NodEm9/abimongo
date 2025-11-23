import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import EditMetaRow from '@theme/EditMetaRow';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItemFooter({ metadata, isBlogPostPage }: any): ReactNode {
	const blogPost = useBlogPost();
	const meta = metadata ?? blogPost.metadata ?? {};
	const isDetail = typeof isBlogPostPage !== 'undefined' ? isBlogPostPage : blogPost.isBlogPostPage;

	const {
		tags = [],
		title,
		editUrl,
		hasTruncateMarker,
		lastUpdatedBy,
		lastUpdatedAt,
	} = meta;

	// A post is truncated if it's in the "list view" and it has a truncate marker
	const truncatedPost = !isDetail && !!hasTruncateMarker;

	const tagsExists = Array.isArray(tags) && tags.length > 0;

	const renderFooter = tagsExists || truncatedPost || editUrl;

	// If nothing to render, return null — share control is rendered
	// in the header via the SocialIcons component.
	if (!renderFooter) {
		return null;
	}

	// BlogPost footer - details view
	if (isDetail) {
		const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

		return (
			<footer className="docusaurus-mt-lg">
				{tagsExists && (
					<div className={clsx('row', 'margin-top--sm')}>
						<div className="col">
							<TagsListInline tags={tags} />
						</div>
					</div>
				)}
				{/* Share button moved to header (SocialIcons); footer intentionally left without it. */}
				{canDisplayEditMetaRow && (
					<EditMetaRow
						className={clsx('margin-top--sm')}
						editUrl={editUrl}
						lastUpdatedAt={lastUpdatedAt}
						lastUpdatedBy={lastUpdatedBy}
					/>
				)}
			</footer>
		);
	}
	// BlogPost footer - list view
	else {
		return (
			<footer className="row docusaurus-mt-lg">
				{tagsExists && (
					<div className={clsx('col', { 'col--9': truncatedPost })}>
						<TagsListInline tags={tags} />
					</div>
				)}
				{truncatedPost && (
					<div
						className={clsx('col text--right', {
							'col--3': tagsExists,
						})}>
						<ReadMoreLink blogPostTitle={title} to={meta.permalink} />
					</div>
				)}
			</footer>
		);
	}
}
