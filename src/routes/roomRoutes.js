'use strict'

const express = require('express');
const router = express.Router();

const { addNewRoom } = require('../helper/redisMongo');

// Endpoint to create a room
router.post('/rooms', async (req, res) => {
    const roomName = req.body.name
    const host = req.user._id
    try {
        const roomId = await addNewRoom(roomName, host); // Use req.body for POST data
        res.status(201).json({ roomId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
});

module.exports = router;
