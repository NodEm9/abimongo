import React, { useEffect, useRef } from 'react';

export default function ComingSoon() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // prevent background scroll while modal open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow || '';
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function close() {
    const unmount = (window as any).__abimongoComingSoonUnmount;
    if (typeof unmount === 'function') {
      try {
        unmount();
      } catch {
        /* ignore */
      }
      return;
    }
    const el = document.getElementById('abimongo-coming-soon-root');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Abimongo coming soon"
      onClick={(e) => {
        // close when clicking the backdrop (but not when clicking the image/content)
        if (e.target === rootRef.current) close();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
        background: 'rgba(0,0,0,0.45)'
      }}
    >
      {/* Modal content: show the image prominently */}
      <div
        style={{
          position: 'relative',
          // Keep the popup small: prefer up to 200x200px, fit to viewport on narrow screens
          width: 'min(400px, 60vw)',
          height: 'min(400px, 60vw)',
          maxWidth: 500,
          maxHeight: 500,
          minWidth: 350,
          minHeight: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,.45)'
        }}
      >
        <button
          aria-label="Close"
          onClick={close}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 3,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            width: 36,
            height: 36,
            borderRadius: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          ✕
        </button>

        <img
          src="/abimongo/img/coming-soon.png"
          alt="Coming soon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            background: 'white'
          }}
        />

        {/* Optional caption area overlaid at bottom */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '12px 20px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: 15,
            zIndex: 2
          }}
        >
          {/* Big updates are coming in Abimongo v2 — tutorials, adapters, and improved DX. Stay tuned. */}
        </div>
      </div>
    </div>
  );
}
