const express = require('express')
const {protect} = require("../middleware/auth");

const { saveMessage, getMessage } = require('../controllers/message')

const router = express.Router()

router.route('/:id').put(protect, saveMessage)
router.route('/get/').get(protect, getMessage)

module.exports = router