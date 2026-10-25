/**
 * Service Worker Registration Helper
 *
 * Registers the background caching service worker on window load
 * in secure contexts and localhost.
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    // Only register in secure contexts or localhost
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    if (window.isSecureContext || isLocalhost) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.info('[SW] Service worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[SW] Service worker registration failed:', error);
          });
      });
    }
  }
}
