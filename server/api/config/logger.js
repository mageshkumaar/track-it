const fs = require('fs')
const winston = require('winston')

// Log folder where the logs will be written
// It's been made to write outside the app directory
const logFolder = `${__dirname}/../../../logs`

// Create the logs folder if it doesn't exist
// We're doing this synchronously
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder)
}

// Configure the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: `${logFolder}/app.log` })
  ]
})

module.exports = logger
