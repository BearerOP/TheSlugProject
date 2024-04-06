const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  user_login,
  user_register,
  user_logout,
  email_verify
} = require("../controllers/user_controller.js");

router.post("/login", user_login);

router.post("/register", user_register);

router.post("/email_verify",email_verify);

router.post("/logout",user_auth,user_logout)

module.exports = router;
