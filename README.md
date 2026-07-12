# Brent Oil Price Change Point Analysis

Change point analysis and statistical modeling of Brent crude oil prices,
associating detected structural breaks with major geopolitical, economic,
and OPEC-related events. Built for Birhan Energies (10 Academy KAIM Week 10
challenge).

## Project Structure

```
├── .vscode/
│   └── settings.json
├── .github/
│   └── workflows/
│       └── unittests.yml
├── .gitignore
├── requirements.txt
├── README.md
├── data/
│   ├── BrentOilPrices.csv      # raw daily Brent prices (1987-2022)
│   └── key_events.csv          # researched major oil-market events
├── docs/
│   ├── analysis_workflow.md
│   └── assumptions_and_limitations.md
├── src/
│   └── __init__.py
├── notebooks/
│   ├── __init__.py
│   ├── README.md
│   └── eda.ipynb
├── tests/
│   ├── __init__.py
│   └── test_data_loader.py
└── scripts/
    ├── __init__.py
    ├── README.md
    └── data_loader.py
```

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

Run the EDA / change point analysis notebook:

```bash
jupyter notebook notebooks/eda.ipynb
```

Run tests:

```bash
pytest tests/ -v
```

## Task Status

- [x] **Task 1** — Workflow definition, event data compilation, assumptions &
  limitations, initial EDA (`docs/`, `data/key_events.csv`, `notebooks/eda.ipynb`)
- [ ] **Task 2** — Bayesian change point modeling with PyMC, quantified
  impact statements, event association
- [ ] **Task 3** — Flask backend + React dashboard

## Key Caveat

This analysis identifies **statistical** change points in the price series
and proposes **plausible hypotheses** for what may have triggered them based
on timing and domain knowledge. It does not establish causation — see
`docs/assumptions_and_limitations.md` for a full discussion.
