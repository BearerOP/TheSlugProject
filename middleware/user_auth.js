require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../src/models/user_model");

// Middleware for handling auth
async function user_auth(req, res, next) {
  // Implement user auth logic
  const ip_address = req.body.ip_address;
  try {
    // const token = req.headers["token"];
    // console.log(token);
    // const tokenHead = req.headers['token'];
    // const token = tokenHead.split(" ")[1];

    const jwtPassword = process.env.SECRET_KEY;
    const decode = jwt.verify(token, jwtPassword);
    // console.log(decode.id);
    let user = await userModel
      .findOne({ _id: decode.id })
      .select("-password -auth_key")
      .exec();
    // if (!user) return res.status(403).json({ msg: "User not found" });
    req.user = user;
    req.ip_address = ip_address;
    next();
  } catch (err) {
    req.user = null;
    req.ip_address = ip_address;
    next();
  }
}

module.exports = user_auth;
