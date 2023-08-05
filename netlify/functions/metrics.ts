import fetch from 'node-fetch';
import { google } from 'googleapis';
import type { Handler, HandlerResponse } from '@netlify/functions';
import {
  EventBody,
  GlobalQuoteResult,
  OverviewResult,
  QueryFunction,
  QueryResult
} from '../../types';
import serviceAccount from '../../service-account.json';
import { Response } from '@netlify/functions/dist/function/response';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SPREADSHEET_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

const googleAuth = async () => {
  try {
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: SPREADSHEET_SCOPES
    });

    const jwtAuthPromise = jwtClient.authorize();

    await jwtAuthPromise;

    return jwtClient;
  } catch (error) {
    console.error('Failed googleAuthentication', error);
  }
};

const globalQuoteRowValues = (result: GlobalQuoteResult) => [
  result['Global Quote']['01. symbol'],
  result['Global Quote']['05. price'],
  result['Global Quote']['07. latest trading day']
];

const overviewRowValues = (result: OverviewResult) => [
  result.Name,
  result.MarketCapitalization,
  result['52WeekLow'],
  result['52WeekHigh'],
  result.PERatio,
  result.TrailingPE,
  result.ForwardPE,
  result.PEGRatio,
  result.EPS,
  result.DividendYield,
  result.AnalystTargetPrice,
  result.Sector
];

// const updateGoogleSheet = async (values: string[], sheetName: 'OVERVIEW' | 'QUOTE') => {
//   try {
//     const jwt = await googleAuth();

//     const { spreadsheets } = google.sheets('v4');

//     return spreadsheets.values.batchUpdateByDataFilter({
//       auth: jwt,
//       spreadsheetId: SPREADSHEET_ID,
//       requestBody: {
//         valueInputOption: 'RAW',
//         data: [{ majorDimension: 'ROWS', dataFilter: [] }]
//       }
//     });
//   } catch (error) {
//     console.log('updateGoogleSheet error:', error);
//   }
// };

const appendToGoogleSheet = async (values: string[], sheetName: 'OVERVIEW' | 'QUOTE') => {
  try {
    const jwt = await googleAuth();

    const { spreadsheets } = google.sheets('v4');

    return spreadsheets.values.append({
      auth: jwt,
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2`,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      requestBody: {
        values: [values]
      }
    });
  } catch (error) {
    console.log('appendToGoogleSheet error:', error);
  }
};

const handleResponse = (
  statusCode: HandlerResponse['statusCode'],
  body: HandlerResponse['body']
): Response => ({
  statusCode,
  body,
  headers: { 'Access-Control-Allow-Origin': '*' }
});

// TODO - ADD QUERY DATETIME TO SHEET
// TODO - TRY AND MATCH NAME COLUMN WHEN UPDATING SO IT OVERWRITES EXISTING SYMBOLS
// TODO - batch symbols into groups of 5 and execute the query every 60 seconds to avoid throttle limit
// TODO - OR try to use a scheduler to call script with 5 tickets at a time

const queryAlphaVantage = async (symbol: string, queryFn: QueryFunction) => {
  try {
    const response = await fetch(`${BASE_QUERY}&symbol=${symbol}&function=${queryFn}`);

    if (response.ok) {
      const data = await response.json();

      return data as QueryResult;
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.log('queryAlphaVantage error:', error);
  }
};

const fetchMetrics: Handler = async (event) => {
  if (!event.body) return handleResponse(500, 'Please provide a request body');

  const { symbols, queryFunction, updateSheet }: EventBody = JSON.parse(event.body);

  const queries = symbols.slice(0, 5).map((symbol) => queryAlphaVantage(symbol, queryFunction));
  const results = await Promise.all(queries);

  if (updateSheet) {
    for (const result of results) {
      if (queryFunction === 'OVERVIEW') {
        const row = overviewRowValues(result as OverviewResult);
        await appendToGoogleSheet(row, 'OVERVIEW');
      }

      if (queryFunction === 'GLOBAL_QUOTE') {
        const row = globalQuoteRowValues(result as GlobalQuoteResult);
        await appendToGoogleSheet(row, 'QUOTE');
      }
    }
  }

  return handleResponse(200, JSON.stringify(results));
};

exports.handler = fetchMetrics;
