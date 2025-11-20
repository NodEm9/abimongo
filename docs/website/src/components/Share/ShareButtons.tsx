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
				<img
					src="/img/share%20(1).png"
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
