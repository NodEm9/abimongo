import React from 'react';
import clsx from 'clsx';
import BlogAuthor from '@theme/Blog/Components/Author';
import SocialIcons from '@site/src/components/SOCIAL-ICONS/SocialIcons';
import type { Props } from '@theme/BlogPostItem/Header/Authors';
import styles from './styles.module.css';

export default function ClientAuthors({ className }: Props) {
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

					<div className="col col--12 margin-top--sm">
						<SocialIcons />
					</div>
				</div>
			);
		}
	} catch {
		// ignore and fallback to null
	}
	return null;
}
