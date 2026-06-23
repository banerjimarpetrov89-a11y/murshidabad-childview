import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, Heart, Droplet, AlertTriangle, Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { KpiCard } from "@/components/site/KpiCard";
import { SC_HMIS, BLOCK_HMIS_SUMMARY, HMIS_DISTRICT_ROLLUP } from "@/data/hmis";
import SubcentreMap from "@/components/site/SubcentreMap";
import SCReportCard from "@/components/site/SCReportCard";
import { MULTI_BLOCKS, TEEN_HOTSPOTS_DISTRICT, type BlockPack } from "@/data/multi-block-hmis";
import {
  INFANT_DEATHS_2025_26,
  INFANT_DEATH_TOTAL,
  INFANT_DEATH_PERIOD,
  MATERNAL_DEATHS_2025_26,
  MATERNAL_DEATH_DISTRICT_TOTAL,
  MATERNAL_DEATH_GRAND_TOTAL,
  MATERNAL_DEATH_PERIOD,
  NEW_BLOCK_HMIS,
} from "@/data/mortality";


export const Route = createFileRoute("/hmis")({
  head: () => ({
    meta: [
      { title: "HMIS Health Indicators — CINI" },
      { name: "description", content: "Sub-centre level Health Management Information System indicators for Murshidabad — pregnancies, anaemia, high-risk, contraception drop-off." },
      { property: "og:title", content: "HMIS Health Indicators — CINI" },
      { property: "og:description", content: "155 sub-centres across 5 ingested blocks. ANC, teen-pregnancy, anaemia & Antara drop-off." },
    ],
  }),
  component: HmisPage,
});

function HmisPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? SC_HMIS.filter((r) => r.sc.toLowerCase().includes(s)) : SC_HMIS;
  }, [q]);

  const antaraMax = Math.max(...SC_HMIS.map((r) => r.d1 ?? 0));
  const teenRanked = [...SC_HMIS]
    .map((r) => ({ sc: r.sc, pct: r.newPW > 0 ? (r.pw15_19 / r.newPW) * 100 : 0, n: r.pw15_19 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 12);

  return (
    <>
      <PageHeader
        eyebrow="Health Management Information System"
        title="Maternal & child health, sub-centre by sub-centre"
        lead={`${HMIS_DISTRICT_ROLLUP.scIngested} sub-centres across ${HMIS_DISTRICT_ROLLUP.blocksIngested} ingested blocks · ${HMIS_DISTRICT_ROLLUP.windowLabel}. Pregnancies, first-trimester registration, high-risk share, anaemia, and Antara contraceptive drop-off — surfaced from official HMIS exports.`}
      />

      {/* KPI strip */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Pregnant women tracked" value={HMIS_DISTRICT_ROLLUP.totalPWTracked} sub="across 155 sub-centres" icon={<Heart className="h-4 w-4" />} />
          <KpiCard label="ANC in 1st trimester" value={`${HMIS_DISTRICT_ROLLUP.firstTriPctAvg}%`} sub="block average · target 100%" tone="ok" icon={<Activity className="h-4 w-4" />} />
          <KpiCard label="High-risk pregnancies" value={`${HMIS_DISTRICT_ROLLUP.highRiskPctAvg}%`} sub="of registered PW" tone="warn" icon={<AlertTriangle className="h-4 w-4" />} />
          <KpiCard label="Teenage pregnancy share" value={`${HMIS_DISTRICT_ROLLUP.teenPWShareAvg}%`} sub="age 15-19 of new ANC" tone="risk" icon={<Droplet className="h-4 w-4" />} />
        </div>
      </section>

      {/* Block summaries */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl tracking-tight">Block factsheets</h2>
          <div className="text-xs text-muted-foreground">Source: NHM HMIS exports</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(BLOCK_HMIS_SUMMARY).map((b) => (
            <div key={b.block} className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{b.period}</div>
              <h3 className="mt-1 font-serif text-xl tracking-tight">{b.block}</h3>
              <div className="mt-3 text-xs text-muted-foreground">
                {"scCount" in b && <span>{b.scCount} sub-centres · </span>}
                {"totalPW" in b && <span className="text-foreground font-semibold tabular-nums">{b.totalPW?.toLocaleString("en-IN")}</span>}
                {"totalPW" in b && <span> PW registered</span>}
              </div>
              <ul className="mt-4 space-y-1.5 text-xs">
                {"firstTriPct" in b && <Row k="1st-trimester ANC" v={`${b.firstTriPct}%`} />}
                {"highRiskPct" in b && <Row k="High-risk PW" v={`${b.highRiskPct}%`} />}
                {"anaemicPct" in b && <Row k="Severe-anaemic PW" v={`${b.anaemicPct}%`} />}
                {"teenPWShare" in b && <Row k="Teenage (15-19) share" v={`${b.teenPWShare}%`} tone="risk" />}
                {"teenPW" in b && <Row k="Teen PW (15-19)" v={b.teenPW?.toLocaleString("en-IN") ?? ""} />}
                {"anc1stTri" in b && <Row k="ANC 1st trimester" v={b.anc1stTri?.toLocaleString("en-IN") ?? ""} />}
                {"instDel" in b && <Row k="Institutional deliveries" v={b.instDel?.toLocaleString("en-IN") ?? ""} />}
                {"note" in b && <li className="pt-1 text-muted-foreground">{b.note}</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Additional block ingests */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl tracking-tight">Newly ingested block HMIS workbooks</h2>
          <div className="text-xs text-muted-foreground">FY 2024-25 & 2025-26 cumulative</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {NEW_BLOCK_HMIS.map((b) => (
            <div key={b.block} className="rounded-xl border border-border bg-card p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{b.period}</div>
              <h3 className="mt-1 font-serif text-lg tracking-tight">{b.block}</h3>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground tabular-nums">{b.scCount}</span> sub-centres
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{b.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Infant Deaths */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Infant deaths by place of death</div>
              <h2 className="mt-1 font-serif text-2xl tracking-tight">{INFANT_DEATH_TOTAL.toLocaleString("en-IN")} infant deaths recorded · {INFANT_DEATH_PERIOD}</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
                Tertiary referral concentration: Murshidabad MCH alone accounts for{" "}
                <strong className="text-foreground">{((643 / INFANT_DEATH_TOTAL) * 100).toFixed(0)}%</strong> of all recorded infant deaths, and the five SDH / MCH facilities together account for{" "}
                <strong className="text-foreground">{(((643 + 182 + 101 + 96 + 76) / INFANT_DEATH_TOTAL) * 100).toFixed(0)}%</strong> — a signal that block-level newborn care is referring late or upward.
              </p>
            </div>
          </div>
          <ul className="mt-5 grid gap-1.5 md:grid-cols-2">
            {INFANT_DEATHS_2025_26.map((r) => {
              const max = INFANT_DEATHS_2025_26[0].deaths;
              const pct = (r.deaths / max) * 100;
              return (
                <li key={r.unit} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.unit}</span>
                    <span className="tabular-nums text-muted-foreground">{r.deaths}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-secondary">
                    <div className="h-full" style={{ width: `${Math.max(1.5, pct)}%`, backgroundColor: r.deaths >= 50 ? "var(--risk-critical)" : r.deaths >= 10 ? "var(--risk-high)" : "var(--risk-moderate)" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Maternal Deaths */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Maternal deaths by block / municipality</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">
            {MATERNAL_DEATH_DISTRICT_TOTAL} district deaths · grand total {MATERNAL_DEATH_GRAND_TOTAL} (incl. referrals)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{MATERNAL_DEATH_PERIOD}. Includes deaths reported from neighbouring districts and Jharkhand referrals into Murshidabad facilities.</p>
          <div className="mt-5 grid gap-2 md:grid-cols-3">
            {MATERNAL_DEATHS_2025_26.map((r) => (
              <div key={r.unit} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-xs">
                <span className="font-medium">{r.unit}</span>
                <span className={`tabular-nums font-semibold ${r.deaths >= 5 ? "text-[color:var(--risk-critical)]" : r.deaths >= 2 ? "text-[color:var(--risk-high)]" : "text-muted-foreground"}`}>{r.deaths}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-centre Google map */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Sub-centre map · Samserganj block</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">36 sub-centres, plotted with their HMIS load</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Each marker is one sub-centre. Click for pregnancies tracked, 1st-trimester ANC %, high-risk antenatal %, BCG, and Antara doses 1→4. Marker colour reflects high-risk antenatal share; size reflects pregnant women tracked.
          </p>
          <SubcentreMap />
        </div>
      </section>

      {/* Teen pregnancy ranking */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Teenage pregnancy hotspots</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">Top 12 sub-centres by 15-19 ANC share</h2>
          <p className="mt-1 text-sm text-muted-foreground">Where adolescent pregnancy is most concentrated. A higher bar = a higher share of new mothers under 20.</p>
          <ul className="mt-5 space-y-2">
            {teenRanked.map((r) => (
              <li key={r.sc} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.sc}</span>
                  <span className="tabular-nums text-muted-foreground">{r.n} cases · <strong className="text-foreground">{r.pct.toFixed(1)}%</strong></span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${Math.min(100, r.pct * 3)}%`, backgroundColor: "var(--risk-critical)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Antara drop-off */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Antara contraceptive drop-off</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">Doses 1 → 4 across 36 sub-centres</h2>
          <p className="mt-1 text-sm text-muted-foreground">Dose-1 women are often lost by Dose-4. Block totals: 1309 → 576 → 375 → 588. Each row plots one SC's four doses on a shared scale.</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {SC_HMIS.filter((r) => (r.d1 ?? 0) > 0).slice(0, 24).map((r) => (
              <div key={r.sc} className="rounded-md border border-border/60 p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium">{r.sc}</span>
                  <span className="tabular-nums text-muted-foreground">{r.d1}→{r.d2}→{r.d3}→{r.d4}</span>
                </div>
                <div className="mt-1.5 flex h-1.5 gap-0.5">
                  {[r.d1, r.d2, r.d3, r.d4].map((v, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        width: `${((v ?? 0) / antaraMax) * 100}%`,
                        backgroundColor: ["var(--primary)", "var(--risk-moderate)", "var(--risk-high)", "var(--risk-critical)"][i],
                        minWidth: (v ?? 0) > 0 ? 3 : 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-centre report cards — one per SC */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Sub-centre report cards</div>
            <h2 className="mt-1 font-serif text-2xl tracking-tight">Report card for every sub-centre uploaded</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
              One card per sub-centre · {SC_HMIS.length} cards total. Filter by name using the search box below; each card summarises pregnancy load, ANC quality, risk share, immunisation and family-planning continuity.
            </p>
          </div>
          <label className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter cards…"
              className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <SCReportCard key={r.sc} r={r} blockLabel="Samserganj · FY 2024-25" />
          ))}
          {rows.length === 0 && (
            <div className="col-span-full rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No sub-centre matches "{q}".
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* District-wide teenage pregnancy shortlist across new blocks    */}
      {/* ============================================================== */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Teen pregnancy shortlist · 7 newly mapped blocks</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">Top SCs by 15-19 ANC share — district view</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            Top 3 sub-centres from each of Suti II, Murshidabad-Jiaganj, Khargram, Bharatpur II, Bhagwangola I, Nabagram and Sagardighi, ranked by adolescent share of new ANC. Block-level scaffolded values pending HMIS upload.
          </p>
          <ul className="mt-5 grid gap-2 md:grid-cols-2">
            {TEEN_HOTSPOTS_DISTRICT.slice(0, 18).map((h) => (
              <li key={`${h.block}-${h.sc}`} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{h.sc} <span className="text-muted-foreground">· {h.block}</span></span>
                  <span className="tabular-nums text-muted-foreground">{h.n} of {h.newPW} · <strong className="text-foreground">{h.pct.toFixed(1)}%</strong></span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${Math.min(100, h.pct * 3.5)}%`, backgroundColor: "var(--risk-critical)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================== */}
      {/* Per-block sections: factsheet + map + collapsible report cards */}
      {/* ============================================================== */}
      {MULTI_BLOCKS.map((b) => (
        <BlockSection key={b.block} pack={b} />
      ))}



      {/* SC drill-down table */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Sub-centre drill-down</div>
              <h2 className="mt-0.5 font-serif text-xl tracking-tight">All 36 SCs · key indicators</h2>
            </div>
            <label className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sub-centre…"
                className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Sub-centre</th>
                  <th className="px-3 py-2 text-right">New PW</th>
                  <th className="px-3 py-2 text-right">15-19</th>
                  <th className="px-3 py-2 text-right">1st-tri %</th>
                  <th className="px-3 py-2 text-right">High-risk %</th>
                  <th className="px-3 py-2 text-right">HRP (ante)</th>
                  <th className="px-3 py-2 text-right">BCG</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sc} className="border-t border-border/60 hover:bg-secondary/30">
                    <td className="px-3 py-2 font-medium">{r.sc}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.newPW}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.pw15_19}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.firstTriPct?.toFixed(0) ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.highRiskPct?.toFixed(0) ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.hrpAnte}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.bcg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5 md:p-6 text-xs text-muted-foreground leading-relaxed">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Methodology & sources</div>
          <p className="mt-2">
            HMIS exports for Samserganj (36 sub-centres · FY 2024-25), Suti-II (19 SCs · FY 2024-25), Murshidabad-Jiaganj (43 facilities · FY 2024-25),
            Bharatpur-II (18 SCs · FY 2024-25) and Khargram (39 SCs · Apr-Aug 2025) were parsed from the official monthly HMIS workbook format.
            PW Registration line-list dated 28-Jun-2025 supplies first-trimester %, high-risk % and severe-anaemic %.
            FP-Antara drop-off is computed as Dose-1 → Dose-4 per SC. Teen-pregnancy share = age 15-19 ÷ new ANC registrations.
          </p>
          <p className="mt-2">
            Limitations: the 36-SC consolidated workbook's institutional-delivery column rolls up to facility level; SC-level inst-del shows zero and is omitted.
            Rolled-up district percentages are simple block averages, not population-weighted. 21 of the 26 blocks are pending HMIS ingestion.
          </p>
        </div>
      </section>
    </>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "risk" }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-bold tabular-nums ${tone === "risk" ? "text-[color:var(--risk-critical)]" : "text-foreground"}`}>{v}</span>
    </li>
  );
}

function BlockSection({ pack }: { pack: BlockPack }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? pack.scs.filter((r) => r.sc.toLowerCase().includes(s)) : pack.scs;
  }, [q, pack.scs]);

  const totalPW = pack.scs.reduce((a, r) => a + r.newPW, 0);
  const totalTeen = pack.scs.reduce((a, r) => a + r.pw15_19, 0);
  const teenShare = totalPW ? (totalTeen / totalPW) * 100 : 0;
  const hrAvg = pack.scs.reduce((a, r) => a + (r.highRiskPct ?? 0), 0) / pack.scs.length;
  const ftAvg = pack.scs.reduce((a, r) => a + (r.firstTriPct ?? 0), 0) / pack.scs.length;

  const teenTop = [...pack.scs]
    .map((r) => ({ sc: r.sc, pct: r.newPW > 0 ? (r.pw15_19 / r.newPW) * 100 : 0, n: r.pw15_19 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
      <div className="rounded-xl border border-border bg-card p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{pack.fyLabel}</div>
            <h2 className="mt-1 font-serif text-2xl tracking-tight">{pack.block} block · {pack.scs.length} sub-centres</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-3xl">{pack.note}</p>
          </div>
          <div className="rounded-md border border-dashed border-border bg-secondary/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Scaffolded placeholder
          </div>
        </div>

        {/* Block KPI strip */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="PW tracked" value={totalPW.toLocaleString("en-IN")} />
          <MiniStat label="1st-tri ANC avg" value={`${ftAvg.toFixed(0)}%`} />
          <MiniStat label="High-risk avg" value={`${hrAvg.toFixed(0)}%`} tone={hrAvg >= 55 ? "risk" : undefined} />
          <MiniStat label="Teen share" value={`${teenShare.toFixed(1)}%`} tone="risk" />
        </div>

        {/* Teen hotspots within block */}
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Teen pregnancy hotspots in {pack.block}</div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {teenTop.map((t) => (
              <li key={t.sc} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.sc}</span>
                  <span className="tabular-nums text-muted-foreground">{t.n} cases · <strong className="text-foreground">{t.pct.toFixed(1)}%</strong></span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${Math.min(100, t.pct * 3.5)}%`, backgroundColor: "var(--risk-critical)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Sub-centre map · {pack.block}</div>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">Marker colour = high-risk antenatal band; size ∝ PW tracked. Click for sub-centre detail.</p>
          <SubcentreMap
            data={pack.scs}
            coords={pack.coords}
            center={pack.centroid}
            zoom={11}
            blockLabel={pack.block}
            height={420}
          />
        </div>

        {/* Drill-down: collapsible report cards */}
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Sub-centre drill-down</div>
              <h3 className="mt-0.5 font-serif text-lg tracking-tight">Report card per sub-centre · click to collapse</h3>
            </div>
            <label className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Filter ${pack.block}…`}
                className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <SCReportCard key={r.sc} r={r} blockLabel={`${pack.block} · ${pack.fyLabel}`} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                No sub-centre matches "{q}".
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "risk" }) {
  return (
    <div className="rounded-md bg-secondary/40 px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${tone === "risk" ? "text-[color:var(--risk-critical)]" : ""}`}>{value}</div>
    </div>
  );
}

