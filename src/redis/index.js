'use strict'

const Redis = require('ioredis');
const {logInfo, logError} = require('../logger')

// Configure Redis
// const redis = new Redis(process.env.REDIS_URL); // Use your Redis URL from .env
const redis = new Redis()
redis.on('connect', () => {
  logInfo('Connected to Redis');
});
redis.on('error', (err) => {
  logError('Redis connection error:', err);
});

const redisAddRoom = (roomId, value) => {
  // Store room in Redis (if needed)
  redis.set(`room:${roomId}`, JSON.stringify(value), 'EX', 3600); // Expires in 1 hour
}

const redisGetRoom = async (roomId) => {
  const key = `room:${roomId}`
  return await redis.get(key)
}

const redisPushMessage = async (roomId, message) => {
  // Optionally store messages in Redis (e.g., in a list)
  const messagesKey = `messages:${roomId}`;
  await redis.rpush(messagesKey, message); // Push the message to a Redis list    
}

const redisGetMessages = async (roomId) => {
  // Retrieve historical messages from Redis
  const messagesKey = `messages:${roomId}`;
  const messages = await redis.lrange(messagesKey, 0, -1); // Get all messages
  return messages
}

module.exports = {
  redisAddRoom,
  redisGetRoom,
  redisGetMessages,
  redisPushMessage
}