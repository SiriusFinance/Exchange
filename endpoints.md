[TOC]

# List of Endpoints

Base URL: https://api.sirius.finance/

### Get pairs

```
GET /api/pairs
```

Response:

```json
{
  "ok": true,
  "data": {
    "pairs": [
      {
        "pool_id": "0xEEa640c27620D7C448AD655B6e3FB94853AC01e3",
        "ticker_id": "ASTR_nASTR",
        "base": "ASTR",
        "target": "nASTR"
      }
    ]
  }
}
```

### Get ticker

```
GET /api/ticker/24hr
```

Parameters:

- `ticker_id`: ticker id

Query e.g.

```
GET /api/ticker/24hr?ticker_id=ASTR_nASTR
```

Response:

```json
{
  "ok": true,
  "data": {
    "tickers": [
      {
        "pool_id": "0xEEa640c27620D7C448AD655B6e3FB94853AC01e3",
        "ticker_id": "ASTR_nASTR",
        "base_currency": "ASTR",
        "target_currency": "nASTR",
        "last_price": "1.000631288707494223",
        "base_volume": "534.39",
        "target_volume": "534.733024214013518946",
        "high": "1.00064235823772869",
        "low": "1.000631288707494223"
      }
    ]
  }
}
```

### Get ve leaderboard

```
GET /api/leaderboard/ve
```

Parameters:

- `timestamp`: unix timestamp; default: current hour
- `offset`: default: 0
- `limit`: default: 100

Query e.g.

```
GET /api/leaderboard/ve?limit=2
```

Response:

```json
{
  "ok": true,
  "data": {
    "list": [
      {
        "address": "0x2c45869703bf137050637f1C48d1A0C71e151Ac6",
        "balance": "969820612678829419200"
      },
      {
        "address": "0x1748672FbFA9D481c80d5feEeEdF7b30135e1F9f",
        "balance": "688722222208154400"
      }
    ],
    "totalCount": 903
  }
}
```

### Get volumes statistics

```
GET /api/swap/volume_stats
```

Response:

```json
{
  "ok": true,
  "data": {
    "list": [
      {
        "address": "0x417e9d065ee22dfb7cc6c63c403600e27627f333",
        "last24h": "24973.25342455045449038",
        "last7d": "281259.08508786726943578",
        "lastMonth": "787952.709921445087457756",
        "total": "11299206.986009009259125622"
      }
    ]
  }
}
```
