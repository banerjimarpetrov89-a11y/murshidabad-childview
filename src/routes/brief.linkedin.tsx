import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, TrendingUp, AlertTriangle, GitCompare, ListOrdered, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/brief/linkedin")({
  head: () => ({
    meta: [
      { title: "ChildWatch AI — LinkedIn Preview" },
      { name: "description", content: "Shareable visual preview of the Murshidabad ChildWatch AI district brief — narrative only, no data or sources." },
    ],
  }),
  component: LinkedInPreview,
});

function Pillar({
  icon: Icon, eyebrow, title, body,
}: { icon: React.ElementType; eyebrow: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
        <Icon className="h-3.5 w-3.5" /> {eyebrow}
      </div>
      <h3 className="mt-2 font-serif text-lg leading-tight text-primary-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">{body}</p>
    </div>
  );
}

function LinkedInPreview() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14 print:py-0 print:px-0 print:max-w-none">
      {/* Toolbar (hidden on print/screenshot crop) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="text-xs text-muted-foreground">
          LinkedIn-ready visual. Screenshot the card below (1200×1200 crops well) or use Export PDF.
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/brief"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Back to full brief
          </Link>
          <button
            onClick={() => { if (typeof window !== "undefined") window.print(); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* The poster card */}
      <article
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl md:p-12 print:rounded-none print:shadow-none"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--primary) 85%, transparent) 0%, transparent 55%), radial-gradient(100% 80% at 100% 100%, color-mix(in oklab, var(--accent) 70%, transparent) 0%, transparent 55%), var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> Executive Briefing
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
              <MapPin className="h-3.5 w-3.5" /> Murshidabad · West Bengal
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-8 font-serif text-4xl leading-[1.05] tracking-tight text-primary-foreground md:text-6xl">
            District Child Protection Brief
          </h1>
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">
            An AI-assisted, evidence-led situational view of child protection across 26 blocks — built for district administrators, frontline officers, and civil-society partners.
          </p>

          {/* Pillars grid (no numbers, no sources) */}
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Pillar
              icon={Shield}
              eyebrow="Section 1"
              title="Executive Summary"
              body="A district-wide read of vulnerability across every block — Critical, High, Medium, and Low — distilled into one neutral situational frame."
            />
            <Pillar
              icon={TrendingUp}
              eyebrow="Section 2"
              title="Key Trends"
              body="How teenage pregnancies, child marriages, and formal FIRs have moved year on year — and what reporting infrastructure is telling us."
            />
            <Pillar
              icon={ListOrdered}
              eyebrow="Section 3"
              title="Vulnerability Ranking"
              body="A composite index ranks every block on a single comparable scale, surfacing where attention is most warranted."
            />
            <Pillar
              icon={AlertTriangle}
              eyebrow="Section 4"
              title="Emerging Risk Signals"
              body="Concentration of risk, rising case loads at police-station level, and clusters of reporting silence — flagged early."
            />
            <Pillar
              icon={GitCompare}
              eyebrow="Section 5"
              title="Comparative Analysis"
              body="Sub-district clusters benchmarked against the district average — border, river-belt, central, and western outposts."
            />
            <Pillar
              icon={Sparkles}
              eyebrow="Built with"
              title="ChildWatch AI"
              body="Deterministic indicators, transparent methodology, and an AI copilot — designed for review by competent authorities."
            />
          </div>

          {/* Footer / CTA */}
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Murshidabad ChildWatch AI
              </div>
              <div className="mt-1 font-serif text-xl text-primary-foreground">
                Evidence first. Neutral by design.
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/95 px-4 py-2 text-sm font-semibold text-primary">
              Read the full brief <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </article>

      {/* Suggested caption */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested LinkedIn caption</div>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          Introducing the Murshidabad District Child Protection Brief — an AI-assisted, evidence-led situational view across 26 blocks. Six sections, one neutral frame: executive summary, key trends, vulnerability ranking, emerging risk signals, comparative analysis, and methodology. Built for administrators, frontline officers, and civil-society partners.
        </p>
      </div>
    </div>
  );
}
