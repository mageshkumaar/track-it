const express = require('express')
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const router = express.Router()

// Routes for login
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/register', userController.create)
module.exports = router
