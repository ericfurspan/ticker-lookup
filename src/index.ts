import fetchTicker from './fetchTicker.js';
import { ProcessOptions } from './types.js';
import appendGoogleSheet from './appendGoogleSheet.js';
import { compileKeyMetrics } from './utils.js';

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

async function process({
  tickers,
  updateGoogleSheet = false,
  sheetName = 'default'
}: ProcessOptions) {
  for (const t of tickers) {
    const { overviewResult, quoteResult } = await fetchTicker(t);
    const keyMetrics = compileKeyMetrics(overviewResult, quoteResult);

    if (updateGoogleSheet) {
      await appendGoogleSheet(keyMetrics, sheetName);
    }

    console.log(`processed ${t}, waiting ${TIME_BETWEEN_REQUESTS / 1000} seconds...`);

    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
  }
}

export default process({
  tickers: ['PLTR', 'VZ'],
  updateGoogleSheet: true,
  sheetName: 'default'
});
