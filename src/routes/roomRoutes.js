'use strict'

const express = require('express');
const router = express.Router();

const { redisPushParticipants, redisGetUserSocketId } = require('../redis');
const { createRoom } = require('../services/roomService')
const Participant = require('../models/participants')
const { getIOInstance } = require('../socket')

// Endpoint to create a room
router.post('/rooms', async (req, res) => {
  const roomName = req.body.name
  const host = req.user._id
  try {
    const room = await createRoom(roomName, host)
    const newParticipantData = {
      name: user.name,
      status: 'active',
      score: 0,
      type: 'player',
      roomId: room._id
    };
    Participant.createParticipant(newParticipantData).then(async participant => {
      redisPushParticipants(room._id, participant)
      const socketId = await redisGetUserSocketId(req.user.name)
      const io = getIOInstance()
      const socket = io.sockets.sockets.get(socketId);
      io.to(socket).emit('registerUser')
    }).catch((error) => {
      // Handle any errors that occur during participant creation
      console.error('Error creating participant:', error);
    });

    redisPushParticipants(room._id, participant)

    res.status(201).json({ roomId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

module.exports = router;
