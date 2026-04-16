import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label, value, sub, tone = "default", icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "risk" | "warn" | "ok";
  icon?: ReactNode;
}) {
  const toneClass = {
    default: "border-border",
    risk: "border-[color:var(--risk-critical)]/40",
    warn: "border-[color:var(--risk-moderate)]/40",
    ok: "border-[color:var(--risk-safe)]/40",
  }[tone];

  const accent = {
    default: "var(--primary)",
    risk: "var(--risk-critical)",
    warn: "var(--risk-moderate)",
    ok: "var(--risk-safe)",
  }[tone];

  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm", toneClass)}>
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {icon && (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
