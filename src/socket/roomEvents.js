'use strict'

const roomEvents = {
    JOIN_ROOM: 'joinRoom',
    MESSAGE: 'message',
    DISCONNECT: 'disconnect',
    REGISTER_USER: 'registerUser'
}
const roomEventsList = Object.values(roomEvents)

module.exports = {
    roomEvents,
    roomEventsList
}