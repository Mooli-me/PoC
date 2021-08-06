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
const appVersion = 2;

let db;

let clickCounter = 0;
let secondsCounter = 0;

const channel = new BroadcastChannel('main');


function updateDB (ev) {
  const updateProcesses = [
      (db) => {
          console.log('There is no DB');
      },
      (db) => {
          console.log('Create DB first version');
          db.createObjectStore("times", { keyPath: "timestamp" });
      },
      (db) => {
          console.log('Update to version 2');
          db.createObjectStore("binaries", { keyPath: "sha256" });
      },
      (db) => {
          console.log('Update to version 3');
      }
  ];

  const db = ev.target.result;

  if ( ev.newVersion > updateProcesses.length - 1 ) {
      console.error(`Can't handle this DB version. Old version: ${ev.oldVersion}, new version:${ev.newVersion}.` );
      return;
  }

  for ( let version = ev.oldVersion + 1 ; version <= ev.newVersion ; version ++ ) {
      const process = updateProcesses[version];
      process(db);
  }
  
  //const objectStore = db.createObjectStore("name", { keyPath: "myKey" });
}

function openDB () {

  if (!self.indexedDB) {
      console.error("Browser doesn't seems to support IndexDB");
      return;
  }

  const dbConnection = indexedDB.open('thingsDB', appVersion);

  dbConnection.onupgradeneeded = updateDB;

  dbConnection.onsuccess = (ev) => {
      db = ev.target.result;
      console.log('DB opened.')
      console.log('DB stores:',db.objectStoreNames);
  }

  dbConnection.onerror = (ev) => console.error('Error opening DB:', ev.target.errorCode);

}

function addObjectToDB (obj, db, storeName) {

  const transaction = db.transaction(storeName, 'readwrite');

  transaction.oncomplete = ev => console.log('Transaction done:', ev);

  transaction.onerror = ev => console.error('Transaction error:', ev);

  const store = transaction.objectStore(storeName);

  const resquest = store.add(obj)

  resquest.onsuccess = (ev) => console.log('Time added to DB:', ev);

  channel.postMessage(
      {
          type: 'DBUpdate',
          storeName,
          obj
      }
  );

}

function writeDateToDB () {

  const now = Date.now();

  const obj = {
      timestamp: now,
      string: Date(now)
  }

  addObjectToDB(obj, db, 'times');

}

function startLoop () {
  setInterval(writeDateToDB, 5000);
  console.log('Writing time to DB each 5 seconds.');
  setInterval(updateSeconds,1000);
  console.log('Updating time each second.')
}

function updateSeconds () {
  secondsCounter ++;
  channel.postMessage(
    {
      type: 'time',
      value: secondsCounter
    })
}


openDB();

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

startLoop();