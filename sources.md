# Sources

Retrieval timestamp (UTC): 2026-02-24T05:57:06Z

## Official Budget Sources (Sri Lanka)
1. Parliament of Sri Lanka - "Presentation of Budget 2026"
   - URL: https://www.parliament.lk/en/news-en/view/4429?category=6
   - Note: Official parliamentary announcement and context.

2. Ministry of Finance / Department of National Budget (Treasury) - Budget 2026 portal
   - URL: https://www.treasury.gov.lk/web/budget/2026
   - Note: Official budget publication listing.

3. Budget Speech 2026 (English PDF) - Treasury file endpoint
   - URL: https://www.treasury.gov.lk/api/file/3307f6d8-3f47-4e6d-abf6-c07099e516f6
   - Note: Primary source for headline fiscal metrics, macro assumptions, and tax changes.

4. Approved Estimates 2026 (English PDF) - Treasury file endpoint
   - URL: https://www.treasury.gov.lk/api/file/e4df63c3-6191-4a17-8fca-58649db508f7
   - Note: Official estimate publication.

5. Activity Estimate 2026 (English PDF) - Treasury file endpoint
   - URL: https://www.treasury.gov.lk/api/file/8f4843c7-c564-488e-b500-f9e98f6ef5ce
   - Note: Source for ministry allocation table rows used in dashboard drill-down.

## Source Handling Notes
- Environment shell DNS restrictions prevented direct in-shell download from `treasury.gov.lk` during this run.
- Data inputs in `data/raw/` were built from extracted official publication content and remain traceable to the URLs above.
