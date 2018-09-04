const User = require('../models/user')
const i18n = require('i18n')
const logger = require('../../../shared/logger')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const time = require('../utils/time')

const bcryptSaltRounds = 10

const create = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    })
    if (user && user.email) {
      return res.status(409).send({
        error: i18n.__('user.already.exists')
      })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, bcryptSaltRounds)
    const currentTime = time.currentTime()
    let newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      created_at: currentTime,
      updated_at: currentTime
    })
    newUser = await newUser.save()
    return res.status(200).send(newUser)
  } catch (e) {
    logger.error(e.stack)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  }
}

const show = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error('User Id is an invalid object Id')
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send({
        error: i18n.__('resource.not.found')
      })
    }
    return res.status(200).send(user)
  } catch (e) {
    logger.error(e.stack)
    return res.status(500).send({
      error: i18n.__('server.error')
    })
  }
}

module.exports = {
  create,
  show
}
