import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Col = { key: string; label: string; required?: boolean; textarea?: boolean; number?: boolean; upload?: { bucket: string } };

export function CrudSection({ table, label, columns }: { table: "resources" | "publications" | "events" | "stakeholders"; label: string; columns: Col[] }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    const payload: Record<string, unknown> = {};
    for (const c of columns) {
      const v = form[c.key];
      if (v === undefined || v === "") continue;
      payload[c.key] = c.number ? Number(v) : v;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from(table) as any).insert(payload);
    if (error) setMsg(error.message); else { setForm({}); await load(); }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from(table).delete().eq("id", id);
    await load();
  };

  const upload = async (col: Col, file: File) => {
    if (!col.upload) return;
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
    const { error } = await supabase.storage.from(col.upload.bucket).upload(path, file);
    if (error) { setMsg(error.message); return; }
    setForm((f) => ({ ...f, [col.key]: path }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-serif text-lg">Add {label}</h3>
        {columns.map((c) => (
          <div key={c.key}>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</label>
            {c.upload ? (
              <div className="mt-1 flex items-center gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-xs font-medium hover:bg-secondary/70">
                  <Upload className="h-3.5 w-3.5" /> Upload
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && upload(c, e.target.files[0])} />
                </label>
                {Boolean(form[c.key]) && <span className="text-xs text-muted-foreground truncate">{String(form[c.key])}</span>}
              </div>
            ) : c.textarea ? (
              <textarea
                value={(form[c.key] as string) ?? ""}
                onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                required={c.required}
                rows={3}
                className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm"
              />
            ) : (
              <input
                value={(form[c.key] as string) ?? ""}
                onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                required={c.required}
                type={c.number ? "number" : "text"}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
              />
            )}
          </div>
        ))}
        {msg && <div className="text-xs text-destructive">{msg}</div>}
        <button disabled={busy} className="h-9 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Saving…" : `Add ${label}`}
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider">{items.length} {label}{items.length === 1 ? "" : "s"}</div>
        <ul className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {items.map((it) => (
            <li key={String(it.id)} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground truncate">{String(it.title ?? it.name ?? "Untitled")}</div>
                <div className="mt-0.5 text-xs text-muted-foreground truncate">
                  {columns.slice(1, 4).map((c) => String(it[c.key] ?? "")).filter(Boolean).join(" · ")}
                </div>
              </div>
              <button onClick={() => remove(String(it.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {items.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No items yet.</li>}
        </ul>
      </div>
    </div>
  );
}
