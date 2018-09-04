const mongoose = require('mongoose')
const Manufacturer = require('../models/manufacturer')
const logger = require('../../../shared/logger')
const i18n = require('i18n')
const time = require('../utils/time')

const create = async (req, res) => {
  try {
    const currentTime = time.currentTime()
    let newManufacturer = new Manufacturer({
      name: req.body.name,
      website: req.body.website,
      created_by: req.currentUser.id,
      created_at: currentTime,
      updated_at: currentTime
    })
    if (req.body.support) {
      newManufacturer.support.website = req.body.support.website
      newManufacturer.support.email = req.body.support.email
      newManufacturer.support.phone = req.body.support.phone
    }
    await newManufacturer.save()
    const manufacturer = await Manufacturer.findById(newManufacturer._id).populate('created_by', ['firstname', 'lastname', 'email'])
    res.status(200).send(manufacturer)
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
      throw new Error('Manufacturer Id is an invalid object Id')
    }
    const manufacturer = await Manufacturer.findById(req.params.id).populate('created_by', ['firstname', 'lastname', 'email'])
    return res.status(200).send(manufacturer)
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
