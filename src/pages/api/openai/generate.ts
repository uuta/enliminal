import type { APIRoute } from "astro";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  const { keyword, extract } = await request.json();
  if (!keyword) return new Response("keyword required", { status: 400 });

  const stream = await client.chat.completions.create({
    model: "gpt-5-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an expert who shares fascinating trivia and specialized knowledge.

For the given keyword, respond ONLY with the following JSON (no other text):
{
  "definition": "A brief one-sentence definition of the term.",
  "category": "The category or field it belongs to (e.g. 'Complexity Science', 'Economics & Psychology').",
  "explanation": "A detailed explanation with concrete real-world examples, written in 3-4 paragraphs.",
  "diagram": "A Mermaid diagram string (graph or flowchart) if it helps illustrate the concept, otherwise null.",
  "useCases": ["Specific use case 1", "Specific use case 2", "Specific use case 3", "Specific use case 4", "Specific use case 5"],
  "relatedTerms": ["Term1", "Term2", "Term3", "Term4", "Term5", "Term6", "Term7", "Term8", "Term9", "Term10"]
}
Output JSON only. No markdown fences, no extra text.`,
      },
      {
        role: "user",
        content: `Keyword: ${keyword}\nSummary: ${extract ?? ""}`,
      },
    ],
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } },
  );
};
