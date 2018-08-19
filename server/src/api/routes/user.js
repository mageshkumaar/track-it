const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

// Routes for user module
router.get('/', userController.index)
router.post('/', userController.create)
router.get('/:id', userController.show)
router.put('/:id', userController.update)
router.delete('/:id', userController.remove)

module.exports = router
