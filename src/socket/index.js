'use strict'

const socketIo = require('socket.io');
const { logInfo } = require('../logger')
const { roomEvents } = require('./roomEvents')
const { getRoom, updateRoomDetails } = require('../helper/redisMongo')

const initSocket = (() => {
  let io
  return (server) => {
    if (!io) {
      const io = socketIo(server);
      io.on('connection', socket => connectionHandler(socket, io))
      logInfo('Socket initialized')
    } else {
      logInfo('Socket already initialized')
    }
  }
})()

const connectionHandler = (socket, io) => {
  logInfo('A User Connected')
  socket.on(roomEvents.JOIN_ROOM, roomId => joinRoomHandler(roomId, socket, io))
  socket.on(roomEvents.MESSAGE, (roomId, message) => messageHandler(roomId, message, socket, io))
  socket.on(roomEvents.DISCONNECT, disconnectHandler)
}

const joinRoomHandler = async (roomId, socket, io) => {
  const room = await getRoom(roomId)
  if (room) {
    socket.join(roomId)

    const participants = room.participants
    participants.push(socket.id);

    // Update participants in both in-memory and Redis
    updateRoomDetails(roomId, roomDetails)

    socket.to(roomId).emit('message', `${socket.id} has joined the room.`);

    // Send current participants to all users
    io.to(roomId).emit('participants', participants);

    // const messages = await redisUtil.getMessages(roomId)

    // // Emit historical messages to the joining user
    // socket.emit('historicalMessages', messages);
  }
}

const messageHandler = (roomId, message, socket, io) => {
  socket.to(roomId).emit('message', message);
  redisUtil.pushMessage(roomId, message)
}

const disconnectHandler = () => {
  logInfo('A user disconnected')
}

module.exports = {
  initSocket
}
