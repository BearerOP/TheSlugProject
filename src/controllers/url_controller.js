const { url_shorten, url_redirection, show_urls } = require("../services/url_service.js");

exports.url_shorten = async (req, res) => {
  try {
    const data = await url_shorten(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.url_redirection = async (req, res) => {
  try {
    const data = await url_redirection(req, res);
    if (data.success) {
      res.status(200).redirect(`${data.redirectURL}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.show_urls = async (req, res) => {
  try {
    const data = await show_urls(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}