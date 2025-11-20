import React from 'react';
import clsx from 'clsx';
import BlogAuthor from '@theme/Blog/Components/Author';
import type { Props } from '@theme/BlogPostItem/Header/Authors';
import styles from './styles.module.css';

// Client authors: avoid `useBlogPost`. Try to find author info in DOM
// fallbacks; if not present, render nothing.
export default function ClientAuthors({ className }: Props) {
	// Best-effort: look for a JSON-LD script with authors or a data attribute.
	try {
		const ld = typeof document !== 'undefined' ? document.querySelector('script[type="application/ld+json"]') : null;
		if (ld) {
			const data = JSON.parse(ld.textContent || '{}');
			const authors = data?.author ? (Array.isArray(data.author) ? data.author : [data.author]) : [];
			if (authors.length === 0) return null;
			const imageOnly = authors.every((a: any) => !a.name);
			const singleAuthor = authors.length === 1;
			return (
				<div
					className={clsx(
						'margin-top--md margin-bottom--sm',
						imageOnly ? styles.imageOnlyAuthorRow : 'row',
						className,
					)}>
					{authors.map((author: any, idx: number) => (
						<div
							className={clsx(
								!imageOnly && (singleAuthor ? 'col col--12' : 'col col--6'),
								imageOnly ? styles.imageOnlyAuthorCol : styles.authorCol,
							)}
							key={idx}>
							<BlogAuthor author={({ name: author.name || '', imageURL: author.image || undefined }) as any} />
						</div>
					))}
				</div>
			);
		}
	} catch (e) {
		// ignore and fallback to null
	}
	return null;
}
