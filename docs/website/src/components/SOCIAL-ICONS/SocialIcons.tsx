import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ShareButtons from '@site/src/components/Share/ShareButtons';

// Use local SVG/bitmap assets (in `static/img`) instead of inline SVGs.
export default function SocialIcons(): React.ReactElement {
	const github = 'https://github.com/NodEm9/abimongo';
	const x = 'https://x.com/AbimongoCore';
	const linkedin = 'https://www.linkedin.com/in/emmanuel-nodolomwanyi';
	const medium = 'https://medium.com/@padave805';
	const discord = 'https://discord.gg/your-discord-invite';

	const img = (p: string, alt: string) => (
		<img
			src={useBaseUrl(p)}
			alt={alt}
			width={20}
			height={20}
			style={{ display: 'inline-block', verticalAlign: 'middle' }}
		/>
	);

	return (
		<div className="social-icons margin-top--sm">
			<div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
				<a href={github} target="_blank" rel="noopener noreferrer" aria-label="Abimongo on GitHub">
					{img('/abimongo/img/github.svg', 'GitHub')}
				</a>

				<a href={x} target="_blank" rel="noopener noreferrer" aria-label="Abimongo on X">
					{img('/abimongo/img/X-Logo.svg', 'X')}
				</a>

				<a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="Emmanuel Nodolomwanyi on LinkedIn">
					{img('/abimongo/img/skill-icons_linkedin.svg', 'LinkedIn')}
				</a>

				<a href={medium} target="_blank" rel="noopener noreferrer" aria-label="Abimongo on Medium">
					{img('/abimongo/img/medium.svg', 'Medium')}
				</a>

				<a href={discord} target="_blank" rel="noopener noreferrer" aria-label="Abimongo on Discord">
					{img('/abimongo/img/skill-icons_discord.svg', 'Discord')}
				</a>

				<div>
					<ShareButtons />
				</div>
			</div>
		</div>
	);
}