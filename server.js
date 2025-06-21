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
    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": "102fbc59camsh0bd008b773ba4e0p1e697fjsnc38e32a38aab", // <-- Your RapidAPI key
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
      },
      timeout: 8000
    });

    res.json(response.data);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res
      .status(err.response?.status || 500)
      .send("Error: " + (err.response?.data?.message || err.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server is running on port ${PORT}`);
});
