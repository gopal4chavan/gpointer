'use strict'

const mongoose = require('mongoose')


function getConnectionUrl() {
  const BASE_URL = process.env.DB_BASE_URL
  const USER = process.env.DB_USERNAME
  const PASSWORD = process.env.DB_PASSWORD
  const HOST = process.env.DB_HOSTS
  const DATABASE = process.env.DB_DATABASE

  const connectionUrl = `${BASE_URL}${USER}:${PASSWORD}@${HOST}/${DATABASE}`
  return connectionUrl
}

function getConnectionOptions() {
  const maxPoolSize = 1
  const serverSelectionTimeoutMS = 300000
  const connectTimeoutMS = 30000

  return {
    maxPoolSize,
    serverSelectionTimeoutMS,
    connectTimeoutMS
  }
}

function connectToDB() {
  // if connection is already initialise just return, need not create a connection again
  // 0 - Disconnected:    The connection is not established.
  // 1 - Connected:       The connection is established and ready to be used.
  // 2 - Connecting:      The connection is in the process of being established.
  // 3 - Disconnecting:T  he connection is in the process of being closed.
  if (mongoose.connection.readyState === 1) return

  const connectionUrl = getConnectionUrl()
  const connectionOptions = getConnectionOptions()

  mongoose.connect(connectionUrl, connectionOptions)
}

async function closeConnection() {
  await connection.close()
}


module.exports = {
  connectToDB,
  closeConnection
}
