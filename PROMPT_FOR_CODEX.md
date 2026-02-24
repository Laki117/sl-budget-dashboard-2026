# PROMPT_FOR_CODEX

## Master Prompt (Improved)

Build a production-grade Sri Lanka Budget 2026 analytics dashboard with strict source integrity and reproducibility.

Requirements:
1. Use only official Sri Lankan government/parliament/finance ministry sources for budget facts. Record every URL and retrieval UTC timestamp in `sources.md`.
2. Build a reproducible pipeline in `/scripts` that transforms raw extracted data into a normalized JSON dataset.
3. Never fabricate data. For unknown values, set `null` and display "Unavailable" in UI.
4. Deliver a modern, accessible, mobile-first dashboard with:
   - headline KPIs
   - filters and search
   - drill-down allocation views
   - trend comparisons from available historical values
   - tax/policy changes
   - methodology and source transparency
5. Implement polished loading, empty, and error states.
6. Validate build success locally.
7. Produce required docs: `README.md`, `DATA_DICTIONARY.md`, `sources.md`, `PROMPT_FOR_CODEX.md`, `DEPLOYED_URL.txt`.
8. Commit changes. If GitHub/Netlify auth is unavailable, stop and print exact login commands needed before proceeding.

Output quality bar:
- Professional spacing and hierarchy
- Accessible contrast and keyboard support
- Clear analytical narrative (not generic charts)
- Fast runtime and responsive behavior

## Why This Prompt Is Better
- Explicitly separates source integrity, data engineering, product UX, and delivery constraints.
- Adds hard anti-fabrication behavior (`null` + explicit unavailable rendering).
- Forces reproducibility as a first-class requirement, not an afterthought.
- Defines operational handling for auth blockers, reducing deployment ambiguity.
- Encodes quality gates for both design and engineering outcomes.

## Iteration Framework
1. Data audit pass: verify every displayed number has a source line.
2. Insight pass: add only decision-relevant views (composition, concentration, trend, policy impact).
3. UX pass: tune spacing/typography/interaction states and keyboard navigation.
4. Performance pass: remove unnecessary dependencies and reduce payload size.
5. Trust pass: ensure methodology and limitations are visible in-product.
