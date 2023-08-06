import type { Handler } from '@netlify/functions';
import processTicker from '../../src/processTicker.js';

const tickerLookup: Handler = async (event) => {
  if (!event.body) return { statusCode: 500, body: 'Please provide a request body' };

  const data = await processTicker(JSON.parse(event.body));

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
};

exports.handler = tickerLookup;
