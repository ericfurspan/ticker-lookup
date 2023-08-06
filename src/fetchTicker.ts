import 'dotenv/config';
import fetch from 'node-fetch';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from '../types.js';
import { compileKeyMetrics } from './utils.js';

const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

const queryAlphaVantage = async (ticker: string, queryFn: QueryFunction) => {
  const query = `${BASE_QUERY}&symbol=${ticker}&function=${queryFn}`;
  const response = await fetch(query);

  if (response.ok) {
    const data = await response.json();

    return data as QueryResult;
  }

  console.error(`${response.status} - ${response.statusText}`, query);
  throw new Error(`queryAlphaVantage error`);
};

async function fetchTicker(ticker: string) {
  const quoteResult = (await queryAlphaVantage(ticker, 'GLOBAL_QUOTE')) as GlobalQuoteResult;
  const overviewResult = (await queryAlphaVantage(ticker, 'OVERVIEW')) as OverviewResult;

  const data = { ...quoteResult, ...overviewResult };

  const keyMetrics = compileKeyMetrics(overviewResult, quoteResult);

  return { data, keyMetrics };
}

export default fetchTicker;
