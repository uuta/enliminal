import type { APIRoute } from "astro";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { fetchRandomKeyword, fetchKeywordByTitle } from "@/lib/wikipedia";
import { fetchRandomHNKeyword } from "@/lib/hackernews";
import type { Keyword } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });

const EXTRACT_SYSTEM =
  "Extract a single precise English keyword or short concept phrase (max 3 words) suitable for a Wikipedia search. Return ONLY the keyword — no punctuation, no explanation.";

export const GET: APIRoute = async ({ url }) => {
  const sources = url.searchParams.get("sources")?.split(",") ?? ["wikipedia"];
  const pick = sources[Math.floor(Math.random() * sources.length)];

  let rawTitle: string;
  let fallback: Keyword;

  if (pick === "hackernews") {
    const raw = await fetchRandomHNKeyword();
    rawTitle = raw.title ?? "";
    fallback = {
      title: raw.title ?? "",
      extract: raw.text ?? "",
      pageUrl: `https://news.ycombinator.com/item?id=${raw.id}`,
    };
  } else {
    const raw = await fetchRandomKeyword();
    rawTitle = raw.title;
    fallback = {
      title: raw.title,
      extract: raw.extract,
      pageUrl: raw.content_urls.desktop.page,
    };
  }

  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: rawTitle }] }],
    config: {
      systemInstruction: EXTRACT_SYSTEM,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });
  const clean = res.text?.trim() ?? rawTitle;

  try {
    const raw = await fetchKeywordByTitle(clean);
    const keyword: Keyword = {
      title: raw.title,
      extract: raw.extract,
      pageUrl: raw.content_urls.desktop.page,
    };
    return new Response(JSON.stringify(keyword), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(fallback), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
