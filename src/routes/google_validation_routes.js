const express = require("express");
const router = express.Router();

const {
  google_login,

} = require("../controllers/user_controller.js");

router.post("/google_login", google_login);

module.exports = router;
