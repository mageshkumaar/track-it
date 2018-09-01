const mongoose = require('mongoose')
const Category = require('../models/category')
const logger = require('../../../shared/logger')
const i18n = require('i18n')

const create = async (req, res) => {
  try {
    const currentUserId = req.currentUser.id
    const currentTime = new Date(Date.now()).toISOString()
    let newCategory = new Category({
      name: req.body.name,
      created_by: currentUserId,
      created_at: currentTime,
      updated_at: currentTime
    })
    await newCategory.save()
    const category = await Category.findById(newCategory._id).populate('created_by', ['firstname', 'lastname', 'email'])
    res.status(200).send(category)
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
    const category = await Category.findById(req.params.id).populate('created_by', ['firstname', 'lastname', 'email'])
    return res.status(200).send(category)
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
