import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Heart, Scale } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { KpiCard } from "@/components/site/KpiCard";
import { LeakFunnel } from "@/components/site/LeakFunnel";
import { MurshidabadMap } from "@/components/site/MurshidabadMap";
import { DISTRICT_TOTALS, YEAR_TREND, topRiskBlocks, riskColor, riskLabel } from "@/data/blocks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINI Murshidabad — Child Protection Dashboard" },
      { name: "description", content: "An evidence-led overview of child protection across all 26 blocks of Murshidabad district." },
      { property: "og:title", content: "CINI Murshidabad — Child Protection Dashboard" },
      { property: "og:description", content: "Hotspots, vulnerability matrix, and action plan across 26 blocks of Murshidabad." },
    ],
  }),
  component: Index,
});

function Index() {
  const top = topRiskBlocks(5);
  const trendMax = Math.max(...YEAR_TREND.map((y) => y.pregnancies));

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Teenage pregnancies (HMIS)" value={DISTRICT_TOTALS.pregnancies} sub="Cumulative 2023–2026" tone="risk" icon={<Heart className="h-4 w-4" />} />
          <KpiCard label="Kanyashree K1 dropouts" value={DISTRICT_TOTALS.k1Dropouts} sub="Non-renewals across district" tone="warn" icon={<Activity className="h-4 w-4" />} />
          <KpiCard label="Child marriages reported" value={DISTRICT_TOTALS.childMarriages} sub="CMRTS register" tone="warn" icon={<AlertTriangle className="h-4 w-4" />} />
          <KpiCard label="FIRs filed" value={DISTRICT_TOTALS.firs} sub="POCSO + child crime, eCourts" tone="ok" icon={<Scale className="h-4 w-4" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeakFunnel />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 md:p-7">
          <h2 className="font-serif text-2xl tracking-tight">Year-wise pregnancy trend</h2>
          <p className="mt-1 text-sm text-muted-foreground">Teenage pregnancies registered each year (HMIS).</p>
          <div className="mt-6 space-y-4">
            {YEAR_TREND.map((y) => (
              <div key={y.year}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{y.year}</span>
                  <span className="tabular-nums text-muted-foreground">{y.pregnancies.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded bg-secondary/60">
                  <div
                    className="h-full"
                    style={{ width: `${(y.pregnancies / trendMax) * 100}%`, backgroundColor: "var(--primary)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-md bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">What this means:</strong> The 2025-26 figure is partial-year and
            already trending below the previous full year — but cumulative load remains the highest in West Bengal.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl tracking-tight">Top 5 high-risk blocks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Composite of pregnancies, child marriages and reporting silence.</p>
          </div>
          <Link to="/map" className="text-sm font-medium text-primary hover:underline">View map →</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {top.map((b, i) => (
            <Link key={b.id} to="/map" className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: riskColor(b.risk) }}
                >
                  {riskLabel(b.risk)}
                </span>
              </div>
              <div className="mt-3 font-serif text-lg leading-tight text-foreground group-hover:text-primary">{b.name}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <div><div className="text-foreground font-semibold tabular-nums">{b.pregnancies.toLocaleString("en-IN")}</div>pregnancies</div>
                <div><div className="text-foreground font-semibold tabular-nums">{b.childMarriages}</div>marriages</div>
                <div><div className="text-foreground font-semibold tabular-nums">{b.k1Dropouts}</div>K1 dropouts</div>
                <div><div className="text-foreground font-semibold tabular-nums">{b.firs}</div>FIRs</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Key Insights</div>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl tracking-tight">What the data is telling us</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3 text-sm leading-relaxed">
            <div>
              <div className="font-semibold text-foreground">1 · The justice gap is structural.</div>
              <p className="mt-1 text-muted-foreground">86,928 teenage pregnancies have produced just 427 FIRs. That is not a reporting hesitation — it is system failure at scale.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground">2 · Kanyashree dropouts ARE child marriages.</div>
              <p className="mt-1 text-muted-foreground">Field audits show 60–80% of K1 non-renewals in the worst blocks are masked underage marriages.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground">3 · Border + river blocks dominate every list.</div>
              <p className="mt-1 text-muted-foreground">Lalgola, Bhagwangola, Domkol, Jalangi appear in the worst quartile on every indicator.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
