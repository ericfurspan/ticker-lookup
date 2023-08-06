import { BaseProcessOptions } from '../types.js';
import processTicker from './processTicker.js';

const TIME_BETWEEN_REQUESTS = 60000; // time in ms

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const m1Holdings = [
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

interface ProcessOptions extends BaseProcessOptions {
  tickers: string[];
}

async function process({
  tickers,
  updateGoogleSheet = false,
  sheetName = 'default'
}: ProcessOptions) {
  for (const ticker of tickers) {
    await processTicker({ ticker, updateGoogleSheet, sheetName });

    console.log(`processed ${ticker}, waiting ${TIME_BETWEEN_REQUESTS / 1000} seconds...`);

    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
  }
}

export default process({
  tickers: ['PLTR', 'VZ'],
  updateGoogleSheet: true,
  sheetName: 'WATCHLIST'
});
