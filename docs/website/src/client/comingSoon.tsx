import React from 'react';
import ReactDOM from 'react-dom/client';
import ComingSoon from '../components/ComingSoon/ComingSoon';

function mount() {
  if (typeof document === 'undefined') return;
  // don't mount twice
  if (document.getElementById('abimongo-coming-soon-root')) return;
  const rootEl = document.createElement('div');
  rootEl.id = 'abimongo-coming-soon-root';
  document.body.appendChild(rootEl);
  try {
    const root = ReactDOM.createRoot(rootEl);
    // expose an unmount helper so the component can request a clean unmount
    // (removing the DOM node directly prevents React effects cleanup)
    // store on window to keep it easy and avoid additional bundles
    (window as any).__abimongoComingSoonRoot = root;
    (window as any).__abimongoComingSoonUnmount = () => {
      try {
        root.unmount();
      } catch {
        // ignore
      }
      const el = document.getElementById('abimongo-coming-soon-root');
      if (el && el.parentNode) el.parentNode.removeChild(el);
      try {
        delete (window as any).__abimongoComingSoonUnmount;
        delete (window as any).__abimongoComingSoonRoot;
      } catch (e) {
        /* ignore */
      }
    };
    root.render(React.createElement(ComingSoon));
  } catch {
    // fallback for older ReactDOM (shouldn't happen in Docusaurus v3)
    const ReactDOMLegacy = require('react-dom');
    ReactDOMLegacy.render(React.createElement(ComingSoon), rootEl);
    // also expose a legacy unmount helper
    (window as any).__abimongoComingSoonUnmount = () => {
      try {
        ReactDOMLegacy.unmountComponentAtNode(rootEl);
      } catch {
        /* ignore */
      }
      if (rootEl && rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
      try {
        delete (window as any).__abimongoComingSoonUnmount;
      } catch {
        /* ignore */
      }
    };
  }
}

if (typeof window !== 'undefined') {
  // mount on DOMContentLoaded to show as soon as possible
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(mount, 50);
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
}

export { };
