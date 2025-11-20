import React from 'react';
import { useLocation } from '@docusaurus/router';

function ShareButtons() {
  const location = useLocation();
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';
  const shareTitle = typeof document !== 'undefined' ? document.title : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert(`You can manually share this link: ${shareUrl}`);
    }
  };

  return (
    <div>
      <button onClick={handleShare}>
        Share Page
      </button>
      {/* You can add specific buttons for Twitter, LinkedIn, etc. here using standard share links */}
    </div>
  );
}

export default ShareButtons;
