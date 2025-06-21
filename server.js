app.get("/get", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).send("Symbol is required");

  const url = `https://www.idnfinancials.com/id/${symbol}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          req.headers["user-agent"] || // use incoming headers if available
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      timeout: 8000,
    });

    res.send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send("Error fetching data");
  }
});
