'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParticipantSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'not active'], required: true },
  score: { type: Number, default: 0 },
  type: { type: String, enum: ['observer', 'player'], required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
})

const model = mongoose.model('Participant', ParticipantSchema)
module.exports = model
