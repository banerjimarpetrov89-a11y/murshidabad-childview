import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Building2, HeartHandshake, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { SEED_STAKEHOLDERS } from "@/data/content";

export const Route = createFileRoute("/stakeholders")({
  head: () => ({
    meta: [
      { title: "Stakeholder Ecosystem — CINI" },
      { name: "description", content: "Government departments, NGOs and CSR partners working on child protection in the district." },
      { property: "og:title", content: "Stakeholder Ecosystem — CINI" },
      { property: "og:description", content: "Who is doing what across the district." },
    ],
  }),
  component: StakeholdersPage,
});

type S = { id?: string; name: string; type: string; role: string | null; areas: string | null; website: string | null };

function StakeholdersPage() {
  const [items, setItems] = useState<S[]>([]);
  useEffect(() => {
    supabase.from("stakeholders").select("*").order("name").then(({ data }) => {
      const db = (data ?? []) as S[];
      setItems(db.length ? db : (SEED_STAKEHOLDERS as S[]));
    });
  }, []);

  const groups: Record<string, S[]> = { govt: [], ngo: [], csr: [] };
  items.forEach((s) => { (groups[s.type] ?? groups.govt).push(s); });

  return (
    <>
      <PageHeader
        eyebrow="Stakeholder Ecosystem"
        title="Who's doing what"
        lead="Government, NGO and CSR actors across Murshidabad — their roles and areas of intervention."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 space-y-10">
        <Group title="Government" icon={<Building2 className="h-4 w-4" />} items={groups.govt} />
        <Group title="NGO partners" icon={<HeartHandshake className="h-4 w-4" />} items={groups.ngo} />
        <Group title="CSR partners" icon={<Briefcase className="h-4 w-4" />} items={groups.csr} />
      </section>
    </>
  );
}

function Group({ title, icon, items }: { title: string; icon: React.ReactNode; items: S[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="flex items-center gap-2 font-serif text-2xl tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">{icon}</span>
        {title}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <article key={s.id ?? i} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg leading-tight">{s.name}</h3>
            {s.role && <p className="mt-1 text-xs text-primary font-medium">{s.role}</p>}
            {s.areas && <p className="mt-3 text-sm text-muted-foreground"><strong className="text-foreground">Areas: </strong>{s.areas}</p>}
            {s.website && (
              <a href={s.website} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Website <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
