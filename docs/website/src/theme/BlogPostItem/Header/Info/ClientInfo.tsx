import React from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/BlogPostItem/Header/Info';
import styles from './styles.module.css';

// Lightweight client info that attempts to read the post date from a
// meta tag or leaves it empty. Avoids importing Docusaurus internals.
export default function ClientInfo({ className }: Props) {
	const dateMeta = typeof document !== 'undefined' ? document.querySelector('meta[name="date"]') : null;
	const date = dateMeta ? dateMeta.getAttribute('content') || '' : '';
	return (
		<div className={clsx(styles.container, 'margin-vert--md', className)}>
			{date ? <time dateTime={date}>{new Date(date).toDateString()}</time> : null}
		</div>
	);
}
