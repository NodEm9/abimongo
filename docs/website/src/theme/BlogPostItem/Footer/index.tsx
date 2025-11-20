import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import EditMetaRow from '@theme/EditMetaRow';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import ShareButtons from '@site/src/components/Share/ShareButtons';

// Defensive Footer: avoid importing Docusaurus runtime internals.
// Accept optional props (metadata, isBlogPostPage) when provided by a parent.
export default function BlogPostItemFooter({ metadata, isBlogPostPage }: any): ReactNode {
	metadata = metadata ?? {};
	const {
		tags = [],
		title,
		editUrl,
		hasTruncateMarker,
		lastUpdatedBy,
		lastUpdatedAt,
	} = metadata;

	// A post is truncated if it's in the "list view" and it has a truncate marker
	const truncatedPost = !isBlogPostPage && !!hasTruncateMarker;

	const tagsExists = Array.isArray(tags) && tags.length > 0;

	const renderFooter = tagsExists || truncatedPost || editUrl;

	// If nothing to render, still show ShareButtons so the share control is always available.
	if (!renderFooter) {
		return (
			<footer className="docusaurus-mt-lg">
				<div className="row margin-top--sm">
					<div className="col">
						<ShareButtons />
					</div>
				</div>
			</footer>
		);
	}

	// BlogPost footer - details view
	if (isBlogPostPage) {
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
				<div className="row margin-top--sm">
					<div className="col">
						<ShareButtons />
					</div>
				</div>
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
						<ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
					</div>
				)}
			</footer>
		);
	}
}
