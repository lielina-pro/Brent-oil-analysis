# Scripts

Reusable, non-notebook Python utilities for the project:

- `data_loader.py` — parses the raw `BrentOilPrices.csv` (handles the mixed date formats present in the raw file) and returns a clean, date-indexed DataFrame.

These scripts are imported by the notebooks and by the Flask backend (Task 3) so logic isn't duplicated.
