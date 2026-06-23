import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, DISTRICT_TOTALS, YEAR_TREND, ECOURTS_BREAKDOWN, CLUSTERS } from "@/data/blocks";
import { PS_FREQUENCY_2024, PS_FREQUENCY_2025 } from "@/data/crime";
import { scoreAllBlocks, priorityColor, type Priority } from "@/lib/vulnerability-score";
import { FileText, TrendingUp, AlertTriangle, BarChart3, GitCompare, Info, ListOrdered } from "lucide-react";

export const Route = createFileRoute("/brief")({
  head: () => ({
    meta: [
      { title: "District Child Protection Brief — Child Watch AI" },
      { name: "description", content: "Executive briefing: trends, vulnerability ranking, emerging risk signals, comparative analysis, and data notes for Murshidabad district." },
    ],
  }),
  component: BriefPage,
});

function priorityBadge(p: Priority) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
      style={{ background: priorityColor(p) }}
    >
      {p}
    </span>
  );
}

function SectionCard({
  icon: Icon, eyebrow, title, children,
}: { icon: React.ElementType; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Icon className="h-3.5 w-3.5" /> {eyebrow}
      </div>
      <h2 className="mt-2 font-serif text-2xl tracking-tight text-foreground md:text-3xl">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

function BriefPage() {
  const scored = scoreAllBlocks();
  const districtAvg = scored.reduce((s, x) => s + x.score, 0) / scored.length;
  const critical = scored.filter((s) => s.priority === "Critical");
  const high = scored.filter((s) => s.priority === "High");
  const medium = scored.filter((s) => s.priority === "Medium");
  const low = scored.filter((s) => s.priority === "Low");
  const justiceGapPct = 100 - (DISTRICT_TOTALS.firs / DISTRICT_TOTALS.pregnancies) * 100;

  const top5 = scored.slice(0, 5);
  const bottom5 = scored.slice(-5).reverse();

  // PS YoY deltas
  const psDeltas = PS_FREQUENCY_2024.map((p24) => {
    const p25 = PS_FREQUENCY_2025.find((x) => x.ps === p24.ps);
    const v25 = p25?.count ?? p24.count;
    const delta = v25 - p24.count;
    const pct = p24.count ? (delta / p24.count) * 100 : 0;
    return { ps: p24.ps, v24: p24.count, v25, delta, pct };
  }).sort((a, b) => b.pct - a.pct);

  const rising = psDeltas.slice(0, 3);

  // Comparative: cluster averages
  const clusterStats = (Object.keys(CLUSTERS) as Array<keyof typeof CLUSTERS>).map((cid) => {
    const cBlocks = scored.filter((s) => s.block.cluster === cid);
    const avg = cBlocks.length ? cBlocks.reduce((s, x) => s + x.score, 0) / cBlocks.length : 0;
    return { cluster: CLUSTERS[cid].label, avg, count: cBlocks.length };
  }).sort((a, b) => b.avg - a.avg);

  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <PageHeader
        eyebrow="Executive Briefing"
        title="District Child Protection Brief"
        lead={`Murshidabad district — generated ${today}. Deterministic situational summary compiled from HMIS, DPMU/Kanyashree, CMRTS, and eCourts data. Evidence-led, neutral analysis. No recommendations or prescriptive actions.`}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">
            Export this brief as a PDF using your browser's print dialog (destination: <em>Save as PDF</em>).
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <FileText className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>


      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-6 md:py-14">
        {/* 1. Executive Summary */}
        <SectionCard icon={FileText} eyebrow="Section 1" title="Executive Summary">
          <p>
            Murshidabad's child-protection landscape across {scored.length} blocks shows a district average vulnerability index of{" "}
            <strong>{districtAvg.toFixed(0)}/100</strong>. Of these, <strong>{critical.length}</strong> blocks are classified Critical,{" "}
            <strong>{high.length}</strong> High, <strong>{medium.length}</strong> Medium, and <strong>{low.length}</strong> Low.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li className="rounded-md bg-secondary/50 p-3"><strong>Teenage pregnancies (cumulative HMIS):</strong> {DISTRICT_TOTALS.pregnancies.toLocaleString()}</li>
            <li className="rounded-md bg-secondary/50 p-3"><strong>Kanyashree K1 dropouts:</strong> {DISTRICT_TOTALS.k1Dropouts.toLocaleString()}</li>
            <li className="rounded-md bg-secondary/50 p-3"><strong>CMRTS marriages tracked:</strong> {DISTRICT_TOTALS.childMarriages.toLocaleString()}</li>
            <li className="rounded-md bg-secondary/50 p-3"><strong>POCSO / child-crime FIRs:</strong> {DISTRICT_TOTALS.firs.toLocaleString()}</li>
          </ul>
          <p className="mt-3">
            The estimated <strong>justice gap</strong> — the share of incident load (teenage pregnancies) not represented in formal FIRs — stands at{" "}
            <strong>{justiceGapPct.toFixed(1)}%</strong>. The most vulnerable block in the district is{" "}
            <strong>{top5[0].block.name}</strong> (score {top5[0].score.toFixed(0)}, {top5[0].priority}).
          </p>
        </SectionCard>

        {/* 2. Key Trends */}
        <SectionCard icon={TrendingUp} eyebrow="Section 2" title="Key Trends">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Teenage Pregnancies</th>
                  <th className="py-2 pr-4">CMRTS Marriages</th>
                  <th className="py-2">POCSO/Child FIRs</th>
                </tr>
              </thead>
              <tbody>
                {YEAR_TREND.map((y) => (
                  <tr key={y.year} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{y.year}</td>
                    <td className="py-2 pr-4">{y.pregnancies.toLocaleString()}</td>
                    <td className="py-2 pr-4">{y.marriages.toLocaleString()}</td>
                    <td className="py-2">{y.firs.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            HMIS-recorded teenage pregnancies declined from {YEAR_TREND[0].pregnancies.toLocaleString()} (2023–24) to{" "}
            {YEAR_TREND[2].pregnancies.toLocaleString()} (2025–26, partial). Over the same window, CMRTS-tracked marriages rose from{" "}
            {YEAR_TREND[0].marriages} to {YEAR_TREND[2].marriages}, and POCSO/child-crime FIRs rose from {YEAR_TREND[0].firs} to{" "}
            {YEAR_TREND[2].firs} — consistent with improved formal reporting infrastructure rather than necessarily a decline in incidence.
          </p>
        </SectionCard>

        {/* 3. Vulnerability Ranking */}
        <SectionCard icon={ListOrdered} eyebrow="Section 3" title="Vulnerability Ranking">
          <p className="mb-3">Top 5 most vulnerable blocks by composite index (0–100):</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Block</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2">Top Indicator</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((s) => (
                  <tr key={s.block.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{s.rank}</td>
                    <td className="py-2 pr-4">{s.block.name}</td>
                    <td className="py-2 pr-4">{s.score.toFixed(0)}</td>
                    <td className="py-2 pr-4">{priorityBadge(s.priority)}</td>
                    <td className="py-2 text-muted-foreground">{s.topThree[0].label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-2 text-sm font-semibold text-foreground">Lowest-vulnerability blocks (reference):</p>
          <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            {bottom5.map((s) => (
              <li key={s.block.id}>
                #{s.rank} {s.block.name} — {s.score.toFixed(0)} ({s.priority})
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* 4. Emerging Risk Signals */}
        <SectionCard icon={AlertTriangle} eyebrow="Section 4" title="Emerging Risk Signals">
          <ul className="space-y-3">
            <li className="rounded-md border border-border bg-secondary/30 p-4">
              <div className="font-semibold">Concentration of vulnerability</div>
              <p className="mt-1 text-muted-foreground">
                {critical.length + high.length} of {scored.length} blocks ({(((critical.length + high.length) / scored.length) * 100).toFixed(0)}%)
                sit in Critical or High priority bands, indicating systemic rather than isolated risk.
              </p>
            </li>
            <li className="rounded-md border border-border bg-secondary/30 p-4">
              <div className="font-semibold">Rising case volume at police-station level (2024 → 2025)</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                {rising.map((r) => (
                  <li key={r.ps}>
                    {r.ps} PS: {r.v24} → {r.v25} ({r.pct >= 0 ? "+" : ""}{r.pct.toFixed(0)}%)
                  </li>
                ))}
              </ul>
            </li>
            <li className="rounded-md border border-border bg-secondary/30 p-4">
              <div className="font-semibold">Reporting silence clusters</div>
              <p className="mt-1 text-muted-foreground">
                {BLOCKS.filter((b) => b.reportingSilence >= 95).length} blocks report reporting-silence ≥ 95, suggesting under-registration of incidents
                relative to recorded health and scheme indicators.
              </p>
            </li>
          </ul>
        </SectionCard>

        {/* 5. Comparative Analysis */}
        <SectionCard icon={GitCompare} eyebrow="Section 5" title="Comparative Analysis">
          <p className="mb-3">Average composite vulnerability score by sub-district cluster:</p>
          <div className="space-y-2">
            {clusterStats.map((c) => {
              const w = Math.min(100, (c.avg / 100) * 100);
              return (
                <div key={c.cluster}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{c.cluster}</span>
                    <span className="font-mono text-muted-foreground">{c.avg.toFixed(0)} ({c.count} blocks)</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 rounded-full" style={{ width: `${w}%`, background: "var(--primary)" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4">
            Border and river-belt clusters consistently exceed the district average ({districtAvg.toFixed(0)}), while the Central Hub and Western Outpost
            clusters fall closer to or below it. eCourts case breakdown is concentrated in Sexual Assault ({ECOURTS_BREAKDOWN[0].count})
            and POCSO + Kidnapping ({ECOURTS_BREAKDOWN[1].count}).
          </p>
        </SectionCard>

        {/* 6. Data Notes */}
        <SectionCard icon={Info} eyebrow="Section 6" title="Data Notes">
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Sources:</strong> CINI Murshidabad Dashboard (HMIS, DPMU/Kanyashree, CMRTS, eCourts) 2023–2026;
              "Crime Against Children — Murshidabad" 2nd draft (2025). Daily Arrest Report (DAR); NFHS-V vs NFHS-IV comparators.
            </li>
            <li>
              <strong className="text-foreground">Composite index:</strong> weighted normalisation of five indicators — Reporting Silence (0.30),
              Teenage Pregnancies (0.25), K1 Dropouts (0.20), CMRTS Child Marriages (0.15), Justice Gap from low FIRs (0.10).
            </li>
            <li>
              <strong className="text-foreground">Reporting silence</strong> = 100 − (FIRs ÷ teenage pregnancies × 1000), clamped 0–100.
              Justice gap is a proxy derived from FIR ratio against incident load.
            </li>
            <li>
              <strong className="text-foreground">Partial periods:</strong> 2025–26 figures reflect data captured up to May–Nov 2025 and are not full-year.
            </li>
            <li>
              <strong className="text-foreground">Use of this brief:</strong> This document provides situational intelligence and evidence for review by
              competent authorities. It does not prescribe actions, name individuals, or substitute for statutory decision-making processes.
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
