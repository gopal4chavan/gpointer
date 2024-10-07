'use strict'

const User = require('../models/users')

async function updateOrAddUser({ sub: googleUserId, name, email }) {
  try {
    let user = await User.findOne({ googleUserId })

    if (user) {
      user.name = name
      user.email = email
      user.isGoogleSignIn = true
      await user.save()
    } else {
      user = new User({
        googleUserId,
        name,
        email,
        isGoogleSignIn: true
      });
      await user.save()
    }
    return user
  } catch (error) {
    console.error('Error updating or adding user:', error)
    throw error
  }
}

async function getUser(userId) {
  try {
    let user = await User.findOne({ _id: userId })
    return user
  } catch (error) {
    console.error('Error updating or adding user:', error)
    throw error
  }

}

module.exports = {
  updateOrAddUser,
  getUser
}
