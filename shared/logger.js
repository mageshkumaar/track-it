const fs = require('fs')
const winston = require('winston')
const config = require('../config/config')

// Log folder where the logs will be written
// It's been made to write outside the app directory
const logsFolder = `${__dirname}/../logs`

// Create the logs folder if it doesn't exist `synchronously`
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder)
}

// Configure the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: `${logsFolder}/${config.logs.file_name}` })
  ]
})

module.exports = logger
