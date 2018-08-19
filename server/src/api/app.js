const express = require('express')
const mongoose = require('mongoose')
const config = require('../../config/config')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const logger = require('../utils/logger')

// Starting up the database
mongoose.connect(config.database.uri, config.database.options, (err) => {
  if (err) {
    logger.error(err)
  }
})

// Setting up the express server
const app = express()
app.use(express.json())

// Establishing the routes
app.use('/users', userRouter)
app.use(loginRouter)

// Starting up the server
app.listen(config.app.port, () => {
  logger.info(`Starting the server on ${config.app.port}`)
})

module.exports = app
