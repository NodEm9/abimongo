import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type { Props } from '@theme/BlogPostItem/Header/Title';

import styles from './styles.module.css';

// Lightweight client title: derive title from document and permalink from
// location. This avoids importing Docusaurus internals while providing
// a usable title on the client.
export default function ClientTitle({ className }: Props) {
	const title = typeof document !== 'undefined' ? document.title : '';
	const permalink = typeof window !== 'undefined' ? window.location.pathname : '/';
	const isBlogPostPage = true; // assume detail view when client-loaded
	const TitleHeading: any = isBlogPostPage ? 'h1' : 'h2';
	return (
		<TitleHeading className={clsx(styles.title, className)}>
			{isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
		</TitleHeading>
	);
}
