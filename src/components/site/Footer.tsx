import { Link } from "@tanstack/react-router";
import { DATA_SOURCES } from "@/data/content";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-sm font-bold text-foreground">CINI Murshidabad</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Child In Need Institute · Murshidabad District Administration ·
            Government of West Bengal. A public knowledge & decision-support resource for child
            protection.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li><Link to="/map" className="hover:text-foreground">Hotspot Map</Link></li>
            <li><Link to="/red-flags" className="hover:text-foreground">Red Flags</Link></li>
            <li><Link to="/action-plan" className="hover:text-foreground">Action Plan</Link></li>
            <li><Link to="/publications" className="hover:text-foreground">Publications</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Data Sources</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            {DATA_SOURCES.map((s) => <li key={s}>· {s}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 text-[11px] text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} CINI Murshidabad · Built as a public good.</span>
          <span>Statistical reference: HMIS, DPMU, CMRTS, eCourts (2023–2026).</span>
        </div>
      </div>
    </footer>
  );
}
