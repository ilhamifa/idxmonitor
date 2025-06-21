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

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.JK`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      timeout: 8000
    });

    res.json(response.data);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res
      .status(err.response?.status || 500)
      .send("Error: " + (err.response?.data?.finance?.error?.description || err.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server is running on port ${PORT}`);
});
