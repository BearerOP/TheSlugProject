const axios = require("axios");

exports.reelOrPost_link_provider = async (req, res) => {
  let download_link = req.body.download_link;

  try {
    const options = {
      method: "GET",
      url: "https://instagram-looter2.p.rapidapi.com/post-dl",
      params: {
        link: download_link,
      },
      headers: {
        "X-RapidAPI-Key": "3c789f9123msh3274719871c0c25p1cf51djsn5d700889e62a",
        "X-RapidAPI-Host": "instagram-looter2.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(error);
  }
};
exports.story_link_provider = async (req, res) => {
  let url = req.body.download_link;
  function extractUsernameFromUrl(url) {
    // Regular expression pattern to match the username in the URL
    const pattern = /instagram\.com\/stories\/([^/]+)/;
    
    // Find the username using regex
    const match = url.match(pattern);
    
    if (match) {
      // Extract and return the username
      return match[1];
    } else {
      // If no match is found, return null
      return null;
    }
  }
  
  try {
    const username = extractUsernameFromUrl(url);
    
    if (!username) {
      // If username is null, handle the scenario
      return {
        success: false,
        message: "No username found in the provided URL.",
      };
    }
    console.log(2);

    const options = {
      method: "POST",
      url: "https://instagram120.p.rapidapi.com/api/instagram/stories",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "3c789f9123msh3274719871c0c25p1cf51djsn5d700889e62a",
        "X-RapidAPI-Host": "instagram120.p.rapidapi.com",
      },
      data: {
        username: `${username}`,
      },
    };
    const response = await axios.request(options);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(error);
  }
};
