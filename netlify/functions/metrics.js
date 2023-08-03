import fetch from "node-fetch";

const fetchMetrics = async (event) => {
  const { symbols, queryFunction } = JSON.parse(event.body);

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const url = `https://www.alphavantage.co/query?symbol=${symbol}&function=${queryFunction}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      const response = await fetch(url);

      const data = await response.json();

      return data;
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(results),
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
    },
  };
};

exports.handler = fetchMetrics;
