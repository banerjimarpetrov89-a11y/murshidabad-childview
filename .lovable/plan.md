
# Goal
Turn the dashboard into an attractive, informative public + research portal by ingesting the newly uploaded HMIS (Health Management Information System) sub-centre datasets for **Khargram, Bharatpur II, Suti II, Murshidabad-Jiaganj, and the 36-SC consolidated workbook**, plus the PW Registration line-list, alongside the existing Crime-against-Children draft. Polish the UI for public viewing.

## 1. Data ingestion (build-time, no backend changes)

Add a Node build script `scripts/ingest-hmis.ts` that reads the uploaded `.xlsx`/`.xls` files from `src/data/raw/` and emits typed JSON to `src/data/hmis.generated.ts`. We commit the generated TS so the runtime stays static.

Datasets emitted:
- `PW_REGISTRATION` — per sub-centre: projected pop, estimated PW, total registered, 1st-trimester %, high-risk %, severe-anaemic %. (Source: `PW_Registration_05_07_2025_10_51_47.xlsx`, FY 2024-25.)
- `SC_HMIS_2024_25` — 36 sub-centres × key indicators from `APRIL_2024_to_MARCH_2025_SC_wise_HMIS_Data.xlsx` (ANC, institutional delivery, immunisation, FP-Antara doses, anaemia).
- `BLOCK_HMIS` — block-level rollups for Khargram (Apr–Jul 2025 + Aug 2025), Bharatpur II, Suti II, Murshidabad-Jiaganj.
- `FP_ANTARA_TREND` — injectable contraceptive doses 1–4 per SC (from "FP Antara Analysis" sheet).
- `TEENAGE_PREG_BY_SC` — derived: teenage-pregnancy share per SC using PW age-band columns.

Each record carries `{block, subCentre, indicator, value, period}` to enable filtering.

## 2. New page — `/hmis` (Health Indicators)

Route: `src/routes/hmis.tsx`. Sections:
- **Hero strip**: 4 KPIs — total PW registered (district-rolled), % 1st-trimester registration, % high-risk PW, % severe anaemic.
- **Block selector + Sub-centre drill-down table** (shadcn `Table` + search) — sortable on every indicator.
- **Antara FP trend** — small-multiple line charts per SC (Recharts), one per dose 1→4 to show drop-off (a public-health red flag).
- **Anaemia & high-risk heatstrip** — horizontal bar with colour ramp per SC.
- **Teenage pregnancy by SC** — derived bars, linked back to the Vulnerability Matrix.
- **Methodology card** at the bottom citing HMIS / NHM as the source and the data window.

Add `/hmis` to header nav and footer.

## 3. Wire HMIS data into existing pages

- **Home (`/`)** — add a 4-card "Health Snapshot" row between the existing KPI strip and the map: institutional delivery %, full immunisation %, severe-anaemic PW %, teenage-pregnancy %. Add a one-line "Where the data comes from" caption with source chips (HMIS, eCourts, CMRTS, NFHS-V, DAR).
- **Hotspot Map (`/map`)** — extend the block-detail drawer with a "Health profile" mini-section (ANC, institutional delivery, anaemia) sourced from `BLOCK_HMIS` when available, with a clear "Data not yet ingested" fallback for the other 22 blocks.
- **Vulnerability Matrix (`/matrix`)** — add a third axis-toggle: "Teenage pregnancy %" derived from PW data, so the bubble chart can be reshaded by health vs. justice indicators.
- **Insights (`/insights`)** — add two charts: "FP-Antara drop-off curve" (Doses 1→4 across 36 SCs) and "1st-trimester PW registration vs district target" with a "What this means" caption.
- **Clusters (`/clusters`)** — the Khargram + Bharatpur II + Suti II cluster cards get a real HMIS factsheet panel instead of placeholder copy.

## 4. Visual polish for public viewing

- **Hero (`/`)** — replace the current Hero with a fuller editorial header: large display heading, lead paragraph, three trust chips ("26 blocks · 36 sub-centres · 14 police stations"), source pills, scroll cue. Keep existing palette tokens — no new colours.
- **PageHeader** — add an optional `stats` slot rendering 3 inline stats under the lead, so every section page shows context (e.g., on `/hmis`: "36 SCs · FY 2024-25 · NHM HMIS").
- **KpiCard** — add a `trend` prop (sparkline + delta chip) so KPIs can show ↑/↓ vs baseline; reuse on Home, `/hmis`, `/insights`.
- **Footer** — add a "For researchers" block linking `/hmis`, `/insights`, `/publications`, and a "Cite this dashboard" snippet (APA + plain-text), plus the existing source links.
- **Header** — add `/hmis` to the top nav and a small "Public dashboard" badge.
- **Typography pass** — keep the existing serif display / sans body pair; tighten section spacing, lift section eyebrows to uppercase tracked labels.
- **Accessibility** — ensure all new charts have a textual `<caption>`/summary, and the SC drill-down table has visible focus states.

## 5. Technical notes

- New deps: none (Recharts and shadcn already in the stack). The ingest script uses `xlsx` (npm) at build time only.
- Raw uploads land in `src/data/raw/` (gitignored binaries optional); generated output is `src/data/hmis.generated.ts` (committed). All HMIS reads go through `src/data/hmis.ts` which re-exports the generated module + helpers (`getBlockHMIS`, `getSCByBlock`, `computeTeenagePregRate`).
- The crime PDF is already integrated; we only add cross-links from `/hmis` cards into the matching `/red-flags` and `/clusters` narratives.
- No DB schema changes. No edge functions. No new secrets.

## Out of scope
- Per-block ingestion for the 22 blocks not in the upload set (placeholder "data pending" cards instead).
- Authenticated researcher-only views; everything is public.
- Re-doing the Leaflet map styling — only the drawer content changes.
