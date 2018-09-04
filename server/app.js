const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('../shared/logger')
const config = require('../config/config')
const authRouter = require('./src/routes/auth')
const userRouter = require('./src/routes/user')
const manufacturerRouter = require('./src/routes/manufacturer')
const categoryRouter = require('./src/routes/category')
const departmentRouter = require('./src/routes/department')
const authMiddleware = require('./src/middlewares/auth')

// Starting up the database
mongoose.connect(config.database.uri, config.database.options, (err) => {
  if (err) {
    logger.error(err.stack)
  } else {
    logger.info(`Connected to database`)
  }
})

// Configuring cors
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === config.app.url.frontend || origin === config.app.url.backend) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed by CORS'))
    }
  }
}

// Configuration of the server
const app = express()
app.use(express.json())
app.use(cors(corsOptions))
app.use(authMiddleware)

// Configuration of the routes
app.use(authRouter)
app.use('/users', userRouter)
app.use('/manufacturers', manufacturerRouter)
app.use('/categories', categoryRouter)
app.use('/departments', departmentRouter)

// Starting the server
app.listen(config.app.port.backend, () => {
  logger.info(`Server started on port ${config.app.port.backend}`)
})

module.exports = app
