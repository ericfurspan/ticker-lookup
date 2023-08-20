import 'dotenv/config';
import fetch from 'node-fetch';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from './types.js';

const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

const queryAlphaVantage = async (ticker: string, queryFn: QueryFunction) => {
  const query = `${BASE_QUERY}&symbol=${ticker}&function=${queryFn}`;
  const response = await fetch(query);

  const data = await response.json();

  return data as QueryResult | { [key: string]: string };
};

async function fetchTicker(ticker: string) {
  const quoteResult = await queryAlphaVantage(ticker, 'GLOBAL_QUOTE');
  const overviewResult = await queryAlphaVantage(ticker, 'OVERVIEW');

  if ('Note' in quoteResult) return { error: quoteResult.Note };
  if ('Information' in quoteResult) return { error: quoteResult.Information };
  if ('Note' in overviewResult) return { error: overviewResult.Note };
  if ('Information' in overviewResult) return { error: overviewResult.Information };

  return { quoteResult, overviewResult } as {
    quoteResult: GlobalQuoteResult;
    overviewResult: OverviewResult;
  };
}

export default fetchTicker;
