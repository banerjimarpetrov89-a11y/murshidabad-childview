import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildDashboardContext } from "@/lib/copilot-context";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are the CINI Murshidabad AI Copilot — a senior child-protection policy analyst supporting the District Magistrate's office.

Audience: District officials, ICDS/Health/Education leads, police, and NGO partners.

Style & format — ALWAYS produce a professional policy briefing in markdown, structured as:

## Executive Summary
2–3 tight sentences naming the concrete answer and the headline number.

## Evidence
Bulleted, data-grounded findings. Reference exact block names, indicator values, and risk tiers from the dashboard JSON below. Quote numbers (e.g. "Jalangi: 4,260 teen pregnancies, 8 FIRs, 98% reporting silence").

## Why It Matters
Brief interpretation — what these signals mean for child welfare, trafficking, dropout, early marriage, or POCSO underreporting.

## Recommended Actions
A numbered list of 3–5 specific, time-bound interventions. Name the lead department (ICDS, BDO, Police/AHTU, Education, Health, CWC), the geography (block / cluster / panchayat), and the indicator each action moves.

## Watch Indicators
A short bulleted list of indicators to monitor next quarter.

Rules:
- Ground every claim in the JSON data. Do NOT invent numbers, blocks, or schemes.
- Use Indian government framing: ICDS, Kanyashree (K1/K2), POCSO, CMRTS, AHTU, CWC, DCPU, BDO, Panchayat.
- Be direct and decisive — this is a briefing, not a chat.
- Keep paragraphs short. Use bold for key block names and percentages.
- If the user asks something off-topic, answer briefly and steer back to the dashboard.

DASHBOARD DATA (authoritative — use only this):
\`\`\`json
${JSON.stringify(buildDashboardContext())}
\`\`\``;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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
