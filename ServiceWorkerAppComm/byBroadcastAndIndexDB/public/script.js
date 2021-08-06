const appVersion = 2;
let secondsDiv;
let clicksDiv;
let button;
let channel;
let db;

const clickMessage = {
    type: 'click',
    value: true
}

function messageHandler (ev) {
    let element;
    console.log('A new update from worker.')
    switch (ev.data.type) {
        case 'clicks':
            element = clicksDiv
            break;
        case 'time':
            element = secondsDiv
            break;
    }
    element.innerText = ev.data.value;
}

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

    if (!window.indexedDB) {
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
}

function main () {
    console.log('Starting...')
    if ('serviceWorker' in navigator) {

        try {
            navigator.serviceWorker.register('/service-worker.js');
            console.log('Service worker registered.');
        } catch (error) {
            console.error(error)
            return
        }

        channel = new BroadcastChannel('main');
        channel.addEventListener('message', messageHandler);
        console.log('Opened channel in window');

        openDB();

        secondsDiv = document.querySelector('div#seconds');
        clicksDiv = document.querySelector('div#clicks');
        button = document.querySelector('button');
        button.addEventListener('click', () =>  channel.postMessage(clickMessage) );

        startLoop();

    } else {

        console.error('This browser doesn\'t support service workers');

    }
}


window.addEventListener('load',main);