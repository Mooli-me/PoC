const precache = {
  id: 'v0.0.0',
  paths: [
    './',
    '/index.html',
    '/manifest.json',
    '/script.js',
    '/styles.css',
    '/service-worker.js',
    '/img/logo.png'
  ]
};


let clickCounter = 0;
let secondsCounter = 0;

const channel = new BroadcastChannel('main');

function updateSeconds () {
  secondsCounter ++;
  channel.postMessage(
    {
      type: 'time',
      value: secondsCounter
    })
}

console.log('Setting message event.')
channel.addEventListener('message', (ev) => {
  console.log('Message received in service worker');
  clickCounter++;
  channel.postMessage(
    {
      type: 'clicks',
      value: clickCounter
    }
  );
});

console.log('Setting install event.')
self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(precache.id)
      .then(
        cache => cache.addAll(precache.paths)
      )
      .then(
        self.skipWaiting()
      )
  );
});

console.log('Getting control.')
self.clients.claim();

setInterval(updateSeconds,1000);
console.log('Updating time each second.')