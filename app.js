require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

app.use(express.json());

app.post("/metrics", async (req, res) => {
  try {
    const { queryFunction = "OVERVIEW", symbols } = req.body;

    const baseUrl = "https://www.alphavantage.co/query";

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await axios.get(baseUrl, {
          params: {
            function: queryFunction,
            symbol,
            apikey: apiKey,
          },
        });

        return response.data;
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
