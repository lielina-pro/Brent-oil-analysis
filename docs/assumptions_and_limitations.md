# Assumptions and Limitations

## Assumptions

1. **Single/few discrete structural breaks.** The core Task 2 model assumes
   the price (or log-return) process can be described by a small number of
   distinct regimes separated by sharp switch points (`tau`), each with its
   own constant mean (and optionally variance). Real markets can also drift
   gradually, which a single-switch model will not capture well — this is
   why we may extend to a multiple-change-point or regime-switching model.
2. **Log returns are approximately stationary and roughly normally
   distributed** for the purposes of the Gaussian likelihood used in the
   baseline PyMC model. Financial return series in practice have fatter
   tails than a Normal distribution; we treat this as a simplifying
   assumption and note it as a limitation.
3. **Event dates are "start" dates, not full timelines.** `key_events.csv`
   records the approximate onset of each event. Markets often price in
   anticipation before the "official" date (e.g., rumors of an OPEC
   decision) or react with a lag, so we allow a reasonable window (days to
   weeks) around each detected change point when looking for a matching
   event, rather than requiring an exact date match.
4. **No survivorship or gap issues in the raw price series** beyond the
   documented date-format inconsistency, which has been resolved in
   `scripts/data_loader.py`. We assume the price values themselves are
   accurate as reported.
5. **Brent price is treated as a single global benchmark**, ignoring
   regional price differentials (WTI, Dubai, etc.) and how those may respond
   differently to the same event.

## Limitations

1. **Correlation vs. causation.** This is the single most important caveat
   in this project. A change point model can tell us *that* the statistical
   properties of the price series changed at approximately date `X`, and *by
   how much*, with a given posterior probability. It **cannot** prove that a
   specific geopolitical or economic event *caused* that change. Any
   event we associate with a detected change point is a **plausible
   hypothesis**, supported by temporal proximity and domain knowledge — not
   a causal finding. Oil prices are driven by many simultaneous factors
   (macroeconomic data releases, currency moves, speculative positioning,
   weather, unrelated news), and more than one candidate event can often
   fall near the same change point window. Rigorously establishing causation
   would require techniques well beyond change point detection — e.g.,
   event-study methodology with counterfactuals, natural experiments, or
   structural econometric models (VAR/VECM) with exogenous controls — and
   even those carry their own strong assumptions.
2. **Confounding and omitted variables.** The model as specified uses price
   (or log returns) alone. It does not control for other macroeconomic
   variables (USD strength, global GDP growth, inflation, interest rates)
   that co-move with oil prices and could be the "true" driver behind an
   apparent shift coinciding with a geopolitical event.
3. **Look-ahead / multiple-comparison risk when matching events.** With 16+
   candidate events spanning 35 years and potentially several detected
   change points, some matches may occur by chance. We mitigate this by
   favoring matches with a short lag and a clear economic/geopolitical
   transmission story, but chance alignment cannot be fully ruled out.
4. **Single change point vs. multiple regimes.** The baseline model detects
   one switch point. Given the number of major events in the dataset's
   35-year span, a single change point is unlikely to represent the full
   history well; we plan to extend to multiple change points (or a
   regime-switching model) as time allows, and flag this as a scoping
   limitation of the mandatory/baseline analysis.
5. **Non-oil-market shocks are out of scope for the baseline model.** Purely
   macro/financial shocks (e.g., a general equity market crash) can move oil
   prices for reasons unrelated to the oil market itself; the baseline model
   does not distinguish "oil-specific" shocks from broader market shocks.
6. **Data currency.** The dataset ends in November 2022, so results and
   conclusions do not reflect any oil market developments after that date.
