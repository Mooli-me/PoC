const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const http = require('http');
const webSockets = require('ws');

app.use(express.static(__dirname + '/public'));

const httpServer = http.createServer(app);
const webSocketsServer = new webSockets.Server({ server: httpServer });

function sendWSMessage (ws) {
    console.log('Sending message...')
    ws.send(Date.now());
}

webSocketsServer.on('connection', async (ws) => {

    console.log('-> Client connected');

    ws.on('close', () =>  console.log('X- Client leaves') );

    ws.on('message', (msg) => {
        console.log('-- Message arrived:', msg);
    });

    setInterval(()=>sendWSMessage(ws), 5000);

})

httpServer.listen( PORT , ()=>{
    const connection = httpServer.address()
    console.log(`Running and lisening. Address: ${connection.address} Port:${connection.port}`);
}) ;