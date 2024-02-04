const userModel = require("../models/user_model");
const urlModel = require("../models/url_model")
const bcrypt = require("bcryptjs");
const { request } = require("express");
const jwt = require("jsonwebtoken");

exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.json({ message: "Student not found" });
    }

    const isPasswordValid = bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.json({ message: "Invalid password" });
    }
    
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      );
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });
      
      if (!token) {
      return res.json({ message:" Token generation failed" });
    }

    const authKeyInsertion = await userModel.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return res.json({ message: "Token updation failed" });
    }

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
