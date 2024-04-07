const userModel = require("../models/user_model");
const urlModel = require("../models/url_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip_address = req.headers["cf-connecting-ip"];
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
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
    });

    // res.cookie('token', token, { partitioned: true });

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
    const profile_picture =
      "https://firebasestorage.googleapis.com/v0/b/theslugproject-bca3f.appspot.com/o/Frontend%2F7309681.jpg?alt=media&token=063a4cbc-dbfb-408f-9802-fc3aab1b9e8e";
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
      profile_picture,
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
      { auth_key: null }
    );
    res.clearCookie("token");
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

exports.email_verify = async (req, res) => {
  try {
    const { email } = req.body;

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log(otp);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, secure: false,
      auth: {
        user: `${process.env.Slug_Project_Gmail_User}`,
        pass: `${process.env.Slug_Project_Gmail_Pass}`,
      },
    });
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"The Slug Project Team" <${process.env.Slug_Project_Gmail_User}>`,
        to: `${email}`,
        subject: "OTP for email verification",
        text: "",
        html: `<body style="font-family: Arial, sans-serif;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
            <p style="font-size: 16px;">Dear User,</p>
            <p style="font-size: 16px;">You have requested a One-Time Password (OTP) verify your email. Please use the following OTP:</p>
            <div style="padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">
                <strong>OTP:</strong> <span style="font-weight: bold; color: #333;"> ${otp}</span>
            </div>
            <p style="font-size: 16px;">This OTP is valid for a single use and should not be shared with anyone.</p>
            <p style="font-size: 16px;">If you did not request this OTP, please disregard this email.</p>
            <p style="font-size: 16px;">Best regards,<br>The Slug Project Team.</p>
        </div></body>`,
      });

      console.log("Message sent: %s", info.messageId);
    }

    // main().catch(console.error);

    return {
      success: true,
      message: "OTP sent successfully",
      otp,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "OTP sending failed",
    };
  }
};
