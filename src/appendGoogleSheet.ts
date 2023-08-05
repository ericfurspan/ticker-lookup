import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SPREADSHEET_RANGE = process.env.GOOGLE_SHEETS_RANGE;
const SPREADSHEET_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const googleAuth = async () => {
  try {
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
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
      range: SPREADSHEET_RANGE,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });
  } catch (error) {
    console.log('appendToGoogleSheet error:', error);
  }
};

export default appendToGoogleSheet;
