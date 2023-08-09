# ticker-lookup

 A nodejs/typescript wrapper around select AlphaVantage endpoints to enable rapid access to key financial metrics for any stock.

 ## Sample Usage

*These examples will use Microsoft (symbol: MSFT) for the lookup.*

Get results in JSON format: (i.e for script usage)

`https://ticker-lookup.netlify.app/.netlify/functions/lookup?symbol=MSFT`


Get results in HTML format: (i.e for browser usage)

`https://ticker-lookup.netlify.app/.netlify/functions/lookup?symbol=MSFT&format=html`


## Resources
- https://www.alphavantage.co/documentation/
- https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values
- https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/sheets/append.js
- https://docs.netlify.com/functions/overview/
