import type { Keyword } from "@/lib/types";

export type { Keyword };

export async function fetchRandomKeyword(): Promise<Keyword> {
  const res = await fetch(
    "https://en.wikipedia.org/api/rest_v1/page/random/summary",
  );
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  const data = await res.json();
  return {
    title: data.title,
    extract: data.extract,
    pageUrl: data.content_urls.desktop.page,
  };
}

export async function fetchKeywordByTitle(title: string): Promise<Keyword> {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  const data = await res.json();
  return {
    title: data.title,
    extract: data.extract,
    pageUrl: data.content_urls.desktop.page,
  };
}
