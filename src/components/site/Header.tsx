import { Link } from "@tanstack/react-router";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Hotspot Map" },
  { to: "/insights", label: "Data Insights" },
  { to: "/hmis", label: "HMIS Health" },
  { to: "/matrix", label: "Vulnerability Matrix" },
  { to: "/red-flags", label: "Risk Signals" },
  { to: "/clusters", label: "Clusters" },
  { to: "/copilot", label: "AI Intelligence" },
  { to: "/action-plan", label: "Action Plan" },
  { to: "/resources", label: "Resources" },
  { to: "/publications", label: "Publications" },
  { to: "/events", label: "Events" },
  { to: "/stakeholders", label: "Stakeholders" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-foreground">CINI</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Child Protection Dashboard</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.slice(0, 7).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          {NAV.slice(7).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div className={cn("lg:hidden border-t border-border bg-background", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
