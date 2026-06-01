import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Heart, Scale, TrendingDown, TrendingUp, Droplet } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { KpiCard } from "@/components/site/KpiCard";
import { LeakFunnel } from "@/components/site/LeakFunnel";
import { MurshidabadMap } from "@/components/site/MurshidabadMap";
import { DISTRICT_TOTALS, topRiskBlocks, riskColor, riskLabel } from "@/data/blocks";
import { CMRTS_TREND, DAR_SUMMARY, ECOURTS_TOTALS, NFHS_TREND } from "@/data/crime";
import { HMIS_DISTRICT_ROLLUP, BLOCK_HMIS_SUMMARY } from "@/data/hmis";

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
  const cmrtsMax = Math.max(...CMRTS_TREND.map((c) => c.value));

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Child marriage prevalence (NFHS-V)"
            value={`${NFHS_TREND.childMarriage.nfhs5}%`}
            sub={`↑ ${NFHS_TREND.childMarriage.delta} pts vs NFHS-IV (${NFHS_TREND.childMarriage.nfhs4}%)`}
            tone="risk"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Teenage pregnancy (NFHS-V)"
            value={`${NFHS_TREND.teenagePregnancy.nfhs5}%`}
            sub={`↓ ${Math.abs(NFHS_TREND.teenagePregnancy.delta)} pts vs ${NFHS_TREND.teenagePregnancy.nfhs4}%`}
            tone="warn"
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <KpiCard
            label="CMRTS marriages prevented"
            value={CMRTS_TREND[CMRTS_TREND.length - 1].value}
            sub="2025 · 130 → 471 → 929 (3yr)"
            tone="ok"
            icon={<Activity className="h-4 w-4" />}
          />
          <KpiCard
            label="eCourts cases filed"
            value={ECOURTS_TOTALS.y2025}
            sub={`+${ECOURTS_TOTALS.growth}% vs ${ECOURTS_TOTALS.y2024} in 2024`}
            tone="risk"
            icon={<Scale className="h-4 w-4" />}
          />
        </div>

        {/* CMRTS sparkline strip */}
        <div className="mt-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">CMRTS Prevention Trend</div>
              <h3 className="mt-1 font-serif text-lg tracking-tight">Marriages prevented per year — sevenfold rise</h3>
            </div>
            <div className="text-xs text-muted-foreground">2023 → 2025</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {CMRTS_TREND.map((c) => (
              <div key={c.year}>
                <div className="flex items-end justify-between text-xs">
                  <span className="font-medium">{c.year}</span>
                  <span className="tabular-nums font-bold">{c.value}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded bg-secondary">
                  <div className="h-full" style={{ width: `${(c.value / cmrtsMax) * 100}%`, backgroundColor: "var(--risk-safe)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAR Snapshot */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <div className="rounded-xl border-2 border-[color:var(--risk-critical)]/30 bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-critical)]">Daily Arrest Report Snapshot</div>
              <h2 className="mt-1 font-serif text-2xl tracking-tight">{DAR_SUMMARY.windowLabel} · arrest activity</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[DAR_SUMMARY.murshidabadPD, DAR_SUMMARY.jangipurPD].map((pd) => (
              <div key={pd.label} className="rounded-lg border border-border p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{pd.label}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold tabular-nums">{pd.total}</span>
                  <span className="text-xs text-muted-foreground">cases</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  {"pcma" in pd && <Stat k="PCMA" v={pd.pcma} />}
                  {"pocso" in pd && <Stat k="POCSO" v={pd.pocso} />}
                  {"kidnapping" in pd && <Stat k="Kidnapping" v={pd.kidnapping} />}
                  {"trafficking" in pd && <Stat k="Trafficking" v={pd.trafficking} />}
                  {"rape" in pd && <Stat k="Rape" v={pd.rape} />}
                  <Stat k="Multi-convict" v={pd.multiConvict} />
                  <Stat k="Child convicts" v={pd.childConvicts} />
                  <Stat k="Avg. age" v={pd.avgAge} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">District Map</div>
              <h2 className="mt-1 font-serif text-2xl tracking-tight">Murshidabad — 26 blocks, mapped</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Filter by cardinal direction (North, South, East, West, Central) or reshade by indicator. Hover any
                block for teenage pregnancies, CMRTS, FIRs and police station.
              </p>
            </div>
            <Link to="/map" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Explore full map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5">
            <MurshidabadMap height={460} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeakFunnel />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 md:p-7">
          <h2 className="font-serif text-2xl tracking-tight">District totals</h2>
          <p className="mt-1 text-sm text-muted-foreground">Cumulative across all 26 blocks (current draft).</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Tot label="Pregnancies" value={DISTRICT_TOTALS.pregnancies} icon={<Heart className="h-4 w-4" />} />
            <Tot label="K1 dropouts" value={DISTRICT_TOTALS.k1Dropouts} icon={<Activity className="h-4 w-4" />} />
            <Tot label="CMRTS prevented" value={DISTRICT_TOTALS.childMarriages} icon={<AlertTriangle className="h-4 w-4" />} />
            <Tot label="FIRs filed" value={DISTRICT_TOTALS.firs} icon={<Scale className="h-4 w-4" />} />
          </div>
          <p className="mt-5 rounded-md bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">What this means:</strong> Even with a sevenfold rise in CMRTS prevention,
            the gap between health detection and FIRs remains structural. The system catches more — but courts still see a fraction.
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
                <div><div className="text-foreground font-semibold tabular-nums">{b.childMarriages}</div>CMRTS</div>
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
              <div className="font-semibold text-foreground">1 · Detection is up — justice is lagging.</div>
              <p className="mt-1 text-muted-foreground">CMRTS prevention jumped 130 → 929 in three years, but FIRs grew only 201 → 226. Detection finally outpaces filing.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground">2 · Lalgola is the district crime epicentre.</div>
              <p className="mt-1 text-muted-foreground">Lalgola PS leads the district at 38 cases (2025), followed by Berhampore and Murshidabad town.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground">3 · Khargram & Sagardighi remain silent.</div>
              <p className="mt-1 text-muted-foreground">Khargram filed only 13 FIRs against 3,909 pregnancies — a 0.003% justice ratio.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ k, v }: { k: string; v: number | string }) {
  return (
    <div className="flex items-baseline justify-between rounded border border-border/60 px-2 py-1">
      <span>{k}</span>
      <span className="font-bold tabular-nums text-foreground">{v}</span>
    </div>
  );
}

function Tot({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="mt-1 text-xl font-bold tabular-nums">{value.toLocaleString("en-IN")}</div>
    </div>
  );
}
