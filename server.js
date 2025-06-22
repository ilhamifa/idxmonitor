const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/get", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).send("Symbol is required");

  console.log("🧾 Raw symbol:", JSON.stringify(symbol), "🆕 Version: Jun 21 10:50pm");

  const trimmedSymbol = symbol.trim();
  let fullSymbol = trimmedSymbol;
  let region = "US";

  if (!trimmedSymbol.includes(".")) {
    fullSymbol = `${trimmedSymbol}.JK`;
    region = "ID";
  } else if (trimmedSymbol.endsWith(".JK")) {
    region = "ID";
  }

  console.log("📌 Full symbol:", fullSymbol);
  console.log("🌍 Region:", region);

  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${fullSymbol}&region=${region}`;

  try {
    console.log("🔍 Fetching from Yahoo:", url);

    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": "102fbc59camsh0bd008b773ba4e0p1e697fjsnc38e32a38aab", // Your RapidAPI Key
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
      },
      timeout: 8000
    });

    const data = response.data;

    // Debug logging
    console.log("✅ Yahoo response OK");
    if (!data?.price) {
      console.warn("⚠️ No 'price' field in response");
    }

    const price = data?.price?.regularMarketPrice?.raw ?? null;
    const changePercent = data?.price?.regularMarketChangePercent?.raw ?? null;

    res.json({
      symbol: fullSymbol,
      price,
      changePercent,
      full: data.price ?? {}
    });

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
