const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ IDX Yahoo Finance Proxy is running. Use /get?symbol=BBCA or /get?symbol=AAPL");
});

app.get("/get", async (req, res) => {
  const rawSymbol = req.query.symbol;
  if (!rawSymbol) return res.status(400).send("Symbol is required");

  const trimmedSymbol = rawSymbol.trim().toUpperCase();
  let fullSymbol = trimmedSymbol;
  let region = "US";

  // If it's an IDX stock (e.g., BBCA, BBRI), we add .JK
  if (/^[A-Z]{4}$/.test(trimmedSymbol)) {
    fullSymbol = `${trimmedSymbol}.JK`;
    region = "ID";
  } else if (trimmedSymbol.endsWith(".JK")) {
    region = "ID";
  }

  console.log(`📥 Symbol: ${trimmedSymbol} → ${fullSymbol} | 🌏 Region: ${region}`);

  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?symbols=${fullSymbol}&region=${region}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": "102fbc59camsh0bd008b773ba4e0p1e697fjsnc38e32a38aab",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
      },
      timeout: 8000
    });

    const result = response.data?.quoteResponse?.result?.[0];

    if (!result) {
      return res.status(404).json({ error: "Symbol not found or invalid data" });
    }

    const price = result.regularMarketPrice ?? null;
    const changePercent = result.regularMarketChangePercent ?? null;

    res.json({
      symbol: fullSymbol,
      price,
      changePercent,
      full: result
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      res.status(err.response.status).json({
        error: err.response.data,
        message: "Yahoo API error"
      });
    } else {
      res.status(500).json({
        error: err.message,
        message: "Proxy server error"
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
