import type { APIRoute } from 'astro';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { fetchRandomKeyword, fetchKeywordByTitle } from '@/lib/wikipedia';
import { fetchRandomHNKeyword } from '@/lib/hackernews';

const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });

const EXTRACT_SYSTEM = "Extract a single precise English keyword or short concept phrase (max 3 words) suitable for a Wikipedia search. Return ONLY the keyword — no punctuation, no explanation.";

export const GET: APIRoute = async ({ url }) => {
  const sources = url.searchParams.get('sources')?.split(',') ?? ['wikipedia'];
  const pick = sources[Math.floor(Math.random() * sources.length)];
  const raw = pick === 'hackernews'
    ? await fetchRandomHNKeyword()
    : await fetchRandomKeyword();

  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: raw.title }] }],
    config: {
      systemInstruction: EXTRACT_SYSTEM,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });
  const clean = res.text?.trim() ?? raw.title;

  try {
    const keyword = await fetchKeywordByTitle(clean);
    return new Response(JSON.stringify(keyword), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify(raw), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
