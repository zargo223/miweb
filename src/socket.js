// Import packages
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const router = require('./routes/routes');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Init packages 
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, verifyClient: (info, cb) => { cb(true) } });

const connectedClients = new Set();

// Config static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));

app.set('trust proxy', true);

// Ping Time
const PING_TIME = 25;

// Capture new connection by app
wss.on('connection', (ws) => {
    // Generate id random for user
    const userId = uuidv4();

    // Add new client to the list connectedClients
    connectedClients.add({ userId, ws });

    // Config function to ping
    const ping = () => ws.ping(() => { });

    // Config set interval
    setInterval(ping, PING_TIME * 1000);

    // Listen event message of sockets por send message to client (Dashboard)
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            // If exists data with userId and Message, dashboard send response by user
            if (data.userId && data.message) {
                // Send message specific for user
                let userSocket;

                for (const client of connectedClients) {
                    if (client.userId === data.userId) {
                        userSocket = client.ws;
                        break;
                    }
                }

                // Get user for clients actives and if your state is connect open
                if (userSocket && userSocket.readyState === WebSocket.OPEN) {
                    userSocket.send(JSON.stringify({ message: data.message, redirectUserId: data.userId }));
                }
            } else {
                // Send message by everything clients
                connectedClients.forEach((client) => {
                    if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(JSON.stringify({ ...data, userId }));
                    }
                });
            }
        } catch (error) {
            console.error('Error process in message: ', error.message);
        }

    });

    // Close connect user with socket - server
    ws.on('close', () => {
        connectedClients.forEach((client, clientWs) => {
            if (clientWs === ws) {
                connectedClients.delete(client);
            }
        });
    });
});

// Update connect to websockets
wss.on('upgrade', (request, socket, head) => {
    wssSecure.handleUpgrade(request, socket, head, (ws) => {
        wssSecure.emit('connection', ws, request);
    });
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Define routes for the server
app.use('/', router);

// Errors globals
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Define port of the server sockets
const PORT = process.env.PORT || 3000;

// Init server on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

