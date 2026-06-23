import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, riskColor, riskLabel } from "@/data/blocks";
import { VulnerabilityScorecards } from "@/components/site/VulnerabilityScorecards";

export const Route = createFileRoute("/matrix")({
  head: () => ({
    meta: [
      { title: "Vulnerability Matrix — Murshidabad" },
      { name: "description", content: "Plot of every Murshidabad block by incident volume vs reporting silence. Toggle to discrepancy ratio (FIRs/TP)." },
      { property: "og:title", content: "Vulnerability Matrix — Murshidabad" },
      { property: "og:description", content: "Where do the worst-affected and the most-silent blocks meet?" },
    ],
  }),
  component: MatrixPage,
});

type Mode = "volume" | "ratio";

function MatrixPage() {
  const [mode, setMode] = useState<Mode>("volume");

  const w = 760;
  const h = 540;
  const pad = 56;
  const xMax = 100;
  const yVals = mode === "volume"
    ? BLOCKS.map((b) => b.pregnancies)
    : BLOCKS.map((b) => (b.firs / b.pregnancies) * 1000); // per-mille for spread
  const yMax = Math.max(...yVals);
  const cmMax = Math.max(...BLOCKS.map((b) => b.childMarriages));

  const xPos = (v: number) => pad + (v / xMax) * (w - pad * 2);
  const yPos = (v: number) => h - pad - (v / yMax) * (h - pad * 2);
  const yOf = (b: typeof BLOCKS[number]) =>
    mode === "volume" ? b.pregnancies : (b.firs / b.pregnancies) * 1000;
  const rOf = (b: typeof BLOCKS[number]) => 5 + (b.childMarriages / cmMax) * 12;

  return (
    <>
      <PageHeader
        eyebrow="Vulnerability Matrix"
        title="Volume × Silence"
        lead="X-axis: how silent is the system here. Y-axis: incident load. Bubble size = CMRTS marriages prevented."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Y-axis:</span>
          <div className="flex rounded-md border border-border bg-secondary/40 p-1">
            <button onClick={() => setMode("volume")} className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${mode === "volume" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              Pregnancy volume
            </button>
            <button onClick={() => setMode("ratio")} className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${mode === "ratio" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              FIRs per 1,000 TP
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-x-auto">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
            <rect x={pad} y={pad} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-moderate)" fillOpacity={0.08} />
            <rect x={pad + (w - pad * 2) / 2} y={pad} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-critical)" fillOpacity={0.12} />
            <rect x={pad} y={pad + (h - pad * 2) / 2} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-safe)" fillOpacity={0.10} />
            <rect x={pad + (w - pad * 2) / 2} y={pad + (h - pad * 2) / 2} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-high)" fillOpacity={0.10} />

            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--border)" />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--border)" />
            <line x1={(w) / 2} y1={pad} x2={(w) / 2} y2={h - pad} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={pad} y1={(h) / 2} x2={w - pad} y2={(h) / 2} stroke="var(--border)" strokeDasharray="3 3" />

            <text x={w / 2} y={h - 14} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
              Reporting silence (incidents without FIRs) →
            </text>
            <text x={16} y={h / 2} fontSize="11" fill="var(--muted-foreground)" transform={`rotate(-90 16 ${h / 2})`} textAnchor="middle">
              {mode === "volume" ? "Incident volume (pregnancies) →" : "FIRs per 1,000 pregnancies →"}
            </text>

            <text x={pad + 8} y={pad + 16} fontSize="10" fontWeight="700" fill="var(--risk-moderate)">⚠ HIGH VOLUME · LOUD</text>
            <text x={w - pad - 8} y={pad + 16} fontSize="10" fontWeight="700" fill="var(--risk-critical)" textAnchor="end">🔥 CRITICAL — HIGH & SILENT</text>
            <text x={pad + 8} y={h - pad - 8} fontSize="10" fontWeight="700" fill="var(--risk-safe)">✓ SAFER ZONE</text>
            <text x={w - pad - 8} y={h - pad - 8} fontSize="10" fontWeight="700" fill="var(--risk-high)" textAnchor="end">⚠ LOW VOLUME · SILENT</text>

            {BLOCKS.map((b) => (
              <g key={b.id}>
                <circle
                  cx={xPos(b.reportingSilence)}
                  cy={yPos(yOf(b))}
                  r={rOf(b)}
                  fill={riskColor(b.risk)}
                  fillOpacity={0.78}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
                <text x={xPos(b.reportingSilence) + rOf(b) + 3} y={yPos(yOf(b)) + 4} fontSize="10" fill="var(--foreground)">{b.name}</text>
              </g>
            ))}
          </svg>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            {(["critical", "high", "moderate", "low", "safe"] as const).map((r) => (
              <div key={r} className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: riskColor(r) }} />
                <span className="text-muted-foreground">{riskLabel(r)}</span>
              </div>
            ))}
            <span className="ml-auto text-[11px] text-muted-foreground">Bubble size = CMRTS marriages prevented</span>
          </div>
        </div>

        <p className="mt-6 rounded-md bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">How to read it:</strong>{" "}
          {mode === "volume"
            ? "Top-right = highest exposure (Domkol, Khargram, Sagardighi, Jalangi, Raninagar II). Big bubbles = strong CMRTS detection (Bhagwangola I leads at 114)."
            : "Top-left = healthy reporting (Murshidabad-Jiaganj, Berhampore: 18+ FIRs per 1k TP). Bottom-right = the silent quadrant — Khargram 3.3, Sagardighi 2.2, Domkol 0."}
        </p>
      </section>

      <VulnerabilityScorecards />
    </>
  );
}
