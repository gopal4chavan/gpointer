'use strict';

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const { redisIsTokenBlackListed } = require('../../redis');
const { getAuthToken } = require('../../helper/authHeader')
const { getUser } = require('../../services/userService')

// Middleware to validate JWT
async function authenticateToken(req, res, next) {
  const token = getAuthToken(req)

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  try {
    // Check if the token is blacklisted
    if (await redisIsTokenBlackListed(token)) {
      return res.sendStatus(403); // Forbidden if token is blacklisted
    }
  } catch (error) {
    console.error('Error checking blacklist:', error);
    return res.sendStatus(500); // Internal Server Error
  }

  jwt.verify(token, secret, async (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    req.userId = user.id; // Attach the user info to the request object
    req.user = await getUser(req.userId)
    next(); // Proceed to the next middleware/route handler
  });
}

module.exports.authenticateToken = authenticateToken;
