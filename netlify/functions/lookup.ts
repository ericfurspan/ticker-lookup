import { HandlerEvent } from '@netlify/functions';
import { compileKeyMetricsWithNames } from '../../src/utils.js';
import fetchTicker from '../../src/fetchTicker.js';

export async function handler(event: HandlerEvent) {
  const params = event.queryStringParameters;

  const format = params?.format ?? 'html';

  if (!params?.symbol)
    return { statusCode: 400, body: 'missing "symbol" parameter \n\n\texample: ?symbol=AAPL' };

  const response = await fetchTicker(params.symbol);

  if ('error' in response) return { statusCode: 200, body: response.error };

  const { quoteResult, overviewResult } = response;

  const keyMetrics = compileKeyMetricsWithNames(overviewResult, quoteResult);
  const rawData = { ...overviewResult, ...quoteResult };
  const lastUpdated = new Date(keyMetrics['Quote Date']).toLocaleString();

  if (format === 'json') {
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...keyMetrics, ...rawData })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/html'
    },
    body: `
    <html lang="en">
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-size: larger; font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif">
        <h1>${rawData.Name} (${params.symbol.toUpperCase()})</h1>

        <p>Last updated: ${lastUpdated}</p>

        <details open>
          <summary>Key Metrics</summary>
          <pre>${JSON.stringify(keyMetrics, null, 4)}</pre>
        </details>
        
        <details>
          <summary>Raw Data</summary>
          <pre>${JSON.stringify(rawData, null, 4)}</pre>
        </details>
      </body>
    </html>`
  };
}
