import React from 'react';
import clsx from 'clsx';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import type { Props } from '@theme/BlogPostItem/Header/Info';
import styles from './styles.module.css';

function DateTime({ date }: { date: string }) {
	return <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>;
}

export default function BlogPostItemHeaderInfo({ className }: Props) {
	const { metadata } = useBlogPost();
	const { date, readingTime } = metadata;

	return (
		<div className={clsx(styles.container, 'margin-vert--md', className)}>
			<DateTime date={date} />
			{typeof readingTime !== 'undefined' && (
				<>
					<span style={{ margin: '0 0.5rem' }}>·</span>
					<span>{Math.ceil(readingTime)} min read</span>
				</>
			)}
		</div>
	);
}
