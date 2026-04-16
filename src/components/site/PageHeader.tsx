export function PageHeader({
  eyebrow, title, lead,
}: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <header className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
        )}
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-foreground md:text-5xl">{title}</h1>
        {lead && <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">{lead}</p>}
      </div>
    </header>
  );
}
