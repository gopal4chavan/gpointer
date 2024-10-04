'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String },
  isGoogleSignIn: { type: Boolean },
  email: { type: String },
  googleUserId: { type: String }
})


let model = mongoose.model('User', UserSchema)
module.exports = model
