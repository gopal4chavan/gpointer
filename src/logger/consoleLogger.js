'use strict'

function logInfo() {
    console.log(...arguments)
}

function logError() {
    console.error(...arguments)
}

module.exports = {
    logInfo,
    logError
}
