const express = require('express')
const {getOneUser, getAllUserExceptCurrent} = require('../controllers/user')
const {protect} = require("../middleware/auth");

const router = express.Router()


router.route('/:id').get(protect, getOneUser)
router.route('/except/:id').get(protect, getAllUserExceptCurrent)


module.exports = router