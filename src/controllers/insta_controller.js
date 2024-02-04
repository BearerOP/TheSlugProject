const { download_link_provider } = require("../services/insta_service.js")

exports.download_link_provider = async (req, res) => {
    try {
        const data = await download_link_provider(req, res);
        if (data.success) {
            res.status(200).json(data.data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}