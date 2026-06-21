import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  Globe,
  Users,
  Heart,
  Droplet,
  Scale,
  BarChart3,
  Map,
  Grid3x3,
  LineChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { KpiCard } from "@/components/site/KpiCard";
import { BLOCKS, DISTRICT_TOTALS } from "@/data/blocks";
import { NFHS_TREND } from "@/data/crime";
import { scoreAllBlocks } from "@/lib/vulnerability-score";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Murshidabad ChildWatch AI — Child Protection Intelligence" },
      { name: "description", content: "AI-powered child protection intelligence and situational analysis for Murshidabad district. Evidence-led, decision-support dashboard." },
      { property: "og:title", content: "Murshidabad ChildWatch AI — Child Protection Intelligence" },
      { property: "og:description", content: "AI-powered situational analysis across 26 blocks of Murshidabad district." },
    ],
  }),
  component: Index,
});

function Index() {
  const scored = scoreAllBlocks();
  const avgScore = scored.reduce((s, c) => s + c.score, 0) / scored.length;
  const avgReportingSilence = BLOCKS.reduce((s, b) => s + b.reportingSilence, 0) / BLOCKS.length;
  const justiceGap = (100 - (DISTRICT_TOTALS.firs / DISTRICT_TOTALS.pregnancies) * 100);

  return (
    <>
      <Hero />

      {/* AI Intelligence Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI Intelligence Highlights
              </div>
              <h2 className="mt-1 font-serif text-2xl tracking-tight">
                Auto-generated situational summary
              </h2>
            </div>
            <Link
              to="/copilot"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Open Intelligence Assistant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <HighlightCard
              icon={<MapPin className="h-4 w-4" />}
              label="Most Vulnerable Block"
              value="Jalangi"
              context="Highest composite vulnerability score across all 26 blocks."
            />
            <HighlightCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="Emerging Trend"
              value="School Dropout Signals"
              context="Kanyashree K1 non-renewals rising in north-central cluster."
            />
            <HighlightCard
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Emerging Risk Signal"
              value="Multi-Indicator Vulnerability Cluster"
              context="Several blocks show simultaneous elevation across health, scheme, and justice indicators."
            />
            <HighlightCard
              icon={<Globe className="h-4 w-4" />}
              label="District Intelligence"
              value="Eastern Blocks Show Higher Vulnerability"
              context="Eastern-border cluster records elevated reporting silence and pregnancy loads."
            />
          </div>

          <div className="mt-5 rounded-md border border-border/60 bg-secondary/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Method:</strong> Highlights are deterministically computed
            from HMIS, CMRTS, Kanyashree, eCourts, and Daily Arrest Report indicators across all 26 blocks.
            Outputs describe observed patterns and analytical signals; they do not prescribe action.
          </div>
        </div>
      </section>

      {/* Key KPI Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Key Indicators</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">District-level KPIs</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Total Population"
            value="7.1M"
            sub="Census 2011 · 26 blocks · 254 GPs"
            tone="default"
            icon={<Users className="h-4 w-4" />}
          />
          <KpiCard
            label="Child Marriage %"
            value={`${NFHS_TREND.childMarriage.nfhs5}%`}
            sub={`NFHS-V · ↑ ${NFHS_TREND.childMarriage.delta} pts vs NFHS-IV`}
            tone="risk"
            icon={<Heart className="h-4 w-4" />}
          />
          <KpiCard
            label="Teenage Pregnancy"
            value={`${NFHS_TREND.teenagePregnancy.nfhs5}%`}
            sub={`NFHS-V · ↓ ${Math.abs(NFHS_TREND.teenagePregnancy.delta)} pts vs NFHS-IV`}
            tone="warn"
            icon={<Droplet className="h-4 w-4" />}
          />
          <KpiCard
            label="Justice Gap"
            value={`${justiceGap.toFixed(1)}%`}
            sub={`${DISTRICT_TOTALS.firs.toLocaleString("en-IN")} FIRs vs ${DISTRICT_TOTALS.pregnancies.toLocaleString("en-IN")} pregnancies`}
            tone="risk"
            icon={<Scale className="h-4 w-4" />}
          />
          <KpiCard
            label="Vulnerability Index"
            value={avgScore.toFixed(0)}
            sub={`District mean · ${scored.filter((s) => s.priority === "Critical").length} Critical · ${scored.filter((s) => s.priority === "High").length} High`}
            tone="warn"
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Maps & Analytics */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Maps & Analytics</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">Explore the data</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <AnalyticsCard
            icon={<Map className="h-5 w-5" />}
            title="Hotspot Map"
            description="Block-level vulnerability mapped across Murshidabad. Click any block for AI-generated hotspot intelligence."
            href="/map"
          />
          <AnalyticsCard
            icon={<Grid3x3 className="h-5 w-5" />}
            title="Vulnerability Matrix"
            description="26-block scorecard with AI vulnerability scores, contributing indicators, and priority levels."
            href="/matrix"
          />
          <AnalyticsCard
            icon={<LineChart className="h-5 w-5" />}
            title="District Trends"
            description="Year-over-year trends in CMRTS prevention, eCourts filings, police station caseloads, and block comparisons."
            href="/insights"
          />
        </div>
      </section>
    </>
  );
}

function HighlightCard({
  icon,
  label,
  value,
  context,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  context: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <div className="mt-2 font-serif text-base font-semibold text-foreground">{value}</div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{context}</p>
    </div>
  );
}

function AnalyticsCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-3 font-serif text-lg tracking-tight text-foreground group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto pt-4 text-sm font-medium text-primary">
        Explore <ArrowRight className="ml-1 inline-block h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
