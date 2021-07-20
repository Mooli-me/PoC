// borrowed from https://github.com/james2doyle/pwa-skeleton/blob/master/sw.js

import { build, files, timestamp } from '$service-worker';

// 'timestamp' imported from $service-worker is a date time stamp from last server side build.
// Using it for cache name provides a way for keep updated versions of files in the cache.
const CACHE_NAME = timestamp;
const expectedCaches = [CACHE_NAME];

// the list of files that need to be cached
// 'build' and 'files', imported from $service-worker, is a list of files server side builded
const staticFiles = [
    ...build,
    ...files,
    './',
];

/**
 * Performs install steps.
 */
addEventListener('install', (event) => {
  // install this service worker as soon as a new one is available
  skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(staticFiles)));
});

/**
 * Handles requests: responds with cache or else network.
 */
addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

/**
 * Cleans up static cache and activates the Service Worker.
 */
addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map((key) => {
    if (!expectedCaches.includes(key)) {
      return caches.delete(key);
    }
  }))).then(() => {
    console.log(`${CACHE_NAME} now ready to handle fetches!`);
    return clients.claim();
  }));
});