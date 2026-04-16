import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, CLUSTERS, type ClusterId, riskColor, riskLabel } from "@/data/blocks";

export const Route = createFileRoute("/clusters")({
  head: () => ({
    meta: [
      { title: "Cluster Stories — Murshidabad" },
      { name: "description", content: "Seven cluster narratives across Murshidabad: border belt, high-dropout zones, central hub and more." },
      { property: "og:title", content: "Cluster Stories — Murshidabad" },
      { property: "og:description", content: "How Murshidabad's blocks group up into seven distinct vulnerability stories." },
    ],
  }),
  component: ClustersPage,
});

function ClustersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cluster Stories"
        title="Seven faces of vulnerability"
        lead="Murshidabad is not one district — it is seven distinct stories. Border, river, dropout-belt, urban, agricultural, transit, mid-south."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-6 md:grid-cols-2">
        {(Object.keys(CLUSTERS) as ClusterId[]).map((id) => {
          const c = CLUSTERS[id];
          const blocks = BLOCKS.filter((b) => b.cluster === id);
          const panchayats = blocks.flatMap((b) => b.topPanchayats ?? []);
          return (
            <article key={id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColor(c.color) }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: riskColor(c.color) }}>{riskLabel(c.color)}</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl tracking-tight">{c.label}</h2>
              <div className="mt-1 text-xs italic text-muted-foreground">{c.theme}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>

              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-foreground">Member blocks</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {blocks.map((b) => (
                  <span key={b.id} className="rounded-full border border-border px-2.5 py-0.5 text-[11px]">{b.name}</span>
                ))}
              </div>

              {panchayats.length > 0 && (
                <>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-foreground">Top Panchayat hotspots</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {panchayats.map((p) => (
                      <span key={p} className="rounded-full px-2.5 py-0.5 text-[11px] text-white" style={{ backgroundColor: riskColor(c.color) }}>{p}</span>
                    ))}
                  </div>
                </>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
