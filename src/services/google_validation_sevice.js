const userModel = require("../models/user_model");
const urlModel = require("../models/url_model");


exports.google_login = async(req,res)=>{
    try {
        const { email, access_token, ip_address, name, profile_picture } = req.body;
    } catch (error) {
        console.log("Error:", error );
    }
}