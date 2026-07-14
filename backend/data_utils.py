"""Shared data-loading helpers for the Flask backend."""

from pathlib import Path
from functools import lru_cache
import pandas as pd

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


@lru_cache(maxsize=1)
def get_prices_df() -> pd.DataFrame:
    """Load the cleaned Brent price series (see scripts/data_loader.py for the
    original cleaning step that produced this file)."""
    df = pd.read_csv(DATA_DIR / "brent_prices_cleaned.csv", parse_dates=["Date"])
    return df.sort_values("Date").reset_index(drop=True)


@lru_cache(maxsize=1)
def get_events_df() -> pd.DataFrame:
    df = pd.read_csv(DATA_DIR / "key_events.csv", parse_dates=["start_date"])
    return df.sort_values("start_date").reset_index(drop=True)
