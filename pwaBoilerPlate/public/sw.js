const PRECACHE = 'v0.0.0';

// Service worker cache files/paths list
const PRECACHEPATHS = [
  './',
  '/index.html',
  '/manifest.json',
  '/runServiceWorker.js',
  '/script.js',
  '/styles.css',
  '/sw.js',
  '/img/logo.png'
];

// Service Worker install handler
self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(PRECACHE)
      .then(
        cache => cache.addAll(PRECACHEPATHS)
      )
      .then(
        self.skipWaiting()
      )
  );
});
