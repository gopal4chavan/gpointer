'use strict'

const { logInfo } = require('../logger')
const { redisGetRoom, redisAddRoom } = require('../redis')
const { getRoomById, updateRoom, createRoom } = require('../services/roomService')
const { Participant } = require('../models/participants')

async function getRoom(roomId) {
  let room = await redisGetRoom(roomId)
  if (room) return JSON.parse(room) || []

  logInfo('redis miss roomHit', roomId)
  room = await getRoomById(roomId)
  redisAddRoom(roomId, room)
  if (room) return room
}
// we want to keep this async, as this are update operations
// And we don't want to block the user, till the records are updated
function updateRoomDetails(roomId, roomDetails) {
  redisAddRoom(roomId, roomDetails)
  updateRoom(roomId, roomDetails)
}

async function addNewRoom(roomName, user) {
  const room = await createRoom(roomName, user.id)
  return room
}

async function asyncUpdateParticipantAndRedis(room, user) {
  const newParticipantData = {
    name: user.name,
    status: 'active',
    score: 0,
    type: 'player',
    roomId: room._id
  };
  const participant = Participant.createParticipant(newParticipantData)
  room.participant = [participant]
  redisAddRoom(roomId, room)
}

module.exports = {
  getRoom,
  updateRoomDetails,
  addNewRoom,
  asyncUpdateParticipantAndRedis
}
