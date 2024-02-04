const {
  user_login,
  user_register,
} = require("../services/user_validation_service.js");

exports.user_login = async (req, res) => {
  try {
    const data = await user_login(req, res);
    if (data.success) {
      res.status(200).json(data);
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
  } catch (error) {
    console.log("Error:", error);
  }
};
