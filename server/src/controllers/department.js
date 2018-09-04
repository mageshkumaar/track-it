const mongoose = require('mongoose')
const Department = require('../models/department')
const logger = require('../../../shared/logger')
const i18n = require('i18n')
const time = require('../utils/time')

const create = async (req, res) => {
  try {
    const currentTime = time.currentTime()
    let newDepartment = new Department({
      name: req.body.name,
      manager: req.body.manager,
      created_by: req.currentUser.id,
      created_at: currentTime,
      updated_at: currentTime
    })
    await newDepartment.save()
    const department = await Department.findById(newDepartment._id).populate('created_by', ['firstname', 'lastname', 'email']).populate('manager', ['firstname', 'lastname', 'email'])
    res.status(200).send(department)
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
      throw new Error('Category Id is an invalid object Id')
    }
    const department = await Department.findById(req.params.id).populate('created_by', ['firstname', 'lastname', 'email']).populate('manager', ['firstname', 'lastname', 'email'])
    return res.status(200).send(department)
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
