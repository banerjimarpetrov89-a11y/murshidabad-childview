import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { MurshidabadMap } from "@/components/site/MurshidabadMap";
import { CLUSTERS, type Block, riskColor, riskLabel } from "@/data/blocks";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Hotspot Map — Murshidabad Child Protection" },
      { name: "description", content: "Interactive block-level vulnerability map of Murshidabad. Click any block for child marriage, pregnancy, dropout and FIR data." },
      { property: "og:title", content: "Hotspot Map — Murshidabad Child Protection" },
      { property: "og:description", content: "Block-by-block vulnerability map across all 26 blocks of Murshidabad." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [selected, setSelected] = useState<Block | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Hotspot Mapping"
        title="Where the risk lives"
        lead="Real geographic boundaries of all 26 Murshidabad blocks, color-coded by vulnerability. Hover for the numbers, click to drill down."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <MurshidabadMap
            height={620}
            selectedId={selected?.id ?? null}
            onSelect={(b) => setSelected(b)}
          />
        </div>

        <aside className="rounded-xl border border-border bg-card p-5 md:p-6">
          {selected ? (
            <BlockDetail block={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="text-sm text-muted-foreground">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Block detail</div>
              <p className="mt-2">Click a block on the map to see its data and Panchayat-level hotspots.</p>
              <div className="mt-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Clusters</div>
                {Object.entries(CLUSTERS).map(([id, c]) => (
                  <div key={id} className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColor(c.color) }} />
                      <span className="font-semibold text-foreground">{c.label}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">{c.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}

function BlockDetail({ block, onClose }: { block: Block; onClose: () => void }) {
  const cluster = CLUSTERS[block.cluster];
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: riskColor(block.risk) }}>
            {riskLabel(block.risk)} risk
          </div>
          <h3 className="mt-1 font-serif text-2xl tracking-tight">{block.name}</h3>
          <div className="mt-1 text-xs text-muted-foreground">{cluster.label}</div>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <Stat label="Pregnancies" value={block.pregnancies.toLocaleString("en-IN")} />
        <Stat label="Child marriages" value={block.childMarriages} />
        <Stat label="K1 dropouts" value={block.k1Dropouts} />
        <Stat label="FIRs" value={block.firs} />
      </dl>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reporting silence</div>
        <div className="mt-1.5 h-2 overflow-hidden rounded bg-secondary">
          <div className="h-full" style={{ width: `${block.reportingSilence}%`, backgroundColor: "var(--risk-critical)" }} />
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{block.reportingSilence}/100 — gap between incidents and FIRs.</div>
      </div>

      {block.topPanchayats && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Panchayat hotspots</div>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {block.topPanchayats.map((p) => (
              <li key={p} className="rounded-full border border-border px-2.5 py-0.5 text-[11px]">{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}
