'use strict'

const { logInfo } = require('../logger')
const {redisGetRoom, redisAddRoom} = require('../redis')
const {getRoomById, updateRoom, createRoom} = require('../services/roomService')

async function getRoom(roomId) {
    let room = await redisGetRoom(roomId)
    if(room) return JSON.parse(room) || []

    logInfo('redis miss roomHit', roomId)
    room = await getRoomById(roomId)
    redisAddRoom(roomId, room)
    if(room) return room
}
// we want to keep this async, as this are update operations
// And we don't want to block the user, till the records are updated
function updateRoomDetails(roomId, roomDetails) {
    redisAddRoom(roomId, roomDetails)
    updateRoom(roomId, roomDetails)
}

async function addNewRoom(name='testRoom') {
    const room = await createRoom(name)
    updateRoom(room._id, room)
    return room.id
}

module.exports = {
    getRoom,
    updateRoomDetails,
    addNewRoom
}
