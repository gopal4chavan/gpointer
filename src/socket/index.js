'use strict'

const socketIo = require('socket.io')
const { logInfo } = require('../logger')
const { roomEvents } = require('./roomEvents')
const { getRoom, updateRoomDetails } = require('../helper/redisMongo')

let io

const initSocket = (server) => {
  if (!io) {
    io = socketIo(server)
    io.on('connection', socket => connectionHandler(socket))
    logInfo('Socket initialized')
  } else {
    logInfo('Socket already initialized')
  }
};

const getIOInstance = () => {
  return io
};

const connectionHandler = (socket) => {
  logInfo('A User Connected')

  socket.on(roomEvents.REGISTER_USER, (userName, socket) => registerUser(userName, socket))
  socket.on(roomEvents.JOIN_ROOM, roomId => joinRoomHandler(roomId, socket))
  socket.on(roomEvents.MESSAGE, (roomId, message) => messageHandler(roomId, message, socket))
  socket.on(roomEvents.DISCONNECT, () => disconnectHandler(socket))
}

const registerUser = (userName, socket) => {
  if (!username) {
    socket.emit('error', 'Username is required.');
    return;
  }

  // Store socket.id with the username in Redis
  redis.hset(`user:${username}`, 'socketId', socket.id, (err, reply) => {
    if (err) {
      socket.emit('error', 'Error storing user data.');
      return;
    }
    socket.emit('registrationSuccess', `User ${username} registered with socket ID: ${socket.id}`);
  });
}

const joinRoomHandler = async (roomId, socket) => {
  const room = await getRoom(roomId)
  if (room) {
    socket.join(roomId)

    const participants = room.participants || [];
    if (!participants.includes(socket.id)) {
      participants.push(socket.id)
      room.participants = participants

      await updateRoomDetails(roomId, room)
      io.to(roomId).emit('participants', participants);
    }

    socket.to(roomId).emit('message', `${socket.id} has joined the room.`);
  }
};

const messageHandler = (roomId, message, socket) => {
  socket.to(roomId).emit('message', message)
  // Here you should add logic to save the message if needed
};

const disconnectHandler = (socket) => {
  logInfo(`User disconnected: ${socket.id}`)
  // Optionally handle removal from participants, etc.
};

module.exports = {
  initSocket,
  getIOInstance // Export the function to get the socket instance
}
