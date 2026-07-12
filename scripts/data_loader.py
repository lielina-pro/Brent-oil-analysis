"""
data_loader.py

Utility for loading and cleaning the raw Brent oil price dataset.

The raw CSV (`data/BrentOilPrices.csv`) contains two different date string
formats mixed together:
    - "20-May-87"      (day-Mon-YY)   used for most of the file
    - "Nov 08, 2022"   (Mon DD, YYYY) used for a block of rows around
                                       Apr 2020 onward
This loader parses both formats safely and returns a clean, sorted,
date-indexed DataFrame with no format ambiguity.
"""

from pathlib import Path
import pandas as pd

DEFAULT_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "BrentOilPrices.csv"


def _parse_date(date_str: str) -> pd.Timestamp:
    """Parse a single date string that may be in one of two known formats."""
    date_str = date_str.strip()
    for fmt in ("%d-%b-%y", "%b %d, %Y"):
        try:
            return pd.to_datetime(date_str, format=fmt)
        except ValueError:
            continue
    # Fall back to pandas' generic parser (logged as a last resort)
    return pd.to_datetime(date_str)


def load_brent_prices(path: str | Path = DEFAULT_DATA_PATH) -> pd.DataFrame:
    """
    Load, clean, and return the Brent oil price series.

    Returns
    -------
    pd.DataFrame
        Indexed by Date (datetime64), sorted ascending, single column 'Price'.
        Also includes 'LogPrice' and 'LogReturn' columns.
    """
    df = pd.read_csv(path)
    df["Date"] = df["Date"].apply(_parse_date)
    df = df.sort_values("Date").reset_index(drop=True)
    df = df.drop_duplicates(subset="Date", keep="first")
    df = df.set_index("Date")

    df["LogPrice"] = df["Price"].apply(lambda x: pd.NA if x <= 0 else x).astype(float)
    import numpy as np
    df["LogPrice"] = np.log(df["Price"])
    df["LogReturn"] = df["LogPrice"].diff()

    return df


if __name__ == "__main__":
    data = load_brent_prices()
    print(data.head())
    print(data.tail())
    print(f"\nRows: {len(data)}")
    print(f"Date range: {data.index.min().date()} to {data.index.max().date()}")
