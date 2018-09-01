const express = require('express')
const manufacturerController = require('../controllers/manufacturer')
const router = express.Router()

router.post('/', manufacturerController.create)
router.get('/:id', manufacturerController.show)

module.exports = router
