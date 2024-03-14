const { view_profile,change_password } = require("../services/user_profile_service.js");

exports.view_profile = async (req, res) => {
    try {
        const data = await view_profile(req, res);
        if (data.success) {
            res.status(200).json(data);
        }else{
            res.status(403).json(data);
          }
    } catch (error) {
        console.log("Error:", error);
    }
}

exports.change_password = async (req, res) => {
    try {
        const data = await change_password(req, res);
        if (data.success) {
            res.status(200).json(data);
        }else{
            res.status(403).json(data);
          }
    } catch (error) {
        console.log("Error:", error);
    }
}