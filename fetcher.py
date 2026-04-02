import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import os 

def fetch_data(ticker: str = "AAPL", period: str = None, start: str = None, end: str = None, interval: str = "1h"):
    try:
        if period and (start or end):
            raise ValueError("Use either period range or start-end range")
        
        if not period and not (start and end):
            raise ValueError("Use either Period range or define both start and end")
        

        print(f"Fetching data for {ticker} ...")

        if(period):
            df = yf.download(ticker,period=period,interval=interval)
        else:
            df = yf.download(ticker, start = start, end = end, interval=interval)

        if df.empty:
            raise ValueError("No data fetched. Check parameters again")
        
        os.makedirs("data", exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        file_path = f"data/{ticker}_{timestamp}_raw.csv"

        df.to_csv(file_path)

        print(f"data saved to {file_path}")
        print(f"Data has {df.shape[0]} rows and {df.shape[1]} columns")

        newDf = df.copy()
        newDf.columns = newDf.columns.droplevel(1)

        return newDf

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return None

    
