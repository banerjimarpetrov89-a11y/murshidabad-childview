import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { SEED_EVENTS } from "@/data/content";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Initiatives — CINI Murshidabad" },
      { name: "description", content: "Awareness campaigns, government drives, NGO interventions and impact stories from across Murshidabad." },
      { property: "og:title", content: "Events & Initiatives — CINI Murshidabad" },
      { property: "og:description", content: "What's happening on the ground — campaigns, drives, interventions and their impact." },
    ],
  }),
  component: EventsPage,
});

type Event = { id?: string; title: string; description: string | null; event_date: string | null; location: string | null; type: string; impact_story: string | null };

function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  useEffect(() => {
    supabase.from("events").select("*").order("event_date", { ascending: false }).then(({ data }) => {
      const db = (data ?? []) as Event[];
      setItems(db.length ? db : (SEED_EVENTS as Event[]));
    });
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Events & Initiatives"
        title="On the ground"
        lead="A timeline of awareness campaigns, government drives, NGO interventions — and the impact each one has had."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <ol className="relative border-l-2 border-border ml-3 space-y-8">
          {items.map((e, i) => (
            <li key={e.id ?? i} className="ml-6">
              <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {e.event_date && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
                  {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>}
                  <span className="rounded-full bg-secondary px-2 py-0.5 uppercase tracking-wider">{e.type}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl tracking-tight">{e.title}</h3>
                {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
                {e.impact_story && (
                  <div className="mt-4 rounded-md border-l-4 border-[color:var(--risk-safe)] bg-secondary/60 p-3 text-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--risk-safe)" }}>Impact</div>
                    <p className="mt-1 text-foreground">{e.impact_story}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
