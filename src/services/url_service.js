const urlModel = require("../models/url_model");
const ShortUniqueId = require("short-unique-id");
const axios = require("axios");
const fs = require("fs").promises; // Using promises version of fs
const path = require("path");
const { AsyncLocalStorage } = require("async_hooks");

const fetchLogo = async (domain) => {
  try {
    const response = await axios.get(`https://icon.horse/icon/${domain}`, {
      responseType: "arraybuffer",
    });

    if (response) {
      const folderPath = path.join(__dirname, "../../public/assets/url_logos");
      const fileName = `${domain}_logo.png`;
      const filePath = path.join(folderPath, fileName);

      await fs.writeFile(filePath, Buffer.from(response.data));
      // console.log(`Logo saved successfully at: ${filePath}`);
      return fileName;
    }

    return "slug_logo.png";
  } catch (error) {
    // console.error("Error fetching or saving logo:", error.message);
    // Handle errors
    throw error; // Rethrow the error to handle it elsewhere
  }
};
const fetchQR = async (url) => {
  try {
    const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, "_");
    const response = await axios.get(
      `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        url
      )}&node-id=0-1&mode=design&t=ejv8AWMVvpixAJaz-0&size=280x280&format=png&charset-source=UTF-8`,
      {
        responseType: "arraybuffer",
      }
    );
    if (response) {
      const folderPath = path.join(__dirname, "../../public/assets/url_qrs");
      try {
        await fs.access(folderPath);
      } catch (error) {
        await fs.mkdir(folderPath);
      }
      const fileName = `${sanitizedUrl}_qr.png`;
      const filePath = path.join(folderPath, fileName);
      await fs.writeFile(filePath, Buffer.from(response.data));
      // console.log(`QR saved successfully at: ${filePath}`);
      return fileName;
    }
  } catch (error) {
    // console.error("Error fetching or saving QR:", error.message);
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
  const redirectURL = req.body.redirectURL;
  const ip_address = req.headers['cf-connecting-ip'];
  const user = req.user;
  console.log(user+"url shorten service");

  try {
    const uid = new ShortUniqueId({ length: 8 });
    const shortURL = uid.rnd();

    // If RedirectURL already exists.
    let existingURL;
    if (user != null) {
      existingURL = await urlModel.findOne({
        redirectURL,
        user: user._id,
        ip_address: null,
      });
    } else {
      existingURL = await urlModel.findOne({
        redirectURL,
        ip_address,
        user: null,
      });
    }

    const domain = extractDomain(redirectURL);
    if (!domain) {
      return res
        .status(400)
        .json({ error: "Failed to extract domain from URL" });
    }

    const url_logo = await fetchLogo(domain); // Wait for the logo to be fetched
    if (!url_logo) {
      return res.status(400).json({ error: "Failed to fetch logo for URL" });
    }
    const url_qr = await fetchQR(`${redirectURL}`);
    if (!url_qr) {
      return res.status(400).json({ error: "Failed to fetch QR for URL" });
    }

    let userId;
    if (user) {
      userId = user._id;
    }
    if (existingURL) {
      // Update the existing document
      existingURL.shortURL = shortURL;
      existingURL.url_logo = url_logo;
      existingURL.url_qr = url_qr;

      // Save the updated document
      const updatedURL = await existingURL.save();
      const host = process.env.host;
      if (updatedURL) {
        return {
          success: true,
          shortURL: `${host}/${shortURL}`,
          url_logo,
          url_qr,
          message: "URL Entry Updated!",
        };
      } else {
        return {
          success: false,
          message: "Failed to update the URL entry!",
        };
      }
    } else {
      // Create a new URL entry
      let userId = user ? user._id : null;
      let ipAddress = user ? null : ip_address;
      console.log(userId, ipAddress);
      const newURL = await urlModel.create({
        user: userId,
        ip_address: ipAddress,
        shortURL,
        redirectURL,
        url_logo,
        url_qr,
        visitHistory: [],
      });

      const host = process.env.host ;
      if (newURL) {
        return {
          success: true,
          shortURL: `${host}/${shortURL}`,
          url_logo,
          url_qr,
          message: "URL Entry Created!",
        };
      } else {
        return {
          success: false,
          message: "Failed to create the URL entry!",
        };
      }
    }
  } catch (error) {
    // console.log(error);
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
    // console.error("Error during redirection:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

exports.show_urls = async (req, res) => {
  const user = req.user;
  const ip_address = req.ip_address;
  console.log(user+"show url service");
  console.log(ip_address+"show url service");
  try {
    let userId;
    let urls;
    if (user) {
      userId = user._id;
      urls = await urlModel.find({ user: userId });
    } else {
      if (ip_address) {
        urls = await urlModel.find({ ip_address: ip_address });
      }
    }
    // if (urls.length == 0) {
    //   return {
    //     success: false,
    //     message: "No URL entries found",
    //   };
    // } else {
    //   return {
    //     success: true,
    //     urls,
    //   };
    // }
    return {
        success: true,
        urls,
      };
  } catch (error) {
    console.log(error);
    
    return res.status(500).send("Internal Server Error");
  }
};
