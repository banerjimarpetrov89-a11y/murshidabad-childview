import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { RED_FLAGS } from "@/data/content";

export const Route = createFileRoute("/red-flags")({
  head: () => ({
    meta: [
      { title: "Red Flags — Murshidabad Child Protection" },
      { name: "description", content: "The discrepancies that demand action: Domkol's zero FIRs, Raninagar II's hidden child brides, the Kanyashree loophole." },
      { property: "og:title", content: "Red Flags — Murshidabad Child Protection" },
      { property: "og:description", content: "Where the data is screaming. And what should be done." },
    ],
  }),
  component: RedFlagsPage,
});

function RedFlagsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Critical Insights"
        title="The data is screaming."
        lead="Where reporting, scheme and justice systems break down most visibly. Each card ends with a concrete next step."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-5 md:grid-cols-2">
        {RED_FLAGS.map((f) => (
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
    </>
  );
}
