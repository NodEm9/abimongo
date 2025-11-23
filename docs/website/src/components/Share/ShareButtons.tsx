import React from 'react';
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function ShareButtons(): React.ReactElement {
	const location = useLocation();
	const shareUrl =
		typeof window !== 'undefined' ? window.location.origin + location.pathname : '';
	const shareTitle = typeof document !== 'undefined' ? document.title : '';

	const handleShare = async () => {
		try {
			const nav: any = typeof navigator !== 'undefined' ? (navigator as any) : undefined;
			if (nav && typeof nav.share === 'function') {
				await nav.share({ title: shareTitle, url: shareUrl });
				return;
			}

			// Fallback: try to copy to clipboard
			if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
				await nav.clipboard.writeText(shareUrl);
				alert('Link copied to clipboard. You can now paste it into your share target.');
				return;
			}

			// Final fallback: show the URL so user can copy manually
			alert(`Share this link: ${shareUrl}`);
		} catch (error) {
			console.error('Error sharing or copying link:', error);
		}
	};

	return (
		<div>
			<button
				type="button"
				className="button button--secondary flex"
				onClick={handleShare}
				aria-label="Share this blog post">
				<img
					src={useBaseUrl('/img/Share_icon.svg')}
					alt="Share"
					width={16}
					height={16}
					style={{ marginRight: 8 }}
				/>
				<span>Share</span>
			</button>
		</div>
	);
}

export default ShareButtons;
