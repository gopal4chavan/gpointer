const cors = require('cors');

// CORS configuration
const corsOptions = {
    origin: `http://${process.env.UI_HOST}:${process.env.UI_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true
};

const corsConfig = cors(corsOptions)
module.exports = {
    corsConfig
}