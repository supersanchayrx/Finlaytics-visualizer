import pandas as pd
import numpy as np


def CalculateReturns(close_series):
    result = close_series.pct_change()
    return result


def CalculateRisk(returns_series, rollingWindow= 20):
    volitality = returns_series.rolling(window=rollingWindow).std()
    return volitality

def CalculateSMA(close_series, avgWindow = 50):
    mva = close_series.rolling(window=avgWindow).mean()
    return mva
