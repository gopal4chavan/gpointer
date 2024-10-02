'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
  name: {type: String},
  participants: [{ type: String }]
})


let model = mongoose.model('Room', RoomSchema)
module.exports = model
