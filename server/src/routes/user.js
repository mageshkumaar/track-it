const express = require('express')
const userController = require('../controllers/user')
const router = express.Router()

// Routes for user module
// Create user does not exist in this controller and is
// available in the auth controller
router.get('/:id', userController.show)

module.exports = router
