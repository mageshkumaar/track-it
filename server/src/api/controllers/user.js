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
    await newUser.save()
    logger.info(`New user created with user Id ${newUser._id}`)
    return res.status(200).send(newUser)
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

const show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // findById returns null if the document is not found unlike find
    // which returns an empty collection if the document is not found
    if (user === null) {
      return res.status(404).send({
        error: i18n.__('resource.notfound')
      })
    }
    return res.status(200).send(user)
  } catch (e) {
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  }
}

const remove = (req, res) => {
  User.findByIdAndRemove(req.params.id).then(doc => {
    if (doc === null) {
      return res.status(404).send({
        error: i18n.__('resource.notfound')
      })
    }
    logger.info(`Deleted user ${req.params.id}`)
    return res.status(200).send({
      message: i18n.__('user.delete.success')
    })
  }).catch(err => {
    logger.error(err)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  })
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    })
    if (user === null) {
      throw new Error('User with the email not found')
    }
    const matches = await bcrypt.compare(req.body.password, user.password)
    if (!matches) {
      throw new Error('Passwords don\'t match')
    } else {
      jwt.sign({
        id: user._id
      }, config.jwt.secret_key, config.jwt.options, (err, token) => {
        if (err) { throw new Error(err) }
        logger.info(`User with email ${user.email} logged in successfully`)
        return res.status(200).send({
          user: user,
          token: token
        })
      })
    }
  } catch (e) {
    logger.error(e)
    return res.status(401).send({
      error: i18n.__('user.login.fail')
    })
  }
}

module.exports = {
  index,
  create,
  update,
  show,
  remove,
  login
}
