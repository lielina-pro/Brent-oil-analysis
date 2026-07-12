# Task 2 — Change Point Modeling Results & Interpretation

## Model 1: Full-Series Single Change Point (Mandatory Core Analysis)

A Bayesian change point model (PyMC) was fit to the entire 1987-2022 daily
price series, with `tau` as a discrete uniform prior over all 9,011 days,
separate means (`mu1`, `mu2`) before/after `tau`, and a shared `sigma`.

**Convergence:** all parameters converged cleanly (max r_hat = 1.00, high
effective sample sizes for a 4-chain, 3,000-tune/3,000-draw run).

**Result:** the posterior for `tau` is centered on **22 Feb 2005** (90%
credible interval: 16 Feb – 2 Mar 2005).

- Mean price **before**: $21.42/barrel
- Mean price **after**: $75.60/barrel
- **Change: +253%**, with posterior probability ≈ 1.00 that the price
  increased after this point.

**Interpretation:** no single event in `data/key_events.csv` falls near
this date — the nearest are the 2003 Iraq invasion (~2 years earlier) and
the 2008 price peak (~3 years later). This is the expected and important
limitation flagged in Task 1: a *single* change point cannot represent 35
years containing many real shocks, so the model instead finds the split
that best separates the broad "low-price era" (pre-2000s) from the
"high-price era" (2000s commodity supercycle, driven by rising
emerging-market demand and a weaker US dollar), rather than pinpointing a
discrete trigger event. This result should be reported as evidence of a
multi-year regime shift, not a single-day cause.

## Model 2: Multiple Change Points (PELT Extension)

To better capture the multiple real structural breaks in the full history,
the PELT algorithm (`ruptures`) detected **4 breakpoints**:

| Segment | Mean Price | vs. Prior Segment |
|---|---|---|
| 1987-05-20 to 2004-07-26 | $20.65 | — |
| 2004-07-26 to 2010-12-06 | $69.46 | +236% |
| 2010-12-06 to 2014-10-31 | $108.80 | +57% |
| 2014-10-31 to 2021-09-21 | $56.34 | -48% |
| 2021-09-21 to 2022-11-14 | $97.52 | +73% |

Only the 2010-12-06 breakpoint falls within the matching window (120 days)
of a researched event — the Arab Spring / Libyan Civil War (15 Feb 2011),
roughly 2 months later. The other breakpoints likely reflect gradual
macro/demand-driven trends rather than single discrete triggers, which is
consistent with the full-series model result above.

## Model 3: Focused Case Study — COVID-19 / Saudi-Russia Price War (2020)

Restricting the same PyMC model to a Nov 2019–Jun 2020 window produced a
**sharp, narrow posterior** centered on **6 Mar 2020**.

- Mean price **before**: $62.05/barrel
- Mean price **after**: $25.03/barrel
- **Change: -59.7%**, with posterior probability ≈ 1.00 that price dropped.

**Interpretation:** 6 Mar 2020 sits 2 days before the Saudi-Russia price war
began (8 Mar 2020) and 5 days before WHO declared COVID-19 a pandemic (11
Mar 2020). Given that markets often price in anticipation of a breakdown in
OPEC+ talks (collapsed 6 Mar 2020) even before the formal price-war
announcement, this change point aligns very closely with both compounding
shocks. This is a plausible, well-supported hypothesis linking the
detected break to these two nearly-simultaneous events — not proof that
either alone caused it.

## Model 4: Focused Case Study — Russian Invasion of Ukraine (2022)

Restricting the model to a Nov 2021–Jun 2022 window produced a sharp
posterior centered on **3 Feb 2022**.

- Mean price **before**: $81.46/barrel
- Mean price **after**: $109.57/barrel
- **Change: +34.5%**, with posterior probability ≈ 1.00 that price rose.

**Interpretation:** the detected change point (3 Feb 2022) precedes the
actual invasion date (24 Feb 2022) by about three weeks. This is consistent
with markets pricing in escalating risk as troop buildups and diplomatic
tensions were widely reported through January and early February 2022,
ahead of the invasion itself — an example of anticipatory pricing rather
than a same-day reaction. The subsequent price level increase of +34.5% is
directionally and materially consistent with the known market impact of
the invasion and the sanctions/export disruption that followed.

## Cross-Cutting Observations

1. **Scale matters.** The same model specification behaves very differently
   depending on the window it's given: applied to 35 years, it finds a
   broad multi-year regime split; applied to a focused ~7-month window
   around a known shock, it finds a sharp, well-supported break aligned
   with real events.
2. **Detected change points sometimes precede the "official" event date**
   (as in the Ukraine case study), which is a reminder that markets often
   price in anticipated risk ahead of a formal announcement — consistent
   with the "start dates are approximate, allow a window" assumption
   documented in Task 1.
3. **Not every statistical break maps to a named event** (as in most of the
   PELT breakpoints and the full-series model). This is expected and should
   be reported honestly rather than force-fit to the nearest available
   event in the dataset.
4. As throughout this project: all event associations here are
   **hypotheses supported by timing and magnitude**, not causal proof. See
   `docs/assumptions_and_limitations.md`.

## Advanced Extensions (Discussion — Not Implemented)

- **Other explanatory data sources:** incorporating GDP growth, inflation,
  and USD exchange rate indices would let a model separate demand-driven
  price moves from event-driven supply shocks — useful since several
  detected breaks (e.g. the 2000s rally) look macro-driven rather than
  event-driven.
- **VAR (Vector Autoregression):** would allow modeling dynamic
  relationships between oil prices and macro variables jointly, capturing
  lead/lag effects (e.g. does USD strength lead or lag oil price moves?).
- **Markov-Switching models:** would let "calm" vs. "volatile" regimes be
  inferred directly and probabilistically at every point in time, rather
  than assuming a fixed number of discrete breakpoints — a natural
  extension of the volatility clustering observed in the Task 1 EDA.
