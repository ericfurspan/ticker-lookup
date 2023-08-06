import { HandlerEvent } from '@netlify/functions';
import fetchTicker from '../../src/fetchTicker.js';

export async function handler(event: HandlerEvent) {
  const params = event.queryStringParameters;

  if (!params?.symbol) return { statusCode: 400, body: 'missing "symbol" param' };

  const { data, keyMetrics } = await fetchTicker(params.symbol);

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
      <body>
        <h1>${params.symbol.toUpperCase()}</h1>

        <details>
          <summary>Key Metrics</summary>
          <pre>${JSON.stringify(keyMetrics, null, 4)}</pre>
        </details>
        
        <details>
          <summary>Raw Data</summary>
          <pre>${JSON.stringify(data, null, 4)}</pre>
        </details>
      </body>
    </html>`
  };
}
