const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("IDX Proxy is running. Use /get?symbol=bbca");
});

app.get("/get", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).send("Symbol is required");

  const url = `https://www.idnfinancials.com/id/${symbol}`;
  try {
    const response = await axios.get(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
    "Connection": "keep-alive"
  },
  timeout: 8000
});


    res.send(response.data);
  } catch (err) {
    console.error("Axios error:", err.message);
    res
      .status(err.response?.status || 500)
      .send("Error fetching data: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
