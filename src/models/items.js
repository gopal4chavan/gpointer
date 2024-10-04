'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  estimatedPoint: { type: Number, required: true },
  order: { type: Number, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
});

const model = mongoose.model('Item', ItemSchema)
module.exports = model
