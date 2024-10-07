'use strict';

const express = require('express');
const router = express.Router();
const { redisPushParticipants, redisGetUserSocketId } = require('../redis');
const { createRoom } = require('../services/roomService')
const Participant = require('../models/participants')
const { getIOInstance } = require('../socket')

// Endpoint to create a room
router.post('/rooms', async (req, res) => {
  const roomName = req.body.roomName
  const host = req.userId

  try {
    const room = await createRoom(roomName, host)

    const newParticipantData = {
      name: req.user.name,
      status: 'active',
      score: 0,
      type: 'player',
      roomId: room._id,
    }

    // Create participant in the background
    Participant.createParticipant(newParticipantData)
      .then(async (participant) => {
        // Get user socket ID and emit event in the background
        const socketId = await redisGetUserSocketId(req.user.name);
        const io = getIOInstance();
        const socket = io.sockets.sockets.get(socketId);

        if (socket) {
          socket.emit('joinRoom', room._id)
        } else {
          console.warn('Socket not found for user:', req.user.name);
        }
      })
      .catch((error) => {
        console.error('Error creating participant:', error);
        // You can choose to log the error without affecting the response
      });

    // Respond immediately with the room ID
    res.status(201).json({ roomId: room._id });
  } catch (error) {
    console.error('Failed to create room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

module.exports = router;
