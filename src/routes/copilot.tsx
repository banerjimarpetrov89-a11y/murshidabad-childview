import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Loader2, FileText, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";


const SUGGESTED = [
  "Which blocks show the highest vulnerability signals?",
  "Compare Jalangi with neighbouring blocks.",
  "What emerging risk signals stand out this quarter?",
  "Summarise indicator trends across the district.",
  "Where are the largest reporting gaps?",
];

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "Child Protection Intelligence Assistant — Child Watch AI" },
      {
        name: "description",
        content:
          "Analytical briefings on child protection situational intelligence across Murshidabad's 26 blocks. Evidence-based, non-prescriptive.",
      },
    ],
  }),
  component: CopilotPage,
});

function CopilotPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const transport = useRef(
    new DefaultChatTransport({ api: "/api/chat" }),
  ).current;

  const { messages, sendMessage, status } = useChat({
    id: "copilot",
    transport,
    onError: (err) => {
      console.error("copilot error", err);
      toast.error(err?.message || "The assistant could not respond. Please try again.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    setInput("");
    await sendMessage({ text: t });
  };


  return (
    <div className="bg-background">
      <PageHeader
        eyebrow="AI Intelligence Center"
        title="Child Protection Intelligence Assistant"
        lead="Evidence-based situational briefings across the Murshidabad dashboard. Responses follow an Executive Summary → Observations → Indicators → Comparative Analysis → Risk Signals → Data Limitations structure. The assistant provides analysis only and does not recommend actions."
      />

      <div className="mx-auto max-w-5xl px-4 pb-12 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Chat column */}
          <div className="flex min-h-[60vh] flex-col rounded-xl border border-border bg-card">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-h-[65vh]"
            >
              {messages.length === 0 && <EmptyState onPick={submit} />}
              {messages.map((m) => (
                <MessageBlock key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Drafting briefing…
                </div>
              )}


            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-border p-3 md:p-4"
            >
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  placeholder="Ask about blocks, risks, indicators, or request a briefing…"
                  rows={2}
                  className="min-h-[52px] resize-none"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-[52px] w-[52px]">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Grounded in HMIS, Kanyashree, CMRTS and eCourts data for 26 Murshidabad blocks. Analytical output only — not a substitute for official decisions.
              </p>
            </form>
          </div>

          {/* Side panel */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Suggested questions
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => submit(q)}
                    disabled={isLoading}
                    className="rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Briefing structure
              </div>
              <ol className="mt-2 space-y-1 list-decimal pl-4">
                <li>Executive Summary</li>
                <li>Key Observations</li>
                <li>Supporting Indicators</li>
                <li>Comparative Block Analysis</li>
                <li>Emerging Risk Signals</li>
                <li>Data Limitations</li>
              </ol>
              <p className="mt-3 text-[11px] italic text-muted-foreground">
                Situational analysis only. No interventions or recommendations are issued.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Child Protection Intelligence Assistant</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Ask an analytical question. The assistant returns an evidence-based situational briefing — no recommendations.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTED.slice(0, 3).map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBlock({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {text}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
          <User2 className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Situational Briefing
        </div>
        <article className="prose prose-sm max-w-none rounded-xl border border-border bg-background/60 p-4 text-foreground prose-headings:text-foreground prose-headings:font-semibold prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-strong:text-foreground prose-li:my-0.5 prose-p:my-2">
          {text ? <ReactMarkdown>{text}</ReactMarkdown> : <span className="text-muted-foreground">…</span>}
        </article>
      </div>
    </div>
  );
}
