const express = require("express")

const { protect } = require("../middleWare/authMiddleWare");
const { senMessage, AllMessage } = require("../Controllers/MessageController");
const router = express.Router()

router.route('/').post(protect,senMessage)
router.route('/:chatId').get(protect,AllMessage)

module.exports = router;