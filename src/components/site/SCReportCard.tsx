import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SCRecord } from "@/data/hmis";

export function riskBand(hr: number) {
  if (hr >= 65) return { label: "Critical", color: "var(--risk-critical)" };
  if (hr >= 55) return { label: "High", color: "var(--risk-high)" };
  if (hr >= 45) return { label: "Moderate", color: "var(--risk-moderate)" };
  return { label: "Watch", color: "var(--primary)" };
}

export default function SCReportCard({
  r,
  blockLabel,
  defaultOpen = true,
}: {
  r: SCRecord;
  blockLabel: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hr = r.highRiskPct ?? 0;
  const ft = r.firstTriPct ?? 0;
  const teenPct = r.newPW > 0 ? (r.pw15_19 / r.newPW) * 100 : 0;
  const band = riskBand(hr);
  const antaraTotal = (r.d1 ?? 0) + (r.d2 ?? 0) + (r.d3 ?? 0) + (r.d4 ?? 0);
  const retention = (r.d1 ?? 0) > 0 ? ((r.d4 ?? 0) / (r.d1 ?? 1)) * 100 : 0;

  return (
    <article className="rounded-xl border border-border bg-card transition hover:border-primary/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-2 p-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{blockLabel}</div>
          <h3 className="mt-0.5 font-serif text-base leading-tight tracking-tight">{r.sc}</h3>
          <div className="mt-1 text-[10px] text-muted-foreground">
            <span className="tabular-nums font-semibold text-foreground">{r.newPW}</span> PW ·
            teen <span className="tabular-nums font-semibold text-foreground">{teenPct.toFixed(0)}%</span> ·
            HRP <span className="tabular-nums font-semibold" style={{ color: band.color }}>{hr.toFixed(0)}%</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: band.color }}
          >
            {band.label}
          </span>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-secondary/40 px-1 py-2">
              <div className="text-base font-bold tabular-nums">{r.newPW}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">New PW</div>
            </div>
            <div className="rounded-md bg-secondary/40 px-1 py-2">
              <div className="text-base font-bold tabular-nums">{ft.toFixed(0)}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">1st-tri ANC</div>
            </div>
            <div className="rounded-md bg-secondary/40 px-1 py-2">
              <div className="text-base font-bold tabular-nums" style={{ color: band.color }}>{hr.toFixed(0)}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">High-risk</div>
            </div>
          </div>

          <ul className="mt-3 space-y-1.5 text-[11px]">
            <li className="flex items-baseline justify-between"><span className="text-muted-foreground">Teen PW (15-19)</span><span className="tabular-nums font-semibold">{r.pw15_19} · {teenPct.toFixed(0)}%</span></li>
            <li className="flex items-baseline justify-between"><span className="text-muted-foreground">High-risk ante (HRP)</span><span className="tabular-nums font-semibold">{r.hrpAnte}</span></li>
            <li className="flex items-baseline justify-between"><span className="text-muted-foreground">Teen deliveries</span><span className="tabular-nums font-semibold">{r.del15_19}</span></li>
            <li className="flex items-baseline justify-between"><span className="text-muted-foreground">BCG immunisation</span><span className="tabular-nums font-semibold">{r.bcg}</span></li>
          </ul>

          {antaraTotal > 0 && (
            <div className="mt-3 border-t border-border/60 pt-2.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Antara D1→D4</span>
                <span className="tabular-nums">{r.d1}·{r.d2}·{r.d3}·{r.d4} · retn {retention.toFixed(0)}%</span>
              </div>
              <div className="mt-1.5 flex h-1.5 gap-0.5">
                {[r.d1, r.d2, r.d3, r.d4].map((v, i) => (
                  <div key={i} className="rounded-sm" style={{
                    width: `${((v ?? 0) / Math.max(r.d1 ?? 1, 1)) * 100}%`,
                    backgroundColor: ["var(--primary)", "var(--risk-moderate)", "var(--risk-high)", "var(--risk-critical)"][i],
                    minWidth: (v ?? 0) > 0 ? 3 : 0,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
