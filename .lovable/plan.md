
## Goal
Integrate every finding from the new "Crime against Children" draft into the site, and add geographic North/South/East/West/Central cluster filtering on the hotspot map.

## 1. Data layer updates (`src/data/blocks.ts` + new `src/data/crime.ts`)

Refresh per-block numbers using the PDF's exact values for the 14 blocks covered: Murshidabad-Jiaganj (TP 2760, CMRTS 75, FIRs 51), Lalgola (5445/57/65), Kandi (3522/23/28), Bhagwangola I (3483/114/18), Bhagwangola II (2661/71/25), Farakka (3361/19/22), Nabagram (3040/69/18), Khargram (3909/39/13), Samserganj (4548/49/26), Sagardighi (4559/32/10), Burwan (2641/20/15), Bharatpur I (2112/21/20), Bharatpur II (1734/17/13), Suti I (2909/22/14), Raghunathganj I+II (7201/78/15), Raninagar I (3165/51/25), Raninagar II (2990/21/25). Recompute reportingSilence from the published CMRTS-vs-TP and FIR-vs-TP ratios.

Add a new `compass` field per block (`N | S | E | W | C`) so the map can filter by cardinal cluster. Add `policeStation` per block.

Create `src/data/crime.ts` with:
- `POLICE_STATION_CASES` — per-PS category breakdown (e.g. Lalgola PS 65 cases split into POCSO+Child Marriage 13, POCSO+Rape 12, POCSO+Kidnapping 19, etc.) for all 14 stations from the doc.
- `PS_FREQUENCY_2024` and `PS_FREQUENCY_2025` — high-frequency PS lists (Lalgola 38, Murshidabad 23, Shamserganj 18, Kandi 15, Farakka 14…).
- `ECOURTS_YEAR_COMPARISON` — 2024 (201 cases) vs 2025 (226 cases) with category split.
- `CMRTS_TREND` — 130 (2023) → 471 (2024) → 929 (2025).
- `NFHS_TREND` — child marriage 53.6%→55.3%; teenage pregnancy 29.5%→20.6%.
- `DAR_SUMMARY` — Murshidabad PD 208 cases (PCMA 97, POCSO 104, Kidnap 20, Trafficking 17; multi-convict 50, child-convicts 18, avg age 28.5) and Jangipur PD 25 cases (PCMA 8, POCSO 17, Rape 3; child-convicts 9, multi-convict 6, avg age 26).
- `LANDMARK_VERDICT` — the 9-yr-old victim case verdict text (death sentence + life imprisonment, POCSO §6).
- `JANGIPUR_PD_BLOCKS` — Farakka, Samserganj, Suti I, Suti II, Raghunathganj I/II, Sagardighi.
- `LIMITATIONS` — Berhampore court missing, FIR-CMRTS not joined, pendency not analysed.

## 2. Map: cardinal cluster filter (`MurshidabadMap.tsx` + `/map`)

Add a top filter bar above the geographic Leaflet map with chips: **All · North · South · East · West · Central**. Selecting a direction dims non-matching blocks (fillOpacity 0.15) and zooms-fits to the selected subset. Compass groupings:
- **N**: Farakka, Samserganj, Suti I/II, Raghunathganj I/II, Sagardighi, Lalgola, Bhagwangola I/II, Raninagar I/II, Jalangi
- **C**: Murshidabad-Jiaganj, Berhampore, Beldanga I/II, Hariharpara, Nowda
- **E**: Domkol, Raninagar I/II edge (border)
- **S**: Bharatpur I/II, Burwan, Khargram, Kandi
- **W**: Nabagram, Sagardighi west, Khargram west

Also add an indicator selector (Pregnancies / Child Marriages / FIRs / Reporting Silence) that reshades the map.

## 3. Home (`/`)
- Update KPIs to PDF figures: NFHS-V child marriage **55.3%** (↑1.7), teenage pregnancy **20.6%**, CMRTS prevented YoY **130→471→929** (mini sparkline), eCourts 2024 vs 2025 (**201 → 226**, +12%).
- Add a "DAR Snapshot" strip: 208 cases in Murshidabad PD + 25 in Jangipur PD over May–Nov 2025.
- Embed cardinal-filter map preview.

## 4. Hotspot Map page (`/map`)
- Cardinal filter (above) + indicator selector.
- New right-rail card: "Top Police Stations by Case Frequency (2025)" with Lalgola 38 leading.
- Block detail drawer extended: shows police station name + case-category breakdown + 2024 vs 2025 trend + reporting discrepancy ratios.

## 5. Data Insights (`/insights`)
Add three new charts:
- **CMRTS Prevention Trend** (bar) 2023/2024/2025.
- **eCourts 2024 vs 2025** grouped bar by category (POCSO+Child Marriage 15→44, POCSO+Kidnapping 67→67, Sexual Harassment 43, Sexual Assault 53→102).
- **Top PS Case Frequency 2024 vs 2025** horizontal bar.
- **DAR Legislation Mix** donut for Murshidabad PD + Jangipur PD.
Each gets a "What this means" caption.

## 6. Vulnerability Matrix (`/matrix`)
- Recompute X (reporting silence) and Y (TP volume) from the refreshed numbers.
- Add a third dimension via point size = child-marriage cases prevented (CMRTS).
- Add a "Discrepancy Ratio" toggle: switch Y to FIRs/TP × 100 to spotlight the silent quadrant (Khargram 0.003%, Sagardighi 0.005%, Samserganj 0.005%).

## 7. Red Flags (`/red-flags`)
Add five new evidence cards from the PDF:
- **The 0.003% Justice Gap — Khargram** (3,909 TP vs 13 FIRs).
- **Sagardighi & Samserganj — vanishing reporting** (0.005% FIR ratio).
- **Lalgola = district crime epicentre** (Lalgola PS 38 cases in 2025, top of district).
- **Raghunathganj combined paradox** (7,201 TP — highest in dataset — only 15 FIRs).
- **Landmark Verdict** — the 9-year-old victim, Dinabandhu Halder death sentence under POCSO §6, as proof the system *can* deliver when cases reach court.
Each retains the "What should be done here?" CTA.

## 8. Cluster Stories (`/clusters`)
- Add a **Jangipur Police District** narrative card (its 7 blocks, 1,054.5 km², ~1.9M population, est. 1 Jan 2020, focus = border security + anti-trafficking).
- Add the cardinal **N/S/E/W/C** roll-up beside the existing 7 thematic clusters: aggregate TP, CMRTS, FIRs and discrepancy ratios per direction.
- Add a "Limitations of this Analysis" footer (Berhampore court gap, no FIR-CMRTS join, no pendency).

## 9. Header / Footer
- Footer: add "eCourts Murshidabad", "CMRTS Portal", "HMIS", "Daily Arrest Report" as data-source links.
- Add new top-nav item linking to a small **Methodology & Limitations** section on `/insights`.

## Out of scope
No backend schema changes — all new data is analytical reference and lives in `src/data/`.
