/**
 * References:
 * https://www.w3schools.com/HTML/html5_webworkers.asp
 * https://github.com/jbmoelker/serviceworker-introduction/tree/gh-pages/steps/13-private-messaging
 */


const contents = document.querySelector('#contents')

function updateContents (ev) {
    console.log('A new update from worker...')
    contents.innerText = ev.data;
}

console.log('Starting...')

if ( typeof(Worker) !== "undefined" && typeof(worker) === "undefined" ) {
    const worker = new Worker("webWorker.js");
    worker.onmessage = updateContents;
}


