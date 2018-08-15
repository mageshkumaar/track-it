const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const logger = require('../config/logger')
const i18n = require('../config/i18n')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const saltRounds = 10

// Request methods
const index = (req, res) => {
  User.find().then(doc => {
    return res.status(200).send(doc)
  }).catch(err => {
    logger.error(err)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  })
}

const create = async (req, res) => {
  try {
    const user = await User.find({
      email: req.body.email
    })
    if (user.length > 0) {
      return res.status(400).send({
        error: i18n.__('user.email.exists')
      })
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds)
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      _id: mongoose.Types.ObjectId(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: passwordHash
    })
    // Save the user in the database
    newUser.save().then(doc => {
      logger.info(`New user created with user Id ${doc._id}`)
      return res.status(200).send(doc)
    })
  } catch (err) {
    logger.error(err)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  }
}

const update = (req, res) => {
  User.findById(req.params.id).then(doc => {
    const updatedUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    }
    User.findByIdAndUpdate(req.params.id, updatedUser).then(user => {
      logger.info(`User with user Id: ${req.params.id} updated successfully`)
      return res.status(200).send(user)
    }).catch(err => {
      logger.error(err)
      return res.status(500).send({
        error: i18n.__('server.error')
      })
    })
  }).catch(err => {
    logger.error(err)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  })
}

const show = (req, res) => {
  User.findById(req.params.id).then(doc => {
    // findById returns null if the document is not found unlike find
    // which returns an empty collection if the document is not found
    if (doc === null) {
      return res.status(404).send({
        error: i18n.__('resource.notfound')
      })
    }

    return res.status(200).send(doc)
  })
}

const remove = (req, res) => {
  User.findByIdAndRemove(req.params.id).then(doc => {
    logger.info(`Deleted user ${req.params.id}`)
    res.status(200).send({
      message: i18n.__('user.delete.success')
    })
  }).catch(err => {
    logger.error(err)
    res.status(500).send({
      error: i18n.__('server.error')
    })
  })
}

const login = async (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user === null) { // User with the email is not found
      return res.status(401).send({
        error: i18n.__('user.login.fail')
      })
    }
    bcrypt.compare(req.body.password, user.password, (err, matches) => {
      if (err) {
        logger.error(err)
        return res.status(401).send({
          error: i18n.__('user.login.fail')
        })
      }
      if (!matches) { // Passwords don't match
        return res.status(401).send({
          error: i18n.__('user.login.fail')
        })
      }
      jwt.sign({
        id: user._id
      }, config.jwt.secret_key, config.jwt.options, (err, token) => {
        if (err) {
          logger.error(err)
          return res.status(401).send({
            error: i18n.__('user.login.fail')
          })
        }
        logger.info(`User with email ${user.email} logged in successfully`)
        return res.status(200).send({
          user: user,
          token: token
        })
      })
    })
  })
}

module.exports = {
  index,
  create,
  update,
  show,
  remove,
  login
}
