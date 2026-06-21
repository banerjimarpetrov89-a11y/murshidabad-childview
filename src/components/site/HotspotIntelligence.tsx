import { useMemo } from "react";
import { Activity, BarChart3, Info, TrendingUp } from "lucide-react";
import { BLOCKS, CLUSTERS, type Block } from "@/data/blocks";
import { scoreBlock, priorityColor } from "@/lib/vulnerability-score";
import { PS_FREQUENCY_2024, PS_FREQUENCY_2025 } from "@/data/crime";

type Props = { block: Block };

const fmt = (n: number) => n.toLocaleString("en-IN");

function comparativeDelta(value: number, mean: number) {
  if (mean === 0) return "—";
  const pct = ((value - mean) / mean) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(0)}% vs district avg`;
}

export function HotspotIntelligence({ block }: Props) {
  const card = useMemo(() => scoreBlock(block), [block]);
  const color = priorityColor(card.priority);

  const districtAvg = useMemo(() => {
    const n = BLOCKS.length;
    return {
      pregnancies: BLOCKS.reduce((s, b) => s + b.pregnancies, 0) / n,
      childMarriages: BLOCKS.reduce((s, b) => s + b.childMarriages, 0) / n,
      k1Dropouts: BLOCKS.reduce((s, b) => s + b.k1Dropouts, 0) / n,
      firs: BLOCKS.reduce((s, b) => s + b.firs, 0) / n,
      reportingSilence:
        BLOCKS.reduce((s, b) => s + b.reportingSilence, 0) / n,
    };
  }, []);

  const clusterPeers = useMemo(
    () => BLOCKS.filter((b) => b.cluster === block.cluster && b.id !== block.id),
    [block],
  );

  const clusterAvg = useMemo(() => {
    if (clusterPeers.length === 0) return null;
    const n = clusterPeers.length;
    return {
      pregnancies: clusterPeers.reduce((s, b) => s + b.pregnancies, 0) / n,
      firs: clusterPeers.reduce((s, b) => s + b.firs, 0) / n,
      reportingSilence:
        clusterPeers.reduce((s, b) => s + b.reportingSilence, 0) / n,
    };
  }, [clusterPeers]);

  const ps2024 = block.policeStation
    ? PS_FREQUENCY_2024.find((p) => p.ps === block.policeStation)?.count
    : undefined;
  const ps2025 = block.policeStation
    ? PS_FREQUENCY_2025.find((p) => p.ps === block.policeStation)?.count
    : undefined;
  const psDelta =
    ps2024 !== undefined && ps2025 !== undefined ? ps2025 - ps2024 : null;

  const cluster = CLUSTERS[block.cluster];

  // Neutral, evidence-led narrative — no recommendations.
  const narrative = (() => {
    const headline = card.topThree[0];
    const second = card.topThree[1];
    const compareLine =
      card.rank <= Math.ceil(card.totalBlocks / 4)
        ? `ranks in the top quartile of the district vulnerability index`
        : card.rank <= Math.ceil(card.totalBlocks / 2)
          ? `sits in the upper half of district vulnerability`
          : `sits in the lower half of district vulnerability`;
    const psLine =
      psDelta === null
        ? ""
        : psDelta > 0
          ? ` ${block.policeStation} PS registered case volume rose from ${ps2024} to ${ps2025} between 2024 and 2025.`
          : psDelta < 0
            ? ` ${block.policeStation} PS registered case volume fell from ${ps2024} to ${ps2025} between 2024 and 2025.`
            : ` ${block.policeStation} PS case volume held steady at ${ps2025} between 2024 and 2025.`;
    return `${block.name} ${compareLine} (rank ${card.rank} of ${card.totalBlocks}, composite score ${card.score.toFixed(0)}/100). The pattern is driven primarily by ${headline.label.toLowerCase()} and ${second.label.toLowerCase()}, with values that diverge from district averages.${psLine} This is a comparative observation, not a recommendation.`;
  })();

  return (
    <div className="mt-5 rounded-lg border border-border bg-background/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
          <Activity className="h-3.5 w-3.5" style={{ color }} />
          AI Hotspot Intelligence
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: color }}
        >
          {card.priority}
        </span>
      </div>

      {/* Rank + score row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className="rounded-md border border-border p-2.5"
          style={{ borderLeft: `3px solid ${color}` }}
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            District Rank
          </div>
          <div className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
            {card.rank}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / {card.totalBlocks}
            </span>
          </div>
        </div>
        <div
          className="rounded-md border border-border p-2.5"
          style={{ borderLeft: `3px solid ${color}` }}
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Vulnerability Score
          </div>
          <div className="mt-0.5 text-lg font-bold tabular-nums" style={{ color }}>
            {card.score.toFixed(0)}
            <span className="text-xs font-normal text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Key contributing indicators */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
          <BarChart3 className="h-3.5 w-3.5" style={{ color }} />
          Key Contributing Indicators
        </div>
        <ul className="space-y-1.5">
          {card.topThree.map((t) => (
            <li key={t.key}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-foreground">{t.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {fmt(t.raw)} · {t.normalized.toFixed(0)}/100
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded bg-secondary/60">
                <div
                  className="h-full"
                  style={{
                    width: `${t.normalized}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Comparative analysis */}
      <div className="mt-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
          Comparative Analysis
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="font-normal">Indicator</th>
              <th className="text-right font-normal">Block</th>
              <th className="text-right font-normal">vs district</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-t border-border/60">
              <td className="py-1 text-foreground">Teenage pregnancies</td>
              <td className="py-1 text-right">{fmt(block.pregnancies)}</td>
              <td className="py-1 text-right text-muted-foreground">
                {comparativeDelta(block.pregnancies, districtAvg.pregnancies)}
              </td>
            </tr>
            <tr className="border-t border-border/60">
              <td className="py-1 text-foreground">CMRTS marriages</td>
              <td className="py-1 text-right">{fmt(block.childMarriages)}</td>
              <td className="py-1 text-right text-muted-foreground">
                {comparativeDelta(block.childMarriages, districtAvg.childMarriages)}
              </td>
            </tr>
            <tr className="border-t border-border/60">
              <td className="py-1 text-foreground">K1 dropouts</td>
              <td className="py-1 text-right">{fmt(block.k1Dropouts)}</td>
              <td className="py-1 text-right text-muted-foreground">
                {comparativeDelta(block.k1Dropouts, districtAvg.k1Dropouts)}
              </td>
            </tr>
            <tr className="border-t border-border/60">
              <td className="py-1 text-foreground">POCSO / child FIRs</td>
              <td className="py-1 text-right">{fmt(block.firs)}</td>
              <td className="py-1 text-right text-muted-foreground">
                {comparativeDelta(block.firs, districtAvg.firs)}
              </td>
            </tr>
            <tr className="border-t border-border/60">
              <td className="py-1 text-foreground">Reporting silence</td>
              <td className="py-1 text-right">{block.reportingSilence}%</td>
              <td className="py-1 text-right text-muted-foreground">
                {comparativeDelta(block.reportingSilence, districtAvg.reportingSilence)}
              </td>
            </tr>
          </tbody>
        </table>
        {clusterAvg && (
          <div className="mt-2 text-[10.5px] text-muted-foreground">
            Within <strong className="text-foreground">{cluster.label}</strong> cluster
            ({clusterPeers.length} peer block{clusterPeers.length === 1 ? "" : "s"}):
            avg {fmt(Math.round(clusterAvg.pregnancies))} pregnancies ·{" "}
            {clusterAvg.firs.toFixed(1)} FIRs · {clusterAvg.reportingSilence.toFixed(0)}% silence.
          </div>
        )}
      </div>

      {/* Historical trend */}
      {psDelta !== null && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
            <TrendingUp className="h-3.5 w-3.5" style={{ color }} />
            Historical Trend
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-background p-2 text-[11px]">
            <span className="text-muted-foreground">
              {block.policeStation} PS · POCSO + child crime
            </span>
            <span className="tabular-nums">
              {ps2024} <span className="text-muted-foreground">→</span>{" "}
              <strong className="text-foreground">{ps2025}</strong>{" "}
              <span
                style={{
                  color: psDelta > 0 ? "var(--risk-critical)" : psDelta < 0 ? "var(--risk-safe)" : undefined,
                }}
              >
                ({psDelta > 0 ? "+" : ""}{psDelta})
              </span>
            </span>
          </div>
        </div>
      )}

      {/* AI narrative */}
      <div className="mt-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
          AI-generated Hotspot Narrative
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">{narrative}</p>
      </div>

      <div className="mt-3 flex items-start gap-1.5 rounded-md bg-secondary/40 p-2 text-[10.5px] text-muted-foreground">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
        <span>
          Situational analysis only. The platform provides evidence and comparative signals — it
          does not recommend interventions.
        </span>
      </div>
    </div>
  );
}
