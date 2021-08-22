let secondsDiv;
let clicksDiv;
let button;
let channel;

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

        secondsDiv = document.querySelector('div#seconds');
        clicksDiv = document.querySelector('div#clicks');
        button = document.querySelector('button');
        button.addEventListener('click', () =>  channel.postMessage(clickMessage) );

    } else {

        console.error('This browser doesn\'t support service workers');

    }
}


window.addEventListener('load',main);