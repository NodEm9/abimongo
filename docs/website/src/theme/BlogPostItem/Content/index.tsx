import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/BlogPostItem/Content';

// Keep this component simple and avoid importing runtime internals
// so it can be bundled safely in this swizzled theme.
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
