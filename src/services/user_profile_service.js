const userModel = require("../models/user_model");
const urlModel = require("../models/url_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.view_profile = async (req, res) => {
  let user = req.user;
  try {
    return {
      success: true,
      user,
    };
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.change_password = async (req, res) => {
  let user = req.user;
  let old_password = req.body.old_password;
  let new_password = req.body.new_password;
  try {
    const existingUser = await userModel.findById({ _id: user._id });
    console.log(existingUser);
    const isPasswordValid = bcrypt.compare(old_password, existingUser.password);

    if (!isPasswordValid) {
      return res.json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    existingUser.password = hashedPassword;
    let savedUser = await existingUser.save();
    if (savedUser) {
      return {
        success: true,
        message: "Password Changed successfully",
      };
    } else {
      return {
        success: false,
        message: "Password changing failed !",
      };
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
