from flask import Flask, jsonify
from flask_cors import CORS
import fetcher
import yfinance as yf
from flask import request
import analysis
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "HOMEPAGE"

@app.route('/fetch-data', methods=['POST'])
def fetch_stock_data():
    try:
        #aapl = yf.Ticker("AAPL")

        #hist = aapl.history(period="1mo")

        data = request.get_json()

        if not data or "stock" not in data:
            return jsonify({"status ": "failed", 
                            "message":"Failed to resolve stock symbol empty or invalid"}),400
        
        stock = data.get("stock").upper()

        df = fetcher.fetch_data(stock,"1mo",None,None,"1h")
        df_daily = fetcher.fetch_data(stock,"1y",None,None,"1d")

        if df is None or df.empty or df_daily is None or df_daily.empty:
            return jsonify(
                {
                    "status":"failed",
                    "message":"The data seems to be corrupted or empty"
                }
            ), 400
        

        df_daily['Returns'] = analysis.CalculateReturns(df_daily['Close'])
        df_daily['Volatility'] = analysis.CalculateRisk(df_daily['Returns'])
        df_daily['SMA'] = analysis.CalculateSMA(df_daily['Close'])
        
        currentPrice = float(df['Close'].iloc[-1])
        maxOpen = float(df['Open'].max())
        maxClose = float(df['Close'].max())
        movingAvg = float(
            0 if pd.isna(df_daily['SMA'].iloc[-1]) 
            else df_daily['SMA'].iloc[-1]
        )
        currentReturn = float(
            0 if pd.isna(df_daily['Returns'].iloc[-1])
            else df_daily['Returns'].iloc[-1]
        )
        currentVolatality = float(
            0 if pd.isna(df_daily["Volatility"].iloc[-1])
            else df_daily["Volatility"].iloc[-1]
        )


        

        #print(df['Returns'])

        chartData = []
        for index, row in df.iterrows():
            chartData.append(
                {
                    "time" : index.strftime("%Y-%m-%d %H:%M:%S"),
                    "open" : float(row['Open']),
                    "high" : float(row['High']),
                    "low"  : float(row['Low']),
                    "close": float(row['Close'])
                }
            )

        dailyStats = {}
        for index, row in df_daily.iterrows():
            date_str = index.strftime("%Y-%m-%d")

            dailyStats[date_str] = {
                "returnPCT" : float(
                    0 if pd.isna(row['Returns'])
                    else row['Returns']),
                "volatility" : float(
                    0 if pd.isna(row['Volatility'])
                    else row['Volatility']),
                "sma" : float(
                    0 if pd.isna(row['SMA'])
                    else row['SMA']
                )
            }

        return jsonify(
            {
                "status" : "success",
                "stats" :
                {
                    "currentPrice" : float(currentPrice),
                    "maxClose" : float(maxClose),
                    "maxOpen" : float(maxOpen),
                    "movingAvg" : float(movingAvg),
                    "returnPCT" : float(currentReturn),
                    "volatility" : float(currentVolatality)
                },
                "chartData" : chartData,
                "dailyStats" : dailyStats
            }
        ), 200
    
    except Exception as e:
        return jsonify({"status":"failed", "message":str(e)}), 500
    

if __name__ == "__main__":
    app.run(port=5000,debug=False)
