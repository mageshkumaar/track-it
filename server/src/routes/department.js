const express = require('express')
const departmentController = require('../controllers/department')
const router = express.Router()

router.post('/', departmentController.create)
router.get('/:id', departmentController.show)

module.exports = router
