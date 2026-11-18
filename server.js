import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

import { WebSocketServer } from 'ws';
import { redisPublish, redisSubscribe } from './connection.js';

const PORT = process.env.PORT || 9000;
const REDIS_CHANNEL = 'ws-messages' 

const httpServer = http.createServer(async function (req,res) {
    const indexFile = await fs.readFile(path.resolve('./index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    return res.end(indexFile)
})

const wsServer = new WebSocketServer({server: httpServer})

redisSubscribe.subscribe(REDIS_CHANNEL);
redisSubscribe.on('message', (channel, message) => {
    if(channel === REDIS_CHANNEL){
        //broadcast channel to all of your connected clients
        wsServer.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(message.toString());
            }
        })
    }
});

wsServer.on('connection', (websocket) => {
    console.log("websocket connection.....")

    websocket.on('message', async (data)=> {
        console.log('websocket message recieved: ', data.toString());

        //Relay the message to the broker...
        console.log('Relaying message to the broker...')
        await redisPublish.publish(REDIS_CHANNEL, data.toString());
    })
})

httpServer.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
