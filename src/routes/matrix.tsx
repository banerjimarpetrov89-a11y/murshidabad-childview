import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOCKS, riskColor, riskLabel } from "@/data/blocks";

export const Route = createFileRoute("/matrix")({
  head: () => ({
    meta: [
      { title: "Vulnerability Matrix — Murshidabad" },
      { name: "description", content: "Plot of every Murshidabad block by incident volume vs reporting silence. Critical-red quadrant identifies highest-priority blocks." },
      { property: "og:title", content: "Vulnerability Matrix — Murshidabad" },
      { property: "og:description", content: "Where do the worst-affected and the most-silent blocks meet?" },
    ],
  }),
  component: MatrixPage,
});

function MatrixPage() {
  const w = 760;
  const h = 540;
  const pad = 56;
  const xMax = 100; // reporting silence
  const yMax = Math.max(...BLOCKS.map((b) => b.pregnancies));

  const xPos = (v: number) => pad + (v / xMax) * (w - pad * 2);
  const yPos = (v: number) => h - pad - (v / yMax) * (h - pad * 2);

  return (
    <>
      <PageHeader
        eyebrow="Vulnerability Matrix"
        title="Volume × Silence"
        lead="X-axis: how silent is the system here (gap between incidents & FIRs)? Y-axis: how big is the incident load? Top-right is where children are most exposed."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-x-auto">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
            {/* quadrant fills */}
            <rect x={pad} y={pad} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-moderate)" fillOpacity={0.08} />
            <rect x={pad + (w - pad * 2) / 2} y={pad} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-critical)" fillOpacity={0.12} />
            <rect x={pad} y={pad + (h - pad * 2) / 2} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-safe)" fillOpacity={0.10} />
            <rect x={pad + (w - pad * 2) / 2} y={pad + (h - pad * 2) / 2} width={(w - pad * 2) / 2} height={(h - pad * 2) / 2} fill="var(--risk-high)" fillOpacity={0.10} />

            {/* axes */}
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--border)" />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--border)" />
            <line x1={(w) / 2} y1={pad} x2={(w) / 2} y2={h - pad} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={pad} y1={(h) / 2} x2={w - pad} y2={(h) / 2} stroke="var(--border)" strokeDasharray="3 3" />

            <text x={w / 2} y={h - 14} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
              Reporting silence (incidents without FIRs) →
            </text>
            <text x={16} y={h / 2} fontSize="11" fill="var(--muted-foreground)" transform={`rotate(-90 16 ${h / 2})`} textAnchor="middle">
              Incident volume (pregnancies) →
            </text>

            <text x={pad + 8} y={pad + 16} fontSize="10" fontWeight="700" fill="var(--risk-moderate)">⚠ HIGH VOLUME · LOUD</text>
            <text x={w - pad - 8} y={pad + 16} fontSize="10" fontWeight="700" fill="var(--risk-critical)" textAnchor="end">🔥 CRITICAL — HIGH & SILENT</text>
            <text x={pad + 8} y={h - pad - 8} fontSize="10" fontWeight="700" fill="var(--risk-safe)">✓ SAFER ZONE</text>
            <text x={w - pad - 8} y={h - pad - 8} fontSize="10" fontWeight="700" fill="var(--risk-high)" textAnchor="end">⚠ LOW VOLUME · SILENT</text>

            {BLOCKS.map((b) => (
              <g key={b.id}>
                <circle cx={xPos(b.reportingSilence)} cy={yPos(b.pregnancies)} r={9} fill={riskColor(b.risk)} fillOpacity={0.85} stroke="var(--card)" strokeWidth={2} />
                <text x={xPos(b.reportingSilence) + 12} y={yPos(b.pregnancies) + 4} fontSize="10" fill="var(--foreground)">{b.name}</text>
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
          </div>
        </div>

        <p className="mt-6 rounded-md bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">How to read it:</strong> Blocks in the upper-right corner — Domkol,
          Lalgola, Bhagwangola I/II, Jalangi, Beldanga II — combine the highest incident loads with the deepest
          system silence. Berhampore sits left-of-centre because it has reporting infrastructure, even though incidents are non-trivial.
        </p>
      </section>
    </>
  );
}
