import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Award } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { RED_FLAGS } from "@/data/content";
import { LANDMARK_VERDICT } from "@/data/crime";

export const Route = createFileRoute("/red-flags")({
  head: () => ({
    meta: [
      { title: "Red Flags — Murshidabad Child Protection" },
      { name: "description", content: "The discrepancies that demand action: the 0.003% justice gap, Lalgola epicentre, the Kanyashree loophole and the landmark POCSO verdict." },
      { property: "og:title", content: "Red Flags — Murshidabad Child Protection" },
      { property: "og:description", content: "Where the data is screaming. And what should be done." },
    ],
  }),
  component: RedFlagsPage,
});

const NEW_FLAGS = [
  {
    id: "khargram-justice-gap",
    title: "Khargram: 3,909 pregnancies → 13 FIRs (0.003%)",
    severity: "critical" as const,
    body: "Khargram block recorded 3,909 teenage pregnancies in the latest cumulative HMIS data. Only 13 POCSO/child-crime FIRs were filed. That is a 0.003% justice ratio — effectively zero.",
    action: "Co-locate a CWC desk with Khargram PS; mandatory monthly cross-check between BMOH pregnancy register and Khargram PS daily diary.",
  },
  {
    id: "sagardighi-samserganj-silence",
    title: "Sagardighi & Samserganj — vanishing reporting",
    severity: "critical" as const,
    body: "Sagardighi: 4,559 TP / 10 FIRs (0.005%). Samserganj: 4,548 TP / 26 FIRs (0.005%). Two of the highest-load northern blocks have the silenced reporting trail.",
    action: "Trigger DM-led joint review with both OCs; activate AHTU sub-units; quarterly publication of TP-to-FIR ratio per PS.",
  },
  {
    id: "lalgola-epicentre",
    title: "Lalgola = district crime epicentre (PS 38 cases · 2025)",
    severity: "critical" as const,
    body: "Lalgola PS leads the district with 38 POCSO + child crime cases registered in 2025 — up from 31 in 2024. The block sits at the convergence of border smuggling routes, Padma island migration, and active trafficking networks.",
    action: "Permanent AHTU posting at Lalgola PS; specialised POCSO investigator; coordination cell with Bangladesh-side counterparts via BSF.",
  },
  {
    id: "raghunathganj-paradox",
    title: "Raghunathganj paradox: 7,200 TP, only 15 FIRs",
    severity: "critical" as const,
    body: "Raghunathganj I + II combined hold the largest pregnancy load in the dataset (~7,200) yet produced only 15 FIRs. Filings track Lalgola, not Raghunathganj — even though the underlying caseload is larger.",
    action: "Audit Raghunathganj PS daily diary against Suti GH pregnancy register; deploy a roving CWC member for 90 days.",
  },
];

function RedFlagsPage() {
  const all = [...RED_FLAGS, ...NEW_FLAGS];
  return (
    <>
      <PageHeader
        eyebrow="Critical Insights"
        title="The data is screaming."
        lead="Where reporting, scheme and justice systems break down most visibly. Each card ends with a concrete next step."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-5 md:grid-cols-2">
        {all.map((f) => (
          <article key={f.id} className="rounded-xl border-2 bg-card p-6 shadow-sm" style={{ borderColor: f.severity === "critical" ? "color-mix(in oklab, var(--risk-critical) 50%, transparent)" : "color-mix(in oklab, var(--risk-high) 50%, transparent)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: f.severity === "critical" ? "var(--risk-critical)" : "var(--risk-high)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: f.severity === "critical" ? "var(--risk-critical)" : "var(--risk-high)" }}>
                {f.severity} red flag
              </span>
            </div>
            <h2 className="mt-2 font-serif text-2xl leading-tight tracking-tight">{f.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            <div className="mt-5 rounded-md border-l-4 bg-secondary/50 p-3 text-sm" style={{ borderColor: "var(--primary)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">What should be done here?</div>
              <p className="mt-1 text-foreground">{f.action}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Landmark verdict — counter-narrative */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <article className="rounded-xl border-2 border-[color:var(--risk-safe)]/40 bg-card p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[color:var(--risk-safe)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--risk-safe)]">
              When the system delivers
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
