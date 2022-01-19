const express = require('express')

const {protect} = require("../middleware/auth");
const {suggestionList, requestFriends, requestList, acceptFriends, friendList} = require('../controllers/userChat')

const router = express.Router()

router.route('/suggestionList/:id').get(protect, suggestionList)
router.route('/sendRequest/:id').put(protect, requestFriends)
router.route('/requestList/:id').get(protect, requestList)
router.route('/acceptFriends/:id').put(protect, acceptFriends)
router.route('/:id').get(protect, friendList)



module.exports = router