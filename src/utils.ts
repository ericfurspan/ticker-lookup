import { FetchError } from 'node-fetch';
import { GlobalQuoteResult, OverviewResult } from './types.js';

const formatCurrency = (value: string) => {
  const numericValue = parseFloat(value);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numericValue);
};

const formatPercent = (value: string) => {
  const numericValue = parseFloat(value);

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumSignificantDigits: 3
  }).format(numericValue);
};

export const compileKeyMetrics = (
  overviewResult: OverviewResult,
  globalQuoteResult: GlobalQuoteResult
) => [
  overviewResult.Name,
  globalQuoteResult['Global Quote']?.['05. price'],
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
  overviewResult.Sector,
  new Date().toLocaleString()
];

export const compileKeyMetricsWithNames = (
  overviewResult: OverviewResult,
  globalQuoteResult: GlobalQuoteResult
) => {
  return {
    Name: overviewResult.Name,
    Sector: overviewResult.Sector,
    'Quote Date': new Date().toLocaleString(),
    'Quote Price': formatCurrency(globalQuoteResult['Global Quote']?.['05. price']),
    'Market Cap': formatCurrency(overviewResult.MarketCapitalization),
    '52 Week Low': formatCurrency(overviewResult['52WeekLow']),
    '52 Week High': formatCurrency(overviewResult['52WeekHigh']),
    'PE Ratio': overviewResult.PERatio,
    'Trailing PE': overviewResult.TrailingPE,
    'Forward PE': overviewResult.ForwardPE,
    'PE Growth Ratio': overviewResult.PEGRatio,
    'Earnings Per Share': formatCurrency(overviewResult.EPS),
    'Dividend Yield': formatPercent(overviewResult.DividendYield),
    'Analyst Target Price': formatCurrency(overviewResult.AnalystTargetPrice)
  };
};

export const parseFetchError = (error: FetchError) => {
  const apiKeyIndex = error.message.indexOf('apikey');
  const afterApiKey = error.message.substring(apiKeyIndex);
  const nextAmpersandIndex = afterApiKey.indexOf('&');

  const message =
    error.message.substring(0, apiKeyIndex) + afterApiKey.substring(nextAmpersandIndex);

  return message;
};
