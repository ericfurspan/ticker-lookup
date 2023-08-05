import processTicker from './processTicker.js';
import 'dotenv/config';

const TIME_BETWEEN_REQUESTS = 60000; // in milliseconds

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
  console.log(`starting to process ${symbols.length} symbols`);

  for (const symbol of symbols) {
    console.log('processing', symbol);
    await processTicker(symbol, true);

    console.log(`finished ${symbol}, waiting ${TIME_BETWEEN_REQUESTS / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
  }

  console.log('finished all symbols, exiting');
}

process(tickers);
