import { createFileRoute } from "@tanstack/react-router";
import { Compass as CompassIcon, Shield } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, CLUSTERS, COMPASS_LABELS, compassRollup, type ClusterId, type Compass, riskColor, riskLabel } from "@/data/blocks";
import { JANGIPUR_PD_BLOCKS, JANGIPUR_PD_META, LIMITATIONS } from "@/data/crime";

export const Route = createFileRoute("/clusters")({
  head: () => ({
    meta: [
      { title: "Cluster Stories  —" },
      { name: "description", content: "Seven cluster narratives + cardinal N/S/E/W/C roll-ups + the Jangipur Police District story for Murshidabad." },
      { property: "og:title", content: "Cluster Stories  —" },
      { property: "og:description", content: "How Murshidabad's blocks group up into distinct vulnerability stories." },
    ],
  }),
  component: ClustersPage,
});

function ClustersPage() {
  const compasses: Compass[] = ["N", "S", "E", "W", "C"];

  return (
    <>
      <PageHeader
        eyebrow="Cluster Stories"
        title="Seven faces of vulnerability"
        lead="Murshidabad is not one district — it is multiple distinct stories. Thematic clusters, cardinal direction roll-ups, and the new Jangipur Police District."
      />

      {/* Cardinal roll-up */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <CompassIcon className="h-3.5 w-3.5" /> Cardinal Roll-up
            </div>
            <h2 className="mt-1 font-serif text-2xl tracking-tight">North · South · East · West · Central</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {compasses.map((c) => {
            const r = compassRollup(c);
            return (
              <div key={c} className="rounded-xl border border-border bg-card p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{COMPASS_LABELS[c]}</div>
                <div className="mt-1 font-serif text-xl tabular-nums">{r.count} blocks</div>
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <Row k="Pregnancies" v={r.tp.toLocaleString("en-IN")} />
                  <Row k="CMRTS" v={r.cm} />
                  <Row k="FIRs" v={r.firs} />
                  <Row k="FIRs / 1k TP" v={r.ratio.toFixed(2)} highlight={r.ratio < 1} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Jangipur PD */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <article className="rounded-xl border-2 border-primary/30 bg-card p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">New Jurisdiction</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">Jangipur Police District</h2>
          <div className="mt-1 text-xs italic text-muted-foreground">Carved out for border security and anti-trafficking · est. {JANGIPUR_PD_META.established}</div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Stat label="Member blocks" value={JANGIPUR_PD_META.blocks} />
            <Stat label="Area" value={`${JANGIPUR_PD_META.areaKm2} km²`} />
            <Stat label="Population" value={`${(JANGIPUR_PD_META.population / 100000).toFixed(1)}L`} />
            <Stat label="Focus" value="Border + AHTU" />
          </div>
          <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-foreground">Member blocks</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {JANGIPUR_PD_BLOCKS.map((b) => (
              <span key={b} className="rounded-full border border-border px-2.5 py-0.5 text-[11px]">{b}</span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Created on 1 January 2020 to take pressure off the legacy Murshidabad PD, Jangipur PD covers the
            northernmost trafficking-prone corridor — Farakka through Sagardighi. Despite covering ~1.9 million
            residents, its 2025 DAR shows only 25 child-crime arrests, suggesting room for both more proactive
            policing and better complaint-intake infrastructure.
          </p>
        </article>
      </section>

      {/* Thematic clusters */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <h2 className="font-serif text-2xl tracking-tight">Seven thematic clusters</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
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
                <h3 className="mt-2 font-serif text-2xl tracking-tight">{c.label}</h3>
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
        </div>
      </section>

      {/* Limitations */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Limitations of this Analysis</div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {LIMITATIONS.map((l) => (
              <li key={l} className="flex gap-2 text-muted-foreground">
                <span className="text-[color:var(--risk-high)]">·</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Row({ k, v, highlight }: { k: string; v: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={`tabular-nums font-bold ${highlight ? "text-[color:var(--risk-critical)]" : "text-foreground"}`}>{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-bold">{value}</div>
    </div>
  );
}
