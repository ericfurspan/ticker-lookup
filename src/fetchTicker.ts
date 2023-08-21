import 'dotenv/config';
import fetch, { FetchError } from 'node-fetch';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from './types.js';
import { parseFetchError } from './utils.js';

const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
const ALPHA_VANTAGE_ERROR_KEYS = ['Note', 'Information'] as const;

type AlphaVantageError = { [key in (typeof ALPHA_VANTAGE_ERROR_KEYS)[number]]?: string };
type FetchTickerError = { error: string };
type FetchTickerResult = {
  quoteResult: GlobalQuoteResult;
  overviewResult: OverviewResult;
};

export default async function fetchTicker(ticker: string) {
  const quoteResult = await queryAlphaVantage(ticker, 'GLOBAL_QUOTE');
  const overviewResult = await queryAlphaVantage(ticker, 'OVERVIEW');

  for (const k of ALPHA_VANTAGE_ERROR_KEYS) {
    if (k in quoteResult)
      return { error: quoteResult[k as keyof typeof quoteResult] } as FetchTickerError;
    if (k in overviewResult)
      return { error: overviewResult[k as keyof typeof overviewResult] } as FetchTickerError;
  }

  if (!('Symbol' in overviewResult))
    return { error: `Failed to query the Alpha Vantage API.\n\nTicker "${ticker}" not found.` };

  return { quoteResult, overviewResult } as FetchTickerResult;
}

async function queryAlphaVantage(ticker: string, queryFn: QueryFunction) {
  const query = `${BASE_QUERY}&symbol=${ticker}&function=${queryFn}`;

  try {
    const response = await fetch(query);
    const data = await response.json();

    return data as QueryResult | AlphaVantageError;
  } catch (error) {
    if (error instanceof FetchError) {
      throw `Failed to query the Alpha Vantage API.\n\nMessage: ${parseFetchError(error)}.`;
    } else {
      throw 'An unexpected error occurred, please try again later.';
    }
  }
}
