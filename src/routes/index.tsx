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
  GitCompare,
  ArrowRight,
  Sparkles,
  FileText,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { BLOCKS, DISTRICT_TOTALS } from "@/data/blocks";
import { NFHS_TREND } from "@/data/crime";
import { scoreAllBlocks } from "@/lib/vulnerability-score";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Murshidabad ChildWatch AI — Child Protection Intelligence Platform" },
      {
        name: "description",
        content:
          "AI-powered child protection intelligence and situational analysis for Murshidabad district. Evidence-based, government-ready, explainable AI.",
      },
      { property: "og:title", content: "Murshidabad ChildWatch AI" },
      {
        property: "og:description",
        content:
          "Evidence-based child protection intelligence across 26 blocks of Murshidabad district.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const scored = scoreAllBlocks();
  const avgScore = scored.reduce((s, c) => s + c.score, 0) / scored.length;
  const justiceGap = 100 - (DISTRICT_TOTALS.firs / DISTRICT_TOTALS.pregnancies) * 100;
  const critical = scored.filter((s) => s.priority === "Critical").length;
  const high = scored.filter((s) => s.priority === "High").length;
  const priorityBlocks = critical + high;

  return (
    <>
      <Hero />

      {/* SECTION 2 — District Intelligence Highlights */}
      <Section>
        <SectionHeader
          eyebrow="District Intelligence Highlights"
          title="AI-generated situational signals"
          lead="Auto-computed insights from HMIS, Kanyashree, CMRTS, eCourts and PS-level data — refreshed with each indicator update."
          accent="primary"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <InsightCard
            icon={<MapPin className="h-4 w-4" />}
            kind="Most Vulnerable Block"
            observation="Jalangi shows the highest composite vulnerability score in the district."
            indicator="Composite Vulnerability Index · 26-block ranking"
            confidence="High"
          />
          <InsightCard
            icon={<TrendingUp className="h-4 w-4" />}
            kind="Emerging Trend"
            observation="Rising school-dropout signals concentrated in the north-central cluster."
            indicator="Kanyashree K1 non-renewals · year-over-year"
            confidence="Moderate"
          />
          <InsightCard
            icon={<ShieldAlert className="h-4 w-4" />}
            kind="Emerging Risk Signal"
            observation="Multi-indicator vulnerability cluster — health, scheme and justice indicators co-elevated."
            indicator="HMIS · CMRTS · eCourts cross-section"
            confidence="High"
          />
          <InsightCard
            icon={<Globe className="h-4 w-4" />}
            kind="District Intelligence Snapshot"
            observation="Eastern-border blocks record higher reporting silence and adolescent pregnancy load."
            indicator="Reporting Silence Index · HMIS adolescent register"
            confidence="High"
          />
        </div>
      </Section>

      {/* SECTION 3 — Child Protection Landscape */}
      <Section bg="muted">
        <SectionHeader
          eyebrow="Child Protection Landscape"
          title="District-level indicators at a glance"
          lead="Five headline metrics that frame the situational picture across 26 blocks."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric
            icon={<Heart className="h-4 w-4" />}
            label="Child Marriage"
            value={`${NFHS_TREND.childMarriage.nfhs5}%`}
            sub={`NFHS-V · ↑ ${NFHS_TREND.childMarriage.delta} pts vs NFHS-IV`}
            tone="risk"
          />
          <Metric
            icon={<Droplet className="h-4 w-4" />}
            label="Teenage Pregnancy"
            value={`${NFHS_TREND.teenagePregnancy.nfhs5}%`}
            sub={`NFHS-V · ↓ ${Math.abs(NFHS_TREND.teenagePregnancy.delta)} pts vs NFHS-IV`}
            tone="signal"
          />
          <Metric
            icon={<Scale className="h-4 w-4" />}
            label="Justice Gap"
            value={`${justiceGap.toFixed(1)}%`}
            sub={`${DISTRICT_TOTALS.firs.toLocaleString("en-IN")} FIRs vs ${DISTRICT_TOTALS.pregnancies.toLocaleString("en-IN")} pregnancies`}
            tone="risk"
          />
          <Metric
            icon={<BarChart3 className="h-4 w-4" />}
            label="Vulnerability Index"
            value={avgScore.toFixed(0)}
            sub="District mean · 0–100 composite"
            tone="signal"
          />
          <Metric
            icon={<Users className="h-4 w-4" />}
            label="Priority Blocks"
            value={`${priorityBlocks}`}
            sub={`${critical} Critical · ${high} High of ${BLOCKS.length}`}
            tone="accent"
          />
        </div>
      </Section>

      {/* SECTION 4 — Vulnerability Landscape */}
      <Section>
        <SectionHeader
          eyebrow="Vulnerability Landscape"
          title="Maps, matrices and block comparison"
          lead="Spatial and analytical views — each paired with AI-generated explanations of the underlying pattern."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <ExploreCard
            icon={<Map className="h-5 w-5" />}
            title="Hotspot Map"
            description="Block-level vulnerability mapped across Murshidabad."
            aiNote="AI explainer: clusters traced to co-elevated HMIS load and low FIR-to-incidence ratios."
            href="/map"
          />
          <ExploreCard
            icon={<Grid3x3 className="h-5 w-5" />}
            title="Vulnerability Matrix"
            description="26-block scorecard with contributing indicators and priority bands."
            aiNote="AI explainer: scores are weighted across five indicators with transparent contributions."
            href="/matrix"
          />
          <ExploreCard
            icon={<GitCompare className="h-5 w-5" />}
            title="Block Comparison"
            description="Side-by-side trends across CMRTS, eCourts and PS caseloads."
            aiNote="AI explainer: deltas surfaced where blocks diverge from district median."
            href="/insights"
          />
        </div>
      </Section>

      {/* SECTION 5 — Emerging Risk Signals teaser */}
      <Section bg="muted">
        <SectionHeader
          eyebrow="Emerging Risk Signals"
          title="Where indicators are diverging from district norms"
          lead="Professional intelligence-style signals — observation, data basis, severity and contributing indicators. No recommendations."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <SignalPreview
            severity="critical"
            title="Sagardighi & Samserganj — sustained reporting silence"
            observation="Filing-to-incidence ratios near 0.005% across multiple reporting periods."
            indicators={["Teenage Pregnancies", "POCSO / Child FIRs", "Reporting Silence"]}
            basis="HMIS · WB Police PS-level FIRs · CMRTS"
          />
          <SignalPreview
            severity="high"
            title="Lalgola — concentration of registered child-crime cases"
            observation="38 POCSO + child-crime cases in 2025 (vs. 31 in 2024) — highest single-PS count."
            indicators={["POCSO / Child FIRs", "Border Geography", "Trafficking Indicators"]}
            basis="WB Police PS daily diary · AHTU casework"
          />
        </div>
        <div className="mt-6">
          <Link
            to="/red-flags"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all emerging risk signals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* SECTION 6 — AI Intelligence Assistant */}
      <Section>
        <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <Eyebrow color="accent">AI Intelligence Assistant</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Ask analytical questions. Receive briefing-style answers.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              The assistant returns evidence-based situational analysis in a consistent structure —
              Executive Summary, Key Observations, Supporting Indicators, Comparative Analysis,
              Emerging Risk Signals, and Data Caveats. No prescriptive recommendations.
            </p>
            <ol className="mt-6 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              {[
                "Executive Summary",
                "Key Observations",
                "Supporting Indicators",
                "Comparative Analysis",
                "Emerging Risk Signals",
                "Data Caveats",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <Link
              to="/copilot"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" /> Launch Intelligence Assistant
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-secondary/60 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Activity className="h-3.5 w-3.5" /> Sample briefing prompt
            </div>
            <p className="mt-3 font-serif text-lg italic text-foreground">
              "Compare Jalangi with neighbouring blocks across health and justice indicators."
            </p>
            <div className="mt-4 rounded-md border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Returns:</span> a structured analytical
              briefing with quoted indicator values, ratio comparisons against district medians, and
              clearly stated data limitations.
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 7 — Generate District Brief */}
      <Section>
        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 6%, var(--card)) 0%, var(--card) 60%)",
          }}
        >
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow color="primary">Generate District Brief</Eyebrow>
              <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                Murshidabad Child Protection Brief
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                A deterministic, government-ready briefing compiled directly from dashboard data.
                Includes Executive Summary, District Overview, Vulnerability Ranking, Emerging Risk
                Signals, Indicator Analysis, Block Comparisons and Trend Analysis. Export-ready PDF.
              </p>
              <ul className="mt-5 grid gap-1.5 text-sm text-foreground/80 sm:grid-cols-2">
                {[
                  "Executive Summary",
                  "District Overview",
                  "Vulnerability Ranking",
                  "Emerging Risk Signals",
                  "Indicator Analysis",
                  "Block Comparisons",
                  "Trend Analysis",
                ].map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/brief"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                <FileText className="h-4 w-4" /> Generate &amp; View Brief
              </Link>
              <span className="text-center text-[11px] text-muted-foreground">
                PDF export available on the brief page
              </span>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-8" />
    </>
  );
}

/* ============================================================
   Layout helpers
   ============================================================ */

function Section({ children, bg = "default" }: { children: React.ReactNode; bg?: "default" | "muted" }) {
  return (
    <section
      className={
        bg === "muted"
          ? "border-y border-border bg-[color:var(--secondary)]"
          : "bg-background"
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">{children}</div>
    </section>
  );
}

function Eyebrow({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "accent" }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: color === "accent" ? "var(--accent)" : "var(--primary)" }}
    >
      <Sparkles className="h-3 w-3" /> {children}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  lead,
  accent,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  accent?: "primary" | "accent";
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow color={accent ?? "primary"}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{lead}</p>
    </div>
  );
}

/* ============================================================
   Section 2 — Insight cards
   ============================================================ */

function InsightCard({
  icon,
  kind,
  observation,
  indicator,
  confidence,
}: {
  icon: React.ReactNode;
  kind: string;
  observation: string;
  indicator: string;
  confidence: "High" | "Moderate" | "Indicative";
}) {
  const conf =
    confidence === "High"
      ? { bg: "color-mix(in oklab, var(--accent) 14%, transparent)", fg: "var(--accent)" }
      : confidence === "Moderate"
        ? { bg: "color-mix(in oklab, var(--destructive) 12%, transparent)", fg: "var(--destructive)" }
        : { bg: "var(--muted)", fg: "var(--muted-foreground)" };

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">{icon}</span>
          {kind}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-2.5 w-2.5" /> AI
        </span>
      </div>
      <h3 className="mt-4 font-serif text-lg leading-snug text-foreground">{observation}</h3>
      <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider text-foreground/70">Indicator: </span>
        {indicator}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: conf.bg, color: conf.fg }}
        >
          {confidence}
        </span>
      </div>
    </article>
  );
}

/* ============================================================
   Section 3 — Metric cards
   ============================================================ */

function Metric({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "risk" | "signal" | "accent";
}) {
  const accentVar =
    tone === "risk" ? "var(--risk-critical)" : tone === "signal" ? "var(--destructive)" : "var(--accent)";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: `color-mix(in oklab, ${accentVar} 12%, transparent)`, color: accentVar }}>
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 font-serif text-3xl tracking-tight text-foreground">{value}</div>
      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{sub}</div>
      <div className="mt-3 h-0.5 w-10 rounded-full" style={{ background: accentVar }} />
    </div>
  );
}

/* ============================================================
   Section 4 — Explore cards
   ============================================================ */

function ExploreCard({
  icon,
  title,
  description,
  aiNote,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  aiNote: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-serif text-xl tracking-tight text-foreground group-hover:text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 rounded-md border-l-2 bg-secondary/50 p-3 text-[11px] leading-relaxed text-muted-foreground" style={{ borderColor: "var(--accent)" }}>
        <span className="font-semibold uppercase tracking-wider text-foreground/80">AI explainer · </span>
        {aiNote}
      </div>
      <div className="mt-auto pt-4 text-sm font-semibold text-primary">
        Explore <ArrowRight className="ml-1 inline-block h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/* ============================================================
   Section 5 — Signal preview
   ============================================================ */

function SignalPreview({
  severity,
  title,
  observation,
  indicators,
  basis,
}: {
  severity: "critical" | "high" | "moderate";
  title: string;
  observation: string;
  indicators: string[];
  basis: string;
}) {
  const color =
    severity === "critical"
      ? "var(--risk-critical)"
      : severity === "high"
        ? "var(--destructive)"
        : "var(--risk-moderate)";
  const label = severity === "critical" ? "Critical" : severity === "high" ? "High" : "Moderate";

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>
          <AlertTriangle className="h-3.5 w-3.5" /> Emerging Risk Signal
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ background: color }}
        >
          Severity · {label}
        </span>
      </div>
      <h3 className="mt-3 font-serif text-xl leading-snug text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{observation}</p>
      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground/70">Contributing indicators</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {indicators.map((i) => (
            <span key={i} className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground">
              {i}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider text-foreground/70">Data basis · </span>
        {basis}
      </div>
    </article>
  );
}
