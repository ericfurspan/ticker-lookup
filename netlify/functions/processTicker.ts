import fetch from 'node-fetch';
import { google } from 'googleapis';
import type { Handler, HandlerResponse } from '@netlify/functions';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from '../../types';
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

const rowValues = (overviewResult: OverviewResult, globalQuoteResult: GlobalQuoteResult) => [
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

const appendToGoogleSheet = async (values: string[]) => {
  try {
    const jwt = await googleAuth();

    const { spreadsheets } = google.sheets('v4');

    return spreadsheets.values.append({
      auth: jwt,
      spreadsheetId: SPREADSHEET_ID,
      range: `OVERVIEW!A2`,
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

const processTicker: Handler = async (event) => {
  if (!event.body) return handleResponse(500, 'Please provide a request body');

  const { symbol, updateSheet } = JSON.parse(event.body);

  const quoteResult = (await queryAlphaVantage(symbol, 'GLOBAL_QUOTE')) as GlobalQuoteResult;
  const overviewResult = (await queryAlphaVantage(symbol, 'OVERVIEW')) as OverviewResult;

  if (updateSheet) {
    const row = rowValues(overviewResult, quoteResult);

    await appendToGoogleSheet(row);
  }

  return handleResponse(200, JSON.stringify({ ...quoteResult, ...overviewResult }));
};

exports.handler = processTicker;
