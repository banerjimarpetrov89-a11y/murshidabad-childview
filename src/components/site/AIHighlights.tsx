import { Link } from "@tanstack/react-router";
import { Sparkles, TrendingUp, AlertOctagon, ArrowRight, Scale, Activity } from "lucide-react";
import { scoreAllBlocks, priorityColor, type Priority } from "@/lib/vulnerability-score";
import { PS_FREQUENCY_2024, PS_FREQUENCY_2025 } from "@/data/crime";
import { BLOCKS } from "@/data/blocks";

function priorityChip(p: Priority) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
      style={{ backgroundColor: priorityColor(p) }}
    >
      {p}
    </span>
  );
}

export function AIHighlights() {
  const scored = scoreAllBlocks();
  const topVulnerable = scored.slice(0, 4);

  // Fastest-changing PS year-over-year (2024 → 2025)
  const psDeltas = PS_FREQUENCY_2025
    .map((p25) => {
      const p24 = PS_FREQUENCY_2024.find((p) => p.ps === p25.ps);
      const prev = p24?.count ?? 0;
      const delta = p25.count - prev;
      const pct = prev > 0 ? (delta / prev) * 100 : 0;
      return { ps: p25.ps, prev, curr: p25.count, delta, pct };
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  // Emerging patterns — deterministic, based on dataset
  const districtAvgSilence =
    BLOCKS.reduce((s, b) => s + b.reportingSilence, 0) / BLOCKS.length;
  const silentBlocks = BLOCKS.filter((b) => b.reportingSilence > districtAvgSilence + 10).length;
  const avgScore = scored.reduce((s, c) => s + c.score, 0) / scored.length;
  const criticalCount = scored.filter((s) => s.priority === "Critical").length;
  const highCount = scored.filter((s) => s.priority === "High").length;
  const topPS = PS_FREQUENCY_2025[0];

  const patterns = [
    {
      icon: <AlertOctagon className="h-4 w-4" />,
      title: "Concentration of vulnerability",
      body: `${criticalCount} block(s) classified Critical and ${highCount} as High on the composite index. District mean score: ${avgScore.toFixed(
        0,
      )}/100. Vulnerability is concentrated rather than uniformly distributed.`,
    },
    {
      icon: <Activity className="h-4 w-4" />,
      title: "Reporting silence cluster",
      body: `${silentBlocks} block(s) record reporting silence more than 10 points above the district mean (${districtAvgSilence.toFixed(
        0,
      )}%). Signals divergence between health-side detection and justice-side filings.`,
    },
    {
      icon: <Scale className="h-4 w-4" />,
      title: "Justice-side hotspot",
      body: `${topPS.ps} PS leads 2025 filings at ${topPS.count} cases — ${(
        ((topPS.count - (PS_FREQUENCY_2024.find((p) => p.ps === topPS.ps)?.count ?? topPS.count)) /
          (PS_FREQUENCY_2024.find((p) => p.ps === topPS.ps)?.count ?? topPS.count)) *
        100
      ).toFixed(0)}% above 2024. Concentrated case-load on a single jurisdiction.`,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
      <div className="rounded-xl border border-border bg-card p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Intelligence Highlights
            </div>
            <h2 className="mt-1 font-serif text-2xl tracking-tight">
              Auto-generated situational summary
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              A neutral, evidence-led readout derived directly from current indicators across all 26 blocks.
              These are analytical signals — not recommendations.
            </p>
          </div>
          <Link
            to="/copilot"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Open Intelligence Assistant <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* Most vulnerable */}
          <div className="rounded-lg border border-border/70 bg-background/40 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <AlertOctagon className="h-3.5 w-3.5" /> Most vulnerable blocks
            </div>
            <ul className="mt-3 space-y-2">
              {topVulnerable.map((s) => (
                <li
                  key={s.block.id}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        #{s.rank}
                      </span>
                      <span className="truncate font-serif text-sm">{s.block.name}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      Top driver: {s.topThree[0].label}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="tabular-nums text-sm font-bold">{s.score.toFixed(0)}</span>
                    {priorityChip(s.priority)}
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/matrix"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View vulnerability matrix <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Fastest-changing PS */}
          <div className="rounded-lg border border-border/70 bg-background/40 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Fastest-changing jurisdictions
            </div>
            <ul className="mt-3 space-y-2">
              {psDeltas.map((p) => (
                <li
                  key={p.ps}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card px-3 py-2"
                >
                  <div>
                    <div className="font-serif text-sm">{p.ps} PS</div>
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      2024: {p.prev} → 2025: {p.curr}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="tabular-nums text-sm font-bold"
                      style={{
                        color:
                          p.delta > 0 ? "var(--risk-critical)" : "var(--risk-safe)",
                      }}
                    >
                      {p.delta > 0 ? "+" : ""}
                      {p.delta}
                    </div>
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      {p.pct > 0 ? "+" : ""}
                      {p.pct.toFixed(0)}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10px] text-muted-foreground">
              Year-over-year case volume; signals reporting shift, not necessarily incidence shift.
            </div>
          </div>

          {/* Emerging patterns */}
          <div className="rounded-lg border border-border/70 bg-background/40 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Emerging patterns
            </div>
            <ul className="mt-3 space-y-3">
              {patterns.map((p) => (
                <li key={p.title} className="rounded-md border border-border/60 bg-card p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-primary">{p.icon}</span>
                    {p.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-border/60 bg-secondary/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Method:</strong> Highlights are deterministically computed
          from HMIS, CMRTS, Kanyashree, eCourts, and Daily Arrest Report indicators across all 26 blocks.
          Outputs describe observed patterns and analytical signals; they do not prescribe action.
        </div>
      </div>
    </section>
  );
}
