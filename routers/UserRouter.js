const express = require("express");
const {registerUser, authUser, getAllUsers} = require("../Controllers/UsersController");
const { protect } = require("../middleWare/authMiddleWare");
// const authUser = require("../Controllers/UsersController");

const router = express.Router();

router.route("/").post(registerUser).get(protect,getAllUsers);
router.post("/login", authUser);


module.exports = router;