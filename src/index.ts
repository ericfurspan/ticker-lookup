import processTicker from './processTicker.js';

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

async function process(symbols: string[]) {
  console.log(`starting process for ${symbols.length} symbols`);

  for (const symbol of symbols) {
    for (let i = 0; i < REQUESTS_PER_ITEM; i++) {
      await processTicker(symbol, true);

      console.log(`processed ${symbol}`);
      console.log(`waiting ${TIME_BETWEEN_REQUESTS}ms`);
      await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
    }
  }

  console.log('finished process');
}

process(tickers);
