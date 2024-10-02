'use strict'

const express = require('express');
const router = express.Router();

const { addNewRoom } = require('../helper/redisMongo');

// Endpoint to create a room
router.post('/rooms', async (req, res) => {
    try {
        const roomId = await addNewRoom(req.body.name); // Use req.body for POST data
        res.status(201).json({ roomId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
});

module.exports = router;
