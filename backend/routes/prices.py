"""
Historical price data endpoints.

GET /api/prices                 -> full daily series (optionally filtered by ?start=&end=)
GET /api/prices/summary         -> summary stats (min/max price & date range)
GET /api/prices/volatility      -> rolling annualized volatility series (?window=30)
"""

from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from data_utils import get_prices_df

prices_bp = Blueprint("prices", __name__)


@prices_bp.route("", methods=["GET"])
def get_prices():
    df = get_prices_df()

    start = request.args.get("start")
    end = request.args.get("end")
    if start:
        df = df[df["Date"] >= pd.Timestamp(start)]
    if end:
        df = df[df["Date"] <= pd.Timestamp(end)]

    records = [
        {"date": row.Date.strftime("%Y-%m-%d"), "price": round(row.Price, 2)}
        for row in df.itertuples()
    ]
    return jsonify(records)


@prices_bp.route("/summary", methods=["GET"])
def get_summary():
    df = get_prices_df()
    return jsonify({
        "start_date": df["Date"].min().strftime("%Y-%m-%d"),
        "end_date": df["Date"].max().strftime("%Y-%m-%d"),
        "min_price": round(df["Price"].min(), 2),
        "max_price": round(df["Price"].max(), 2),
        "mean_price": round(df["Price"].mean(), 2),
        "n_days": len(df),
    })


@prices_bp.route("/volatility", methods=["GET"])
def get_volatility():
    window = int(request.args.get("window", 30))
    df = get_prices_df().copy()
    df["LogReturn"] = np.log(df["Price"]).diff()
    df["RollingVol"] = df["LogReturn"].rolling(window=window).std() * np.sqrt(252)
    df = df.dropna(subset=["RollingVol"])

    records = [
        {"date": row.Date.strftime("%Y-%m-%d"), "volatility": round(row.RollingVol, 4)}
        for row in df.itertuples()
    ]
    return jsonify(records)
