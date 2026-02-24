# Sri Lanka Budget 2026 Analytics Dashboard

Production-focused budget analytics dashboard for Sri Lanka Budget FY2026, built from official government publication extracts with transparent sourcing and reproducible data transformation.

## Features
- Headline fiscal metrics cards (expenditure, revenue, deficit, macro assumptions)
- Ministry allocation explorer with search, top-N filter, and drill-down
- Composition and concentration insight cards
- Historical trend view for officially available indicators
- Tax policy change cards with effective dates
- Methodology and transparency section
- Responsive, keyboard-accessible UI with loading/error/empty states

## Architecture
- `src/index.html`: dashboard layout and semantic structure
- `src/styles.css`: design system, responsive styling, accessibility-focused contrast
- `src/app.js`: data fetching, filtering, drill-down interactions, chart rendering
- `scripts/build_data.mjs`: reproducible data build from raw source extracts
- `data/raw/*`: extracted official lines and ministry allocation table inputs
- `data/processed/budget_2026.json`: normalized analytics dataset used by UI
- `server.js`: zero-dependency static server for local runtime

## Setup
```bash
npm run build
npm start
# open http://localhost:3000
```

## Data Pipeline
```bash
npm run build-data
```
Reads:
- `data/raw/speech_key_lines_2026.txt`
- `data/raw/ministry_allocations_2026_lkr_mn.csv`

Writes:
- `data/processed/budget_2026.json`

## Notes on Source Access
The environment used for this build had shell network DNS restrictions, so direct PDF download via `curl` from `treasury.gov.lk` was not possible in-shell. Official source URLs are still documented in `sources.md`, and pipeline inputs were created from extracted text/table content from those official publications.

## Missing Data Policy
No values are fabricated. If an official value was not available in retrieved documents, the dashboard marks it as unavailable.
