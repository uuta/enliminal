import type { APIRoute } from "astro";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  const { keyword, extract } = await request.json();
  if (!keyword) return new Response("keyword required", { status: 400 });

  const systemInstruction = `You are an expert who shares fascinating trivia and specialized knowledge.

For the given keyword, respond ONLY with the following JSON (no other text):
{
  "definition": "A brief one-sentence definition of the term.",
  "category": "The category or field it belongs to (e.g. 'Complexity Science', 'Economics & Psychology').",
  "explanation": "A detailed explanation with concrete real-world examples, written in 3-4 paragraphs.",
  "diagram": "A Mermaid diagram string (graph or flowchart) if it helps illustrate the concept, otherwise null.",
  "useCases": ["Specific use case 1", ...],
  "relatedTerms": ["Term1", ..., "Term10"]
}
Output JSON only. No markdown fences, no extra text.
Write all text values in Japanese.`;

  const thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };

  const stream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Keyword: ${keyword}\nSummary: ${extract ?? ""}` }],
      },
    ],
    config: { systemInstruction, thinkingConfig },
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text ?? "";
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } },
  );
};
