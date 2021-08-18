const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { response, request } = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

const subscriptors = [];

let subscriptionsCounter = 0;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

async function removeSubscriptor (id) {
    console.log(`Client ${id} closes connection.`);
    subscriptors = subscriptors.filter(item => item.id !== id );
}

async function subscriptionHandler (req, res, next) {
    
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };

    response.writeHead(200, headers);

    response.write('data: Welcome.\n\n');

    const subscriptor = {
        id: subscriptionsCounter++,
        connection: response
    }

    subscriptors.push(subscriptor);

    request.on('close', () => removeSubscriptor(subscriptor.id) );
}

async function sendMessage () {
    console.log('Sending message to subscriptors.')
    subscriptors.forEach(
        subscriptor => subscriptor.connection.write(`data: ${Date.now()}\n\n`)
    )
}

app.get('/subscription', subscriptionHandler);

app.listen( PORT , ()=>{
    console.log(`Running and lisening in http://localhost:${PORT}.`);
});

setInterval(sendMessage,3000);