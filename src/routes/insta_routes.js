const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");

const {
    download_link_provider
} = require("../controllers/insta_controller.js");

router.post("/download", download_link_provider);

module.exports = router;
