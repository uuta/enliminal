import type { APIRoute } from "astro";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/aiPrompt";
import { makeStreamResponse } from "@/lib/streamResponse";

const client = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  const { keyword, extract } = await request.json();
  if (!keyword) return new Response("keyword required", { status: 400 });

  const stream = await client.chat.completions.create({
    model: "gpt-5-mini",
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Keyword: ${keyword}\nSummary: ${extract ?? ""}`,
      },
    ],
  });

  return makeStreamResponse(stream, (chunk) => chunk.choices[0]?.delta?.content ?? "");
};
