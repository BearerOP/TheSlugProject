const { 
    reelOrPost_link_provider,
    story_link_provider
 } = require("../services/insta_service.js")

exports.reelOrPost_link_provider = async (req, res) => {
    try {
        const data = await reelOrPost_link_provider(req, res);
        if (data.success) {
            res.status(200).json(data.data);
        }else{
            res.status(403).json(data.data);
        }
    } catch (error) {
        res.status(403).json(data.data);
    }
}
exports.story_link_provider = async (req, res) => {
    try {
        const data = await story_link_provider(req, res);
        if (data.success) {
            res.status(200).json(data);
        }else{
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("hi");
        res.status(403).json(data.data);
    }
}