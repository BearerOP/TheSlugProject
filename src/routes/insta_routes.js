const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");

const {
    reelOrPost_link_provider,
    story_link_provider
} = require("../controllers/insta_controller.js");

router.post("/reelOrPost",reelOrPost_link_provider);
router.post("/story", story_link_provider);

module.exports = router;