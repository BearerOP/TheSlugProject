const express = require("express");
const router = express.Router();

const {
  user_login,
  user_register,
} = require("../controllers/user_controller.js");

router.post("/login", user_login);

router.post("/register", user_register);

module.exports = router;
