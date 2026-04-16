import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, ECOURTS_BREAKDOWN, YEAR_TREND } from "@/data/blocks";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Data Insights — Murshidabad Child Protection" },
      { name: "description", content: "Year-wise trends, block comparisons, and eCourts category breakdown for Murshidabad." },
      { property: "og:title", content: "Data Insights — Murshidabad Child Protection" },
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

  return (
    <>
      <PageHeader
        eyebrow="Data Insights & Trends"
        title="Numbers, side by side"
        lead="Year-wise trends, block comparisons, and what each chart actually means in plain language."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-6 lg:grid-cols-2">
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

        <ChartCard title="eCourts case mix" sub="POCSO + IPC categories filed" interp="Sexual assault and POCSO+kidnapping dominate. Child Marriage Act cases are a small fraction — confirming massive underreporting.">
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

        <ChartCard className="lg:col-span-2" title="Block comparison — teenage pregnancies" sub="All 26 blocks, descending" interp="The top 6 blocks carry roughly 30% of all district pregnancies. Border + river belt dominates.">
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
    </>
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
