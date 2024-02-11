const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      // require: true,
    },
    auth_key: {
      type: String,
      default: null,
    },
    access_token:{
      type: String,
      default: null,
    },
    profile_picture :{
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
