import type { APIRoute } from "astro";
import { fetchRandomKeyword } from "@/lib/wikipedia";
import { fetchRandomHNKeyword } from "@/lib/hackernews";
import type { Keyword } from "@/lib/types";

async function resolveSource(pick: string): Promise<Keyword> {
  if (pick === "hackernews") {
    const raw = await fetchRandomHNKeyword();
    return {
      title: raw.title ?? "",
      extract: raw.text ?? "",
      pageUrl: `https://news.ycombinator.com/item?id=${raw.id}`,
    };
  }

  const raw = await fetchRandomKeyword();
  return {
    title: raw.title,
    extract: raw.extract,
    pageUrl: raw.content_urls.desktop.page,
  };
}

export const GET: APIRoute = async ({ url }) => {
  const sources = url.searchParams.get("sources")?.split(",") ?? ["wikipedia"];
  const pick = sources[Math.floor(Math.random() * sources.length)];
  const keyword = await resolveSource(pick);
  return new Response(JSON.stringify(keyword), {
    headers: { "Content-Type": "application/json" },
  });
};
