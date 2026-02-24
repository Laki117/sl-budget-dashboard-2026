# Data Dictionary

## File: `data/processed/budget_2026.json`

## `metadata`
- `country` (string): Country name.
- `fiscal_year` (number): Budget year.
- `currency` (string): Currency code.
- `unit_conventions` (object): Unit labels used in dataset.
- `generated_at_utc` (string): ISO-8601 UTC timestamp of dataset generation.
- `completeness_note` (string): Limitation statement.

## `headline_metrics` (array)
Each item:
- `label` (string): Metric name.
- `value_lkr_bn` (number|null): Value in LKR billions when applicable.
- `value_pct` (number|null): Percent value when applicable.
- `value_usd_bn` (number|null): USD billions value when applicable.

## `ministry_allocations` (array)
Each item:
- `ministry` (string): Ministry name from activity estimate extract.
- `recurrent_lkr_mn` (number): Recurrent allocation in LKR millions.
- `capital_lkr_mn` (number): Capital allocation in LKR millions.
- `total_lkr_mn` (number): Total allocation in LKR millions.

## `tax_policy_changes` (array)
Each item:
- `name` (string): Tax instrument.
- `effective_date` (string): ISO date.
- `previous_rate_pct` (number): Previous rate.
- `new_rate_pct` (number): New rate.

## `trend_indicators` (object)
- `poverty_rate_pct` (array): `{ year, value }` points.
- `merchandise_exports_usd_bn` (array): `{ year, value }` points.

## `derived_insights` (object)
- `top_5_ministry_share_pct_of_listed_allocations` (number|null): Concentration share.
- `capital_share_pct_of_listed_allocations` (number|null): Capital composition share.
