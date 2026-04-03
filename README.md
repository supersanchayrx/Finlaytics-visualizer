# Finlaytics-visualizer

A web application that fetches and visualizes stock data using the `yfinance` library and a Flask backend.

## Live Demo 🚀
You can try out the application directly on the web:
**[View Live Application Here](https://finlaytics-visualizer-76pvp9x7w-supersanchayrxs-projects.vercel.app/)**

> **Note:** The backend server is hosted on a free tier service and may go to sleep after a period of inactivity. If you receive a "Server Inactive", "Data Corrupted", or data fetching error, please **reload the page** and try again within a few seconds while the server wakes up.

## Overview

This project consists of:
- **Backend**: A Python Flask server (`app.py`) that uses `yfinance` and `pandas` to fetch historical stock data (1-hour intervals). This backend is already deployed to serve the Live Demo.
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