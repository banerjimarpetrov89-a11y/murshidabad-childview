import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MapPin, ExternalLink, BookOpen, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { SEED_EVENTS } from "@/data/content";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Initiatives — CINI Murshidabad" },
      { name: "description", content: "Awareness campaigns, government drives, NGO interventions, the 2025 Press Album and impact stories from across Murshidabad." },
      { property: "og:title", content: "Events & Initiatives — CINI Murshidabad" },
      { property: "og:description", content: "Press album, campaigns, drives, interventions and their impact." },
    ],
  }),
  component: EventsPage,
});

type Event = { id?: string; title: string; description: string | null; event_date: string | null; location: string | null; type: string; impact_story: string | null };

const PRESS_STATS = [
  { n: "929", l: "Prevented in 2025" },
  { n: "26", l: "Blocks Covered" },
  { n: "5,000", l: "Awareness March" },
  { n: "₹1L", l: "Fine / Offence" },
  { n: "1098", l: "Child Helpline" },
];

const PRESS_HIGHLIGHTS = [
  { num: "163", lbl: "Stopped Jan–May" },
  { num: "202", lbl: "Stopped in June" },
  { num: "37", lbl: "FIRs Filed" },
  { num: "300+", lbl: "Monthly Helpline Calls" },
  { num: "2 yrs", lbl: "Imprisonment Penalty" },
];

const PRESS_SOURCES = ["Bartaman", "Ananda Bazar", "Sangbad Pratidin", "Ei Samay", "Bengal Chronicle", "Ai Samoy", "Pratidin"];

function PressAlbumFeature() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#0a1f3c] via-[#1a4d6e] to-[#0f3d24] text-white shadow-xl">
        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#ffd038]/50 bg-[#ffd038]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-[#ffd038]">Press Documentation Album 2025</span>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-emerald-300">District Administration · Murshidabad</span>
          </div>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-5xl">
            বাল্যবিবাহ রোধে <span className="text-[#ffd038]">মুর্শিদাবাদ</span>
          </h2>
          <p className="mt-2 text-sm text-white/60 md:text-base">Child Marriage Prevention — A Comprehensive Press Documentation · June–August 2025</p>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:grid-cols-5">
            {PRESS_STATS.map((s) => (
              <div key={s.l} className="bg-[#0a1f3c]/60 p-4 text-center">
                <div className="font-serif text-2xl font-bold text-[#ffd038] md:text-3xl">{s.n}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/60">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {PRESS_HIGHLIGHTS.map((h) => (
              <div key={h.lbl} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                <span className="font-serif text-lg font-bold text-[#ffd038]">{h.num}</span>
                <span className="ml-2 text-xs text-white/70">{h.lbl}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md bg-[#ffd038] px-4 py-2 text-sm font-bold text-[#0a1f3c] hover:bg-[#ffdc5c]"
            >
              <BookOpen className="h-4 w-4" /> {expanded ? "Hide" : "Read"} Full Album
            </button>
            <a
              href="/press-album-2025.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" /> Open in New Tab
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-white/55">
            <Newspaper className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">Sources:</span>
            {PRESS_SOURCES.map((s) => (
              <span key={s} className="rounded-full bg-white/10 px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>

        {expanded && (
          <div className="border-t border-white/10 bg-white">
            <iframe
              src="/press-album-2025.html"
              title="Murshidabad Press Album 2025"
              className="h-[80vh] w-full"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}

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

      <PressAlbumFeature />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h2 className="mb-6 font-serif text-2xl tracking-tight">Timeline</h2>
        <ol className="relative ml-3 space-y-8 border-l-2 border-border">
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
