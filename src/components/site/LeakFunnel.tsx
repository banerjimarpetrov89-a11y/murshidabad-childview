import { LEAK_FUNNEL } from "@/data/blocks";

const COLORS: Record<string, string> = {
  trust: "var(--primary)",
  moderate: "var(--risk-moderate)",
  high: "var(--risk-high)",
  critical: "var(--risk-critical)",
};

export function LeakFunnel() {
  const max = LEAK_FUNNEL[0].value;
  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl tracking-tight text-foreground">District Leak Funnel</h2>
          <p className="mt-1 text-sm text-muted-foreground">From health detection to courtroom — where the system loses children.</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">End-to-end loss</div>
          <div className="font-serif text-2xl text-[color:var(--risk-critical)]">−99.5%</div>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {LEAK_FUNNEL.map((step, i) => {
          const pct = (step.value / max) * 100;
          const drop = i > 0 ? ((LEAK_FUNNEL[i - 1].value - step.value) / LEAK_FUNNEL[i - 1].value) * 100 : 0;
          const color = COLORS[step.color];
          return (
            <li key={step.stage}>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="text-foreground">{step.stage}</span>
                <span className="tabular-nums">{step.value.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-1.5 h-9 overflow-hidden rounded-md bg-secondary/60">
                <div
                  className="h-full rounded-md transition-all"
                  style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: color }}
                />
              </div>
              {i > 0 && (
                <div className="mt-1 text-[11px] text-[color:var(--risk-critical)]">
                  ↓ {drop.toFixed(1)}% drop-off from previous stage
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
