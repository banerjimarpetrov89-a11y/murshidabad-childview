import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ACTION_PLAN } from "@/data/content";

export const Route = createFileRoute("/action-plan")({
  head: () => ({
    meta: [
      { title: "District Action Plan — Murshidabad" },
      { name: "description", content: "The two-part Murshidabad District Administration action plan: Data & Tracking + Community & Law Enforcement." },
      { property: "og:title", content: "District Action Plan — Murshidabad" },
      { property: "og:description", content: "Concrete actions for govt, NGO and CSR partners." },
    ],
  }),
  component: ActionPage,
});

function ActionPage() {
  return (
    <>
      <PageHeader
        eyebrow="District Action Plan"
        title="What to do, who does it"
        lead="A two-part plan for Murshidabad — one for data and tracking systems, one for community and law-enforcement action."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-8 lg:grid-cols-2">
        {[ACTION_PLAN.partA, ACTION_PLAN.partB].map((part) => (
          <div key={part.title} className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="text-3xl">{part.icon}</div>
            <h2 className="mt-2 font-serif text-2xl tracking-tight">{part.title}</h2>
            <ol className="mt-6 space-y-4">
              {part.items.map((it, i) => (
                <li key={it.title} className="rounded-md border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                    <div>
                      <div className="font-semibold text-foreground">{it.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}
