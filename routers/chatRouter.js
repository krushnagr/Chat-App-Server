const express = require("express");
const { protect } = require("../middleWare/authMiddleWare");
const { fetchChats, accectChat, createGroup, renameGroup, addToGroup, removeFromGroup } = require("../Controllers/ChatController");


const router = express.Router();

router.route("/").post(protect, accectChat)
router.route("/").get(protect, fetchChats)
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;