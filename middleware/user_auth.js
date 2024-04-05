require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../src/models/user_model");

// Middleware for handling auth
async function user_auth(req, res, next) {
  // Implement user auth logic
  console.log(req.headers['cf-connecting-ip'],"auth");
  const ip_address = req.headers['cf-connecting-ip'];
  const token = req.cookies.token;
  console.log(ip_address,token,"auth");
  try {
    if (!token) {
      req.ip_address = ip_address;
      next();
    } else {
      const jwtPassword = process.env.SECRET_KEY;
      const decode = jwt.verify(token, jwtPassword);
      // console.log(decode.id);
      let user = await userModel
        .findOne({ _id: decode.id })
        .select("-password -auth_key -access_token")
        .exec();
      console.log("auth user",user);
      // if (!user) return res.status(403).json({ msg: "User not found" });
      req.user = user;
      req.ip_address = ip_address;
      next();
    }
  } catch (err) {
    if (ip_address != null) {
      // req.user = null;
      req.ip_address = ip_address;
      next();
    }
    console.log(err);
  }
}

module.exports = user_auth;
