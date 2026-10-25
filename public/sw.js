/**
 * Service Worker for Kutty Birthday Experience
 * Cache Version: kutty-assets-v1
 *
 * Implements:
 * 1. Cache-first strategy for all media assets (audio, images, video, fonts).
 * 2. HTTP 206 Partial Content slicing for Range requests (required for seeking,
 *    audio looping, and smooth video playback on mobile and desktop browsers).
 * 3. Stale cache cleanup on activate.
 * 4. Immediate takeover via skipWaiting() and clients.claim().
 */

const CACHE_NAME = 'kutty-assets-v1';

// Media and asset file patterns to handle
const ASSET_EXTENSIONS = [
  '.mp3',
  '.mp4',
  '.webp',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
];

function isCacheableAsset(url) {
  // Same origin assets in audio, images, fonts, backgrounds
  if (url.origin === self.location.origin) {
    const p = url.pathname.toLowerCase();
    if (
      p.startsWith('/audio/') ||
      p.startsWith('/images/') ||
      p.startsWith('/fonts/') ||
      p.startsWith('/backgrounds/') ||
      p.startsWith('/gift-assets/') ||
      p === '/favicon.svg' ||
      p === '/icons.svg'
    ) {
      return true;
    }
    return ASSET_EXTENSIONS.some((ext) => p.endsWith(ext));
  }

  // Google Fonts CSS and WebFont files
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    return true;
  }

  return false;
}

self.addEventListener('install', (_event) => {
  // Activate immediately without waiting for old clients to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.info('[SW] Removing obsolete cache:', key);
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (!isCacheableAsset(url)) {
    return;
  }

  const rangeHeader = request.headers.get('range');

  // ── Range Request Handler (Audio & Video Seeking) ──────────────────────────
  if (rangeHeader) {
    event.respondWith(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          // Try matching pathname, full URL, or decoded pathname
          let cachedResponse =
            (await cache.match(url.pathname)) ||
            (await cache.match(decodeURI(url.pathname))) ||
            (await cache.match(request));

          if (!cachedResponse) {
            // Not in cache yet, fetch from network
            return await fetch(request);
          }

          const arrayBuffer = await cachedResponse.arrayBuffer();
          const totalLength = arrayBuffer.byteLength;

          // Parse bytes=start-end
          const matches = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
          if (!matches) {
            return await fetch(request);
          }

          const start = parseInt(matches[1], 10);
          const end = matches[2] ? parseInt(matches[2], 10) : totalLength - 1;

          // Validate range bounds
          if (start >= totalLength || (end && end >= totalLength) || start > end) {
            return new Response(null, {
              status: 416,
              statusText: 'Range Not Satisfiable',
              headers: {
                'Content-Range': `bytes */${totalLength}`,
              },
            });
          }

          const chunk = arrayBuffer.slice(start, end + 1);
          let contentType = cachedResponse.headers.get('Content-Type');
          if (!contentType) {
            if (url.pathname.endsWith('.mp4')) contentType = 'video/mp4';
            else if (url.pathname.endsWith('.mp3')) contentType = 'audio/mpeg';
            else contentType = 'application/octet-stream';
          }

          return new Response(chunk, {
            status: 206,
            statusText: 'Partial Content',
            headers: {
              'Content-Range': `bytes ${start}-${end}/${totalLength}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': String(chunk.byteLength),
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000',
            },
          });
        } catch (err) {
          console.warn('[SW] Range request error, falling back to network:', err);
          return await fetch(request);
        }
      })()
    );
    return;
  }

  // ── Standard Cache-First Request Handler ───────────────────────────────────
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse =
          (await cache.match(url.pathname)) ||
          (await cache.match(decodeURI(url.pathname))) ||
          (await cache.match(request));

        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache successful full responses
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          // Clone and store in cache
          const clone = networkResponse.clone();
          cache.put(url.pathname, clone).catch(() => {});
          const decoded = decodeURI(url.pathname);
          if (decoded !== url.pathname) {
            cache.put(decoded, networkResponse.clone()).catch(() => {});
          }
        }
        return networkResponse;
      } catch (err) {
        // If offline and not in cache, fallback
        console.warn('[SW] Fetch failed for:', url.pathname, err);
        const cache = await caches.open(CACHE_NAME);
        const fallback =
          (await cache.match(url.pathname)) ||
          (await cache.match(decodeURI(url.pathname)));
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});
