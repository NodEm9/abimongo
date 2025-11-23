import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/BlogPostItem/Content';

export default function BlogPostItemContent({
	children,
	className,
}: Props): ReactNode {
	return (
		<div className={clsx('markdown', className)}>
			<MDXContent>{children}</MDXContent>
		</div>
	);
}
