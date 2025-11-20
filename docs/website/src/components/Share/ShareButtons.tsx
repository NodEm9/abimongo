import React from 'react';
import { useLocation } from '@docusaurus/router';

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
				className="button button--secondary"
				onClick={handleShare}
				aria-label="Share this blog post">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					style={{ marginRight: 8 }}>
					<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
					<polyline points="16 6 12 2 8 6" />
					<line x1="12" y1="2" x2="12" y2="15" />
				</svg>
				<span>Share</span>
			</button>
		</div>
	);
}

export default ShareButtons;
