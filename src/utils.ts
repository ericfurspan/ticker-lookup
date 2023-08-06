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

export const compileKeyMetricsWithNames = (
  overviewResult: OverviewResult,
  globalQuoteResult: GlobalQuoteResult
) => {
  const keyNames = [
    'Name',
    'Price',
    'MarketCapitalization',
    '52WeekLow',
    '52WeekHigh',
    'PERatio',
    'TrailingPE',
    'ForwardPE',
    'PEGRatio',
    'EPS',
    'DividendYield',
    'AnalystTargetPrice',
    'Sector'
  ];

  return keyNames.reduce((acc, curr) => {
    if (curr === 'Price') {
      // @ts-expect-error - property exists on GlobalQuoteResult['Global Quote']
      acc[curr] = globalQuoteResult['Global Quote']?.['05. price'];

      return acc;
    }

    return { ...acc, [curr]: overviewResult[curr as keyof OverviewResult] };
  }, {});
};
