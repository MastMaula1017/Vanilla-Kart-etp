const axios = require('axios');

// @desc    Get TURN credentials from Metered.ca
// @route   GET /api/turn/credentials
// @access  Public (or Protected if you want to restrict to logged in users)
const getTurnCredentials = async (req, res) => {
  try {
    if (!process.env.METERED_API_KEY || !process.env.METERED_DOMAIN) {
      console.error("❌ Missing Metered env vars");
      return res.status(500).json({
        error: "Metered env vars missing",
      });
    }

    console.log("🔐 Fetching TURN creds with:");
    const key = process.env.METERED_API_KEY;
    const domain = process.env.METERED_DOMAIN;

    console.log("🔐 Fetching TURN creds with:");
    console.log("API KEY:", key ? (key.length > 6 ? key.slice(0, 6) + "***" : "***") : "UNDEFINED");
    console.log("DOMAIN:", domain);

    // Using exact format from user docs:
    // https://consultprocalling.metered.live/api/v1/turn/credentials?apiKey=...
    const url = `https://${domain}/api/v1/turn/credentials`;

    const response = await axios.get(url, {
        params: {
          apiKey: key, // Must be 'apiKey' for this endpoint
        },
        timeout: 5000,
      }
    );

    return res.json(response.data);
  } catch (err) {
    console.error("🔥 TURN FETCH FAILED");
    if (err.code === 'ENOTFOUND') {
        console.error(`Error: Domain '${process.env.METERED_DOMAIN}' not found.`);
    } else {
        console.error(err.response?.data || err.message);
    }

    return res.status(500).json({
      error: "Failed to fetch TURN credentials",
    });
  }
};

module.exports = { getTurnCredentials };
