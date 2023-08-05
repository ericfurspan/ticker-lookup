import type { Handler } from '@netlify/functions';
import fetchMetrics from '../../src/fetchMetrics';

const processTicker: Handler = async (event) => {
  if (!event.body)
    return {
      statusCode: 500,
      body: 'Please provide a request body',
      headers: { 'Access-Control-Allow-Origin': '*' }
    };

  const { symbol, updateSheet } = JSON.parse(event.body);

  const data = await fetchMetrics(symbol, updateSheet);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
};

exports.handler = processTicker;
