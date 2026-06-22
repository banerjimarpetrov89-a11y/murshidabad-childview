import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { SEED_PUBLICATIONS } from "@/data/content";

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Publications & Reports — CINI Murshidabad" },
      { name: "description", content: "District reports, research studies, baseline and endline assessments on child protection in Murshidabad." },
      { property: "og:title", content: "Publications & Reports — CINI Murshidabad" },
      { property: "og:description", content: "District reports, research and assessments — downloadable." },
    ],
  }),
  component: PublicationsPage,
});

type Pub = { id?: string; title: string; summary: string | null; key_findings: string | null; year: number | null; type: string; file_path: string | null };

function PublicationsPage() {
  const [items, setItems] = useState<Pub[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("publications").select("*").order("year", { ascending: false }).then(({ data }) => {
      const db = (data ?? []) as Pub[];
      setItems(db.length ? db : (SEED_PUBLICATIONS as Pub[]));
    });
  }, []);

  useEffect(() => {
    const paths = items.map((p) => p.file_path).filter((p): p is string => !!p);
    if (paths.length === 0) return;
    let cancelled = false;
    supabase.storage.from("publications").createSignedUrls(paths, 60 * 60).then(({ data }) => {
      if (cancelled || !data) return;
      const map: Record<string, string> = {};
      for (const row of data) if (row.path && row.signedUrl) map[row.path] = row.signedUrl;
      setSignedUrls(map);
    });
    return () => { cancelled = true; };
  }, [items]);

  return (
    <>
      <PageHeader
        eyebrow="Publications & Reports"
        title="The evidence base"
        lead="District reports, baseline and endline studies, peer-reviewed research and field audits."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <article key={p.id ?? i} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">{p.type}</span>
              {p.year && <><span>·</span><span>{p.year}</span></>}
            </div>
            <h3 className="mt-2 font-serif text-xl tracking-tight">{p.title}</h3>
            {p.summary && <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>}
            {p.key_findings && (
              <div className="mt-4 rounded-md bg-secondary/60 p-3 text-xs">
                <div className="font-semibold uppercase tracking-wider text-foreground">Key findings</div>
                <p className="mt-1 leading-relaxed text-muted-foreground">{p.key_findings}</p>
              </div>
            )}
            {p.file_path && signedUrls[p.file_path] && (
              <a
                href={signedUrls[p.file_path]}
                target="_blank" rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </a>
            )}
          </article>
        ))}
        {items.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">No publications yet.</div>}
      </section>
    </>
  );
}
