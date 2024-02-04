const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth.js");

const {
  url_shorten,
  url_redirection,
  show_urls
} = require("../controllers/url_controller.js");

router.post("/url_shorten", user_auth, url_shorten);

router.get("/:shortURL", url_redirection);

router.post("/show_urls",user_auth,show_urls)

module.exports = router;
