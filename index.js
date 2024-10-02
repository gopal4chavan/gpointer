'use strict'

require('./environment')
require('./src/db')

const {logInfo} = require('./src/logger')
const { initSocket } = require('./src/socket');
const roomRoutes = require('./src/routes/roomRoutes');
const {corsConfig} = require('./cors')

const express = require('express');
const http = require('http');
const path = require('path');


const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(corsConfig)

// Serve the static files for the client
app.use(express.static(path.join(__dirname, 'public')));

// Use the room routes
app.use('/rooms', roomRoutes); // Mount the routes under the '/rooms' path

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logInfo(`Server is running on http://localhost:${PORT}`);
});
