import { google } from 'googleapis';
import serviceAccount from '../service-account.json';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SPREADSHEET_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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

export default appendToGoogleSheet;
