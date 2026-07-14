# Frontend — React Dashboard

An interactive dashboard for exploring the Brent oil price history, the
compiled key events, and the Task 2 Bayesian change point results.

## Setup & Run

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. Make sure the Flask backend is also
running (see `../backend/README.md`) at `http://localhost:5000` — the
dashboard calls it directly.

To point the frontend at a different backend URL, set `VITE_API_URL`
(e.g. in a `.env` file in this folder):
```
VITE_API_URL=http://localhost:5000/api
```

## Build for production

```bash
npm run build      # outputs to frontend/dist/
npm run preview    # serve the production build locally
```

## Features

- **Historical price chart** — Brent spot price with event markers overlaid
  as vertical flare lines; hover for exact date/price.
- **Date range selector** — manual date pickers plus quick presets (full
  history, 2008 crisis, 2014-16 collapse, COVID/price war, Russia-Ukraine)
  matching the windows used in the Task 2 notebook.
- **Event list with drill-down** — filterable by category; clicking an
  event both expands its description and re-centers the price chart on a
  ~9-month window around it ("event highlight" functionality).
- **Rolling volatility chart** — 30-day annualized volatility, toggleable.
- **Change point results panel** — cards for the mandatory full-series
  model, the PELT multiple-change-point extension, and the two focused
  case studies (COVID/price war, Russia-Ukraine), each with quantified
  before/after price and probability statements pulled live from the
  backend.

## Responsiveness

The layout uses a CSS grid that collapses from a 3-column (sidebar + main)
desktop layout to a single stacked column under 900px width, tested down to
a 390px mobile viewport (see `../docs/screenshots/dashboard_mobile.png`).

## Project Layout

```
frontend/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx                       # top-level layout & data fetching
    ├── api.js                        # fetch wrapper for the Flask backend
    ├── styles/index.css              # design tokens + component styles
    └── components/
        ├── DateRangeControl.jsx
        ├── EventList.jsx
        ├── PriceChart.jsx
        ├── VolatilityChart.jsx
        └── ChangePointPanel.jsx
```

## Recommended Charting Library

Built with [Recharts](https://recharts.org/), per the brief's recommended
options.
