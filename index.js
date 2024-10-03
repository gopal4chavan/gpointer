'use strict'

require('./environment')
require('./src/db')

const { logInfo } = require('./src/logger')
const { initSocket } = require('./src/socket');
const { roomRoutes, googleAuthRoutes } = require('./src/routes')
const { authenticateToken } = require("./src/middleware")
const { corsConfig } = require('./cors')
const { redisTokenBlackList } = require('./src/redis')
const { getAuthToken } = require('./src/helper/authHeader')

const express = require('express');
const http = require('http');
const path = require('path');


const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(corsConfig)

// Serve the static files for the client
app.use(express.static(path.join(__dirname, 'public')));

// room routes
app.use('/api', authenticateToken, roomRoutes)

app.use('/api', googleAuthRoutes)
app.use('/api/logout', authenticateToken, async (req, res) => {
  const token = getAuthToken(req)
  await redisTokenBlackList(token)
  return res.status(200).json({ message: 'Successfully logged out.' });
})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logInfo(`Server is running on http://localhost:${PORT}`);
});
