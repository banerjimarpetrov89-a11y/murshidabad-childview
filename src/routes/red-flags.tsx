import { createFileRoute } from "@tanstack/react-router";
import { Activity, Award, Info } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { RED_FLAGS } from "@/data/content";
import { LANDMARK_VERDICT } from "@/data/crime";

export const Route = createFileRoute("/red-flags")({
  head: () => ({
    meta: [
      { title: "Emerging Risk Signals — Murshidabad ChildWatch AI" },
      {
        name: "description",
        content:
          "Evidence-based emerging risk signals across Murshidabad blocks: contributing indicators, observed patterns and severity. Situational intelligence only — no prescriptive actions.",
      },
      { property: "og:title", content: "Emerging Risk Signals — Murshidabad ChildWatch AI" },
      {
        property: "og:description",
        content:
          "Where indicators are diverging from district norms. Observation + contributing indicators + severity.",
      },
    ],
  }),
  component: RiskSignalsPage,
});

type Severity = "critical" | "high" | "moderate";

type Signal = {
  id: string;
  title: string;
  severity: Severity;
  observation: string;
  indicators: string[];
  dataBasis: string;
};

const NEW_SIGNALS: Signal[] = [
  {
    id: "khargram-justice-gap",
    title: "Khargram — divergence between health load and justice filings",
    severity: "critical",
    observation:
      "Cumulative HMIS records show 3,909 teenage pregnancies in Khargram block alongside 13 registered POCSO / child-crime FIRs — a filing-to-incidence ratio of approximately 0.003%, the lowest band in the district.",
    indicators: ["Teenage Pregnancies", "POCSO / Child FIRs", "Reporting Silence"],
    dataBasis: "HMIS adolescent pregnancy register · eCourts/PS FIR aggregates",
  },
  {
    id: "sagardighi-samserganj-silence",
    title: "Sagardighi & Samserganj — sustained reporting silence",
    severity: "critical",
    observation:
      "Sagardighi (4,559 teenage pregnancies / 10 FIRs) and Samserganj (4,548 / 26) show filing-to-incidence ratios near 0.005% — among the lowest in northern Murshidabad. Pattern persists across multiple reporting periods.",
    indicators: ["Teenage Pregnancies", "POCSO / Child FIRs", "Reporting Silence"],
    dataBasis: "HMIS · WB Police PS-level FIR data · CMRTS register",
  },
  {
    id: "lalgola-epicentre",
    title: "Lalgola — concentration of registered child-crime cases",
    severity: "high",
    observation:
      "Lalgola PS recorded 38 POCSO + child-crime cases in 2025 (vs. 31 in 2024), the highest single-PS count in the district. Co-located with border, riverine and migration corridors.",
    indicators: ["POCSO / Child FIRs", "Trafficking Indicators", "Border Geography"],
    dataBasis: "WB Police PS daily diary · AHTU casework summaries",
  },
  {
    id: "raghunathganj-divergence",
    title: "Raghunathganj I + II — load-to-filing divergence",
    severity: "high",
    observation:
      "Combined teenage pregnancy load of ~7,200 represents the largest in the dataset, while combined FIRs total 15. Filing volume does not track underlying caseload at the same proportionality observed in comparator northern blocks.",
    indicators: ["Teenage Pregnancies", "POCSO / Child FIRs", "Comparative Filing Ratio"],
    dataBasis: "HMIS · PS-level FIR aggregates · neighbouring-block comparators",
  },
];

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
};

const SEVERITY_VAR: Record<Severity, string> = {
  critical: "var(--risk-critical)",
  high: "var(--risk-high)",
  moderate: "var(--risk-moderate)",
};

function normalize(item: (typeof RED_FLAGS)[number] | Signal): Signal {
  if ("observation" in item) return item;
  // Convert legacy RED_FLAGS records (with `body` and `action`) into the neutral signal shape.
  const sev: Severity =
    item.severity === "critical" ? "critical" : item.severity === "high" ? "high" : "moderate";
  return {
    id: item.id,
    title: item.title,
    severity: sev,
    observation: item.body,
    indicators: deriveIndicators(item.body),
    dataBasis: "Dashboard composite (HMIS · Kanyashree · CMRTS · eCourts)",
  };
}

function deriveIndicators(body: string): string[] {
  const out: string[] = [];
  const b = body.toLowerCase();
  if (b.includes("pregnan")) out.push("Teenage Pregnancies");
  if (b.includes("k1") || b.includes("kanyashree") || b.includes("dropout")) out.push("Kanyashree K1 Dropouts");
  if (b.includes("marri")) out.push("Child Marriages (CMRTS)");
  if (b.includes("fir") || b.includes("pocso") || b.includes("justice")) out.push("POCSO / Child FIRs");
  if (out.length === 0) out.push("Composite Vulnerability Index");
  return out.slice(0, 4);
}

function RiskSignalsPage() {
  const signals: Signal[] = [...RED_FLAGS.map(normalize), ...NEW_SIGNALS];

  return (
    <>
      <PageHeader
        eyebrow="Emerging Risk Signals"
        title="Where indicators are diverging from district norms"
        lead="Evidence-based signals across Murshidabad blocks. Each card states the observation, contributing indicators, data basis and severity band. This view provides situational intelligence — it does not recommend actions."
      />

      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <div className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            Signals are derived from HMIS, Kanyashree, CMRTS and eCourts/PS data. Severity reflects
            the strength and persistence of the observed pattern, not a prescription. Decisions
            remain with the competent authority.
          </span>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 md:grid-cols-2 md:px-6">
        {signals.map((s) => {
          const color = SEVERITY_VAR[s.severity];
          return (
            <article
              key={s.id}
              className="rounded-xl border-2 bg-card p-6 shadow-sm"
              style={{ borderColor: `color-mix(in oklab, ${color} 50%, transparent)` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" style={{ color }} />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color }}
                  >
                    Emerging Risk Signal
                  </span>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: color }}
                >
                  Severity · {SEVERITY_LABEL[s.severity]}
                </span>
              </div>

              <h2 className="mt-2 font-serif text-2xl leading-tight tracking-tight">{s.title}</h2>

              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Observation
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.observation}</p>
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Contributing Indicators
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {s.indicators.map((i) => (
                    <span
                      key={i}
                      className="rounded border border-border bg-secondary/40 px-2 py-0.5 text-[11px] text-foreground"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md border-l-4 bg-background/60 p-3 text-[11px] text-muted-foreground" style={{ borderColor: color }}>
                <span className="font-semibold uppercase tracking-wider text-foreground">Data basis:</span>{" "}
                {s.dataBasis}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <article className="rounded-xl border-2 border-[color:var(--risk-safe)]/40 bg-card p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[color:var(--risk-safe)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-safe)]">
              Counter-signal · system delivery
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">{LANDMARK_VERDICT.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{LANDMARK_VERDICT.body}</p>
          <div className="mt-4 text-xs italic text-muted-foreground">{LANDMARK_VERDICT.citation}</div>
        </article>
      </section>
    </>
  );
}
