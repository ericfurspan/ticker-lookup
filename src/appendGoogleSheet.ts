import { google } from 'googleapis';

const googleAuth = async () => {
  try {
    console.log('starting googleAuth');

    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const jwtAuthPromise = jwtClient.authorize();

    await jwtAuthPromise;

    console.log('finished googleAuth');

    return jwtClient;
  } catch (error) {
    console.log('failed googleAuth:', error);
  }
};

const appendToGoogleSheet = async (values: string[]) => {
  try {
    console.log('starting appendToGoogleSheet');

    const jwt = await googleAuth();

    const { spreadsheets } = google.sheets('v4');

    await spreadsheets.values.append({
      auth: jwt,
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: process.env.GOOGLE_SHEETS_RANGE,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });

    console.log('finished appendToGoogleSheet');
  } catch (error) {
    console.log('failed appendToGoogleSheet:', error);
  }
};

export default appendToGoogleSheet;
