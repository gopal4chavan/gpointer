'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {type: String},
  isGoogleSSO: {type: Boolean}
})


let model = mongoose.model('User', UserSchema)
module.exports = model
