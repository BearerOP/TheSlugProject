const express = require("express")
const router = express.Router()
const user_auth = require("../../middleware/user_auth.js");

const { view_profile,change_password } = require("../controllers/user_profile_controller.js");

router.post("/view_profile", user_auth, view_profile);
router.post("/change_password", user_auth, change_password);

module.exports = router