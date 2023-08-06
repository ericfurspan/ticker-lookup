import { GlobalQuoteResult, OverviewResult } from '../types.js';

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
