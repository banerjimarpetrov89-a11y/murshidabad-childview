import { Link } from "@tanstack/react-router";
import { DATA_SOURCES } from "@/data/content";
import { DATA_SOURCE_LINKS } from "@/data/crime";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-4">
        <div>
          <div className="text-sm font-bold text-foreground">CINI</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Child In Need Institute · District Administration ·
            Government of West Bengal. A public knowledge & decision-support resource for child protection.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li><Link to="/map" className="hover:text-foreground">Hotspot Map</Link></li>
            <li><Link to="/hmis" className="hover:text-foreground">HMIS Health</Link></li>
            <li><Link to="/red-flags" className="hover:text-foreground">Emerging Risk Signals</Link></li>
            <li><Link to="/action-plan" className="hover:text-foreground">Action Plan</Link></li>
            <li><Link to="/publications" className="hover:text-foreground">Publications</Link></li>
          </ul>
          <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-foreground">For researchers</div>
          <div className="mt-2 rounded-md border border-border bg-card p-3 text-[11px] leading-relaxed text-muted-foreground">
            <div className="font-semibold text-foreground">Cite this dashboard</div>
            <p className="mt-1">CINI &amp; District Administration ({new Date().getFullYear()}). <em>Child Protection Dashboard.</em> Public knowledge resource. Retrieved from this site.</p>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Data Sources</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            {DATA_SOURCES.map((s) => <li key={s}>· {s}</li>)}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">External Portals</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            {DATA_SOURCE_LINKS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-foreground underline-offset-2 hover:underline">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 text-[11px] text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} CINI · Built as a public good.</span>
          <span>Statistical reference: HMIS, DPMU, CMRTS, eCourts, NFHS-V, DAR (2023–2026).</span>
        </div>
      </div>
    </footer>
  );
}
