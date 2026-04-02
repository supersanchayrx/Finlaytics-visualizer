from flask import Flask, jsonify
from flask_cors import CORS
import fetcher
import yfinance as yf
from flask import request

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

        if df is None or df.empty:
            return jsonify(
                {
                    "status":"failed",
                    "message":"The data seems to be corrupted or empty"
                }
            ), 400
        
        currentPrice = float(df['Close'].iloc[-1])
        maxOpen = float(df['Open'].max())
        maxClose = float(df['Close'].max())

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

        return jsonify(
            {
                "status" : "success",
                "stats" :
                {
                    "currentPrice" : float(currentPrice),
                    "maxClose" : float(maxClose),
                    "maxOpen" : float(maxOpen)
                },
                "chartData" : chartData
            }
        ), 200
    
    except Exception as e:
        return jsonify({"status":"failed", "message":str(e)}), 500
    

if __name__ == "__main__":
    app.run(port=5000,debug=False)
