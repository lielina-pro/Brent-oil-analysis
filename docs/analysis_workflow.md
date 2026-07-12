# Analysis Workflow: Change Point Analysis of Brent Oil Prices

**Project:** Birhan Energies — Brent Oil Price Change Point Analysis
**Author:** [Your Name]
**Date:** July 2026

## 1. Business Objective

Identify structural breaks in the historical Brent oil price series, associate
those breaks with plausible real-world triggers (geopolitical events, OPEC
decisions, sanctions, economic shocks), and quantify the size of each shift so
that investors, policymakers, and energy companies can make better-informed
decisions.

## 2. Data

- **Source:** `data/BrentOilPrices.csv` — daily Brent spot price (USD/barrel),
  20-May-1987 to Nov-2022 (the file runs slightly past the 30-Sep-2022 date
  quoted in the brief).
- **Fields:** `Date`, `Price`.
- **Known data quality issue:** the raw file mixes two date formats
  (`20-May-87` and `Nov 08, 2022`); `scripts/data_loader.py` parses both and
  returns a single clean, sorted, de-duplicated, date-indexed series.
- **Supplementary data:** `data/key_events.csv` — 16 manually researched
  major events (conflicts, OPEC/OPEC+ decisions, sanctions, economic shocks)
  with approximate start dates, used to interpret detected change points.

## 3. Analysis Steps

### Step 1 — Data Loading & Cleaning
- Load raw CSV, parse mixed date formats, sort chronologically, drop
  duplicate dates, index by date.

### Step 2 — Exploratory Data Analysis (EDA)
- Plot the raw price series to visually locate major trends, shocks, and
  volatility clusters.
- Compute log returns: `r_t = log(P_t) - log(P_{t-1})`, since raw prices are
  non-stationary (trending, changing variance) while log returns are closer
  to stationary and are the standard input for volatility/changepoint work.
- Run stationarity tests (Augmented Dickey-Fuller) on both the price level
  and the log-return series to confirm this.
- Visualize volatility clustering in log returns (periods of calm vs.
  turbulent price action), which motivates using a model that can capture
  regime shifts rather than a single global distribution.

### Step 3 — Bayesian Change Point Modeling (PyMC)
- Define a discrete uniform prior over `tau` (the switch point index) across
  all days in the series.
- Define two regime parameters (e.g., `mu_1`, `mu_2`, and optionally `sigma_1`,
  `sigma_2`) for the periods before/after `tau`.
- Use `pm.math.switch(tau >= time_index, mu_1, mu_2)` to pick the active mean
  at each time step.
- Connect to the data via a `pm.Normal` likelihood.
- Sample the posterior with `pm.sample()` (MCMC / NUTS).

### Step 4 — Model Interpretation
- Check convergence: `r_hat` values close to 1.0, healthy effective sample
  size, and well-mixed trace plots (`pm.plot_trace()`).
- Examine the posterior distribution of `tau` — a narrow, sharp peak means
  the model is confident about *when* the structural break happened; a wide
  or multi-modal posterior means the data doesn't strongly support a single
  clean break at that point.
- Compare posteriors of the before/after parameters to quantify the size of
  the shift (e.g., "mean log price rose by X, a Z% change, with probability
  P").

### Step 5 — Associate Change Points with Events
- Compare each detected `tau` (converted back to a calendar date) against
  `data/key_events.csv`.
- Look for events whose start date falls at or shortly before the estimated
  change point window (allowing for some lag, since markets can anticipate
  or lag news).
- Formulate — and clearly label as *hypotheses*, not proven causes — which
  event(s) most plausibly triggered each detected shift.

### Step 6 — Reporting
- Summarize findings for a non-technical audience: dates of change points,
  quantified before/after price impact, and the most plausible associated
  event for each.
- Explicitly separate statistically-supported findings (the change point
  itself, its date range, its magnitude) from interpretive claims (which
  event "caused" it).

## 4. Tools

- Python: `pandas`, `numpy`, `matplotlib`/`seaborn` for EDA
- `statsmodels` for stationarity testing (ADF)
- `PyMC` + `ArviZ` for Bayesian change point modeling and diagnostics
- Flask + React for the interactive dashboard (Task 3)

## 5. Deliverables Mapping

| Deliverable | File |
|---|---|
| Workflow document | `docs/analysis_workflow.md` (this file) |
| Events dataset | `data/key_events.csv` |
| Assumptions & limitations | `docs/assumptions_and_limitations.md` |
| EDA notebook | `notebooks/eda.ipynb` |
