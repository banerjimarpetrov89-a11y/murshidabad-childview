import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Search, FileText, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { SEED_RESOURCES } from "@/data/content";
import pocso from "@/assets/legislations/pocso.pdf.asset.json";
import medPocso from "@/assets/legislations/medical-prof-pocso-guidelines.pdf.asset.json";
import newCrim from "@/assets/legislations/women-children-new-criminal-laws.pdf.asset.json";
import adoption from "@/assets/legislations/adoption-regulations-2022.pdf.asset.json";
import jjRules from "@/assets/legislations/jj-model-rules.pdf.asset.json";
import vatsalya from "@/assets/legislations/mission-vatsalya-guidelines.pdf.asset.json";
import foster from "@/assets/legislations/model-foster-care-guidelines-2024.pdf.asset.json";

const LEGISLATIONS = [
  { title: "POCSO Act", category: "Legislation", url: pocso.url },
  { title: "Medical Professionals' Guidelines under POCSO", category: "Guideline", url: medPocso.url },
  { title: "Women, Children and the New Criminal Laws", category: "Legislation", url: newCrim.url },
  { title: "Adoption Regulations, 2022", category: "Regulation", url: adoption.url },
  { title: "Juvenile Justice Model Rules", category: "Rules", url: jjRules.url },
  { title: "Mission Vatsalya Guidelines", category: "Guideline", url: vatsalya.url },
  { title: "Model Foster Care Guidelines, 2024", category: "Guideline", url: foster.url },
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Schemes, SOPs, Manuals" },
      { name: "description", content: "Categorised repository of child-protection schemes, SOPs and training manuals for Murshidabad." },
      { property: "og:title", content: "Resources — CINI Murshidabad" },
      { property: "og:description", content: "Schemes, SOPs and manuals for govt, NGO and CSR partners." },
    ],
  }),
  component: ResourcesPage,
});

type Resource = { id?: string; title: string; description: string | null; category: string; stakeholder: string; theme: string; url: string | null; file_path?: string | null };

function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [stakeholder, setStakeholder] = useState<string>("all");
  const [theme, setTheme] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("resources").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      const dbItems = (data ?? []) as Resource[];
      setItems(dbItems.length ? dbItems : (SEED_RESOURCES as Resource[]));
    });
  }, []);

  const filtered = items.filter((r) =>
    (stakeholder === "all" || r.stakeholder === stakeholder) &&
    (theme === "all" || r.theme === theme) &&
    (q === "" || r.title.toLowerCase().includes(q.toLowerCase()) || (r.description ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  const [legisOpen, setLegisOpen] = useState(true);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Schemes, SOPs, training manuals"
        lead="A working library for frontline officers, NGO mentors and CSR partners. Filter by stakeholder or theme."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources..." className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm" />
          </div>
          <select value={stakeholder} onChange={(e) => setStakeholder(e.target.value)} className="h-10 rounded-md border border-border bg-card px-3 text-sm">
            <option value="all">All stakeholders</option>
            <option value="govt">Government</option>
            <option value="ngo">NGO</option>
            <option value="csr">CSR</option>
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="h-10 rounded-md border border-border bg-card px-3 text-sm">
            <option value="all">All themes</option>
            <option value="child_marriage">Child Marriage</option>
            <option value="trafficking">Trafficking</option>
            <option value="protection">Protection Systems</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setLegisOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition"
            aria-expanded={legisOpen}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="text-left">
                <h2 className="font-serif text-lg leading-tight">Legislations / Guidelines</h2>
                <p className="text-xs text-muted-foreground">Acts, rules, regulations and statutory guidelines</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${legisOpen ? "rotate-180" : ""}`} />
          </button>
          {legisOpen && (
            <ul className="divide-y divide-border border-t border-border">
              {LEGISLATIONS.map((d) => (
                <li key={d.title}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-muted/40 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{d.title}</span>
                      <Badge tone="muted">{d.category}</Badge>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>



        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <article key={r.id ?? i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap gap-1.5">
                <Badge>{r.category}</Badge>
                <Badge tone="primary">{labelStakeholder(r.stakeholder)}</Badge>
                <Badge tone="muted">{labelTheme(r.theme)}</Badge>
              </div>
              <h3 className="mt-3 font-serif text-lg leading-tight">{r.title}</h3>
              {r.description && <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>}
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">No resources match your filters.</div>}
        </div>
      </section>
    </>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "primary" | "muted" }) {
  const cls = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{children}</span>;
}
function labelStakeholder(s: string) { return { govt: "Government", ngo: "NGO", csr: "CSR" }[s] ?? s; }
function labelTheme(t: string) { return { child_marriage: "Child Marriage", trafficking: "Trafficking", protection: "Protection", health: "Health" }[t] ?? t; }
