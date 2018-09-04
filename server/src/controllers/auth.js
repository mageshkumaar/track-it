const User = require('../models/user')
const i18n = require('../utils/i18n')
const bcrypt = require('bcrypt')
const logger = require('../../../shared/logger')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config')

const login = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email
    })
    if (!user) {
      throw new Error(`User with email ${req.body.email} not found`)
    }
    const matches = await bcrypt.compare(req.body.password, user.password)
    if (!matches) {
      throw new Error(`Passwords do not match for ${req.body.email}`)
    }
    // Create a new token
    const token = jwt.sign({
      id: user._id
    }, config.jwt.secret_key, config.jwt.options)
    logger.info(`${user.email} logged in successfully`)
    res.status(200).send({
      user: user,
      token: token
    })
  } catch (e) {
    logger.error(e)
    res.status(404).send({
      error: i18n.__('user.login.failed')
    })
  }
}

const logout = async (req, res) => {
  try {
    // Must implement some way of handling logout
    // based on stack overflow answer
    // https://stackoverflow.com/a/23089839/5284492
    logger.info(`${req.currentUser.email} logged out successfully`)
    res.status(200).send({
      message: i18n.__('user.logout.success')
    })
  } catch (e) {
    logger.error(e)
    res.status(500).send({
      error: i18n.__('user.logout.failed')
    })
  }
}

module.exports = {
  login,
  logout
}
