var cacheName = '0.0.0';

// Service worker cache files/paths list
var contentToCache = [
    '/index.html',
    '/runWorker.js',
    '/sw.js',
    '/webmanifest.json',
    '/img/'
];

// Service Worker install handler
self.addEventListener('install', function(ev) {
  console.log('[Service Worker] Installing...');
  ev.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching...');
      return cache.addAll(contentToCache);
    })
  );
});
