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
            "radial-gradient(55% 70% at 12% 0%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 60%), radial-gradient(40% 55% at 95% 100%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 60%), linear-gradient(180deg, var(--background), var(--background))",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <MapPin className="h-3.5 w-3.5" />
          Murshidabad District · West Bengal · 26 Blocks
        </div>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
          Murshidabad ChildWatch AI
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-xl leading-snug text-foreground/80 md:text-2xl">
          AI-Powered Child Protection Intelligence &amp; Situational Analysis Platform
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Transforming child protection data into evidence-based intelligence to support
          planning, monitoring and situational analysis.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/copilot"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Bot className="h-4 w-4" /> Launch AI Intelligence Assistant
          </Link>
          <Link
            to="/brief"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-secondary"
          >
            <FileText className="h-4 w-4" /> Generate District Brief
          </Link>
        </div>
      </div>
    </section>
  );
}
