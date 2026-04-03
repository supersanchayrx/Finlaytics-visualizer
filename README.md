# Finlaytics-Visualizer

A financial data analysis and visualization dashboard built with Python, Pandas, and Chart.js. The application performs exploratory data analysis on stock market data — computing daily returns, rolling volatility, and moving averages — and presents the results through interactive candlestick, area, and line charts alongside key performance indicator (KPI) cards.

## Live Demo 🚀

You can try out the application directly on the web:
**[View Live Application Here](https://finlaytics-visualizer-76pvp9x7w-supersanchayrxs-projects.vercel.app/)**

> **Note:** The backend server is hosted on a free tier service and may go to sleep after a period of inactivity. If you receive a "Server Inactive", "Data Corrupted", or data fetching error, please **reload the page** and try again within a few seconds while the server wakes up.

## Features

### Data Analysis (Python / Pandas)
- **Daily Returns** — Percentage change in closing price computed via `pct_change()`
- **Rolling Volatility** — 20-day rolling standard deviation of returns to quantify risk
- **Simple Moving Average (SMA-50)** — 50-day rolling mean of closing prices for trend identification
- **Dual Dataframe Architecture** — Hourly data (1-month window) for intraday charting, daily data (1-year window) for statistical metrics

### Interactive Charting (Chart.js)
- **Candlestick Chart** — OHLC visualization for intraday price action
- **Area Chart** — Filled line chart showing price movement over time
- **Line Chart** — Clean line plot of closing prices
- **Day-by-Day Navigation** — Browse through individual trading days with Previous / Next controls

### KPI Dashboard
- **Current Price** — Latest closing price for the selected day
- **Daily Return (%)** — Percentage return for the active trading day
- **Volatility Index** — Rolling standard deviation value for the active day

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, Flask-CORS |
| Data Fetching | yfinance |
| Data Analysis | Pandas, NumPy |
| Frontend | HTML, CSS, JavaScript |
| Charting | Chart.js, chartjs-chart-financial, Luxon (date adapter) |
| Hosting | Render (backend), Vercel (frontend) |

## Project Structure

```
yFinance/
├── app.py            # Flask API server — serves chart data and computed statistics
├── fetcher.py        # Data fetching module — wraps yfinance with period/interval support
├── analysis.py       # Statistical analysis — returns, volatility, SMA calculations
├── index.html        # Frontend entry point
├── css/
│   └── style.css     # Dashboard layout styles
├── js/
│   └── app.js        # Client-side logic — data fetching, chart rendering, KPI updates
├── requirements.txt  # Python dependencies
└── package.json      # Frontend dependencies (Chart.js financial plugin)
```

## Prerequisites

- [Python 3.x](https://www.python.org/)
- Pip (Python Package Installer)

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd yFinance
   ```

2. **Install Python dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies:**
   ```bash
   npm install
   ```

4. **Run the backend server:**
   ```bash
   python app.py
   ```
   The Flask API will start running on `http://localhost:5000`.

5. **Run the frontend:**
   Open `index.html` directly in your web browser, or serve it using a local development server:
   ```bash
   npx serve .
   ```

> **Tip:** When running locally, update the fetch URL in `js/app.js` from the Render deployment URL to `http://localhost:5000/fetch-data`.

## API Reference

### `POST /fetch-data`

Fetches stock data and computed statistics for a given ticker symbol.

**Request Body:**
```json
{
  "stock": "AAPL"
}
```

**Response:**
```json
{
  "status": "success",
  "stats": {
    "currentPrice": 195.42,
    "maxClose": 198.11,
    "maxOpen": 197.85,
    "movingAvg": 191.30,
    "returnPCT": 0.0087,
    "volatility": 0.0142
  },
  "chartData": [
    {
      "time": "2026-03-15 09:30:00",
      "open": 194.50,
      "high": 195.80,
      "low": 194.10,
      "close": 195.42
    }
  ],
  "dailyStats": {
    "2026-03-15": {
      "returnPCT": 0.0087,
      "volatility": 0.0142,
      "sma": 191.30
    }
  }
}
```

## Supported Stocks

Currently available via dropdown: **AAPL** (Apple), **MSFT** (Microsoft), **GOOG** (Google), **NVDA** (Nvidia)