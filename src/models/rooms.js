'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


let model = mongoose.model('Room', RoomSchema)
module.exports = model
