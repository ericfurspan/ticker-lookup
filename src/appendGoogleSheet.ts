import 'dotenv/config';
import { google } from 'googleapis';

const googleAuth = async () => {
  try {
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const jwtAuthPromise = jwtClient.authorize();

    await jwtAuthPromise;

    return jwtClient;
  } catch (error) {
    console.log(error);
    throw new Error('googleAuth error');
  }
};

const appendToGoogleSheet = async (values: string[], sheetName = 'default') => {
  try {
    const jwt = await googleAuth();

    const { spreadsheets } = google.sheets('v4');

    await spreadsheets.values.append({
      auth: jwt,
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${sheetName}!A2`,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] }
    });
  } catch (error) {
    console.error(error);
    throw new Error('appendToGoogleSheet error');
  }
};

export default appendToGoogleSheet;
