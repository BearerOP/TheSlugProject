const userModel = require("../models/user_model");
const urlModel = require("../models/url_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let ip_address = req.cookies.ip_address;
    // Check if the user exists in the database
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
    if (!token) {
      return res.json({ message: " Token generation failed" });
    }
    // Set the token to cookies
    res.cookie('token', token);
    const authKeyInsertion = await userModel.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return res.json({ message: "Token updation failed" });
    }

    const ip_address_user = await urlModel.find({ ip_address: ip_address });
    // Update the user field for each matching document
    const updatePromises = ip_address_user.map(async (document) => {
      document.user = existingUser._id;
      document.ip_address = null;
      return document.save();
    });

    // Wait for all updates to complete
    const updatedDocuments = await Promise.all(updatePromises);

    if (!updatedDocuments) {
      return res.json({ message: "User updation failed" });
    }
    console.log("loggedin");
    return {
      message: "User logged in successfully",
      success: true,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

exports.user_register = async (req, res) => {
  try {
    const { name, email, mobile, gender, password } = req.body;
    // console.log(req.body);
    // Check if the user already exists in the database
    const existingUser = await userModel.findOne({ email } || { mobile });
    if (existingUser) {
      return res.json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // If not, create a new user and save it to the database
    const newUser = await userModel.create({
      name,
      email,
      mobile,
      gender,
      password: hashedPassword,
    });

    if (newUser) {
      return {
        message: "User created successfully",
        success: true,
        newUser,
      };
    } else {
      return {
        message: "User creation failed",
        success: false,
        newUser: [],
      };
    }
  } catch (error) {
    console.log(error);
  }
};

exports.user_logout = async (req, res) => {
  let user = req.user;
  try {
    const currentUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      {auth_key: null }
    );
    res.clearCookie('token');
    if (currentUser) {
      return {
        success: true,
        message: "User logged out successfully",
      };
    } else {
      return {
        success: false,
        message: "User logout failed",
      };
    }
  } catch (error) {
    console.log(error);
  }
};
