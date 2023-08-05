import fetch from 'node-fetch';
import appendToGoogleSheet from './appendGoogleSheet.js';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from '../types.js';

const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

const buildSheetRow = (overviewResult: OverviewResult, globalQuoteResult: GlobalQuoteResult) => [
  overviewResult.Name,
  globalQuoteResult['Global Quote']['05. price'],
  overviewResult.MarketCapitalization,
  overviewResult['52WeekLow'],
  overviewResult['52WeekHigh'],
  overviewResult.PERatio,
  overviewResult.TrailingPE,
  overviewResult.ForwardPE,
  overviewResult.PEGRatio,
  overviewResult.EPS,
  overviewResult.DividendYield,
  overviewResult.AnalystTargetPrice,
  overviewResult.Sector
];

const queryAlphaVantage = async (symbol: string, queryFn: QueryFunction) => {
  try {
    console.log('starting queryAlphaVantage');

    const response = await fetch(`${BASE_QUERY}&symbol=${symbol}&function=${queryFn}`);

    if (response.ok) {
      const data = await response.json();

      return data as QueryResult;
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.log('failed queryAlphaVantage:', error);
  }
};

const processTicker = async (symbol: string, updateGoogleSheet = false) => {
  console.log('starting processTicker');

  const quoteResult = (await queryAlphaVantage(symbol, 'GLOBAL_QUOTE')) as GlobalQuoteResult;
  const overviewResult = (await queryAlphaVantage(symbol, 'OVERVIEW')) as OverviewResult;

  const data = { ...quoteResult, ...overviewResult };

  if (updateGoogleSheet) {
    const row = buildSheetRow(overviewResult, quoteResult);
    await appendToGoogleSheet(row);
  }

  console.log('finished processTicker');

  return data;
};

export default processTicker;
