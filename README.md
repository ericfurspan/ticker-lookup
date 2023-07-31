# Finance Metrics API

Credits belong to to https://www.alphavantage.co/ for the underlying Stock Market API.

## Usage

### cURL sample usage
Returns [Company Overview](https://www.alphavantage.co/documentation/#company-overview) information for AAPL, MSFT, and TSLA.

```
curl -L 'https://portfolio-metrics-api.netlify.app/.netlify/functions/metrics' \
-H 'Content-Type: application/json' \
-d '{
    "queryFunction": "OVERVIEW",
    "symbols": ["AAPL", "MSFT", "TSLA"] 
}'
```

## Alpha Vantage Documentation
- https://www.alphavantage.co/documentation/
