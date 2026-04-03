# Finlaytics-visualizer

A web application that fetches and visualizes stock data using the `yfinance` library and a Flask backend.

## Overview

This project consists of:
- **Backend**: A Python Flask server (`app.py`) that uses `yfinance` and `pandas` to fetch historical stock data (1-hour intervals).
- **Frontend**: A simple client that takes a stock ticker input and visualizes the financial data.

## Prerequisites

- [Python 3.x](https://www.python.org/)
- Pip (Python Package Installer)

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd yFinance
   ```

2. **Install the dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   ```bash
   python app.py
   ```
   The Flask API will start running on `http://localhost:5000`.

4. **Run the frontend:**
   Open `index.html` directly in your web browser, or serve it using a local development server, for example:
   ```bash
   npx serve .
   ```

## Production Deployment (e.g., Render)

To deploy this backend, you can use a free web hosting service like [Render.com](https://render.com). 

When deploying on Render, use the following configurations:
- **Environment**: Python
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

**Important Note for Frontend**: 
Once your backend is successfully deployed, it will be assigned a new public URL. Make sure to update the fetch API endpoint in your `js/app.js` file to point to your new production URL instead of `http://localhost:5000/fetch-data`.