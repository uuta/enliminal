import type { APIRoute } from "astro";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/aiPrompt";
import { makeStreamResponse } from "@/lib/streamResponse";

const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  const { keyword, extract } = await request.json();
  if (!keyword) return new Response("keyword required", { status: 400 });

  const thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };

  const stream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Keyword: ${keyword}\nSummary: ${extract ?? ""}` }],
      },
    ],
    config: { systemInstruction: SYSTEM_PROMPT, thinkingConfig },
  });

  return makeStreamResponse(stream, (chunk) => chunk.text ?? "");
};
