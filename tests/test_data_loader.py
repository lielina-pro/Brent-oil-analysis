import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.data_loader import load_brent_prices, _parse_date
import pandas as pd


def test_parse_date_format_one():
    assert _parse_date("20-May-87") == pd.Timestamp("1987-05-20")


def test_parse_date_format_two():
    assert _parse_date("Nov 08, 2022") == pd.Timestamp("2022-11-08")


def test_load_brent_prices_sorted_and_indexed():
    df = load_brent_prices()
    assert df.index.is_monotonic_increasing
    assert "Price" in df.columns
    assert "LogReturn" in df.columns
    assert len(df) > 8000


def test_no_duplicate_dates():
    df = load_brent_prices()
    assert df.index.is_unique
