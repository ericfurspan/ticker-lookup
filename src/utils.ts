import { GlobalQuoteResult, OverviewResult } from './types.js';

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
    'Quote Price': globalQuoteResult['Global Quote']?.['05. price'],
    'Market Cap': overviewResult.MarketCapitalization,
    '52 Week Low': overviewResult['52WeekLow'],
    '52 Week High': overviewResult['52WeekHigh'],
    'PE Ratio': overviewResult.PERatio,
    'Trailing PE': overviewResult.TrailingPE,
    'Forward PE': overviewResult.ForwardPE,
    'PE Growth Ratio': overviewResult.PEGRatio,
    'Earnings Per Share': overviewResult.EPS,
    'Dividend Yield': overviewResult.DividendYield,
    'Analyst Target Price': overviewResult.AnalystTargetPrice
  };
};
