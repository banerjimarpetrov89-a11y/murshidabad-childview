import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { MurshidabadMap } from "@/components/site/MurshidabadMap";
import { HotspotIntelligence } from "@/components/site/HotspotIntelligence";
import { CLUSTERS, type Block, riskColor, riskLabel } from "@/data/blocks";
import { POLICE_STATION_CASES, PS_FREQUENCY_2024, PS_FREQUENCY_2025 } from "@/data/crime";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Hotspot Map — Child Protection" },
      { name: "description", content: "Interactive block-level vulnerability map of Murshidabad with cardinal filtering and indicator overlays." },
      { property: "og:title", content: "Hotspot Map — Child Protection" },
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
        eyebrow="AI Hotspot Intelligence"
        title="Where the risk signals concentrate"
        lead="Block boundaries across all 26 Murshidabad blocks. Click any block for its district rank, contributing indicators, comparative analysis, historical trend and an AI-generated situational narrative."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <MurshidabadMap
            height={620}
            selectedId={selected?.id ?? null}
            onSelect={(b) => setSelected(b)}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 md:p-6">
            {selected ? (
              <BlockDetail block={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="text-sm text-muted-foreground">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Block detail</div>
                <p className="mt-2">Click a block on the map to see police-station data and Panchayat hotspots.</p>
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
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Top PS · case frequency 2025</div>
            <ul className="mt-3 space-y-2">
              {[...PS_FREQUENCY_2025].sort((a, b) => b.count - a.count).map((p) => {
                const prev = PS_FREQUENCY_2024.find((x) => x.ps === p.ps)?.count ?? 0;
                const max = Math.max(...PS_FREQUENCY_2025.map((x) => x.count));
                return (
                  <li key={p.ps} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.ps}</span>
                      <span className="tabular-nums text-muted-foreground">{prev} → <strong className="text-foreground">{p.count}</strong></span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded bg-secondary">
                      <div className="h-full" style={{ width: `${(p.count / max) * 100}%`, backgroundColor: "var(--risk-critical)" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

function BlockDetail({ block, onClose }: { block: Block; onClose: () => void }) {
  const cluster = CLUSTERS[block.cluster];
  const psRow = block.policeStation
    ? POLICE_STATION_CASES.find((p) => p.ps.toLowerCase() === block.policeStation!.toLowerCase())
    : null;
  const ps2024 = block.policeStation ? PS_FREQUENCY_2024.find((p) => p.ps === block.policeStation)?.count : undefined;
  const ps2025 = block.policeStation ? PS_FREQUENCY_2025.find((p) => p.ps === block.policeStation)?.count : undefined;
  const firRatio = (block.firs / block.pregnancies) * 1000;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: riskColor(block.risk) }}>
            {riskLabel(block.risk)} risk
          </div>
          <h3 className="mt-1 font-serif text-2xl tracking-tight">{block.name}</h3>
          <div className="mt-1 text-xs text-muted-foreground">{cluster.label} · PS {block.policeStation ?? "—"}</div>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <Stat label="Pregnancies" value={block.pregnancies.toLocaleString("en-IN")} />
        <Stat label="CMRTS" value={block.childMarriages} />
        <Stat label="K1 dropouts" value={block.k1Dropouts} />
        <Stat label="FIRs" value={block.firs} />
      </dl>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Justice ratio</div>
        <div className="mt-1 text-sm">
          <span className="font-bold text-[color:var(--risk-critical)] tabular-nums">{firRatio.toFixed(2)}</span>{" "}
          <span className="text-muted-foreground text-xs">FIRs per 1,000 pregnancies</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reporting silence</div>
        <div className="mt-1.5 h-2 overflow-hidden rounded bg-secondary">
          <div className="h-full" style={{ width: `${block.reportingSilence}%`, backgroundColor: "var(--risk-critical)" }} />
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{block.reportingSilence}/100 — gap between incidents and FIRs.</div>
      </div>

      {psRow && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{psRow.ps} PS · case mix</div>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
            <PSCell k="POCSO+CM" v={psRow.pocsoChildMarriage} />
            <PSCell k="POCSO+Rape" v={psRow.pocsoRape} />
            <PSCell k="POCSO+Kidnap" v={psRow.pocsoKidnapping} />
            <PSCell k="Sexual Assault" v={psRow.sexualAssault} />
            <PSCell k="Sexual Harassment" v={psRow.sexualHarassment} />
            <PSCell k="Others" v={psRow.others} />
          </ul>
          {ps2024 !== undefined && ps2025 !== undefined && (
            <div className="mt-2 text-[11px] text-muted-foreground">
              YoY frequency: <span className="tabular-nums">{ps2024} → <strong className="text-foreground">{ps2025}</strong></span>
            </div>
          )}
        </div>
      )}

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

      <HotspotIntelligence block={block} />
    </div>
  );
}

function PSCell({ k, v }: { k: string; v: number }) {
  return (
    <li className="flex items-baseline justify-between rounded border border-border/60 px-2 py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-bold tabular-nums text-foreground">{v}</span>
    </li>
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
