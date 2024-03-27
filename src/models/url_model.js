const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "user",
    },
    ip_address:{
      type: String,
      default: null,
    },
    url_logo:{
      type: String,
      default: "",
    },
    url_qr:{
      type: String,
      default: "",
    },
    shortURL: {
      type: String,
      unique: true,
    },
    redirectURL: {
      type: String,
    },
    clicks:{
      type: Number,
      default: 0
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("url", urlSchema);