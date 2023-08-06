import type { Handler } from '@netlify/functions';
import processTicker from '../../src/processTicker.js';

const handler: Handler = async (event) => {
  if (!event.body) return { statusCode: 500, body: 'Please provide a request body' };

  const args = JSON.parse(event.body);

  if (!args.ticker) return { statusCode: 500, body: 'Please provide a ticker' };

  const data = await processTicker(args);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
};

exports.handler = handler;
