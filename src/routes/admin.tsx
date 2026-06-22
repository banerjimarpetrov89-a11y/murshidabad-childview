import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CINI Murshidabad" },
      { name: "description", content: "Admin area for managing resources, publications, events and stakeholders." },
    ],
  }),
  component: AdminPage,
});

type Tab = "resources" | "publications" | "events" | "stakeholders";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("resources");

  if (loading) return <Centered>Loading…</Centered>;
  if (!user) return <AuthForm />;
  if (!isAdmin) return <NotAdmin email={user.email ?? ""} />;

  return (
    <>
      <PageHeader eyebrow="Admin" title="Manage content" lead="Add, edit and delete resources, publications, events and stakeholders." />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
            {(["resources", "publications", "events", "stakeholders"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
        </div>

        {tab === "resources" && <ResourcesAdmin />}
        {tab === "publications" && <PublicationsAdmin />}
        {tab === "events" && <EventsAdmin />}
        {tab === "stakeholders" && <StakeholdersAdmin />}
      </section>
    </>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">{children}</div>;
}

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) setMsg(error.message); else setMsg("Account created. You may need to confirm your email, then ask an existing admin to grant you the admin role.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="font-serif text-2xl tracking-tight">Admin {mode === "signup" ? "sign up" : "sign in"}</h1>
        <p className="mt-1 text-xs text-muted-foreground">Restricted to authorised CINI Murshidabad staff.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="email@example.org" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} placeholder="password" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
          {msg && <div className="text-xs text-muted-foreground">{msg}</div>}
          <button disabled={busy} className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-3 text-xs text-primary hover:underline">
          {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  );
}

function NotAdmin({ email }: { email: string }) {
  const [msg, setMsg] = useState("");
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.rpc("admin_exists").then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setAdminExists(true); // fail closed — hide bootstrap button
      } else {
        setAdminExists(!!data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const claimAdmin = async () => {
    setMsg("");
    const { data, error } = await supabase.rpc("bootstrap_first_admin");
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data === true) {
      setMsg("You are now admin. Reloading…");
      setTimeout(() => location.reload(), 800);
    } else {
      setMsg("An admin already exists. Ask them to grant you access.");
      setAdminExists(true);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-serif text-2xl">Signed in as {email}</h1>
      <p className="mt-2 text-sm text-muted-foreground">You don't have admin access yet.</p>
      {adminExists === false && (
        <button onClick={claimAdmin} className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Claim admin (first user only)</button>
      )}
      {adminExists === true && (
        <p className="mt-5 text-sm text-muted-foreground">Ask an existing admin to grant you access.</p>
      )}
      {msg && <p className="mt-3 text-xs text-muted-foreground">{msg}</p>}
      <button onClick={() => supabase.auth.signOut()} className="mt-4 block mx-auto text-xs text-muted-foreground hover:text-foreground">Sign out</button>
    </div>
  );
}

// --- CRUD sections ---
import { CrudSection } from "@/components/site/CrudSection";

function ResourcesAdmin() {
  return (
    <CrudSection
      table="resources"
      label="Resource"
      columns={[
        { key: "title", label: "Title", required: true },
        { key: "description", label: "Description", textarea: true },
        { key: "category", label: "Category (scheme/sop/manual)" },
        { key: "stakeholder", label: "Stakeholder (govt/ngo/csr)" },
        { key: "theme", label: "Theme" },
        { key: "url", label: "URL" },
      ]}
    />
  );
}
function PublicationsAdmin() {
  return (
    <CrudSection
      table="publications"
      label="Publication"
      columns={[
        { key: "title", label: "Title", required: true },
        { key: "summary", label: "Summary", textarea: true },
        { key: "key_findings", label: "Key findings", textarea: true },
        { key: "year", label: "Year", number: true },
        { key: "type", label: "Type (report/study/baseline/endline)" },
        { key: "file_path", label: "File path (uploaded)", upload: { bucket: "publications" } },
      ]}
    />
  );
}
function EventsAdmin() {
  return (
    <CrudSection
      table="events"
      label="Event"
      columns={[
        { key: "title", label: "Title", required: true },
        { key: "description", label: "Description", textarea: true },
        { key: "event_date", label: "Date (YYYY-MM-DD)" },
        { key: "location", label: "Location" },
        { key: "type", label: "Type (campaign/drive/intervention)" },
        { key: "impact_story", label: "Impact story", textarea: true },
      ]}
    />
  );
}
function StakeholdersAdmin() {
  return (
    <CrudSection
      table="stakeholders"
      label="Stakeholder"
      columns={[
        { key: "name", label: "Name", required: true },
        { key: "type", label: "Type (govt/ngo/csr)" },
        { key: "role", label: "Role" },
        { key: "areas", label: "Areas" },
        { key: "website", label: "Website" },
      ]}
    />
  );
}
