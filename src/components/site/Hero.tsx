import { Link } from "@tanstack/react-router";
import { MapPin, Bot, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 20% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(50% 70% at 100% 100%, color-mix(in oklab, var(--risk-critical) 18%, transparent), transparent 60%), linear-gradient(180deg, var(--background), color-mix(in oklab, var(--secondary) 60%, var(--background)))",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <MapPin className="h-3.5 w-3.5" />
          MURSHIDABAD DISTRICT · WEST BENGAL · 26 BLOCKS · 254 GPs
        </div>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
          Murshidabad ChildWatch AI
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          AI-Powered Child Protection Intelligence &amp; Situational Analysis Platform
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/copilot"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Bot className="h-4 w-4" /> Launch AI Copilot
          </Link>
          <Link
            to="/copilot"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <FileText className="h-4 w-4" /> Generate District Brief
          </Link>
        </div>
      </div>
    </section>
  );
}
