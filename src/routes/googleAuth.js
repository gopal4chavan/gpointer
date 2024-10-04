'use strict'

const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { updateOrAddUser } = require('../services/userService')

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await verify(token);
    const user = await updateOrAddUser(payload)
    // Check if the user exists in your database
    // If not, create a new user
    const userId = user._id

    // Create a JWT token
    const jwtToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}


module.exports = router;
