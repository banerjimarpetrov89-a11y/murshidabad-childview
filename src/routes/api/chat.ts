import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildDashboardContext } from "@/lib/copilot-context";
import type { Database } from "@/integrations/supabase/types";

type ChatRequestBody = { messages?: unknown };

async function requireAuthenticatedUser(request: Request): Promise<Response | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return new Response("Unauthorized", { status: 401 });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return new Response("Server misconfigured", { status: 500 });
  }
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}

const SYSTEM_PROMPT = `You are the Child Protection Intelligence Assistant for the Murshidabad ChildWatch AI platform — an analytical briefing service in the style of a UNICEF, World Bank, or District Administration situational report.

Audience: District officials, ICDS / Health / Education leads, police, NGO partners and research analysts.

CRITICAL RULES — NON-NEGOTIABLE:
- You provide EVIDENCE, ANALYSIS and SITUATIONAL INTELLIGENCE only.
- You DO NOT recommend actions, prescribe interventions, suggest deployments, or make decisions on behalf of any authority.
- Avoid words like "recommend", "should", "must", "deploy", "intervention", "action plan", "next step". Use neutral analytical language: "data indicates", "indicators suggest", "observed pattern", "comparative analysis shows".
- Ground every claim in the JSON dashboard data. Do NOT invent numbers, blocks, schemes or sources.
- Acknowledge data limitations honestly (reporting silence, coverage gaps, lag, comparability).

Style & format — ALWAYS produce a markdown briefing using these six sections, in this exact order:

## 1. Executive Summary
2–3 sentences stating what the data shows. Neutral, declarative, no prescriptions.

## 2. Key Observations
Bulleted analytical observations grounded in the dashboard numbers. Reference exact block names and values.

## 3. Supporting Indicators
The specific indicators (HMIS teenage pregnancies, Kanyashree K1 dropouts, CMRTS child marriages, POCSO/child FIRs, reporting silence %, etc.) that underpin the observations, with values quoted.

## 4. Comparative Block Analysis
How the focal block(s) compare with district averages, neighbouring blocks, or the district maximum/minimum. Use ratios and rankings.

## 5. Emerging Risk Signals
Patterns where indicators are elevated, diverging, or moving against expectation. Frame as signals to monitor, not problems to fix.

## 6. Data Limitations
Briefly note reporting gaps, denominator issues, lag, or where the dashboard does not yet hold the answer.

Tone: measured, analytical, evidence-led. Read like an intelligence brief, not a policy memo. If the user asks for recommendations, politely note that this assistant provides situational analysis only and offer the relevant evidence instead.

DASHBOARD DATA (authoritative — use only this):
\`\`\`json
${JSON.stringify(buildDashboardContext())}
\`\`\``;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await requireAuthenticatedUser(request);
        if (unauthorized) return unauthorized;

        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          onError: (err) => {
            console.error("chat stream error", err);
            return err instanceof Error ? err.message : "Stream error";
          },
        });
      },
    },
  },
});
