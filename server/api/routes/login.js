const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

// Routes for user module
router.post('/login', userController.login)

module.exports = router
