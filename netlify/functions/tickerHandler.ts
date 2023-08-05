import type { Handler } from '@netlify/functions';
import processTicker from '../../src/processTicker.js';

const tickerHandler: Handler = async (event) => {
  console.log('starting tickerHandler');

  if (!event.body) {
    console.log('Please provide a request body. Exiting.');
    return {
      statusCode: 500,
      body: 'Please provide a request body',
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }

  const { symbol, updateSheet } = JSON.parse(event.body);

  const data = await processTicker(symbol, updateSheet);

  console.log('finished tickerHandler', data);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
};

exports.handler = tickerHandler;
