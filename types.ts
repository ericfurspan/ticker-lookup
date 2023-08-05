export interface EventBody {
  symbols: string[];
  queryFunction: QueryFunction;
  updateSheet: boolean;
}

export type QueryFunction =
  | 'OVERVIEW'
  | 'GLOBAL_QUOTE'
  | 'INCOME_STATEMENT'
  | 'BALANCE_SHEET'
  | 'CASH_FLOW'
  | 'EARNINGS';

export type QueryResult = OverviewResult | GlobalQuoteResult;

export interface GlobalQuoteResult {
  // see https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo

  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '07. latest trading day': string;
  };
}

export interface OverviewResult {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: Date;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  DividendDate: Date;
  ExDividendDate: Date;
}
