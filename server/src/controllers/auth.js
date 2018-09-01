const User = require('../models/user')
const i18n = require('../utils/i18n')
const bcrypt = require('bcrypt')
const logger = require('../../../shared/logger')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config')

// Maximum number of tokens that can be saved
// If this is set to -1, unlimited tokens
// can be saved.
const maxTokenCount = 10

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
    // Check whether maximum number of login tokens that can be
    // generated has been reached
    if (maxTokenCount !== -1 && user.token.length === maxTokenCount) {
      throw new Error(`Max token count has been reached for user - ${req.body.email}`)
    }
    // Create a new token
    const token = jwt.sign({
      id: user._id
    }, config.jwt.secret_key, config.jwt.options)
    // Save the newly generated token in the database
    user.token.push(token)
    await user.save()
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
    const token = req.headers.authorization.split(' ')[1]
    let currentUser = await User.findById({
      _id: req.currentUser.id
    })
    // Remove the token from the database
    currentUser.token.remove(token)
    await currentUser.save()
    logger.info(`${currentUser.email} logged out successfully`)
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
