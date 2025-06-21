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
          req.headers["user-agent"] ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      timeout: 8000,
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
