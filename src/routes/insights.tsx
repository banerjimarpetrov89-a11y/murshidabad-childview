import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, ECOURTS_BREAKDOWN, YEAR_TREND } from "@/data/blocks";
import {
  CMRTS_TREND,
  DAR_SUMMARY,
  ECOURTS_TOTALS,
  ECOURTS_YEAR_COMPARISON,
  LIMITATIONS,
  PS_FREQUENCY_2024,
  PS_FREQUENCY_2025,
} from "@/data/crime";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Data Insights — Child Protection" },
      { name: "description", content: "Year-wise trends, eCourts comparisons, top police stations and DAR composition." },
      { property: "og:title", content: "Data Insights — Child Protection" },
      { property: "og:description", content: "Trends, comparisons, and what each chart actually means." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const trendMax = Math.max(...YEAR_TREND.map((y) => y.pregnancies));
  const blockSorted = [...BLOCKS].sort((a, b) => b.pregnancies - a.pregnancies);
  const blockMax = blockSorted[0].pregnancies;
  const ecMax = Math.max(...ECOURTS_BREAKDOWN.map((c) => c.count));
  const cmrtsMax = Math.max(...CMRTS_TREND.map((c) => c.value));
  const ecYearMax = Math.max(...ECOURTS_YEAR_COMPARISON.flatMap((c) => [c.y2024, c.y2025]));
  const psMap = new Map(PS_FREQUENCY_2024.map((p) => [p.ps, p.count]));
  const psMerged = PS_FREQUENCY_2025
    .map((p) => ({ ps: p.ps, y2024: psMap.get(p.ps) ?? 0, y2025: p.count }))
    .sort((a, b) => b.y2025 - a.y2025);
  const psMax = Math.max(...psMerged.flatMap((p) => [p.y2024, p.y2025]));

  return (
    <>
      <PageHeader
        eyebrow="Data Insights & Trends"
        title="Numbers, side by side"
        lead="Year-wise trends, eCourts comparisons, top police stations, DAR composition and what each chart means in plain language."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="CMRTS Prevention Trend" sub="Marriages prevented · 2023 → 2025" interp="A sevenfold rise in three years. The detection mechanism is now working at scale.">
          <div className="space-y-3">
            {CMRTS_TREND.map((c) => (
              <div key={c.year}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{c.year}</span>
                  <span className="tabular-nums text-muted-foreground">{c.value}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${(c.value / cmrtsMax) * 100}%`, backgroundColor: "var(--risk-safe)" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="eCourts: 2024 vs 2025" sub={`Total 201 → 226 (+${ECOURTS_TOTALS.growth}%)`} interp="Sexual assault cases nearly doubled. POCSO+Child Marriage tripled. Kidnapping plateaued — courts are catching what was hidden.">
          <div className="space-y-3">
            {ECOURTS_YEAR_COMPARISON.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate pr-2">{c.category}</span>
                  <span className="tabular-nums text-muted-foreground">{c.y2024} → {c.y2025}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <div className="h-2.5 overflow-hidden rounded bg-secondary">
                    <div className="h-full" style={{ width: `${(c.y2024 / ecYearMax) * 100}%`, backgroundColor: "var(--muted-foreground)" }} />
                  </div>
                  <div className="h-2.5 overflow-hidden rounded bg-secondary">
                    <div className="h-full" style={{ width: `${(c.y2025 / ecYearMax) * 100}%`, backgroundColor: "var(--risk-critical)" }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: "var(--muted-foreground)" }} /> 2024</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: "var(--risk-critical)" }} /> 2025</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard className="lg:col-span-2" title="Top Police Stations — case frequency 2024 vs 2025" sub="POCSO + child crime cases registered" interp="Lalgola PS leads the district at 38 cases in 2025 (up from 31 in 2024). The northern belt — Lalgola, Bhagwangola, Berhampore — concentrates filings.">
          <div className="space-y-2">
            {psMerged.map((p) => (
              <div key={p.ps} className="grid grid-cols-[120px_1fr_80px] items-center gap-3 text-xs">
                <span className="truncate font-medium">{p.ps}</span>
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded bg-secondary">
                    <div className="h-full" style={{ width: `${(p.y2024 / psMax) * 100}%`, backgroundColor: "var(--muted-foreground)" }} />
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-secondary">
                    <div className="h-full" style={{ width: `${(p.y2025 / psMax) * 100}%`, backgroundColor: "var(--risk-critical)" }} />
                  </div>
                </div>
                <span className="text-right text-[11px] tabular-nums text-muted-foreground">{p.y2024}→{p.y2025}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="DAR Legislation Mix" sub={`${DAR_SUMMARY.windowLabel} · arrests by Act`} interp="POCSO dominates Murshidabad PD; PCMA + POCSO are nearly evenly weighted in Jangipur PD's smaller caseload.">
          <DonutPair />
        </ChartCard>

        <ChartCard title="Year-wise teenage pregnancy" sub="HMIS, full-year totals (2025-26 partial)" interp="Volume is declining year over year, but the cumulative load is still the largest leakage point in the funnel.">
          <div className="space-y-4">
            {YEAR_TREND.map((y) => (
              <div key={y.year}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{y.year}</span>
                  <span className="tabular-nums text-muted-foreground">{y.pregnancies.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${(y.pregnancies / trendMax) * 100}%`, backgroundColor: "var(--primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="eCourts case mix (cumulative)" sub="POCSO + IPC categories filed" interp="Sexual assault and POCSO+kidnapping dominate. Child Marriage Act cases are growing — confirming better detection but persistent underreporting.">
          <div className="space-y-3">
            {ECOURTS_BREAKDOWN.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs">
                  <span>{c.category}</span>
                  <span className="tabular-nums text-muted-foreground">{c.count}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${(c.count / ecMax) * 100}%`, backgroundColor: "var(--risk-critical)" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard className="lg:col-span-2" title="Block comparison — teenage pregnancies" sub="All 26 blocks, descending" interp="Raghunathganj I+II together carry the highest district load (~7,200), followed by Lalgola and Sagardighi.">
          <div className="space-y-2">
            {blockSorted.map((b) => (
              <div key={b.id} className="grid grid-cols-[140px_1fr_64px] items-center gap-3 text-xs">
                <span className="truncate">{b.name}</span>
                <div className="h-2.5 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${(b.pregnancies / blockMax) * 100}%`, backgroundColor: "var(--primary)" }} />
                </div>
                <span className="text-right tabular-nums text-muted-foreground">{b.pregnancies.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section id="methodology" className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Methodology & Limitations</div>
          <h2 className="mt-2 font-serif text-2xl tracking-tight">How this dashboard is built</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Block-level figures come from the CINI / Murshidabad District Administration "Crime Against Children" 2nd
            draft (2025) and the cumulative HMIS, DPMU, CMRTS and eCourts records (2023–2026). Reporting silence is
            computed as <code className="rounded bg-secondary px-1">100 − (FIRs / pregnancies × 1000)</code>, clamped 0–100.
            NFHS figures are NFHS-V (2019-21) compared to NFHS-IV (2015-16).
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {LIMITATIONS.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="text-[color:var(--risk-high)]">·</span>
                <span className="text-muted-foreground">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function DonutPair() {
  const m = DAR_SUMMARY.murshidabadPD;
  const j = DAR_SUMMARY.jangipurPD;
  return (
    <div className="grid grid-cols-2 gap-4">
      <Donut
        label="Murshidabad PD"
        total={m.total}
        slices={[
          { k: "POCSO", v: m.pocso, c: "var(--risk-critical)" },
          { k: "PCMA", v: m.pcma, c: "var(--risk-high)" },
          { k: "Kidnap", v: m.kidnapping, c: "var(--risk-moderate)" },
          { k: "Trafficking", v: m.trafficking, c: "var(--primary)" },
        ]}
      />
      <Donut
        label="Jangipur PD"
        total={j.total}
        slices={[
          { k: "POCSO", v: j.pocso, c: "var(--risk-critical)" },
          { k: "PCMA", v: j.pcma, c: "var(--risk-high)" },
          { k: "Rape", v: j.rape, c: "var(--risk-moderate)" },
        ]}
      />
    </div>
  );
}

function Donut({ label, total, slices }: { label: string; total: number; slices: { k: string; v: number; c: string }[] }) {
  const sum = slices.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  const r = 38;
  const C = 2 * Math.PI * r;
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--secondary)" strokeWidth="14" />
          {slices.map((s, i) => {
            const frac = s.v / sum;
            const dash = frac * C;
            const offset = -acc;
            acc += dash;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none" stroke={s.c} strokeWidth="14"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            );
          })}
          <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--foreground)">{total}</text>
          <text x="50" y="62" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">cases</text>
        </svg>
        <ul className="space-y-1 text-[11px]">
          {slices.map((s) => (
            <li key={s.k} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: s.c }} />
              <span className="text-muted-foreground">{s.k}</span>
              <span className="ml-1 font-bold tabular-nums text-foreground">{s.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChartCard({ title, sub, interp, children, className = "" }: { title: string; sub?: string; interp: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 md:p-7 ${className}`}>
      <h2 className="font-serif text-xl tracking-tight">{title}</h2>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      <div className="mt-5">{children}</div>
      <p className="mt-5 rounded-md bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">What this means:</strong> {interp}
      </p>
    </div>
  );
}
