const {
  user_login,
  user_register,
  user_logout
} = require("../services/user_validation_service.js");

const {
  google_login,
} = require("../services/google_validation_sevice.js")

exports.google_login = async (req, res) => {
  try {
    const data = await google_login(req, res);
    if (data.success) {
      res.status(200).json(data);
    }else{
      res.status(403).json(data);
  }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.user_login = async (req, res) => {
  try {
    const data = await user_login(req, res);
    if (data.success) {
      res.status(200).json(data);
    }else{
        res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.user_register = async (req, res) => {
  try {
    const data = await user_register(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
    else{
        res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.user_logout = async (req, res) => {
  try {
    const data = await user_logout(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
