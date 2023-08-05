import fetchMetrics from './fetchMetrics.js';

const API_RATE_LIMIT = 5;
const REQUESTS_PER_ITEM = 2;
const TIME_BETWEEN_REQUESTS = (60 * 1000) / API_RATE_LIMIT; // in milliseconds

const tickers = [
  'AAPL',
  'TSLA',
  'MSFT',
  'UNH',
  'JNJ',
  'AVGO',
  'JPM',
  'CVX',
  'PG',
  'HD',
  'PEP',
  'COST',
  'MCD',
  'DE',
  'LMT',
  'NOC',
  'V',
  'WM',
  'GIS',
  'HSY'
];

async function process(tickers: string[]) {
  for (const ticker of tickers) {
    for (let i = 0; i < REQUESTS_PER_ITEM; i++) {
      await fetchMetrics(ticker, true);

      // pause between requests
      await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
    }
  }
}

process(tickers);
