import fetch from "node-fetch";

exports.handler = async (event) => {
  const { symbols, queryFunction } = JSON.parse(event.body);

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const response = await fetch(
        `https://www.alphavantage.co/query?symbol=${symbol}&function=${queryFunction}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );

      const data = await response.json();

      return data;
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
