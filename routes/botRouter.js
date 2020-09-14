const express = require('express')
const BotController = require('../controllers/botController')
const router = express.Router()

router.post('/', BotController.createResponse)

module.exports = router
