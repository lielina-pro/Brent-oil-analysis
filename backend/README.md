# Backend — Flask API

Serves the processed Brent oil data, key events, and Task 2 change point
model results to the React dashboard.

## Setup & Run

```bash
cd backend
pip install -r ../requirements.txt
python app.py
```

The API runs at `http://localhost:5000` by default. CORS is enabled for all
origins so the React dev server (typically `http://localhost:5173`) can
call it directly.

## API Reference

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Liveness check, returns `{"status": "ok"}` |

### Historical Prices

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/api/prices` | `start`, `end` (optional, `YYYY-MM-DD`) | Daily price series, optionally filtered by date range |
| GET | `/api/prices/summary` | — | Min/max/mean price, date range, row count |
| GET | `/api/prices/volatility` | `window` (optional, default 30) | Rolling annualized volatility of log returns |

Example:
```
GET /api/prices?start=2020-01-01&end=2020-06-01
[{"date": "2020-01-02", "price": 66.25}, ...]
```

### Key Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | All 16 researched events (date, name, category, description) |
| GET | `/api/events/categories` | Distinct event categories (for filter dropdowns) |
| GET | `/api/events/<event_id>` | A single event by id |

### Change Point Results (Task 2)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/changepoints` | Everything: full-series model, PELT breakpoints, case studies |
| GET | `/api/changepoints/full-series` | The mandatory full-history Bayesian model result |
| GET | `/api/changepoints/pelt` | Multiple-change-point (PELT) extension results |
| GET | `/api/changepoints/case-studies` | Focused case studies (COVID/price-war, Russia-Ukraine) |

## Project Layout

```
backend/
├── app.py                      # Flask app factory / entrypoint
├── data_utils.py                # shared data loading helpers (cached)
├── data/
│   └── changepoint_results.json # Task 2 model outputs, precomputed from notebooks/change_point_model.ipynb
└── routes/
    ├── prices.py
    ├── events.py
    └── changepoints.py
```

Price and event data itself is read from the top-level `../data/` folder
(`brent_prices_cleaned.csv`, `key_events.csv`) so there is a single source
of truth shared with the analysis notebooks.
