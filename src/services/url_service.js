const urlModel = require("../models/url_model");
const ShortUniqueId = require("short-unique-id");
const axios = require("axios");
const fs = require("fs").promises; // Using promises version of fs
const path = require("path");

const fetchLogo = async (domain) => {
  try {
    const response = await axios.get(
      `https://logo.clearbit.com/${domain}?format=png`,
      {
        responseType: "arraybuffer",
      }
    );

    const folderPath = path.join(__dirname, "../../public/assets/url_logos");
    const fileName = `${domain}_logo.png`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, Buffer.from(response.data));

    console.log(`Logo saved successfully at: ${filePath}`);
    return fileName;
  } catch (error) {
    console.error("Error fetching or saving logo:", error.message);
    // Handle errors
    throw error; // Rethrow the error to handle it elsewhere
  }
};
const fetchQR = async (url) => {
  try {
    const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, "_");
    const response = await axios.get(
      `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&node-id=0-1&mode=design&t=ejv8AWMVvpixAJaz-0&size=280x280&format=png&charset-source=UTF-8`,
      {
        responseType: "arraybuffer",
      }
    );

    const folderPath = path.join(__dirname, "../../public/assets/url_qrs");
    try {
      await fs.access(folderPath);
    } catch (error) {
      await fs.mkdir(folderPath);
    }
    const fileName = `${sanitizedUrl}_qr.png`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, Buffer.from(response.data));

    console.log(`QR saved successfully at: ${filePath}`);
    return fileName;
  } catch (error) {
    console.error("Error fetching or saving QR:", error.message);
    // Handle errors
    throw error; // Rethrow the error to handle it elsewhere
  }
};

function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    return domain;
  } catch (error) {
    console.error(`Error extracting domain: ${error.message}`);
    return null;
  }
}

exports.url_shorten = async (req, res) => {
  try {
    const redirectURL = req.body.redirectURL;
    if (!redirectURL) {
      return res.status(400).json({ error: "URL is required" });
    }

    const domain = extractDomain(redirectURL);
    if (domain) {
      console.log(`The domain is: ${domain}`);
    } else {
      console.log("Failed to extract domain.");
    }


    const url_logo = await fetchLogo(domain); // Wait for the logo to be fetched

    
    const uid = new ShortUniqueId({ length: 8 });
    const shortURL = uid.rnd();
    
    const url_qr = await fetchQR(`http://localhost:10000/${shortURL}`);
    

    const user = req.user;
    let userId = null;
    if (user) {
      userId = user._id;
    }

    let urlEntry = await urlModel.create({
      user: userId,
      shortURL: shortURL,
      redirectURL: redirectURL,
      url_logo,
      url_qr,
      visitHistory: [],
    });

    if (urlEntry) {
      return {
        success: true,
        shortURL: `http://localhost:10000/${shortURL}`,
        url_logo,
        url_qr,
        message: "URL entry updated!",
      };
    } else {
      return {
        success: false,
        message: "Failed to update the URL entry!",
      };
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message || "An error occurred");
  }
};

exports.url_redirection = async (req, res) => {
  try {
    const shortURL = req.params.shortURL;
    const urlEntry = await urlModel.findOneAndUpdate(
      { shortURL },
      {
        $push: { visitHistory: { timestamp: Date.now() } },

        $inc: { clicks: 1 },
      },
      { new: true }
    );

    if (urlEntry) {
      return {
        redirectURL: urlEntry.redirectURL,
        success: true,
        message: "URL entry updated!",
      };
    } else {
      return {
        success: false,
        message: "URL not found",
      };
    }
  } catch (error) {
    console.error("Error during redirection:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

exports.show_urls = async (req, res) => {
  try {
    const user = req.user;
    let userId = null;
    if (user) {
      userId = user._id;
    }
    const urls = await urlModel.find({ user: userId });
    return {
      success: true,
      urls,
    };
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
