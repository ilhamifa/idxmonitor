const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ IDX Yahoo Finance Proxy is running. Use /get?symbol=BBCA");
});

app.get("/get", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).send("Symbol is required");

  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}.JK&region=ID`;

  try {
    console.log("🔍 Fetching:", url);

    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": "102fbc59camsh0bd008b773ba4e0p1e697fjsnc38e32a38aab",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
      },
      timeout: 8000
    });

    console.log("✅ Yahoo response OK");
    res.json(response.data); // Send the full response JSON to browser

  } catch (err) {
    console.error("❌ Error fetching Yahoo data:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Body:", err.response.data);
      res.status(err.response.status).json({
        error: err.response.data,
        message: "Yahoo API error"
      });
    } else {
      console.error("Unknown error:", err.message);
      res.status(500).json({
        error: err.message,
        message: "Proxy server error"
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server is running on port ${PORT}`);
});
