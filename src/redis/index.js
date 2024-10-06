'use strict'

const Redis = require('ioredis');
const { logInfo, logError } = require('../logger')

const PARTICIPANTS = 'participants'
const MESSAGES = 'messages'
const ROOM = 'room'
const USER = 'user'

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
  redis.set(`${ROOM}:${roomId}`, JSON.stringify(value), 'EX', 3600); // Expires in 1 hour
}

const participantKey = (roomId) => {
  return `${PARTICIPANTS}:${roomId}`
}
const redisPushParticipants = async (roomId, participant) => {
  const key = participantKey(roomId)
  participant.socketId = //TODO get socket id
    await redis.sAdd(key, participant)
}

const redisGetParticipants = async (roomId) => {
  const key = participantKey(roomId)
  return await redis.sMembers(key)
}

const userKey = (userName) => {
  return `${USER}:${userName}`
}
const redisSetUserSocketId = async (userName, socketId) => {
  const key = userKey(userName)
  redis.set(key, socketId, 'EX', 3600)
}
const redisGetUserSocketId = async (userName, socketId) => {
  const key = userKey(userName)
  redis.get(key)
}

const redisGetRoom = async (roomId) => {
  const key = `${ROOM}:${roomId}`
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

const redisTokenBlackList = async (token) => {
  const expiration = process.env.BLACKLIST_TOKEN_EXPIRATION
  const key = `blacklist_token:${token}`
  await redis.setex(key, expiration, 'blackListed')
}

const redisIsTokenBlackListed = async (token) => {
  const key = `blacklist_token:${token}`
  const res = await redis.exists(key)
  return res === 1 // is 1 if exists, 0 if not
}

module.exports = {
  redisAddRoom,
  redisGetRoom,
  redisGetMessages,
  redisPushMessage,
  redisTokenBlackList,
  redisIsTokenBlackListed,
  redisPushParticipants,
  redisGetParticipants,
  redisSetUserSocketId,
  redisGetUserSocketId
}