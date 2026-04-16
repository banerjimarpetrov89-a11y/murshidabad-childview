
# Murshidabad Child Protection Dashboard — CINI

A modern, data-driven public site presenting real district + block-level data from your CINI / Murshidabad District Administration dashboard (2023–2026). All 26 blocks, the District Leak Funnel, the Vulnerability Matrix, cluster narratives, and action plans — encoded as real data and visualized cleanly.

## Pages (separate routes for SSR + SEO)

1. **Home `/`** — Hero with district headline, 4 KPI cards (86,928 teenage pregnancies · 18,525 K1 non-renewals · 1,518 child marriages · 427 FIRs), the **District Leak Funnel** (Health → Scheme → Protection → Justice with -98.7% drop-offs), year-wise trend chart, top 5 high-risk blocks, "Key Insights" narrative.

2. **Hotspot Map `/map`** — Stylized SVG of all 26 Murshidabad blocks arranged by geography/cluster (North border, North-Central, Eastern Border, Central Hub, Western Outpost, Mid-South, Northern Central). Color-coded Red/Orange/Yellow/Teal by vulnerability. Hover tooltip shows pregnancies, child marriages, K1 dropouts, FIRs. Click → block detail drawer with Panchayat hotspots (Mohisar, Sadal, Akheriganj, Lakshmijhola, etc.).

3. **Data Insights `/insights`** — Year-wise teenage pregnancy line chart (2023-24: 38,744 → 2025-26: 12,549), block-wise comparison bars, eCourts category breakdown (Sexual Assault 155, POCSO+Kidnapping 141, etc.), Kanyashree dropout chart. Each chart has a "What this means" interpretation card.

4. **Vulnerability Matrix `/matrix`** — Interactive scatter plot with 4 quadrants (Critical Red / Orange / Yellow / Safe Teal), X = reporting silence, Y = incident volume. Plots Lalgola, Bhagwangola I/II, Domkol, Jalangi, Berhampore, Beldanga I, Farakka, Suti II, Kandi, Bharatpur II, etc.

5. **Red Flags `/red-flags`** — The "killer feature" page. Insight cards: Domkol (4,393 pregnancies / 0 FIRs), Raninagar II ground truth (125/157 dropouts were child brides), Beldanga II (60% of 470 K1 dropouts = underage marriage), Kanyashree Loophole flowchart, Justice Gap analysis. Each card ends with **"What should be done here?"**

6. **Cluster Stories `/clusters`** — 7 cluster narratives: Border & River (North), High Dropout (North-Central), Eastern Border, Central Hub, Western Outpost, Mid-South, Northern Central. Each shows member blocks + key Panchayat hotspots.

7. **Resources `/resources`** — Repository of schemes (ICPS, Kanyashree, Beti Bachao Beti Padhao), SOPs, training manuals. Filters by stakeholder (Govt / NGO / CSR) and theme (Child Marriage, Trafficking, Protection Systems). Backed by database.

8. **Publications `/publications`** — District reports, research, baseline/endline assessments. Each card: summary + key findings + PDF download. Database-backed with admin upload.

9. **Events & Initiatives `/events`** — Timeline of campaigns, govt drives, NGO interventions, with impact stories. Database-backed.

10. **Stakeholders `/stakeholders`** — Govt departments, NGOs (CINI), CSR partners — roles and intervention areas.

11. **Action Plan `/action-plan`** — The District Administration 2-part action plan (Data & Tracking + Community & Law Enforcement) presented as actionable cards.

12. **Admin `/admin`** — Login-gated. Add/edit Resources, Publications, Events, Stakeholders. Upload PDFs.

## Backend (Lovable Cloud)

- Tables: `resources`, `publications`, `events`, `stakeholders` (public read via RLS), plus `user_roles` with `app_role` enum + `has_role()` security-definer function for admin gating.
- Storage bucket for publication PDFs.
- Email/password auth for admins; first user can self-promote, then invites.
- All 26 blocks' statistical data lives in code (`src/data/blocks.ts`) — it's analytical reference data, not user content.

## Design

- **Branding:** "CINI Murshidabad" with "Child In Need Institute · Murshidabad District Administration, Government of West Bengal" attribution in header/footer.
- **Palette:** Deep blue (trust/govt), red (risk), amber (caution), green (positive), teal (safe). Government-friendly, clean, professional.
- **Typography:** Inter for clarity; serif accent for narrative pull-quotes.
- **Charts:** Recharts (line, bar, scatter, funnel).
- **Mobile-responsive**, sticky top nav, footer with data sources (HMIS, DPMU, CMRTS, eCourts).
- Search + filters on Resources/Publications; CSV/PDF export on data tables.

## Data baked in from your PDFs

District totals, year-wise pregnancy trend, eCourts category breakdown, all 26 block factsheets (Khargram, Nabagram, Suti I/II, Samserganj, Murshidabad-Jiaganj, Farakka, Kandi, Lalgola, Sagardighi, Burwan, Bhagwangola I/II, Domkol, Jalangi, Raninagar 1/2, Bharatpur 1/2, Hariharpara, Berhampore, Beldanga 1/2, Raghunathganj 1/2, Nowda), top Panchayats, cluster groupings, Vulnerability Matrix coordinates, and the full action plan.
