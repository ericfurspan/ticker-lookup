// TODO:
// - process tickers with fetchMetrics on a schedule

import fetchMetrics from './fetchMetrics';

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

fetchMetrics(tickers[3], false);
