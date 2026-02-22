import type { Keyword } from "@/lib/types";
import type { KeywordData } from "@/lib/generateContent";
import type { Paper } from "@/lib/semanticScholar";
import type { Video } from "@/lib/youtube";

export async function fetchRandomKeyword(sources: string): Promise<Keyword> {
  const res = await fetch(`/api/keyword/random?sources=${encodeURIComponent(sources)}`);
  if (!res.ok) throw new Error(`keyword API error: ${res.status}`);
  return res.json();
}

export async function generateContent(kw: Keyword): Promise<KeywordData> {
  const res = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: kw.title, extract: kw.extract, pageUrl: kw.pageUrl }),
  });
  if (!res.ok) throw new Error(`generate API error: ${res.status}`);
  return res.json();
}

export async function fetchPapers(query: string): Promise<Paper[]> {
  const res = await fetch(`/api/papers?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`papers API error: ${res.status}`);
  return res.json();
}

export async function fetchVideos(query: string): Promise<Video[]> {
  const res = await fetch(`/api/videos?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`videos API error: ${res.status}`);
  return res.json();
}
