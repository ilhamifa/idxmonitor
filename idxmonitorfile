const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const cache = {};
const CACHE_TTL = 30 * 1000;

app.get('/get', async (req, res) => {
  const symbol = req.query.symbol?.toLowerCase();
  if (!symbol) return res.status(400).send("Missing symbol");

  const now = Date.now();
  if (cache[symbol] && now - cache[symbol].timestamp < CACHE_TTL) {
    console.log(`⚡ Cache hit: ${symbol}`);
    return res.send(cache[symbol].html);
  }

  try {
    console.log(`🌐 Fetching: ${symbol}`);
    const url = `https://www.idnfinancials.com/id/${symbol}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html'
      },
      timeout: 8000
    });

    const html = response.data;
    cache[symbol] = { html, timestamp: now };
    res.send(html);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    res.status(500).send("Error fetching data");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Proxy running on port ${port}`);
});
